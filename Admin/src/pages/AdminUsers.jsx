import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import './AdminUsers.css'; // Create your styles here

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20; // users per page

  const fetchUsers = async (pageNum = 1) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.getUsers(pageNum);


    setUsers(response.data.users);
    setPage(response.data.page);
    setTotalPages(response.data.totalPages);
  } catch (err) {
    setError('Failed to load users');
    console.error('Fetch users error:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-users-page">
      <h2>Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Registered On</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullname || '-'}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.verified ? 'Yes' : 'No'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
