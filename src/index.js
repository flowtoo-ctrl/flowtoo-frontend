import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';
import './styles/navbar.css';
import './styles/product.css';
import './styles/cart.css';
import './styles/checkout.css';
import './styles/admin.css';
import './styles/responsive.css';


const root = createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<CartProvider>
<AuthProvider>
<App />
</AuthProvider>
</CartProvider>
</BrowserRouter>
);