
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-extrabold text-nova-red">404</h1>
      <h2 className="text-4xl font-bold text-nova-light mt-4">Page Not Found</h2>
      <p className="text-lg text-nova-gray mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-8 inline-block bg-nova-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
