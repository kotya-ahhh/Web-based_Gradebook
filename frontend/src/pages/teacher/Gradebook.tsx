import React, { useState, MouseEvent } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TextField, Box, Typography 
} from '@mui/material';

interface StudentInfo {
  id: number;
  name: string;
  status: 'ACTIVE' | 'EXPELLED' | 'NEW';
}

interface CellData {
  value: string;
  isAbsent: boolean;
  isLate: boolean;
}

export const TeacherGradebook: React.FC = () => {
  const [students] = useState<StudentInfo[]>([
    { id: 1, name: 'Иванов И.И.', status: 'ACTIVE' },
    { id: 2, name: 'Петров П.П.', status: 'NEW' },
    { id: 3, name: 'Сидоров С.С.', status: 'EXPELLED' },
  ]);

  const [dates] = useState<string[]>(['01.09', '03.09', '05.09']);
  
  const [grades, setGrades] = useState<Record<string, CellData>>({});
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const getCellKey = (studentId: number, dateIndex: number) => `${studentId}-${dateIndex}`;

  const handleInteraction = (e: MouseEvent<HTMLDivElement>, studentId: number, dateIndex: number) => {
    e.preventDefault();
    const key = getCellKey(studentId, dateIndex);
    const current = grades[key] || { value: '', isAbsent: false, isLate: false };

    if (e.button === 1) {
      setGrades(prev => ({
        ...prev,
        [key]: { ...current, isLate: !current.isLate, isAbsent: false }
      }));
    } else if (e.button === 2) {
      setGrades(prev => ({
        ...prev,
        [key]: { ...current, isAbsent: !current.isAbsent, isLate: false, value: '' }
      }));
    }
  };

  const handleInputChange = (studentId: number, dateIndex: number, val: string) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    
    const key = getCellKey(studentId, dateIndex);
    const current = grades[key] || { value: '', isAbsent: false, isLate: false };
    
    setGrades(prev => ({
      ...prev,
      [key]: { ...current, value: val, isAbsent: false }
    }));
  };

  const getRowStyle = (status: string, studentId: number) => {
    let backgroundColor = 'inherit';
    let opacity = 1;

    if (status === 'EXPELLED') {
      opacity = 0.5;
      backgroundColor = '#f5f5f5';
    } else if (status === 'NEW') {
      backgroundColor = '#e8f5e9';
    }

    if (hoveredRow === studentId) {
      backgroundColor = status === 'EXPELLED' ? '#e0e0e0' : '#bbdefb';
    }

    return { backgroundColor, opacity, transition: 'background-color 0.2s' };
  };

  const getCellStyle = (studentId: number, dateIndex: number) => {
    const key = getCellKey(studentId, dateIndex);
    const data = grades[key];
    
    let backgroundColor = 'inherit';
    if (data?.isAbsent) backgroundColor = '#ffcdd2';
    if (data?.isLate) backgroundColor = '#fff9c4';
    
    if (hoveredCol === dateIndex && hoveredRow !== studentId) {
      backgroundColor = backgroundColor === 'inherit' ? '#e3f2fd' : backgroundColor;
    }

    return { 
      backgroundColor, 
      cursor: 'pointer',
      minWidth: '60px',
      transition: 'background-color 0.2s'
    };
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Журнал преподавателя</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Студент</TableCell>
              {dates.map((date, index) => (
                <TableCell 
                  key={index}
                  onMouseEnter={() => setHoveredCol(index)}
                  onMouseLeave={() => setHoveredCol(null)}
                  sx={{ backgroundColor: hoveredCol === index ? '#e3f2fd' : 'inherit' }}
                >
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow 
                key={student.id}
                onMouseEnter={() => setHoveredRow(student.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={getRowStyle(student.status, student.id)}
              >
                <TableCell>{student.name}</TableCell>
                {dates.map((_, index) => (
                  <TableCell 
                    key={index}
                    sx={getCellStyle(student.id, index)}
                    onMouseEnter={() => setHoveredCol(index)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <Box
                      onMouseDown={(e) => handleInteraction(e, student.id, index)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <TextField
                        variant="standard"
                        value={grades[getCellKey(student.id, index)]?.value || ''}
                        onChange={(e) => handleInputChange(student.id, index, e.target.value)}
                        disabled={grades[getCellKey(student.id, index)]?.isAbsent}
                        inputProps={{ 
                          style: { textAlign: 'center', cursor: 'pointer' },
                          maxLength: 2 
                        }}
                        InputProps={{ disableUnderline: true }}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};