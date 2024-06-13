import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, formData);
        setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers([...users, response.data]);
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
    setFormData({ name: '', email: '' });
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <input 
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {editingUser ? 'Update' : 'Add'} User
          </button>
        </div>
      </form>
      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <button className="btn btn-warning mr-2" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
