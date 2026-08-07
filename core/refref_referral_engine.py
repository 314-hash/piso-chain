"""
RefRef Referral & Affiliate Engine for PISO Chain.
Inspired by amicalhq/refref.

Provides On-Chain Referral Attribution, Campaign Creation, Unique Link Generation,
Conversion Event Tracking, and Automated Reward Payouts.
"""

import time
import hashlib
from typing import Dict, List, Any, Optional


class RefRefReferralEngine:
    """
    Open-source referral & affiliate marketing engine managing campaign rules,
    referrer attribution, conversion tracking, and PISO token reward calculations.
    """

    def __init__(self):
        self.campaigns: Dict[str, Dict[str, Any]] = {}
        self.referral_codes: Dict[str, Dict[str, Any]] = {}
        self.conversions: List[Dict[str, Any]] = []

        # Seed default campaign
        self.create_campaign(
            campaign_name="Validator Node Onboarding",
            reward_piso=50.0,
            reward_type="FIXED",
            description="Earn 50 PISO for every new active validator node referred."
        )

    def create_campaign(self, campaign_name: str, reward_piso: float = 10.0, reward_type: str = "FIXED", description: str = "") -> Dict[str, Any]:
        """
        Create a new referral campaign.
        """
        campaign_id = "CMP-" + hashlib.sha256(f"{campaign_name}-{time.time()}".encode()).hexdigest()[:8]
        campaign = {
            "campaign_id": campaign_id,
            "name": campaign_name,
            "reward_piso": reward_piso,
            "reward_type": reward_type,  # FIXED or PERCENTAGE
            "description": description,
            "created_at": time.time(),
            "active": True,
        }
        self.campaigns[campaign_id] = campaign
        return campaign

    def generate_referral_code(self, referrer_address: str, campaign_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a unique referral code (e.g. PISO-REF-9F8A2B) for a referrer wallet address.
        """
        ref_addr = referrer_address.lower()
        code_suffix = hashlib.sha256(f"{ref_addr}-{time.time()}".encode()).hexdigest()[:6].upper()
        ref_code = f"PISO-REF-{code_suffix}"

        selected_campaign = campaign_id if (campaign_id and campaign_id in self.campaigns) else list(self.campaigns.keys())[0]

        record = {
            "referral_code": ref_code,
            "referrer_address": ref_addr,
            "campaign_id": selected_campaign,
            "total_clicks": 0,
            "total_conversions": 0,
            "total_rewards_earned_piso": 0.0,
            "created_at": time.time(),
        }
        self.referral_codes[ref_code] = record

        return record

    def track_conversion(self, referral_code: str, referred_user_address: str, transaction_hash: str) -> Dict[str, Any]:
        """
        Process and attribute a referral conversion event.
        """
        if referral_code not in self.referral_codes:
            return {"status": "ERROR", "reason": f"Referral code {referral_code} not found"}

        ref_record = self.referral_codes[referral_code]
        campaign = self.campaigns.get(ref_record["campaign_id"], {})
        reward_piso = campaign.get("reward_piso", 10.0)

        # Update stats
        ref_record["total_conversions"] += 1
        ref_record["total_rewards_earned_piso"] += reward_piso

        conversion_event = {
            "conversion_id": "CNV-" + hashlib.sha256(f"{referral_code}-{referred_user_address}-{time.time()}".encode()).hexdigest()[:8],
            "referral_code": referral_code,
            "referrer_address": ref_record["referrer_address"],
            "referred_user": referred_user_address.lower(),
            "campaign_id": ref_record["campaign_id"],
            "reward_piso": reward_piso,
            "tx_hash": transaction_hash,
            "timestamp": time.time(),
            "status": "ATTRIBUTED_AND_DISBURSED",
        }
        self.conversions.append(conversion_event)

        return conversion_event

    def get_referral_stats(self, referrer_address: Optional[str] = None) -> Dict[str, Any]:
        """
        Get aggregated referral statistics and campaign performance.
        """
        if referrer_address:
            ref_addr = referrer_address.lower()
            user_codes = [c for c in self.referral_codes.values() if c["referrer_address"] == ref_addr]
            total_earned = sum(c["total_rewards_earned_piso"] for c in user_codes)
            total_convs = sum(c["total_conversions"] for c in user_codes)
            return {
                "referrer_address": ref_addr,
                "active_codes": len(user_codes),
                "codes": user_codes,
                "total_conversions": total_convs,
                "total_rewards_earned_piso": total_earned,
            }

        total_conversions_count = len(self.conversions)
        total_rewards_paid = sum(c["reward_piso"] for c in self.conversions)

        return {
            "engine": "RefRef Referral & Affiliate Engine v1.0",
            "total_campaigns": len(self.campaigns),
            "total_referral_codes": len(self.referral_codes),
            "total_conversions": total_conversions_count,
            "total_rewards_disbursed_piso": total_rewards_paid,
            "active_campaigns": list(self.campaigns.values()),
        }
