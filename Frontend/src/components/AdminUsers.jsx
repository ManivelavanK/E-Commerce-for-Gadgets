import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching users from MongoDB...');
      const data = await usersAPI.getAll();
      console.log('✅ Users fetched:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(`Failed to fetch users: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading('create');
      console.log('🔄 Creating user:', formData);
      const newUser = await usersAPI.create(formData);
      console.log('✅ User created:', newUser);
      setUsers(prev => [...prev, newUser]);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setShowForm(false);
    } catch (err) {
      console.error('❌ Error creating user:', err);
      setError(`Failed to create user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setActionLoading(id);
      console.log('🔄 Deleting user:', id);
      await usersAPI.delete(id);
      console.log('✅ User deleted');
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={`admin-users ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="admin-users-header">
        <h1>User Management</h1>
        <button className="add-user-btn" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {loading && <div className="loading">Loading users...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="users-grid">
          {users.length === 0 ? (
            <div className="no-users">No users found in database</div>
          ) : (
            users.map(user => (
              <div key={user._id} className="admin-user-card">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="email">{user.email}</p>
                  <span className={`role ${user.role}`}>{user.role}</span>
                  <p className="created-date">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="user-actions">
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteUser(user._id)}
                    disabled={actionLoading === user._id}
                  >
                    {actionLoading === user._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="user-form-overlay">
          <form className="user-form" onSubmit={handleSubmit}>
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="form-buttons">
              <button type="submit" disabled={actionLoading === 'create'}>
                {actionLoading === 'create' ? 'Creating...' : 'Add User'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;