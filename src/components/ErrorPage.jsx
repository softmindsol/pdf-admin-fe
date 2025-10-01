// src/components/ErrorPage.jsx

import React from 'react';

// An SVG for a visual cue. You can replace this with your own image or SVG.
const ErrorIcon = () => (
  <svg
    className="w-24 h-24 text-orange-dark mb-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const ErrorPage = () => {
  // This function will handle the page reload.
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 font-sans">
      <div className="text-center p-10 md:p-16 rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 max-w-lg mx-4">
        
        <div className="flex justify-center">
          <ErrorIcon />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Oops!
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Something went wrong on our end. Please try reloading the page.
        </p>

        <button
          onClick={handleReload}
          className="orange-gradient text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-light focus:ring-opacity-50"
        >
          Reload Page
        </button>

      </div>
    </main>
  );
};

export default ErrorPage;