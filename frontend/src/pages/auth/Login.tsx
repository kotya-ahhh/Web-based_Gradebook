import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Container, Paper, Alert } from '@mui/material';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error();

      const data: any = await res.json();
      const token = data.access_token || data.token || data.jwt;
      
      if (token) {
        document.cookie = `jwt=${token}; path=/; max-age=86400`;
      }
      
      if (data.role === 'STUDENT') navigate('/student/schedule');
      if (data.role === 'TEACHER') navigate('/teacher/gradebook');
    } catch (err) {
      setError('Ошибка авторизации. Проверьте логин и пароль.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <h2 style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: 0, marginBottom: '16px' }}>
            Вход в систему
          </h2>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Войти
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};