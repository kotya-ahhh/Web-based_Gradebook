import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';

interface Lesson {
  id: number;
  time: string;
  subject: string;
  type: 'Лекция' | 'Практика' | 'Лабораторная';
  teacher: string;
  room: string;
}

export const StudentSchedule: React.FC = () => {
  const [schedule] = useState<Lesson[]>([
    { id: 1, time: '09:00 - 10:30', subject: 'Программирование на C++', type: 'Лекция', teacher: 'Иванов А.А.', room: 'Ауд. 401' },
    { id: 2, time: '10:45 - 12:15', subject: 'Базы данных', type: 'Практика', teacher: 'Смирнов В.В.', room: 'Ауд. 305' },
    { id: 3, time: '13:00 - 14:30', subject: 'Веб-разработка', type: 'Лабораторная', teacher: 'Петров Б.Б.', room: 'Комп. класс 2' },
  ]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Лекция': return 'primary';
      case 'Практика': return 'success';
      case 'Лабораторная': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Расписание занятий
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Группа: Т-394 | Сегодня
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="15%">Время</TableCell>
              <TableCell width="35%">Предмет</TableCell>
              <TableCell width="15%">Тип занятия</TableCell>
              <TableCell width="20%">Преподаватель</TableCell>
              <TableCell width="15%">Аудитория</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((lesson) => (
              <TableRow key={lesson.id} hover>
                <TableCell><Typography fontWeight="bold">{lesson.time}</Typography></TableCell>
                <TableCell>{lesson.subject}</TableCell>
                <TableCell>
                  <Chip 
                    label={lesson.type} 
                    color={getTypeColor(lesson.type) as any} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{lesson.teacher}</TableCell>
                <TableCell>{lesson.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};