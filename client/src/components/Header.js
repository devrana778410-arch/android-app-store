import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import ChatbotWidget from './ChatbotWidget';

const Header = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleChatbotToggle = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="me-2 fs-3">📱</span>
            <span className="fw-bold fs-4">Android App Store</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="me-3">
                <i className="bi bi-house-door me-1"></i>Home
              </Nav.Link>
              <Nav.Link as={Link} to="/apps" className="me-3">
                <i className="bi bi-grid me-1"></i>Apps
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="me-3">
                <i className="bi bi-person me-1"></i>Login
              </Nav.Link>
              <Nav.Link as={Link} to="/developer" className="me-3">
                <i className="bi bi-code-slash me-1"></i>Developer
              </Nav.Link>
              <Button
                variant="outline-light"
                onClick={handleChatbotToggle}
                className="me-3"
              >
                <i className="bi bi-chat-dots me-1"></i>AI Assistant
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Chatbot Modal */}
      {showChatbot && (
        <ChatbotWidget onClose={() => setShowChatbot(false)} />
      )}
    </>
  );
};

export default Header;
