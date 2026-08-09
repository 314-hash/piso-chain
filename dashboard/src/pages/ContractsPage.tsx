import BentoCard from '../components/ui/BentoCard'

export default function ContractsPage() {
  const contracts = [
    { name: 'PISOValidatorSet', addr: '0x0000000000000000000000000000000000001000', desc: 'Parlia PoSA Consensus Validator Set' },
    { name: 'PISOSlashIndicator', addr: '0x0000000000000000000000000000000000001001', desc: 'Validator Double-Sign & Downtime Slasher' },
    { name: 'PISOQuantumSecurity', addr: '0x0000000000000000000000000000000000001002', desc: 'NIST FIPS 204 ML-DSA / W-OTS+ Cryptographic Vault' },
    { name: 'PISOProofOfWork', addr: '0x0000000000000000000000000000000000001003', desc: 'Keccak-256 Nonce Verification & Payout Engine' },
    { name: 'PISOMiningTreasury', addr: '0x0000000000000000000000000000000000001004', desc: '60 Billion PISO Zero-Inflation Reserve Vault' },
    { name: 'PISOPaymaster', addr: '0x0000000000000000000000000000000000001005', desc: 'EIP-4337 Sponsored Gasless Transactions' },
    { name: 'PISOSakuraAIOracle', addr: '0x0000000000000000000000000000000000001013', desc: '20-Agent AI Swarm & Governance Oracle' },
  ]

  return (
    <div className="space-y-5 slide-in-up">
      <div>
        <h2 className="text-2xl font-black text-white">📜 System Smart Contracts Hub</h2>
        <p className="text-slate-400 text-sm mt-1">Precompiled system contracts operating at fixed addresses on PISO Chain Mainnet</p>
      </div>

      <div className="grid gap-3">
        {contracts.map((c) => (
          <BentoCard key={c.addr} accentColor="#06b6d4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
                <code className="text-xs text-cyan-400 block mt-2 font-mono break-all">{c.addr}</code>
              </div>
              <span className="badge badge-green text-xs self-start sm:self-center">Verified Precompile</span>
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  )
}
