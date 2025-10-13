import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppCard from '../components/AppCard';

const AppsList = () => {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiBaseUrl}/api/apps`);
        setApps(response.data);
        setFilteredApps(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching apps:', error);
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredApps(apps);
    } else {
      const filtered = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
    }
  }, [searchTerm, apps]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      setFilteredApps(apps);
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBaseUrl}/api/search`, { query: searchTerm });
      setFilteredApps(response.data);
    } catch (error) {
      console.error('Error searching apps:', error);
      // Fallback to client-side filtering
      const filtered = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading text-2xl">Loading apps...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All Apps
        </h1>
        <p className="text-xl text-gray-600">Discover and download amazing Android applications</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search apps, categories, or descriptions..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary ml-2 px-6">
            Search
          </button>
        </div>
      </form>

      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredApps.length} of {apps.length} apps
        </p>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No apps found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppsList;
