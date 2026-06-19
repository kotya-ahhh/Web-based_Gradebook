import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

export const StudentGradebook: React.FC = () => {
  const gradesData = [
    { id: 1, subject: 'C++', dates: [{ date: '01.09', mark: '5' }, { date: '03.09', mark: 'Н' }] },
    { id: 2, subject: 'Python', dates: [{ date: '02.09', mark: '4' }, { date: '04.09', mark: '5' }] }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Мой журнал</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Предмет</TableCell>
              <TableCell>01.09</TableCell>
              <TableCell>02.09</TableCell>
              <TableCell>03.09</TableCell>
              <TableCell>04.09</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gradesData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.dates.find(d => d.date === '01.09')?.mark || ''}</TableCell>
                <TableCell>{row.dates.find(d => d.date === '02.09')?.mark || ''}</TableCell>
                <TableCell sx={{ backgroundColor: row.dates.find(d => d.date === '03.09')?.mark === 'Н' ? '#ffcdd2' : 'inherit' }}>
                  {row.dates.find(d => d.date === '03.09')?.mark || ''}
                </TableCell>
                <TableCell>{row.dates.find(d => d.date === '04.09')?.mark || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};