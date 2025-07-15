import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import WelcomePage from './pages/WelcomePage';
import Layout from './components/Layout';
import './App.css';

// Lazy load dos micro-frontends
const ClientsPage = React.lazy(() => import('./pages/ClientsPageMF'));
const SelectedPage = React.lazy(() => import('./pages/SelectedPageMF'));

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
                <Suspense fallback={<div className="loading">Carregando...</div>}>
                  <ClientsPage />
                </Suspense>
              </Layout>
            } 
          />
          <Route 
            path="/selected" 
            element={
              <Layout>
                <Suspense fallback={<div className="loading">Carregando...</div>}>
                  <SelectedPage />
                </Suspense>
              </Layout>
            } 
          />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
