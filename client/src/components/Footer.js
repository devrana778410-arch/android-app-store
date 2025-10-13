import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <span className="fs-2 me-2">📱</span>
              <span className="fw-bold fs-4">Android App Store</span>
            </div>
            <p className="text-muted">Your ultimate destination for Android apps and games.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Terms of Service</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Connect With Us</h5>
            <div className="d-flex justify-content-center">
              <a href="#" className="text-light me-3 fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3 fs-4"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light me-3 fs-4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light fs-4"><i className="bi bi-youtube"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">&copy; 2023 Android App Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
