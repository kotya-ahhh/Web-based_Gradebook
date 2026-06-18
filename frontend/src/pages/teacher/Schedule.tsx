import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';

export const TeacherSchedule: React.FC = () => {
  const [schedule] = useState([
    { id: 1, time: '09:00 - 10:30', group: 'Т-394', subject: 'Программирование на C++', type: 'Лекция', room: 'Ауд. 401' },
    { id: 2, time: '13:00 - 14:30', group: 'Т-395', subject: 'Веб-разработка', type: 'Лабораторная', room: 'Комп. класс 2' },
  ]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Моё расписание</Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Время</TableCell>
              <TableCell>Группа</TableCell>
              <TableCell>Предмет</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Аудитория</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((lesson) => (
              <TableRow key={lesson.id} hover>
                <TableCell><Typography fontWeight="bold">{lesson.time}</Typography></TableCell>
                <TableCell>{lesson.group}</TableCell>
                <TableCell>{lesson.subject}</TableCell>
                <TableCell><Chip label={lesson.type} size="small" color="primary" /></TableCell>
                <TableCell>{lesson.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};