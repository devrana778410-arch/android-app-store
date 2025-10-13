import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);

      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('Login successful!');
      } else {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h3>{isLogin ? 'Login' : 'Register'}</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {message && (
                <Alert variant={message.includes('successful') ? 'success' : 'danger'}>
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                  />
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {isLogin ? 'Logging in...' : 'Registering...'}
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Register'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage('');
                    setFormData({ username: '', password: '', email: '' });
                  }}
                >
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
