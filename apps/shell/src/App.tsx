import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import WelcomePage from './pages/WelcomePage';
import Layout from './components/Layout';
import ClientsPageMF from './pages/ClientsPageMF';
import SelectedPageMF from './pages/SelectedPageMF';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route 
            path="/clients" 
            element={
              <Layout>
                <ClientsPageMF />
              </Layout>
            } 
          />
          <Route 
            path="/selected" 
            element={
              <Layout>
                <SelectedPageMF />
              </Layout>
            } 
          />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
