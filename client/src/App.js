import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import Home from './pages/Home';
import AppsList from './pages/AppsList';
import AppDetail from './pages/AppDetail';
import Login from './pages/Login';
import Developer from './pages/Developer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apps" element={<AppsList />} />
            <Route path="/apps/:id" element={<AppDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/developer" element={<Developer />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
