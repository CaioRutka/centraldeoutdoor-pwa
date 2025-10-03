import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface ScheduleItem {
  _id: string;
  startTime: string;
  endTime: string;
  title: string;
  type: 'talk' | 'break' | 'networking' | 'panel' | 'sponsor' | 'opening';
  description?: string;
  speaker?: string;
}

interface Schedule {
  _id: string;
  days: Array<{
    day: number;
    date: string;
    items: ScheduleItem[];
  }>;
}

const getTypeColor = (type: ScheduleItem['type']) => {
  switch (type) {
    case 'talk':
      return '#00C851'; // Verde
    case 'panel':
      return '#00C851'; // Verde
    case 'break':
      return '#E8E8E8'; // Cinza
    case 'networking':
      return '#E8E8E8'; // Cinza
    case 'sponsor':
      return '#FFD700'; // Amarelo
    case 'opening':
      return '#004C84'; // Azul principal
    default:
      return '#F2F7FF';
  }
};

const getTypeTextColor = (type: ScheduleItem['type']) => {
  switch (type) {
    case 'break':
    case 'networking':
      return '#666666';
    default:
      return '#fff';
  }
};

export default function Schedule() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    if (!eventId) return;
    loadSchedule();
  }, [eventId]);

  const loadSchedule = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const scheduleData = await api.getEventSection(eventId, 'schedule');
      setSchedule(scheduleData);
      if (scheduleData.days && scheduleData.days.length > 0) {
        setSelectedDay(scheduleData.days[0].day);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar programação');
      console.error('Erro ao carregar schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderScheduleItem = (item: ScheduleItem) => (
    <div key={item._id} className="schedule-card" style={{ backgroundColor: getTypeColor(item.type) }}>
      <div className="schedule-time-container" style={{ backgroundColor: getTypeColor(item.type) }}>
        <div className="schedule-start-time" style={{ color: getTypeTextColor(item.type) }}>
          {item.startTime}
        </div>
        <div className="schedule-end-time" style={{ color: getTypeTextColor(item.type) }}>
          {item.endTime}
        </div>
      </div>
      
      <div className="schedule-content-container" style={{ backgroundColor: getTypeColor(item.type) }}>
        <div className="schedule-title" style={{ color: getTypeTextColor(item.type) }}>
          {item.title}
        </div>
        {item.speaker && (
          <div className="schedule-speaker" style={{ color: getTypeTextColor(item.type) }}>
            {item.speaker}
          </div>
        )}
        {item.description && (
          <div className="schedule-description" style={{ color: getTypeTextColor(item.type) }}>
            {item.description}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="schedule-loading-container">
        <div className="schedule-spinner"></div>
        <div className="schedule-loading-text">Carregando programação...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-error-container">
        <div className="schedule-error-text">❌ {error}</div>
        <button className="schedule-retry-button" onClick={loadSchedule}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!schedule || !schedule.days || schedule.days.length === 0) {
    return (
      <div className="schedule-error-container">
        <div className="schedule-error-text">Programação não encontrada</div>
      </div>
    );
  }

  const currentDay = schedule.days.find(day => day.day === selectedDay);
  const currentSchedule = currentDay?.items || [];

  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule-header">
        <button 
          className="schedule-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>
        
        <div className="schedule-header-title">Programação</div>
      </div>

      {/* Tabs dos dias */}
      <div className="schedule-tab-container">
        {schedule.days.map((day) => (
          <button
            key={day.day}
            className={`schedule-tab ${selectedDay === day.day ? 'schedule-active-tab' : ''}`}
            onClick={() => setSelectedDay(day.day)}
          >
            <div className={`schedule-tab-text ${selectedDay === day.day ? 'schedule-active-tab-text' : ''}`}>
              {day.date}
            </div>
            <div className={`schedule-tab-subtext ${selectedDay === day.day ? 'schedule-active-tab-text' : ''}`}>
              Dia {day.day}
            </div>
          </button>
        ))}
      </div>

      {/* Programação */}
      <div className="schedule-schedule-container">
        <div className="schedule-schedule-content">
          <div className="schedule-schedule-list">
            {currentSchedule.map(renderScheduleItem)}
          </div>
          
          {/* Legenda */}
          <div className="schedule-legend-container">
            <div className="schedule-legend-title">Legenda:</div>
            <div className="schedule-legend-grid">
              <div className="schedule-legend-item">
                <div className="schedule-legend-color" style={{ backgroundColor: '#00C851' }}></div>
                <div className="schedule-legend-text">Palestras e Painéis</div>
              </div>
              <div className="schedule-legend-item">
                <div className="schedule-legend-color" style={{ backgroundColor: '#FFD700' }}></div>
                <div className="schedule-legend-text">Patrocinadores</div>
              </div>
              <div className="schedule-legend-item">
                <div className="schedule-legend-color" style={{ backgroundColor: '#E8E8E8' }}></div>
                <div className="schedule-legend-text">Intervalos</div>
              </div>
              <div className="schedule-legend-item">
                <div className="schedule-legend-color" style={{ backgroundColor: '#004C84' }}></div>
                <div className="schedule-legend-text">Abertura</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


