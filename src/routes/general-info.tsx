import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface GeneralInfo {
  _id: string;
  title: string;
  sections: Array<{
    content: string;
  }>;
  highlight?: {
    icon: string;
    title: string;
    description: string;
  };
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export default function GeneralInfo() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    loadGeneralInfo();
  }, [eventId]);

  const loadGeneralInfo = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const info = await api.getEventSection(eventId, 'general-info');
      setGeneralInfo(info);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar informações gerais');
      console.error('Erro ao carregar general info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="general-info-loading-container">
        <div className="general-info-spinner"></div>
        <div className="general-info-loading-text">Carregando informações gerais...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="general-info-error-container">
        <div className="general-info-error-text">❌ {error}</div>
        <button className="general-info-retry-button" onClick={loadGeneralInfo}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!generalInfo) {
    return (
      <div className="general-info-error-container">
        <div className="general-info-error-text">Informações gerais não encontradas</div>
      </div>
    );
  }

  return (
    <div className="general-info-container">
      {/* Header com logo e botão voltar */}
      <div className="general-info-header">
        <button
          className="general-info-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>

        <img
          src="/logo-invert.png"
          alt="Central de Outdoor"
          className="general-info-logo"
        />
      </div>

      <div className="general-info-scroll-container">
        <div className="general-info-scroll-content">
          {/* Título principal */}
          <div className="general-info-title-section">
            <div className="general-info-main-title">{generalInfo.title}</div>
          </div>

          {/* Conteúdo em cards */}
          {generalInfo.sections.map((section, index) => (
            <div key={index} className="general-info-content-card">
              <div className="general-info-card-content">
                <div className="general-info-section-text">
                  {section.content}
                </div>
              </div>
            </div>
          ))}

          {/* Card de destaque */}
          {generalInfo.highlight && (
            <div className="general-info-highlight-card">
              <div className="general-info-highlight-content">
                <div className="general-info-highlight-icon">{generalInfo.highlight.icon}</div>
                <div className="general-info-highlight-title">{generalInfo.highlight.title}</div>
                <div className="general-info-highlight-text">
                  {generalInfo.highlight.description}
                </div>
              </div>
            </div>
          )}

          {/* Características do evento */}
          {generalInfo.features && generalInfo.features.length > 0 && (
            <div className="general-info-features-container">
              {generalInfo.features.map((feature, index) => (
                <div key={index} className="general-info-feature-item">
                  <div className="general-info-feature-icon">{feature.icon}</div>
                  <div className="general-info-feature-title">{feature.title}</div>
                  <div className="general-info-feature-text">{feature.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
