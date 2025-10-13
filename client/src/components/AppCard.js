import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';

const AppCard = ({ app }) => {
  return (
    <Card className="h-100 shadow-sm hover-shadow-lg transition-all duration-300 border-0">
      <Card.Body className="d-flex flex-column text-center">
        <div className="mb-3">
          <img
            src={app.icon}
            alt={app.name}
            className="rounded-circle shadow-sm"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x80?text=App';
            }}
          />
        </div>

        <Card.Title className="fw-bold mb-2 fs-6 lh-sm" style={{ minHeight: '2.5rem' }}>
          {app.name}
        </Card.Title>

        <Badge bg="primary" className="mb-2 align-self-center">
          {app.category}
        </Badge>

        <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ minHeight: '3rem' }}>
          {app.description.length > 80 ? `${app.description.substring(0, 80)}...` : app.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <span className="text-warning me-1">⭐</span>
            <span className="fw-semibold small">{app.rating}</span>
          </div>
          <span className="text-muted small">{app.downloads} downloads</span>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">{app.size}</span>
          <Badge bg={app.price === 'Free' ? 'success' : 'secondary'} className="small">
            {app.price}
          </Badge>
        </div>

        <Button
          as={Link}
          to={`/apps/${app.id}`}
          variant="primary"
          className="w-100"
        >
          <i className="bi bi-eye me-1"></i>View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AppCard;
