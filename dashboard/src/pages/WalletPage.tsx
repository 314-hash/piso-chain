import BentoCard from '../components/ui/BentoCard'

export default function WalletPage() {
  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">👛 Wallet Studio</h2>
        <p className="text-slate-400 text-sm mt-1">Mainnet PISO wallet — create, import, send, receive, and manage assets</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <BentoCard accentColor="#06b6d4">
          <h3 className="text-base font-bold text-white mb-4">🔑 Create / Import Wallet</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Mnemonic Phrase (24 words)</label>
              <textarea className="piso-input" style={{ minHeight: '72px' }} placeholder="Enter your 24-word recovery phrase..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn btn-primary-blue text-sm">🔓 Import Wallet</button>
              <button className="btn text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg,#ffd700,#b8860b)' }}>✨ Create New</button>
            </div>
          </div>
        </BentoCard>

        <BentoCard accentColor="#10b981">
          <h3 className="text-base font-bold text-white mb-4">💰 Wallet Balance</h3>
          <div className="text-center py-4">
            <div className="text-4xl font-black text-white font-mono mb-1">0.0000</div>
            <div className="text-sm text-slate-400 mb-4">PISO (Mainnet)</div>
            <div className="flex gap-2">
              <button className="btn btn-primary-blue flex-1 text-sm">📤 Send</button>
              <button className="btn btn-ghost flex-1 text-sm">📥 Receive</button>
            </div>
          </div>
        </BentoCard>
      </div>

      <BentoCard>
        <h3 className="text-base font-bold text-white mb-4">📜 Transaction History</h3>
        <div className="text-center py-10 text-slate-500">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">No transactions yet. Connect your wallet to see history.</p>
        </div>
      </BentoCard>

      <div className="text-center">
        <a
          href="../wallet.html"
          className="btn btn-primary-blue text-sm"
        >
          🔗 Open Full Wallet Studio (wallet.html)
        </a>
      </div>
    </div>
  )
}
