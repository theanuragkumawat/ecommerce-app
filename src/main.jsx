import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"


import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import store from './store/store'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Provider store={store}>
    <App />
    <Toaster />
</Provider>
</BrowserRouter>

)
