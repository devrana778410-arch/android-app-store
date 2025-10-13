import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import CategoryList from '../components/CategoryList';
import AppCard from '../components/AppCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredApps, setFeaturedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        const [categoriesResponse, appsResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/categories`),
          axios.get(`${apiBaseUrl}/api/apps`)
        ]);

        setCategories(categoriesResponse.data);
        setFeaturedApps(appsResponse.data.slice(0, 6)); // Show first 6 apps as featured
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Oops!</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 fw-bold mb-4 text-primary">
            Welcome to Android App Store
          </h1>
          <p className="lead text-muted mb-4">
            Discover amazing Android apps, games, and tools. Download the best apps for your device.
          </p>
          <Button variant="primary" size="lg" className="me-3">
            <i className="bi bi-download me-2"></i>Explore Apps
          </Button>
          <Button variant="outline-primary" size="lg">
            <i className="bi bi-chat-dots me-2"></i>AI Assistant
          </Button>
        </Col>
      </Row>

      {/* Categories Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
            <i className="bi bi-folder me-3 text-primary"></i>
            Categories
          </h2>
          <CategoryList categories={categories} />
        </Col>
      </Row>

      {/* Featured Apps Section */}
      <Row>
        <Col>
          <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
            <i className="bi bi-star me-3 text-warning"></i>
            Featured Apps
          </h2>
          <Row>
            {featuredApps.map(app => (
              <Col key={app.id} md={6} lg={4} className="mb-4">
                <AppCard app={app} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="mt-5 pt-5 border-top">
        <Col md={4} className="text-center mb-4">
          <div className="fs-1 text-primary mb-2">📱</div>
          <h3 className="h4 fw-bold">10,000+</h3>
          <p className="text-muted">Apps Available</p>
        </Col>
        <Col md={4} className="text-center mb-4">
          <div className="fs-1 text-success mb-2">⭐</div>
          <h3 className="h4 fw-bold">4.8</h3>
          <p className="text-muted">Average Rating</p>
        </Col>
        <Col md={4} className="text-center mb-4">
          <div className="fs-1 text-info mb-2">👥</div>
          <h3 className="h4 fw-bold">1M+</h3>
          <p className="text-muted">Happy Users</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
