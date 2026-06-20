import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';

export const Labs: React.FC = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = () => {
    fetch('http://localhost:3000/labs/all-labs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setLabs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, labId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(labId);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('labWorkId', labId.toString());

    fetch('http://localhost:3000/labs/submit', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error();
      alert('Файл загружен');
      fetchLabs();
    })
    .catch(() => alert('Ошибка при загрузке'))
    .finally(() => setUploadingId(null));
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <h2 style={{ fontFamily: 'sans-serif', marginTop: 0, marginBottom: '20px' }}>Лабораторные работы</h2>
      {labs.length === 0 ? (
        <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Лабораторных работ пока нет.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {labs.map(lab => (
            <div key={lab.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <h3 style={{ fontFamily: 'sans-serif', margin: 0 }}>{lab.title}</h3>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={lab.subjectName} color="primary" variant="outlined" size="small" />
                      {lab.isTeamWork && <Chip label="Командная" color="info" size="small" />}
                    </Box>
                  </Box>
                  <p style={{ fontFamily: 'sans-serif', whiteSpace: 'pre-wrap', color: '#333' }}>{lab.description}</p>
                  <p style={{ fontFamily: 'sans-serif', color: '#d32f2f', fontSize: '14px', fontWeight: 'bold' }}>
                    Дедлайн: {new Date(lab.deadline).toLocaleDateString('ru-RU')}
                  </p>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <h4 style={{ fontFamily: 'sans-serif', margin: '0 0 10px 0' }}>Статус сдачи:</h4>
                    {lab.submissions && lab.submissions.length > 0 ? (
                      <Box>
                        <p style={{ fontFamily: 'sans-serif', color: '#2e7d32', margin: '0 0 10px 0', fontWeight: 'bold' }}>Работа сдана</p>
                        <Button variant="outlined" size="small" href={`http://localhost:3000${lab.submissions[0].fileUrl}`} target="_blank">
                          Скачать файл
                        </Button>
                        {lab.submissions[0].mark && (
                          <p style={{ fontFamily: 'sans-serif', marginTop: '10px', color: '#1976d2', fontWeight: 'bold' }}>
                            Оценка: {lab.submissions[0].mark}
                          </p>
                        )}
                      </Box>
                    ) : (
                      <Box>
                        <input
                          type="file"
                          id={`upload-${lab.id}`}
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, lab.id)}
                          disabled={uploadingId === lab.id}
                        />
                        <label htmlFor={`upload-${lab.id}`}>
                          <Button variant="contained" component="span" disabled={uploadingId === lab.id}>
                            {uploadingId === lab.id ? 'Загрузка...' : 'Загрузить решение'}
                          </Button>
                        </label>
                      </Box>
                    )}
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