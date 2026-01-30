// src/components/Services.jsx  (or Products.jsx, Components.jsx – whatever your file is)

import { useState, useEffect } from 'react';
import apiClient from '../services/api';  // adjust path if needed

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Change this endpoint to whatever your backend uses
        // Common examples: '/api/services', '/api/products', '/products', '/api/components'
        const response = await apiClient.get('/api/services');  
        
        setServices(response.data);  // assuming backend returns an array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);  // Empty array = run once on component mount

  if (loading) {
    return <div className="text-center py-10">Loading services...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No services found. Try adjusting your filters.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {service.image && (
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-blue-600">${service.price}</p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;