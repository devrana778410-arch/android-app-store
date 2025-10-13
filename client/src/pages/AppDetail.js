import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const AppDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiBaseUrl}/api/apps/${id}`);
        setApp(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching app details:', error);
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading text-2xl">Loading app details...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">App not found</h2>
        <p className="text-gray-600 mb-4">The app you're looking for doesn't exist.</p>
        <Link to="/apps" className="btn-primary">
          Browse All Apps
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link to="/apps" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200">
          <span className="mr-2">←</span> Back to Apps
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* App header */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <img
              src={app.icon}
              alt={app.name}
              className="w-32 h-32 rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-8"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128x128?text=App';
              }}
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{app.name}</h1>
              <p className="text-xl text-blue-600 font-medium mb-4">{app.category}</p>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="text-yellow-500 text-2xl mr-2">⭐</span>
                <span className="text-2xl font-bold text-gray-800 mr-4">{app.rating}</span>
                <span className="text-gray-600">({app.downloads} downloads)</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <span>📏 {app.size}</span>
                <span>🔄 v{app.version}</span>
                <span className={`font-medium ${app.price === 'Free' ? 'text-green-600' : 'text-gray-800'}`}>
                  💰 {app.price}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About this app</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{app.description}</p>
          </div>

          {/* Screenshots */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {app.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Screenshot';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Developer info */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Developer</h2>
            <p className="text-gray-700 text-lg">👨‍💻 {app.developer}</p>
          </div>

          {/* Download button */}
          <div className="text-center">
          <Button variant="success" size="lg" className="me-3" onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/apps/${app.id}/download`, '_blank')} disabled={!app.apk_filename}>
  <i className="bi bi-download me-2"></i>
  {app.apk_filename ? 'Download APK' : 'APK Not Available'}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
