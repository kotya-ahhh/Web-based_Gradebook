import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, List, ListItem, ListItemText, Chip
} from '@mui/material';

export const StudentLabDetails: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Лабораторная работа №1: Основы Rust</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Детали задания</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Разработать консольное приложение с использованием borrow checker.
        </Typography>
        <List>
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemText primary="Дата выдачи:" secondary="01.09.2026" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Дедлайн:" secondary="10.09.2026" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Команда:"
              secondary={<Chip label="Иванов И.И." size="small" sx={{ mt: 0.5 }} />}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Сдача работы</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button variant="contained" component="label">
            Прикрепить решение
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography>{file.name}</Typography>}
        </Box>
        <Button variant="contained" color="success" disabled={!file}>
          Отправить на проверку
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6">Обратная связь от преподавателя</Typography>
        <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
          "Алгоритм написан корректно, но стоит улучшить обработку ошибок. Оценка: 9"
        </Typography>
      </Paper>
    </Box>
  );
};