import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, TextField
} from '@mui/material';

export const TeacherLabSubmissions: React.FC = () => {
  const submissions = [
    { id: 1, student: 'Смирнов А.', file: 'lab1_smirnov.zip', date: '05.09.2026', status: 'Ожидает проверки' },
    { id: 2, student: 'Петрова В.', file: 'rust_lab.tar.gz', date: '04.09.2026', status: 'Проверено' }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Сдача лабораторных работ</Typography>
      <Typography variant="subtitle1" gutterBottom>Лабораторная №1</Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Студент</TableCell>
              <TableCell>Дата сдачи</TableCell>
              <TableCell>Файл</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Оценка</TableCell>
              <TableCell>Комментарий</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.student}</TableCell>
                <TableCell>{sub.date}</TableCell>
                <TableCell>
                  <Button size="small" variant="text">{sub.file}</Button>
                </TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>
                  <TextField size="small" sx={{ width: 60 }} />
                </TableCell>
                <TableCell>
                  <TextField size="small" fullWidth />
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" color="primary">Сохранить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};