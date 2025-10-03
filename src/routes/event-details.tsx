import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

interface EventDetail {
  _id: string;
  title: string;
  description?: string;
  icon?: string;
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setDetailsLoading(true);
      setError(null);
      setDetailsError(null);
      
      const [eventData, detailsData] = await Promise.all([
        api.getEvent(id),
        api.getEventSection(id, 'event-details').catch(() => [])
      ]);
      
      setEvent(eventData);
      setEventDetails(detailsData || []);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar evento');
      setDetailsError(e.message || 'Erro ao carregar detalhes do evento');
    } finally {
      setLoading(false);
      setDetailsLoading(false);
    }
  };

  const handleDetailPress = async (detail: EventDetail) => {
    if (!id) return;

    const title = detail.title.toLowerCase();
    
    if (title.includes('fotos') || title.includes('photos')) {
      try {
        const googleDriveUrl = await api.getGoogleDriveUrl(id);
        window.open(googleDriveUrl, '_blank');
      } catch (error) {
        console.error('Erro ao buscar ou abrir link do Google Drive:', error);
      }
    } else if (title.includes('informações gerais') || title.includes('gerais')) {
      navigate(`/general-info/${id}`);
    } else if (title.includes('local') || title.includes('venue')) {
      navigate(`/venue/${id}`);
    } else if (title.includes('programação') || title.includes('schedule')) {
      navigate(`/schedule/${id}`);
    } else if (title.includes('pessoais') || title.includes('pessoal')) {
      navigate(`/profile/${id}`);
    } else if (title.includes('palestrantes') || title.includes('speakers')) {
      navigate(`/speakers/${id}`);
    } else if (title.includes('patrocinadores') || title.includes('sponsors')) {
      navigate(`/sponsors/${id}`);
    } else {
      console.log(`Navegando para: ${detail.title}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading || detailsLoading) {
    return (
      <div className="event-details-container">
        <div className="event-details-header">
          <button className="event-details-back-button" onClick={handleGoBack}>
            ←
          </button>
          <img 
            src="/logo-invert.png" 
            alt="Central de Outdoor"
            className="event-details-logo"
          />
        </div>
        <div className="event-details-loading-container">
          <div className="event-details-spinner"></div>
          <div className="event-details-loading-text">Carregando detalhes...</div>
        </div>
      </div>
    );
  }

  if (error || detailsError || !event) {
    return (
      <div className="event-details-container">
        <div className="event-details-header">
          <button className="event-details-back-button" onClick={handleGoBack}>
            ←
          </button>
          <img 
            src="/logo-invert.png" 
            alt="Central de Outdoor"
            className="event-details-logo"
          />
        </div>
        <div className="event-details-error-container">
          <div className="event-details-error-text">{error || detailsError || 'Evento não encontrado'}</div>
          <button className="event-details-retry-button" onClick={loadEventDetails}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const renderDetailCard = (detail: EventDetail) => (
    <div 
      key={detail._id} 
      className="event-details-card"
      onClick={() => handleDetailPress(detail)}
    >
      <div className="event-details-card-content">
        <div className="event-details-icon-container">
          <div className="event-details-card-icon">{detail.icon || '📋'}</div>
        </div>
        <div className="event-details-card-title">{detail.title}</div>
        <div className="event-details-card-description">{detail.description}</div>
      </div>
    </div>
  );

  return (
    <div className="event-details-container">
      {/* Header com logo e botão voltar */}
      <div className="event-details-header">
        <button 
          className="event-details-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>
        
        <img 
          src="/logo-invert.png" 
          alt="Central de Outdoor"
          className="event-details-logo"
        />
      </div>

      <div className="event-details-scroll-container">
        <div className="event-details-scroll-content">
          <div className="event-details-title-container">
            <div className="event-details-event-title">{event.title}</div>
            <div className="event-details-event-subtitle">{event.date} • {event.location?.split(' - ')[0]}</div>
          </div>

          <div className="event-details-grid">
            {eventDetails.length > 0 ? (
              eventDetails.map(renderDetailCard)
            ) : (
              <div className="event-details-no-data-container">
                <div className="event-details-no-data-text">Nenhum detalhe encontrado</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


