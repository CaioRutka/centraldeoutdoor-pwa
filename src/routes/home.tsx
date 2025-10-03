import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await api.getEvents();
      setEvents(list || []);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadEvents();
    } catch (error) {
      console.error('Failed to refresh events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEventPress = (event: any) => {
    navigate(`/event-details/${event._id}`);
  };

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await logout();
      navigate('/login', { replace: true });
    }
  };

  const renderEventCard = (event: any) => (
    <div 
      key={event._id}
      className="event-card"
      onClick={() => handleEventPress(event)}
    >
      <div className="event-header">
        <div className="event-type-container">
          <div className="event-type">{event.type?.toUpperCase() || 'EVENTO'}</div>
        </div>
        <div className="event-date">{event.date}</div>
      </div>
      
      <div className="event-main-content">
        <div className="event-info">
          <div className="event-title">{event.title}</div>
          <div className="location-container">
            <span className="location-icon">📍</span>
            <div className="event-location">{event.location}</div>
          </div>
        </div>
        <div className="event-logo-container">
          {event.photo ? (
            <img src={event.photo} alt={event.title} className="event-logo-img" />
          ) : (
            <div className="event-logo">🎯</div>
          )}
        </div>
      </div>
      
      <div className="card-action">
        <div className="view-more-text">Ver detalhes</div>
        <div className="arrow-icon">→</div>
      </div>
    </div>
  );

  if (loading && events.length === 0) {
    return (
      <div className="container">
        <div className="header">
          <img 
            src="/logo.webp" 
            alt="Central de Outdoor"
            className="logo"
            style={{ width: 200, height: 60 }}
          />
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <img 
            src="/logo.webp" 
            alt="Central de Outdoor"
            className="logo"
            style={{ width: 200, height: 60 }}
          />
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
        <div className="error-container">
          <div className="error-text">{error}</div>
          <button className="retry-button" onClick={loadEvents}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <img 
          src="/logo.webp" 
          alt="Central de Outdoor"
          className="logo"
          style={{ width: 200, height: 60 }}
        />
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
      
      <div className="scroll-container">
        <div className="scroll-content">
          <div className="events-grid">
            {events.length > 0 ? (
              events.map(renderEventCard)
            ) : (
              <div className="no-events-container">
                <div className="no-events-text">Nenhum evento disponível no momento</div>
                <button className="retry-button" onClick={loadEvents}>
                  Recarregar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


