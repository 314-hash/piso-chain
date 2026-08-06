# pragma pylint: disable=missing-docstring, invalid-name, pointless-string-statement
# flake8: noqa: F401
"""
PISOStrategy — PISO Chain Native Freqtrade Trading Strategy
============================================================
An EMA crossover + RSI momentum strategy designed for PISO Chain integration.

On every profitable trade close, a SHA-256 work proof is generated and
submitted to PISOFreqtradeOracle.sol on PISO Chain (Chain ID 2026001)
to earn $PISO token rewards.

Signal Logic:
  ENTRY (Long):
    - EMA 9 crosses above EMA 21 (bullish crossover)
    - RSI 14 is between 40 and 70 (momentum — not overbought)
    - Price is above EMA 50 (uptrend filter)

  EXIT:
    - EMA 9 crosses below EMA 21 (bearish crossover)  [exit signal]
    - RSI > 75                                         [overbought exit]
    - Stop-Loss: -3%
    - Take-Profit (ROI): 2% / 4% / 8% tiered

Recommended timeframe: 5m
Exchange: Binance / Bybit / OKX (Spot)
"""

import hashlib
import logging
import time
from datetime import datetime
from typing import Optional

from pandas import DataFrame
import talib.abstract as ta
from freqtrade.strategy import IStrategy, IntParameter

log = logging.getLogger(__name__)


