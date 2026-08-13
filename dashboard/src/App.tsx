import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from './components/layout/Sidebar'
import TopHeader from './components/layout/TopHeader'
import MobileBottomNav from './components/layout/MobileBottomNav'
import OverviewPage from './pages/OverviewPage'
import WalletPage from './pages/WalletPage'
import SwapPage from './pages/SwapPage'
import ExplorerPage from './pages/ExplorerPage'
import PowPage from './pages/PowPage'
import SakuraPage from './pages/SakuraPage'
import MysteriumPage from './pages/MysteriumPage'
import ContractsPage from './pages/ContractsPage'
import EnterprisePage from './pages/EnterprisePage'
import BridgePage from './pages/BridgePage'
import FreqtradePage from './pages/FreqtradePage'

import { useWallet } from './services/web3'
import Web3Gateway from './components/layout/Web3Gateway'
import ErrorBoundary from './components/layout/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { wallet } = useWallet()

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
      {!wallet ? (
        <Web3Gateway />
      ) : (
        <div className="flex h-screen overflow-hidden bg-dark-900 animate-fade-in">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopHeader onHamburger={() => setSidebarOpen(true)} />

            <main className="flex-1 overflow-y-auto pb-20 md:pb-4">
              <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
                <Routes>
                  <Route path="/" element={<OverviewPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/swap" element={<SwapPage />} />
                  <Route path="/explorer" element={<ExplorerPage />} />
                  <Route path="/pow" element={<PowPage />} />
                  <Route path="/sakura" element={<SakuraPage />} />
                  <Route path="/mysterium" element={<MysteriumPage />} />
                  <Route path="/contracts" element={<ContractsPage />} />
                  <Route path="/enterprise" element={<EnterprisePage />} />
                  <Route path="/bridge" element={<BridgePage />} />
                  <Route path="/freqtrade" element={<FreqtradePage />} />

                  {/* Legacy HTML Page Redirects */}
                  <Route path="/index.html" element={<Navigate to="/" replace />} />
                  <Route path="/wallet.html" element={<Navigate to="/wallet" replace />} />
                  <Route path="/swap.html" element={<Navigate to="/swap" replace />} />
                  <Route path="/explorer.html" element={<Navigate to="/explorer" replace />} />
                  <Route path="/pow.html" element={<Navigate to="/pow" replace />} />
                  <Route path="/sakura.html" element={<Navigate to="/sakura" replace />} />
                  <Route path="/contracts.html" element={<Navigate to="/contracts" replace />} />
                  <Route path="/enterprise.html" element={<Navigate to="/enterprise" replace />} />
                  <Route path="/bridge.html" element={<Navigate to="/bridge" replace />} />
                  <Route path="/freqtrade.html" element={<Navigate to="/freqtrade" replace />} />

                  {/* Fallback redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Mobile Bottom Nav */}
          <MobileBottomNav />

          {/* Sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden fade-in"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      )}
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
