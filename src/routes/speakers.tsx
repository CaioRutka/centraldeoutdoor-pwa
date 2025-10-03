import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Speaker {
  _id: string;
  name: string;
  title: string;
  description: string;
  type: string;
  photo?: string;
}

export default function Speakers() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    loadSpeakers();
  }, [eventId]);

  const loadSpeakers = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const speakersData = await api.getEventSection(eventId, 'speakers');
      setSpeakers(speakersData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar palestrantes');
      console.error('Erro ao carregar speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderSpeakerCard = (speaker: Speaker) => (
    <div key={speaker._id} className="speakers-speaker-card">
      <div className="speakers-photo-container">
        {speaker.photo ? (
          <img 
            src={speaker.photo} 
            alt={speaker.name}
            className="speakers-speaker-photo"
          />
        ) : (
          <div className="speakers-photo-placeholder">
            <div className="speakers-photo-text">FOTO</div>
          </div>
        )}
        <div className="speakers-type-tag">
          <div className="speakers-type-text">{speaker.type}</div>
        </div>
      </div>

      <div className="speakers-speaker-info">
        <div className="speakers-speaker-name">{speaker.name}</div>
        <div className="speakers-speaker-title">{speaker.title}</div>
        <div className="speakers-speaker-description">{speaker.description}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="speakers-loading-container">
        <div className="speakers-spinner"></div>
        <div className="speakers-loading-text">Carregando palestrantes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="speakers-error-container">
        <div className="speakers-error-text">❌ {error}</div>
        <button className="speakers-retry-button" onClick={loadSpeakers}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="speakers-container">
      {/* Header com logo e botão voltar */}
      <div className="speakers-header">
        <button
          className="speakers-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>

        <img
          src="/logo-invert.png"
          alt="Central de Outdoor"
          className="speakers-logo"
        />
      </div>

      <div className="speakers-scroll-container">
        <div className="speakers-scroll-content">
          {/* Título principal */}
          <div className="speakers-title-section">
            <div className="speakers-main-title">🎤 Palestrantes</div>
            <div className="speakers-subtitle">
              Especialistas que compartilharão conhecimento e experiências
            </div>
          </div>

          {/* Lista de palestrantes */}
          <div className="speakers-speakers-list">
            {speakers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(renderSpeakerCard)}
          </div>

          {/* Card de programação */}
          <div className="speakers-program-card">
            <div className="speakers-program-icon">📅</div>
            <div className="speakers-program-title">Programação Completa</div>
            <div className="speakers-program-text">
              Confira a programação completa do evento com horários detalhados de cada apresentação na seção "Programação".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