class PISOStrategy(IStrategy):
    """
    PISO Chain native trading strategy.
    Generates on-chain trade proofs for profitable closed trades.
    """

    # ── Strategy Metadata ──────────────────────────────────────────────────────
    INTERFACE_VERSION   = 3
    strategy_name       = "PISOStrategy"
    timeframe           = "5m"
    can_short           = False
    use_custom_stoploss = False

    # ── ROI Table (tiered take-profit) ─────────────────────────────────────────
    minimal_roi = {
        "0":   0.08,   # 8% profit → sell immediately
        "30":  0.04,   # After 30 minutes → sell at 4%
        "60":  0.02,   # After 60 minutes → sell at 2%
        "120": 0.01,   # After 2 hours    → sell at 1%
    }

    # ── Stop Loss ──────────────────────────────────────────────────────────────
    stoploss = -0.03    # -3% stop loss

    # ── Trailing Stop ─────────────────────────────────────────────────────────
    trailing_stop              = True
    trailing_stop_positive     = 0.01   # 1% profit locks in trailing stop
    trailing_stop_positive_offset = 0.02
    trailing_only_offset_is_reached = True

    # ── Order Types ────────────────────────────────────────────────────────────
    order_types = {
        "entry":             "limit",
        "exit":              "limit",
        "stoploss":          "market",
        "stoploss_on_exchange": False,
    }

    # ── Hyperopt Parameters ────────────────────────────────────────────────────
    ema_fast   = IntParameter(5,  20, default=9,  space="buy",  optimize=True)
    ema_slow   = IntParameter(15, 50, default=21, space="buy",  optimize=True)
    ema_trend  = IntParameter(30, 100, default=50, space="buy", optimize=True)

    rsi_buy_min  = IntParameter(30, 55, default=40, space="buy",  optimize=True)
    rsi_buy_max  = IntParameter(55, 80, default=70, space="buy",  optimize=True)
    rsi_exit_max = IntParameter(65, 90, default=75, space="sell", optimize=True)

    # ── Indicator Computation ──────────────────────────────────────────────────

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """Compute EMA and RSI indicators."""

        # EMA fast / slow / trend
        dataframe["ema_fast"]  = ta.EMA(dataframe, timeperiod=self.ema_fast.value)
        dataframe["ema_slow"]  = ta.EMA(dataframe, timeperiod=self.ema_slow.value)
        dataframe["ema_trend"] = ta.EMA(dataframe, timeperiod=self.ema_trend.value)

        # RSI momentum
        dataframe["rsi"] = ta.RSI(dataframe, timeperiod=14)

        # MACD for additional confluence
        macd, macdsignal, macdhist = ta.MACD(
            dataframe["close"], fastperiod=12, slowperiod=26, signalperiod=9
        )
        dataframe["macd"]       = macd
        dataframe["macdsignal"] = macdsignal
        dataframe["macdhist"]   = macdhist

        # Bollinger Bands width for volatility filter
        upper, mid, lower = ta.BBANDS(dataframe["close"], timeperiod=20)
        dataframe["bb_upper"]  = upper
        dataframe["bb_lower"]  = lower
        dataframe["bb_width"]  = (upper - lower) / mid

        # EMA crossover signals
        dataframe["ema_cross_up"]   = (
            (dataframe["ema_fast"] > dataframe["ema_slow"]) &
            (dataframe["ema_fast"].shift(1) <= dataframe["ema_slow"].shift(1))
        )
        dataframe["ema_cross_down"] = (
            (dataframe["ema_fast"] < dataframe["ema_slow"]) &
            (dataframe["ema_fast"].shift(1) >= dataframe["ema_slow"].shift(1))
        )

        return dataframe

    # ── Entry Signal ───────────────────────────────────────────────────────────

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Long entry conditions:
          1. EMA fast crossed above EMA slow (bullish crossover)
          2. RSI is in valid momentum range (not overbought)
          3. Price above trend EMA (uptrend confirmed)
          4. MACD histogram positive (momentum confirmation)
        """
        dataframe.loc[
            (
                (dataframe["ema_cross_up"]) &
                (dataframe["rsi"] >= self.rsi_buy_min.value) &
                (dataframe["rsi"] <= self.rsi_buy_max.value) &
                (dataframe["close"] > dataframe["ema_trend"]) &
                (dataframe["macdhist"] > 0) &
                (dataframe["volume"] > 0)
            ),
            "enter_long",
        ] = 1

        return dataframe

    # ── Exit Signal ────────────────────────────────────────────────────────────

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Exit conditions:
          1. EMA fast crossed below EMA slow (bearish reversal)
          2. RSI exceeds overbought threshold
        """
        dataframe.loc[
            (
                (dataframe["ema_cross_down"]) |
                (dataframe["rsi"] > self.rsi_exit_max.value)
            ),
            "exit_long",
        ] = 1

        return dataframe

    # ── PISO Chain Proof Hook ──────────────────────────────────────────────────

    def custom_exit(
        self,
        pair: str,
        trade,
        current_time: datetime,
        current_rate: float,
        current_profit: float,
        **kwargs,
    ) -> Optional[str]:
        """
        Called by freqtrade on every candle for open trades.
        When a trade is profitable and held for sufficient time, submit an
        early exit signal (the bridge will handle the on-chain proof).
        """
        # Early exit protection: hold minimum 2 candles
        trade_duration = (current_time - trade.open_date_utc).total_seconds() / 60
        if trade_duration < 10:
            return None

        # Submit on-chain proof for significantly profitable trades
        if current_profit > 0.05:  # 5%+ profit
            self._log_piso_proof(trade, current_profit, pair)
            return "piso_take_profit_5pct"

        return None

    def _log_piso_proof(self, trade, profit: float, pair: str):
        """Log trade data for the bridge to pick up and submit on-chain."""
        proof_data = {
            "trade_id":     trade.id,
            "pair":         pair,
            "strategy":     self.strategy_name,
            "profit_ratio": profit,
            "profit_bps":   int(round(profit * 10_000)),
            "timestamp":    int(time.time()),
        }
        raw   = f"{trade.id}|{self.strategy_name}|{int(profit * 10_000)}|{proof_data['timestamp']}"
        proof = "0x" + hashlib.sha256(raw.encode()).hexdigest()
        proof_data["sha256_proof"] = proof

        log.info(
            f"[PISO Oracle] Trade #{trade.id} | {pair} | "
            f"+{profit * 100:.2f}% | Proof: {proof[:18]}..."
        )
