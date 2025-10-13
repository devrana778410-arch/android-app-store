import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';

const Developer = () => {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    version: '',
    size: '',
    downloads: '0',
    rating: '0',
    icon: '',
    screenshots: '',
    developer: '',
    price: 'Free',
    apkFile: null
  });

  useEffect(() => {
    loadDeveloperApps();
  }, []);

  const loadDeveloperApps = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiBaseUrl}/api/developer/apps`);
      setApps(response.data);
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'apkFile') {
      setFormData({
        ...formData,
        apkFile: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const appData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        version: formData.version,
        size: formData.size,
        downloads: parseInt(formData.downloads),
        rating: parseFloat(formData.rating),
        icon: formData.icon,
        screenshots: formData.screenshots.split(',').map(s => s.trim()),
        developer: formData.developer,
        price: formData.price
      };

      let appId;
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      if (editingApp) {
        await axios.put(`${apiBaseUrl}/api/developer/apps/${editingApp.id}`, appData);
        appId = editingApp.id;
        setMessage('App updated successfully!');
      } else {
        const response = await axios.post(`${apiBaseUrl}/api/developer/apps`, appData);
        appId = response.data.app.id;
        setMessage('App uploaded successfully!');
      }

      // Upload APK file if provided
      if (formData.apkFile) {
        const apkFormData = new FormData();
        apkFormData.append('apk', formData.apkFile);

        await axios.post(`${apiBaseUrl}/api/developer/apps/${appId}/upload-apk`, apkFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(prev => prev + ' APK uploaded successfully!');
      }

      setShowModal(false);
      setEditingApp(null);
      resetForm();
      loadDeveloperApps();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      version: '',
      size: '',
      downloads: '0',
      rating: '0',
      icon: '',
      screenshots: '',
      developer: '',
      price: 'Free',
      apkFile: null
    });
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      category: app.category,
      description: app.description,
      version: app.version,
      size: app.size,
      downloads: app.downloads.toString(),
      rating: app.rating.toString(),
      icon: app.icon,
      screenshots: app.screenshots.join(', '),
      developer: app.developer,
      price: app.price,
      apkFile: null
    });
    setShowModal(true);
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        await axios.delete(`${apiBaseUrl}/api/developer/apps/${appId}`);
        setMessage('App deleted successfully!');
        loadDeveloperApps();
      } catch (error) {
        setMessage('Error deleting app');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Developer Dashboard</h1>
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setEditingApp(null);
                resetForm();
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Upload New App
            </Button>
          </div>
        </Col>
      </Row>

      {message && (
        <Row className="mb-4">
          <Col>
            <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
              {message}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        {apps.map(app => (
          <Col md={6} lg={4} key={app.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={app.icon} alt={app.name} style={{ height: '150px', objectFit: 'cover' }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{app.name}</Card.Title>
                <Card.Text className="flex-grow-1">{app.description}</Card.Text>
                <div className="mb-2">
                  <Badge bg="secondary" className="me-2">{app.category}</Badge>
                  <Badge bg="info">{app.version}</Badge>
                  {app.apk_filename && <Badge bg="success">APK Available</Badge>}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Downloads: {app.downloads}</small>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(app)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(app.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Upload/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingApp ? 'Edit App' : 'Upload New App'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>App Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Version *</Form.Label>
                  <Form.Control
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Size *</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 50MB"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Free or $X.XX"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Developer Name *</Form.Label>
              <Form.Control
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Icon URL *</Form.Label>
              <Form.Control
                type="url"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
                placeholder="https://example.com/icon.png"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Screenshots (comma-separated URLs)</Form.Label>
              <Form.Control
                type="text"
                name="screenshots"
                value={formData.screenshots}
                onChange={handleChange}
                placeholder="https://example.com/screenshot1.png, https://example.com/screenshot2.png"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>APK File</Form.Label>
              <Form.Control
                type="file"
                name="apkFile"
                accept=".apk"
                onChange={handleChange}
                disabled={editingApp !== null} // Disable for editing (APK upload only for new apps)
              />
              <Form.Text className="text-muted">
                Upload your Android APK file (max 100MB). Only .apk files are accepted.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {editingApp ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  editingApp ? 'Update App' : 'Upload App'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Developer;