import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

const Register = ({ setUser }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await register(form);
      localStorage.setItem('freshdishToken', response.data.token);
      setUser(response.data.user);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="centered-form-bg">
      <section className="centered-form-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="centered-form">
          <label>Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <small className="help-text" style={{ marginBottom: '1rem' }}>
            Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </small>
          <button type="submit" className="primary-button" style={{ marginTop: '1.2rem' }}>Register</button>
        </form>
      </section>
    </div>
  );
};

export default Register;
