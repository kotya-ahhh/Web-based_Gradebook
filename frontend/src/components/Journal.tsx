import React, { useEffect, useState } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

export const Journal: React.FC = () => {
  const [info, setInfo] = useState<{ groups: any[], subjects: any[] } | null>(null);
  const [groupId, setGroupId] = useState<number | ''>('');
  const [subjectId, setSubjectId] = useState<number | ''>('');

  const [data, setData] = useState<{ students: any[], schedule: any[], grades: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ studentId: number, scheduleId: number } | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ studentId: number, scheduleId: number } | null>(null);
  const [gradeValue, setGradeValue] = useState('');

  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [lessonDate, setLessonDate] = useState('');
  const [lessonStart, setLessonStart] = useState('');
  const [lessonEnd, setLessonEnd] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/grades/info', { credentials: 'include' })
      .then(res => res.json())
      .then(result => {
        setInfo(result);
        if (result.groups?.length > 0) setGroupId(result.groups[0].id);
        if (result.subjects?.length > 0) setSubjectId(result.subjects[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (groupId && subjectId) fetchJournal();
  }, [groupId, subjectId]);

  const fetchJournal = () => {
    fetch(`http://localhost:3000/grades/journal?groupId=${groupId}&subjectId=${subjectId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(result => setData(result))
      .catch(() => setData(null));
  };

  const handleUpdateGrade = (studentId: number, scheduleId: number, action: string, value: string = '') => {
    fetch('http://localhost:3000/grades/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentId, scheduleId, action, value })
    }).then(() => fetchJournal()); 
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hoveredCell || document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (/^[1-9]$/.test(e.key) || e.key === '0') {
        const mark = e.key === '0' ? '10' : e.key;
        handleUpdateGrade(hoveredCell.studentId, hoveredCell.scheduleId, 'mark', mark);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredCell, groupId, subjectId]);

  const handleContextMenu = (e: React.MouseEvent, studentId: number, scheduleId: number) => {
    e.preventDefault(); 
    handleUpdateGrade(studentId, scheduleId, 'absent');
  };

  const handleAuxClick = (e: React.MouseEvent, studentId: number, scheduleId: number) => {
    if (e.button === 1) { 
      e.preventDefault();
      handleUpdateGrade(studentId, scheduleId, 'late');
    }
  };

  const handleLeftClick = (studentId: number, scheduleId: number) => {
    setSelectedCell({ studentId, scheduleId });
    setGradeValue('');
    setOpenDialog(true);
  };

  const saveGrade = () => {
    const numMark = parseInt(gradeValue, 10);
    if (selectedCell && (gradeValue === '' || (!isNaN(numMark) && numMark >= 1 && numMark <= 10))) {
      handleUpdateGrade(selectedCell.studentId, selectedCell.scheduleId, 'mark', gradeValue);
      setOpenDialog(false);
    } else {
      alert('Оценка должна быть числом от 1 до 10!');
    }
  };

  const saveLesson = () => {
    if (!lessonDate || !lessonStart || !lessonEnd) {
      alert('Заполните все поля!');
      return;
    }
    fetch('http://localhost:3000/grades/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ groupId, subjectId, date: lessonDate, startTime: lessonStart, endTime: lessonEnd })
    }).then(res => {
      if (!res.ok) throw new Error();
      setOpenLessonDialog(false);
      setLessonDate('');
      setLessonStart('');
      setLessonEnd('');
      fetchJournal();
    }).catch(() => alert('Ошибка при создании урока'));
  };

  const getCellDisplay = (studentId: number, scheduleId: number) => {
    const grade = data?.grades.find(g => g.studentId === studentId && g.scheduleId === scheduleId);
    if (!grade) return '-';
    if (grade.isAbsent) return 'Н';
    if (grade.isLate) return 'ОП';
    return grade.value || '-';
  };

  const getRowStyle = (status: string, rowIndex: number) => {
    if (status === 'NEW') return { backgroundColor: hoveredRow === rowIndex ? '#c8e6c9' : '#e8f5e9', opacity: 1 };
    if (status !== 'ACTIVE') return { backgroundColor: hoveredRow === rowIndex ? '#ffcdd2' : '#ffebee', opacity: 0.6 };
    return { backgroundColor: hoveredRow === rowIndex ? '#e3f2fd' : 'inherit', opacity: 1 };
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (!info) return <Box sx={{ p: 3, color: '#fff' }}>Ошибка загрузки данных</Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2, bgcolor: 'rgba(0,0,0,0.5)', p: 2, borderRadius: 2 }}>
        <Box component="h2" sx={{ m: 0, color: '#fff', fontFamily: 'sans-serif' }}>Журнал</Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="group-select" sx={{ color: '#e0e0e0' }}>Группа</InputLabel>
            <Select 
              labelId="group-select" 
              value={groupId} 
              label="Группа" 
              onChange={e => setGroupId(Number(e.target.value))}
              sx={{ 
                color: '#fff', 
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                '.MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              {info.groups.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="subject-select" sx={{ color: '#e0e0e0' }}>Предмет</InputLabel>
            <Select 
              labelId="subject-select" 
              value={subjectId} 
              label="Предмет" 
              onChange={e => setSubjectId(Number(e.target.value))}
              sx={{ 
                color: '#fff', 
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                '.MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              {info.subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={() => setOpenLessonDialog(true)}>
            Добавить урок
          </Button>
        </Box>
      </Box>

      {!data ? (
        <Box sx={{ color: '#fff', fontFamily: 'sans-serif' }}>Выберите группу и предмет для отображения журнала.</Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 200, fontWeight: 'bold', backgroundColor: '#f5f5f5', borderRight: '1px solid #e0e0e0' }}>
                  Студент
                </TableCell>
                {data.schedule.map((lesson, index) => (
                  <TableCell 
                    key={lesson.id} align="center" 
                    sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: hoveredCol === index ? '#bbdefb' : '#f5f5f5',
                      transition: 'background-color 0.1s',
                      borderRight: '1px solid #e0e0e0'
                    }}
                    onMouseEnter={() => setHoveredCol(index)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    {new Date(lesson.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.students.map((student, rowIndex) => (
                <TableRow 
                  key={student.id}
                  sx={{ ...getRowStyle(student.status, rowIndex), transition: 'background-color 0.1s' }}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                    {student.lastName} {student.firstName}
                  </TableCell>
                  
                  {data.schedule.map((lesson, colIndex) => (
                    <TableCell 
                      key={lesson.id} 
                      align="center"
                      onContextMenu={(e) => handleContextMenu(e, student.id, lesson.id)}
                      onAuxClick={(e) => handleAuxClick(e, student.id, lesson.id)}
                      onClick={() => handleLeftClick(student.id, lesson.id)}
                      onMouseEnter={() => {
                        setHoveredCol(colIndex);
                        setHoveredCell({ studentId: student.id, scheduleId: lesson.id });
                      }}
                      onMouseLeave={() => {
                        setHoveredCol(null);
                        setHoveredCell(null);
                      }}
                      sx={{ 
                        cursor: 'pointer', 
                        userSelect: 'none',
                        backgroundColor: hoveredCell?.studentId === student.id && hoveredCell?.scheduleId === lesson.id 
                           ? '#90caf9' 
                           : (hoveredCol === colIndex ? '#bbdefb' : 'transparent'),
                        '&:hover': { transform: 'scale(1.05)' },
                        transition: 'all 0.1s',
                        borderRight: '1px solid #e0e0e0'
                      }}
                    >
                      <Box component="span" sx={{ 
                        fontWeight: 'bold', 
                        color: getCellDisplay(student.id, lesson.id) === 'Н' ? '#d32f2f' : (getCellDisplay(student.id, lesson.id) === 'ОП' ? '#ed6c02' : 'inherit')
                      }}>
                        {getCellDisplay(student.id, lesson.id)}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Выставить оценку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Оценка (1-10)"
            type="text"
            fullWidth
            variant="outlined"
            value={gradeValue}
            onChange={(e) => setGradeValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveGrade();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={saveGrade} variant="contained" color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)}>
        <DialogTitle>Добавить урок</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Дата"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={lessonDate}
            onChange={e => setLessonDate(e.target.value)}
          />
          <TextField
            label="Время начала"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={lessonStart}
            onChange={e => setLessonStart(e.target.value)}
          />
          <TextField
            label="Время окончания"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={lessonEnd}
            onChange={e => setLessonEnd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLessonDialog(false)}>Отмена</Button>
          <Button onClick={saveLesson} variant="contained" color="primary">Добавить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};