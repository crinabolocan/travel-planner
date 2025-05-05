import React, { useState } from 'react';
import authApi from '../api/authApi';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await authApi.post('/register', { username, password });
      alert('Înregistrare reușită!');
    } catch (err) {
      alert('Eroare la înregistrare: ' + err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;
