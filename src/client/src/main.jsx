import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Tắt StrictMode để tránh double render trong development
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
