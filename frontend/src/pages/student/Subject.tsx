import React from 'react';
import { Box, Typography, Paper, Card, CardContent, LinearProgress } from '@mui/material';

export const StudentSubject: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Программирование на C++</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>Преподаватель: Иванов А.А.</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Общая успеваемость</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={85} />
          </Box>
          <Typography variant="body2" color="text.secondary">85%</Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Лабораторные работы</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Лабораторная 1: 5 (Сдано)</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Лабораторная 2: 4 (Сдано)</Typography>
            <Typography variant="body1" color="warning.main">Лабораторная 3: Ожидает проверки</Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Контрольные и тесты</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Тест по указателям: 5</Typography>
            <Typography variant="body1">Контрольная работа №1: 4</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};