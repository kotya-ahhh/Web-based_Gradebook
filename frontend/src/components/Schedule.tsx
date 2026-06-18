import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const Schedule: React.FC = () => {
  const dummySchedule = [
    { time: '08:30 - 10:00', monday: 'Математика', tuesday: 'Базы данных', wednesday: '-', thursday: 'Программирование', friday: 'Физика' },
    { time: '10:15 - 11:45', monday: 'Физика', tuesday: 'Алгоритмы', wednesday: 'Математика', thursday: 'Базы данных', friday: 'Программирование' },
    { time: '12:00 - 13:30', monday: 'Программирование', tuesday: '-', wednesday: 'Английский', thursday: 'Физика', friday: 'Математика' },
    { time: '14:00 - 15:30', monday: '-', tuesday: '-', wednesday: 'Базы данных', thursday: '-', friday: '-' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box component="h2" sx={{ m: 0, mb: 3, fontFamily: 'sans-serif' }}>Расписание занятий</Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto', border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', width: '120px' }}>Время</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Понедельник</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Вторник</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Среда</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Четверг</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Пятница</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummySchedule.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, transition: 'background-color 0.1s' }}>
                <TableCell sx={{ borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                  {row.time}
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{row.monday}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{row.tuesday}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{row.wednesday}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{row.thursday}</TableCell>
                <TableCell>{row.friday}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};