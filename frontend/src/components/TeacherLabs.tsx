import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Chip, CircularProgress } from '@mui/material';

export const TeacherLabs: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = () => {
    fetch('http://localhost:3000/labs/all-submissions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setSubmissions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleGrade = (submissionId: number, mark: string, comment: string) => {
    const numMark = parseInt(mark, 10);
    
    if (isNaN(numMark) || numMark < 1 || numMark > 10) {
      alert('Оценка должна быть от 1 до 10!');
      return;
    }

    fetch('http://localhost:3000/labs/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ submissionId, mark, comment })
    })
    .then(res => {
      if (!res.ok) throw new Error();
      alert('Оценка выставлена!');
      fetchSubmissions();
    })
    .catch(() => alert('Ошибка'));
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <h2 style={{ fontFamily: 'sans-serif', marginTop: 0, marginBottom: '20px' }}>Проверка работ</h2>
      {submissions.length === 0 ? (
        <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Нет загруженных работ для проверки.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {submissions.map(sub => (
            <div key={sub.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <h3 style={{ fontFamily: 'sans-serif', margin: '0 0 8px 0' }}>{sub.labWork?.title || 'Без названия'}</h3>
                      <Chip label={sub.labWork?.subjectName} color="primary" variant="outlined" size="small" />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'sans-serif', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                        Студент: {sub.student?.lastName} {sub.student?.firstName}
                      </p>
                      <Button variant="outlined" size="small" href={`http://localhost:3000${sub.fileUrl}`} target="_blank">
                        Скачать файл решения
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <TextField 
                      label="Оценка" 
                      variant="outlined" 
                      size="small" 
                      sx={{ width: '100px' }}
                      defaultValue={sub.mark || ''}
                      id={`mark-${sub.id}`}
                    />
                    <TextField 
                      label="Комментарий" 
                      variant="outlined" 
                      size="small" 
                      fullWidth
                      defaultValue={sub.comment || ''}
                      id={`comment-${sub.id}`}
                    />
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        const mark = (document.getElementById(`mark-${sub.id}`) as HTMLInputElement).value;
                        const comment = (document.getElementById(`comment-${sub.id}`) as HTMLInputElement).value;
                        handleGrade(sub.id, mark, comment);
                      }}
                    >
                      Оценить
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};