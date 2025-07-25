import React from 'react';
import ReactDOM from 'react-dom/client';
import SelectedApp from './SelectedApp';

if (process.env.NODE_ENV === 'development') {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <SelectedApp />
    </React.StrictMode>
  );
}
