import { useState, useEffect } from 'react'
import * as ethers from 'ethers'
import {
  setActiveWallet,
  generateMLDSAPostQuantumPublicKey,
  addPISOMainnetToMetaMask,
  callJsonRpc
} from '../../services/web3'
import BentoCard from '../ui/BentoCard'

export default function Web3Gateway() {
  const [authMode, setAuthMode] = useState<'select' | 'create' | 'import'>('select')
  const [rpcConnected, setRpcConnected] = useState(false)

  // Create Wallet State
  const [wordsCount, setWordsCount] = useState<12 | 24>(24)
  const [createdMnemonic, setCreatedMnemonic] = useState('')
  const [createdAddress, setCreatedAddress] = useState('')
  const [createdPrivateKey, setCreatedPrivateKey] = useState('')
  const [createdPqcKey, setCreatedPqcKey] = useState('')
  const [mnemonicSaved, setMnemonicSaved] = useState(false)
  const [revealMnemonic, setRevealMnemonic] = useState(false)
  const [exportPassword, setExportPassword] = useState('')
  const [exporting, setExporting] = useState(false)

  // Import Wallet State
  const [importType, setImportType] = useState<'mnemonic' | 'privkey' | 'keystore'>('mnemonic')
  const [importMnemonic, setImportMnemonic] = useState('')
  const [importPrivKey, setImportPrivKey] = useState('')
  const [importKeystorePassword, setImportKeystorePassword] = useState('')
  const [importKeystoreJSON, setImportKeystoreJSON] = useState<string | null>(null)
  const [importConsole, setImportConsole] = useState('')
  const [importLoading, setImportLoading] = useState(false)

  // Check RPC status
  useEffect(() => {
    const checkRpc = async () => {
      try {
        const block = await callJsonRpc('eth_blockNumber', [])
        if (block) setRpcConnected(true)
      } catch {
        setRpcConnected(false)
      }
    }
    checkRpc()
  }, [])

  // --- MetaMask Connection ---
  const handleMetaMaskConnect = async () => {
    const win = window as any
    if (!win.ethereum) {
      alert('🦊 MetaMask not detected. Please install MetaMask browser extension.')
      return
    }

    try {
      // Connect to MetaMask
      const accounts = await win.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        // Automatically request network switch/addition
        try {
          await addPISOMainnetToMetaMask()
        } catch (e) {
          // Ignore network switch failures
        }

        setActiveWallet({
          address: accounts[0],
          privateKey: 'METAMASK_SESSION', // Indicates it's managed externally
          type: 'imported'
        })
      }
    } catch (err: any) {
      alert('MetaMask connection rejected: ' + err.message)
    }
  }

  // --- Generate Wallet Keys ---
  const handleGenerateWallet = () => {
    try {
      let w: ethers.HDNodeWallet
      if (wordsCount === 12) {
        w = ethers.Wallet.createRandom()
      } else {
        const bytes = ethers.randomBytes(32)
        const mnemonic = ethers.Mnemonic.entropyToPhrase(bytes)
        w = ethers.Wallet.fromPhrase(mnemonic)
      }

      setCreatedMnemonic(w.mnemonic?.phrase || '')
      setCreatedAddress(w.address)
      setCreatedPrivateKey(w.privateKey)
      setCreatedPqcKey(generateMLDSAPostQuantumPublicKey(w.privateKey))
      setMnemonicSaved(false)
      setRevealMnemonic(false)
    } catch (err: any) {
      alert('Generation failed: ' + err.message)
    }
  }

  // --- Export Keystore JSON ---
  const handleExportKeystore = async () => {
    if (!createdPrivateKey) {
      alert('Please generate keys first!')
      return
    }
    if (!exportPassword || exportPassword.length < 6) {
      alert('Please enter a secure passphrase (at least 6 characters)!')
      return
    }

    setExporting(true)
    try {
      const w = new ethers.Wallet(createdPrivateKey)
      const json = await w.encrypt(exportPassword)

      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PISO_Keystore_${new Date().toISOString().split('T')[0]}_${createdAddress.slice(0, 8)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('✅ Keystore JSON successfully exported!')
      setExportPassword('')
    } catch (err: any) {
      alert('Encryption failed: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  // --- Complete generated wallet login ---
  const handleUseGeneratedWallet = () => {
    setActiveWallet({
      address: createdAddress,
      privateKey: createdPrivateKey,
      mnemonic: createdMnemonic,
      type: 'generated'
    })
  }

  // --- Import Wallet Action ---
  const handleImportWallet = async () => {
    setImportLoading(true)
    setImportConsole('⏳ Decrypting and validating Web3 payload...')
    try {
      let imported: any = null

      if (importType === 'mnemonic') {
        const phrase = importMnemonic.trim()
        if (!phrase) throw new Error('Mnemonic recovery phrase cannot be empty.')
        imported = ethers.Wallet.fromPhrase(phrase)
      } else if (importType === 'privkey') {
        const key = importPrivKey.trim()
        if (!key) throw new Error('Private key cannot be empty.')
        const formattedKey = key.startsWith('0x') ? key : '0x' + key
        imported = new ethers.Wallet(formattedKey)
      } else if (importType === 'keystore') {
        if (!importKeystoreJSON) throw new Error('Please select a valid Keystore JSON file.')
        if (!importKeystorePassword) throw new Error('Password is required to decrypt Keystore.')
        setImportConsole('⏳ Running PBKDF2 iterations & AES-GCM keystore decryption...')
        imported = await ethers.Wallet.fromEncryptedJson(importKeystoreJSON, importKeystorePassword)
      }

      if (imported) {
        setActiveWallet({
          address: imported.address,
          privateKey: imported.privateKey,
          mnemonic: importType === 'mnemonic' ? importMnemonic : undefined,
          type: 'imported'
        })
      }
    } catch (err: any) {
      setImportConsole(`❌ Import Failed:\n${err.message}`)
    } finally {
      setImportLoading(false)
    }
  }

  const handleKeystoreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setImportKeystoreJSON(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen w-screen bg-dark-950 flex flex-col justify-center items-center p-4 relative overflow-hidden animated-bg select-none">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none float-anim" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none float-anim" style={{ animationDelay: '-3s' }} />

      <div className="max-w-xl w-full z-10 space-y-6 slide-in-up">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-3">
            <img
              src="/piso_logo.jpg"
              alt="PISO Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-piso-gold shadow-glow-gold float-anim"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <h1 className="text-3xl font-black tracking-tight text-white">
              PISO <span className="text-accent-cyan">CHAIN</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            PINOY • POST-QUANTUM • PoW MINING • LAYER 1 BLOCKCHAIN
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className={`w-2 h-2 rounded-full ${rpcConnected ? 'pulse-green' : 'pulse-blue'}`} />
            <span className="text-xs font-mono text-slate-500">
              {rpcConnected ? 'L1 RPC Connected (Chain ID 2026001)' : 'Offline Simulated Devnet'}
            </span>
          </div>
        </div>

        {/* Auth selector panel */}
        {authMode === 'select' && (
          <BentoCard accentColor="#06b6d4">
            <div className="p-4 space-y-5 text-center">
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-white">Unlock Web3 Gateway</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  A wallet identity is required to run block mining executors, trade swaps, and receive coin rewards.
                </p>
              </div>

              <div className="grid gap-3 pt-2">
                <button
                  onClick={handleMetaMaskConnect}
                  className="btn text-sm font-bold text-white py-3.5 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  <span>🦊</span> Connect MetaMask Wallet
                </button>

                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Or Secure Local Session</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAuthMode('create')}
                    className="btn btn-primary-gold text-xs py-3 font-bold"
                  >
                    ✨ Create New Wallet
                  </button>
                  <button
                    onClick={() => setAuthMode('import')}
                    className="btn btn-primary-blue text-xs py-3 font-bold"
                  >
                    🔓 Import Existing
                  </button>
                </div>
              </div>
            </div>
          </BentoCard>
        )}

        {/* Auth creation panel */}
        {authMode === 'create' && (
          <BentoCard accentColor="#ffd700">
            <div className="p-2 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <button onClick={() => setAuthMode('select')} className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1">
                  <span>←</span> Back to selection
                </button>
                <span className="badge badge-gold text-[10px]">Step-by-Step Onboarding</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Generate BIP-39 Seed Phrase</h3>
                <p className="text-xs text-slate-400">
                  Select key entropy and tap generate. Write the phrase down offline in exact order.
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Mnemonic phrase length:</span>
                  <select
                    value={wordsCount}
                    onChange={(e) => setWordsCount(parseInt(e.target.value) as any)}
                    className="piso-input py-1 px-2 text-xs w-20 min-h-0 text-white"
                  >
                    <option value={12}>12 Words</option>
                    <option value={24}>24 Words</option>
                  </select>
                </div>

                <button onClick={handleGenerateWallet} className="btn btn-primary-gold text-xs w-full py-2.5">
                  ✨ Generate BIP-39 Keys
                </button>

                {createdMnemonic && (
                  <div className="space-y-4 pt-3 border-t border-white/5">
                    {/* Word grid */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-500 uppercase block">Secret recovery phrase:</label>
                        <button
                          onClick={() => setRevealMnemonic(!revealMnemonic)}
                          className="text-xs text-cyan-400 hover:underline font-bold"
                        >
                          {revealMnemonic ? '🙈 Hide Words' : '👁️ Reveal Words'}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {createdMnemonic.split(' ').map((word, idx) => (
                          <div
                            key={idx}
                            className="bg-black/50 border border-white/5 rounded-lg p-2 text-center text-xs font-mono select-none"
                            style={{ filter: revealMnemonic ? 'none' : 'blur(5px)' }}
                          >
                            <span className="text-slate-600 mr-1">{idx + 1}.</span>
                            <span className="text-white font-bold">{word}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Derived details */}
                    <div className="space-y-2 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-600 block">PUBLIC ADDRESS</span>
                        <code className="text-emerald-400 break-all select-all">{createdAddress}</code>
                      </div>
                      <div>
                        <span className="text-slate-600 block">PRIVATE KEY HEX</span>
                        <code className="text-red-400 break-all select-all">{createdPrivateKey.slice(0, 16)}...</code>
                      </div>
                      <div>
                        <span className="text-slate-600 block">NIST ML-DSA PUBLIC VAULT KEY</span>
                        <code className="text-cyan-400 break-all">{createdPqcKey}</code>
                      </div>
                    </div>

                    {/* Keystore export optionally */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Optional: Export to Keystore JSON file</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={exportPassword}
                          onChange={(e) => setExportPassword(e.target.value)}
                          placeholder="Passphrase (min 6 chars)..."
                          className="piso-input text-xs flex-1"
                        />
                        <button
                          onClick={handleExportKeystore}
                          disabled={exporting}
                          className="btn btn-ghost text-xs py-2 px-3 font-bold"
                        >
                          {exporting ? '⏳ Encrypting...' : '📥 Export UTC'}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-[10px] text-slate-300">
                      ⚠️ Write the mnemonic seed phrase down on paper and store it securely. PISO Chain is decentralized and cannot recover lost phrases.
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setMnemonicSaved(true)}
                        className={`btn text-xs font-bold py-2.5 flex-1 ${
                          mnemonicSaved ? 'bg-emerald-950 border border-emerald-500 text-emerald-400' : 'btn-ghost'
                        }`}
                      >
                        {mnemonicSaved ? '✓ Mnemonic Checked & Saved' : '🔏 I Have Copied my Mnemonic'}
                      </button>
                      {mnemonicSaved && (
                        <button onClick={handleUseGeneratedWallet} className="btn btn-primary-blue text-xs py-2.5 flex-1 font-bold">
                          🔓 Unlock Dashboard ➔
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </BentoCard>
        )}

        {/* Auth import panel */}
        {authMode === 'import' && (
          <BentoCard accentColor="#06b6d4">
            <div className="p-2 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <button onClick={() => setAuthMode('select')} className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1">
                  <span>←</span> Back to selection
                </button>
                <div className="flex gap-1.5">
                  {['mnemonic', 'privkey', 'keystore'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setImportType(t as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                        importType === t
                          ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                          : 'bg-dark-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'privkey' ? 'PrivKey' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Import Identity Wallet</h3>
                <p className="text-xs text-slate-400">
                  Select credentials method. All details are kept in localStorage and never transmitted on-chain.
                </p>

                {importType === 'mnemonic' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-bold uppercase block">Mnemonic Recovery Phrase (12/24 words)</label>
                    <textarea
                      value={importMnemonic}
                      onChange={(e) => setImportMnemonic(e.target.value)}
                      placeholder="Paste recovery phrase separated by spaces..."
                      className="piso-input text-xs"
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                )}

                {importType === 'privkey' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-bold uppercase block">Private Key Hex</label>
                    <input
                      type="password"
                      value={importPrivKey}
                      onChange={(e) => setImportPrivKey(e.target.value)}
                      placeholder="e.g. 0xabcdef0123456789..."
                      className="piso-input text-xs"
                    />
                  </div>
                )}

                {importType === 'keystore' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-bold uppercase block">Select UTC/Keystore JSON file</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleKeystoreUpload}
                        className="text-xs text-slate-400 block file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-dark-700 file:text-slate-300 hover:file:bg-dark-600 file:cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-bold uppercase block">Keystore Passphrase</label>
                      <input
                        type="password"
                        value={importKeystorePassword}
                        onChange={(e) => setImportKeystorePassword(e.target.value)}
                        placeholder="Enter password chosen during export..."
                        className="piso-input text-xs"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleImportWallet}
                  disabled={importLoading}
                  className="btn btn-primary-blue text-xs font-bold w-full py-2.5"
                >
                  {importLoading ? '⏳ Decrypting...' : '🔓 Import & Unlock Dashboard'}
                </button>

                {importConsole && (
                  <div className="output-box font-mono text-[11px] leading-relaxed mt-2 border border-cyan-500/20" style={{ color: importConsole.startsWith('❌') ? '#f87171' : '#4ade80' }}>
                    {importConsole}
                  </div>
                )}
              </div>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  )
}
