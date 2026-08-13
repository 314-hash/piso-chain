import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in Dashboard Component:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-dark-800 border border-red-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-red-400">Dashboard Render Notice</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              An unexpected render issue occurred in this view. Click below to reload your dashboard.
            </p>
            <div className="p-3 bg-red-950/40 border border-red-800/30 rounded-lg text-left text-[11px] font-mono text-red-300 overflow-x-auto max-h-32">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-xs transition-all shadow-lg shadow-blue-500/20"
            >
              🔄 Reload Dashboard
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
