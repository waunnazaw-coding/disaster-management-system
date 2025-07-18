const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
    <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4 animate-fade-in-down">
        Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
      {/* Optional: Add a button to navigate home or log out */}
      <button
        onClick={() => window.location.href = '/'} // Example: navigate to home
        className="mt-8 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Homepage
      </button>
    </div>
  </div>
);

export default Unauthorized;
