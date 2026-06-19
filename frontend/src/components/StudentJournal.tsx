import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';

export const StudentJournal: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/grades/my', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setGrades(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box component="h2" sx={{ m: 0, mb: 3, fontFamily: 'sans-serif' }}>Мои оценки</Box>
      
      {grades.length === 0 ? (
        <Box sx={{ fontFamily: 'sans-serif' }}>Оценок пока нет.</Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Дата урока</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Предмет</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Оценка / Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map(grade => (
                <TableRow key={grade.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, transition: 'background-color 0.1s' }}>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    {grade.schedule?.date ? new Date(grade.schedule.date).toLocaleDateString('ru-RU') : 'Нет даты'}
                  </TableCell>
                  
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    {grade.schedule?.subject?.name || 'Неизвестный предмет'}
                  </TableCell>
                  
                  <TableCell>
                    {grade.isAbsent ? (
                      <Box component="span" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Н (Отсутствовал)</Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {grade.value && <Box component="span" sx={{ fontWeight: 'bold', fontSize: '16px' }}>{grade.value}</Box>}
                        {grade.isLate && <Chip label="Опоздание" size="small" color="warning" />}
                        {!grade.value && !grade.isLate && <Box component="span">-</Box>}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};