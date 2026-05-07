import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import './index.css'

import App from './App'

import ConflictCenter from './pages/ConflictCenter'

import AuditTrail from './pages/AuditTrail'

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/conflicts"
          element={<ConflictCenter />}
        />

        <Route
  path="/audit"
  element={<AuditTrail />}
/>

      </Routes>

    </BrowserRouter>

  </React.StrictMode>

)