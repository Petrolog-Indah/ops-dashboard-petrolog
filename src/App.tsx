import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import DualChartExamplePage from './pages/DualChartExamplePage'
import './index.css'

function App() {
  const [showExample, setShowExample] = useState(false);

  if (showExample) {
    return <DualChartExamplePage onBack={() => setShowExample(false)} />
  }

  return (
    <div className="relative">
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowExample(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-transform hover:scale-105"
        >
          Lihat Ide Dual Chart ✨
        </button>
      </div>
      <DashboardPage />
    </div>
  )
}

export default App

