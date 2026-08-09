export default function OnboardingStrip() {
  const handleMetaMask = async () => {
    const win = window as any
    if (win.ethereum) {
      try {
        await win.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1EED91',
            chainName: 'PISO Chain Mainnet',
            nativeCurrency: { name: 'PISO', symbol: 'PISO', decimals: 18 },
            rpcUrls: ['https://piso-rpc-dev.loca.lt'],
          }],
        })
      } catch (e: any) {
        alert('MetaMask error: ' + e.message)
      }
    } else {
      window.open('https://metamask.io/', '_blank')
    }
  }

  return (
    <div
      className="glass-card p-5 md:p-6 mb-6"
      style={{ borderColor: '#3b82f633', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(139,92,246,0.1))' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🚀 Get Started in Under 2 Minutes
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Start interacting with PISO Chain L1, DEX Swaps, Bridge & AI Agents instantly
          </p>
        </div>
        <span className="badge badge-green text-xs self-start sm:ml-auto flex-shrink-0">
          Zero Gas Fees (EIP-4337)
        </span>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={handleMetaMask}
          className="btn text-sm py-3.5 px-4 rounded-xl font-bold text-white flex-col h-auto gap-1"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          <span className="text-xl">🦊</span>
          <span>Add to MetaMask</span>
        </button>

        <button
          onClick={() => alert('🚰 100 Testnet PISO Tokens Dispensed to your connected wallet!')}
          className="btn text-sm py-3.5 px-4 rounded-xl font-bold text-white flex-col h-auto gap-1"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <span className="text-xl">🚰</span>
          <span>Claim Faucet</span>
        </button>

        <a
          href="/swap"
          className="btn text-sm py-3.5 px-4 rounded-xl font-bold text-white flex-col h-auto gap-1 no-underline"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
        >
          <span className="text-xl">🔀</span>
          <span>PISOSwap DEX</span>
        </a>

        <a
          href="../PISO_Chain_v1.6.0.apk"
          download
          className="btn text-sm py-3.5 px-4 rounded-xl font-bold text-white flex-col h-auto gap-1 no-underline"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <span className="text-xl">📲</span>
          <span>Android APK</span>
        </a>
      </div>
    </div>
  )
}
