const HomePage = () => {
  return (
    <div className="text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Entity Editor
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A powerful tool for managing and editing entity data with an intuitive interface.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Plans</h3>
            <p className="text-gray-600 mb-4">
              Manage and edit price plan entities with full CRUD operations.
            </p>
            <a
              href="/price-plans"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Price Plans
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Entity Management</h3>
            <p className="text-gray-600 mb-4">
              Create, read, update, and delete entities with a flexible schema system.
            </p>
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 cursor-not-allowed">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
