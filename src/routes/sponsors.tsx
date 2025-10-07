import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Sponsor {
  _id: string;
  name: string;
  category: 'MASTER' | 'GOLD' | 'SILVER' | 'APOIO';
  logo?: string;
}

export default function Sponsors() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    loadSponsors();
  }, [eventId]);

  const loadSponsors = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const sponsorsData = await api.getEventSection(eventId, 'sponsors');
      setSponsors(sponsorsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar patrocinadores');
      console.error('Erro ao carregar sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getSponsorCardStyle = (category: string) => {
    switch (category) {
      case 'MASTER':
        return 'sponsors-master-card';
      case 'GOLD':
        return 'sponsors-gold-card';
      case 'SILVER':
        return 'sponsors-silver-card';
      case 'APOIO':
        return 'sponsors-support-card';
      default:
        return 'sponsors-sponsor-card';
    }
  };

  const getSponsorLogoStyle = (category: string) => {
    switch (category) {
      case 'MASTER':
        return 'sponsors-master-logo';
      case 'GOLD':
        return 'sponsors-gold-logo';
      case 'SILVER':
        return 'sponsors-silver-logo';
      case 'APOIO':
        return 'sponsors-support-logo';
      default:
        return 'sponsors-sponsor-logo';
    }
  };

  const renderSponsorCard = (sponsor: Sponsor) => (
    <div key={sponsor._id} className={getSponsorCardStyle(sponsor.category)}>
      <div className="sponsors-logo-container">
        {sponsor.logo ? (
          <img 
            src={sponsor.logo} 
            alt={sponsor.name}
            className={getSponsorLogoStyle(sponsor.category)}
          />
        ) : (
          <div className="sponsors-logo-placeholder">
            <div className="sponsors-logo-text">LOGO</div>
          </div>
        )}
      </div>

      <div className="sponsors-sponsor-info">
        <div className="sponsors-sponsor-name">{sponsor.name}</div>
      </div>
    </div>
  );

  const renderSponsorSection = (title: string, sponsors: Sponsor[], icon: string) => {
    const getGridStyle = (category: string) => {
      switch (category) {
        case 'MASTER':
          return 'sponsors-master-grid';
        case 'GOLD':
          return 'sponsors-gold-grid';
        case 'SILVER':
          return 'sponsors-silver-grid';
        case 'APOIO':
          return 'sponsors-support-grid';
        default:
          return 'sponsors-sponsors-grid';
      }
    };

    return (
      <div key={title} className="sponsors-category-section">
        <div className="sponsors-category-header">
          <div className="sponsors-category-icon">{icon}</div>
          <div className="sponsors-category-title">{title}</div>
        </div>
        <div className={getGridStyle(title)}>
          {sponsors.map(renderSponsorCard)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="sponsors-loading-container">
        <div className="sponsors-spinner"></div>
        <div className="sponsors-loading-text">Carregando patrocinadores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sponsors-error-container">
        <div className="sponsors-error-text">❌ {error}</div>
        <button className="sponsors-retry-button" onClick={loadSponsors}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="sponsors-container">
      {/* Header com logo e botão voltar */}
      <div className="sponsors-header">
        <button
          className="sponsors-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>

        <img
          src="/logo-invert.png"
          alt="Central de Outdoor"
          className="sponsors-logo"
        />
      </div>

      <div className="sponsors-scroll-container">
        <div className="sponsors-scroll-content">
          {/* Título principal */}
          <div className="sponsors-title-section">
            <div className="sponsors-main-title">🤝 Patrocinadores</div>
            <div className="sponsors-subtitle">
              Empresas que apoiam o crescimento do setor OOH
            </div>
          </div>

          {/* Patrocinadores por categoria */}
          {(() => {
            const masterSponsors = sponsors.filter(s => s.category === 'MASTER');
            const goldSponsors = sponsors.filter(s => s.category === 'GOLD');
            const silverSponsors = sponsors.filter(s => s.category === 'SILVER');
            const supportSponsors = sponsors.filter(s => s.category === 'APOIO');

            return (
              <>
                {masterSponsors.length > 0 && renderSponsorSection('MASTER', masterSponsors, '')}
                {goldSponsors.length > 0 && renderSponsorSection('GOLD', goldSponsors, '')}
                {silverSponsors.length > 0 && renderSponsorSection('SILVER', silverSponsors, '')}
                {supportSponsors.length > 0 && renderSponsorSection('APOIO', supportSponsors, '')}
              </>
            );
          })()}

          {/* Agradecimento */}
          <div className="sponsors-thanks-card">
            <div className="sponsors-thanks-icon">✨</div>
            <div className="sponsors-thanks-title">Agradecimento</div>
            <div className="sponsors-thanks-text">
              Agradecemos a todos os nossos patrocinadores e parceiros que tornam possível a realização do OOH Lab 2025.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


