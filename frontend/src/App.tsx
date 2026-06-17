import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Schedule } from './components/Schedule';
import { StudentJournal } from './components/StudentJournal';
import { Labs } from './components/Labs';
import { Journal } from './components/Journal';
import { SubjectProgram } from './components/SubjectProgram';
import { TeacherLabs } from './components/TeacherLabs';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

const Navigation = () => {
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/') return null;

  const isTeacher = location.pathname.startsWith('/teacher');
  const isStudent = location.pathname.startsWith('/student');

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {isTeacher && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button component={Link} to="/teacher/schedule" color="inherit">Расписание</Button>
              <Button component={Link} to="/teacher/gradebook" color="inherit">Журнал</Button>
              <Button component={Link} to="/teacher/program" color="inherit">Выдать ТЗ</Button>
              <Button component={Link} to="/teacher/submissions" color="inherit">Проверка Лаб</Button>
            </Box>
          )}

          {isStudent && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button component={Link} to="/student/schedule" color="inherit">Расписание</Button>
              <Button component={Link} to="/student/gradebook" color="inherit">Мои оценки</Button>
              <Button component={Link} to="/student/labs" color="inherit">Лабораторные</Button>
            </Box>
          )}
        </Box>

        <Button 
          color="error" 
          variant="contained"
          sx={{ fontWeight: 'bold' }}
          onClick={() => {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/login';
          }}
        >
          Выход
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/student/schedule" element={<Schedule />} />
        <Route path="/student/gradebook" element={<StudentJournal />} />
        <Route path="/student/labs" element={<Labs />} />
        
        <Route path="/teacher/schedule" element={<Schedule />} />
        <Route path="/teacher/gradebook" element={<Journal />} />
        <Route path="/teacher/program" element={<SubjectProgram />} />
        <Route path="/teacher/submissions" element={<TeacherLabs />} />
      </Routes>
    </Router>
  );
};

export default App;