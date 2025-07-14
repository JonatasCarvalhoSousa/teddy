import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import WelcomePage from './pages/WelcomePage' // ou WelcomePageDark para versão fundo escuro
import ClientsPage from './pages/ClientsPage'
import SelectedPage from './pages/SelectedPage'
import './App.css'

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/selected" element={<SelectedPage />} />
        </Routes>
      </div>
    </AppProvider>
  )
}

export default App
