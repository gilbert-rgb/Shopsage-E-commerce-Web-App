import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Context Providers
import { UserProvider } from './contexts/UserContext';
import { ProductProvider } from './contexts/ProductContext'; // Make sure this file exists

// Pages
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import User from './pages/User';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/user" element={<User />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </ProductProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
