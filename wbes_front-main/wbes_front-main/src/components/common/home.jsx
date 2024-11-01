// src/pages/home.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';  // Adjust the path if necessary
import FooterWithSocialLinks from './footer';  // Adjust the path if necessary
import welcome from '../../assets/welcome.svg';

const Home = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="relative min-h-screen bg-blue-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg px-8 py-8 shadow-lg text-left w-full mt-2">
        <h1 className="text-5xl font-bold text-blue-900 mt-4">
          <span className='flex items-center h-15 px-10 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 rounded-tl-full rounded-tr-full font-bold uppercase italic text-white hover:opacity-90'>
            Welcome to WBES
          </span>
        </h1>
        <div className="flex flex-col lg:flex-row items-center mt-4 ">
          <div className="lg:w-3/4 bg-white bg-opacity-30 shadow-lg backdrop-filter backdrop-blur-lg rounded-lg p-8 mr-4">
            <p className="text-lg text-cyan-900 mb-2">
              Agent: I was sure you were gonna like it. The price for this option with all of those great benefits
              and all taxes and fees included, is just $1478. Please provide me your name as in the traveling
              document, for the reservation. (proceed with Booking)
            </p>
            <p className="text-lg text-blue-800 mb-2">Engage with our community.</p>
            <p className="text-lg text-blue-800 mb-4">Unlock your potential with us.</p>
            <div className="mt-24 w-full max-w-2xl flex justify-left">
              <a href="/login" className="text-lg text-white bg-blue-600 rounded-full px-24 py-2 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700">
                Login
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 hidden lg:block rounded-tl-full rounded-br-full">
            <img src={welcome} alt="Placeholder" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterWithSocialLinks />
    </div>
  );
};

export default Home;
