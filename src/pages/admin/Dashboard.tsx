const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>
      <p className="text-gray-700 mb-6">
        Manage users, roles, and system settings from this dashboard.
      </p>
      {/* Example dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Users</h3>
          <p className="text-indigo-700 text-3xl">150</p>
        </div>
        <div className="bg-indigo-100 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Active Roles</h3>
          <p className="text-indigo-700 text-3xl">5</p>
        </div>
        <div className="bg-indigo-100 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Pending Requests</h3>
          <p className="text-indigo-700 text-3xl">12</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
