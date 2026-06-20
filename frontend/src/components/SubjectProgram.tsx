import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, Paper, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';

export const SubjectProgram: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isTeamWork, setIsTeamWork] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/labs/all-subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        if (data.length > 0) setSelectedSubjectId(data[0].id);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubjectId) {
      alert('Выберите предмет');
      return;
    }
    
    fetch('http://localhost:3000/labs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        description,
        deadline,
        isTeamWork,
        subjectId: selectedSubjectId
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка');
      }
      return res.json();
    })
    .then(() => {
      alert('Задание создано');
      setTitle('');
      setDescription('');
      setDeadline('');
      setIsTeamWork(false);
    })
    .catch((e: any) => {
      alert(e.message);
    });
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'sans-serif', marginTop: 0 }}>Выдать новое ТЗ</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <FormControl fullWidth required>
            <InputLabel id="subject-label">Предмет</InputLabel>
            <Select
              labelId="subject-label"
              value={selectedSubjectId}
              label="Предмет"
              onChange={e => setSelectedSubjectId(Number(e.target.value))}
            >
              {subjects.map(sub => (
                <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Название" required value={title} onChange={e => setTitle(e.target.value)} />
          <TextField label="Описание" required multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#666' }}>Дедлайн *</label>
            <input 
              type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} 
              style={{ padding: '14px', borderRadius: '4px', border: '1px solid #c4c4c4', fontSize: '16px', fontFamily: 'inherit' }} 
            />
          </div>

          <FormControlLabel control={<Checkbox checked={isTeamWork} onChange={e => setIsTeamWork(e.target.checked)} />} label="Командная работа" />
          <Button type="submit" variant="contained" color="primary">Опубликовать</Button>
        </form>
      </Paper>
    </Box>
  );
};