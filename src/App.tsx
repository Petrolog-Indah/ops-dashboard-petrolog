import { useState } from 'react'
// import DashboardPage from './pages/DashboardPage'
import NewDashboardPage from './pages/NewDashboardPage'
import DualChartExamplePage from './pages/DualChartExamplePage'
import TrendChartPage from './pages/TrendChartPage'
import './index.css'

type ViewType = 'dashboard' | 'new_dashboard' | 'example' | 'trend';

function App() {
  const [view, setView] = useState<ViewType>('dashboard');

  if (view === 'example') {
    return <DualChartExamplePage onBack={() => setView('dashboard')} />
  }

  if (view === 'trend') {
    return <TrendChartPage onBack={() => setView('dashboard')} />
  }

  // if (view === 'new_dashboard') {
  //   return (
  //     <div className="relative min-h-screen">
  //       <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
  //          <button 
  //            onClick={() => setView('dashboard')}
  //            className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-4 py-3 rounded-2xl text-xs font-black shadow-xl transition-all hover:scale-105 active:scale-95"
  //          >
  //            Kembali ke Classic Dashboard
  //          </button>
  //       </div>
  //       <NewDashboardPage />
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen">
      {/* Floating Shortcut Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        {/* <button 
          onClick={() => setView('new_dashboard')}
          className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl text-xs font-black shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group"
        >
          <span className="text-lg group-hover:rotate-12 transition-transform">📱</span>
          <span className="uppercase tracking-widest">New Grid Design</span>
        </button> */}

        {/* <button 
          onClick={() => setView('example')}
          className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl text-xs font-black shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group"
        >
          <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
          <span className="uppercase tracking-widest">Dual Chart Ideas</span>
        </button>

        <button 
          onClick={() => setView('trend')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-2xl text-xs font-black shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group"
        >
          <div className="flex items-center gap-1">
             <div className="w-1 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
             <div className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
             <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="uppercase tracking-widest">Trend Analytics</span>
        </button> */}
      </div>

      <NewDashboardPage />
    </div>
  )
}

export default App;
