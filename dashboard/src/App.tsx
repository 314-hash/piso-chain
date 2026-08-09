import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-dark-900">
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
    </BrowserRouter>
  )
}
