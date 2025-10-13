import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Card, Spinner } from 'react-bootstrap';

const ChatbotWidget = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. I can help you find apps, answer questions about the app store, or provide recommendations. What can I help you with today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBaseUrl}/api/chatbot`, { query: input });
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg"
        style={{ width: '60px', height: '60px', zIndex: 1050 }}
        variant="primary"
      >
        <i className="bi bi-chat-dots-fill fs-4"></i>
      </Button>

      {/* Chat Modal */}
      <Modal
        show={isOpen}
        onHide={() => {
          setIsOpen(false);
          if (onClose) onClose();
        }}
        size="lg"
        centered
        className="chat-modal"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-robot me-2"></i>
            AI App Store Assistant
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0" style={{ height: '500px' }}>
          <div className="d-flex flex-column h-100">
            {/* Messages Area */}
            <div className="flex-grow-1 p-3 overflow-auto bg-light">
              {messages.map((msg, index) => (
                <div key={index} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <Card className={`shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white'}`} style={{ maxWidth: '70%' }}>
                    <Card.Body className="p-3">
                      <Card.Text className="mb-0 small">
                        {msg.text}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <Card className="shadow-sm bg-white" style={{ maxWidth: '70%' }}>
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <small className="text-muted">AI is typing...</small>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-top bg-white">
              <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about apps, recommendations, or anything else..."
                    className="me-2"
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!input.trim() || isTyping}
                  >
                    <i className="bi bi-send-fill"></i>
                  </Button>
                </div>
              </Form>
              <small className="text-muted mt-2 d-block">
                Try asking: "What are the best productivity apps?" or "Recommend games for kids"
              </small>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatbotWidget;
