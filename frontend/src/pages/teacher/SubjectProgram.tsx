import React from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button, Chip
} from '@mui/material';

export const TeacherSubjectProgram: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Программа по предмету</Typography>
      <Typography variant="subtitle1" gutterBottom>Предмет: Системное программирование</Typography>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" color="primary">Добавить тему</Button>
        <Button variant="outlined" color="primary">Настройки команд</Button>
      </Box>

      <Paper>
        <List>
          <ListItem divider>
            <ListItemText
              primary="1. Введение в архитектуру ОС (Лекция)"
              secondary="Материалы прикреплены. Дата: 01.09"
            />
            <Chip label="Теория" color="info" />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="2. Настройка окружения (Лабораторная)"
              secondary="Дедлайн: 10.09. Командная работа: Да"
            />
            <Chip label="Лабораторная" color="warning" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="3. Проектирование БД (Практика)"
              secondary="ТЗ загружено"
            />
            <Chip label="Практика" color="success" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};