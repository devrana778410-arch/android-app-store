import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const CategoryList = ({ categories }) => {
  const categoryIcons = {
    'Games': '🎮',
    'Productivity': '💼',
    'Social': '👥',
    'Education': '📚'
  };

  return (
    <Row>
      {categories.map(category => (
        <Col key={category.id} md={6} lg={3} className="mb-4">
          <Card className="h-100 shadow-sm hover-shadow-lg transition-all duration-300 border-0 bg-light">
            <Card.Body className="text-center d-flex flex-column justify-content-center">
              <div className="fs-1 mb-3">
                {categoryIcons[category.name] || '📱'}
              </div>
              <Card.Title className="fw-bold mb-2">{category.name}</Card.Title>
              <Card.Text className="text-muted small">{category.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryList;
