import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/message');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Message from Node.js Server:</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
