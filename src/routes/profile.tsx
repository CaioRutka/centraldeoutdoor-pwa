import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, StoredUser } from '../services/api';
import { storage } from '../services/storage';

export default function Profile() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<any | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await storage.getUser();
      setUser(userData);
      const registrationData = await api.getUserRegistration(eventId as string);
      setRegistration(registrationData);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);
  const handleToggleQR = () => setShowQRCode((v) => !v);
  const handleShare = async () => {
    if (!registration || !user) return;
    const content = `${registration.eventId.title} - Credencial Digital\n\nParticipante: ${user.profile.name}\nNúmero: ${registration.registrationNumber}\nTipo: ${registration.registrationType}\n\nEvento: ${registration.eventId.date}\nLocal: ${registration.eventId.location}`;
    try {
      await navigator.clipboard.writeText(content);
      alert('Credencial copiada! Você pode colar e compartilhar.');
    } catch {
      alert('Não foi possível copiar.');
    }
  };

  const qrPattern = useMemo(() => Array.from({ length: 64 }).map(() => Math.random() > 0.5), []);

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-spinner" />
        <div className="profile-loading-text">Carregando dados...</div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="profile-error-container">
        <div className="profile-error-text">{error || 'Dados não encontrados'}</div>
        <button className="profile-retry-button" onClick={loadData}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="profile-back-button" onClick={handleGoBack}>←</button>
        <div className="profile-header-title">Minhas Informações</div>
      </div>

      <div className="profile-scroll-container">
        <div className="profile-scroll-content">
          {/* Credencial Digital */}
          <div className="profile-credential-card">
            <div className="profile-credential-header">
              <div className="profile-credential-title">Credencial Digital</div>
              <div className="profile-event-name">{registration.eventId.title}</div>
            </div>

            <div className="profile-credential-body">
              <div className="profile-participant-info">
                <div className="profile-participant-name">{user?.profile.name || 'Carregando...'}</div>
                <div className="profile-participant-type">{registration.registrationType}</div>
                <div className="profile-registration-number">Nº {registration.registrationNumber}</div>
              </div>

              {showQRCode && (
                <div className="profile-qr-container">
                  <div className="profile-qr-box">
                    <div className="profile-qr-pattern">
                      {qrPattern.map((on, i) => (
                        <div key={i} className="profile-qr-pixel" style={{ backgroundColor: on ? '#004C84' : '#ffffff' }} />
                      ))}
                    </div>
                  </div>
                  <div className="profile-qr-text">{registration.qrCode}</div>
                  <div className="profile-qr-subtext">Apresente este código na entrada do evento</div>
                </div>
              )}

              <div className="profile-credential-actions">
                <button className="profile-action-button" onClick={handleToggleQR}>
                  {showQRCode ? '🔒 Ocultar QR' : '📱 Mostrar QR'}
                </button>
                <button className="profile-action-button" onClick={handleShare}>📤 Compartilhar</button>
              </div>
            </div>
          </div>

          {/* Informações da Inscrição */}
          <div className="profile-section">
            <div className="profile-section-title">Informações da Inscrição</div>
            <div className="profile-info-card">
              <div className="profile-info-item">
                <div className="profile-info-label">Número de Registro</div>
                <div className="profile-info-value">{registration.registrationNumber}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Tipo de Participação</div>
                <div className="profile-info-value">{registration.registrationType}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Evento</div>
                <div className="profile-info-value">{registration.eventId.title}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Data</div>
                <div className="profile-info-value">{registration.eventId.date}</div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Local</div>
                <div className="profile-info-value">{registration.eventId.location}</div>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          {user && (
            <div className="profile-section">
              <div className="profile-section-title">Informações Pessoais</div>
              <div className="profile-info-card">
                <div className="profile-info-item">
                  <div className="profile-info-label">Nome Completo</div>
                  <div className="profile-info-value">{user.profile.name}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Email</div>
                  <div className="profile-info-value">{user.email}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Empresa</div>
                  <div className="profile-info-value">{user.profile.company}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Cargo</div>
                  <div className="profile-info-value">{user.profile.position}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Telefone</div>
                  <div className="profile-info-value">{user.profile.phone}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">CPF</div>
                  <div className="profile-info-value">{user.profile.cpf}</div>
                </div>
              </div>
            </div>
          )}

          {/* Acesso ao Evento */}
          {registration.eventAccess && registration.eventAccess.length > 0 && (
            <div className="profile-section">
              <div className="profile-section-title">Acesso ao Evento</div>
              <div className="profile-access-card">
                {registration.eventAccess.map((access: string, idx: number) => (
                  <div key={idx} className="profile-access-item">
                    <div className="profile-access-icon">✅</div>
                    <div className="profile-access-text">{access}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações do Evento */}
          <div className="profile-event-info-card">
            <div className="profile-event-info-title">Informações do Evento</div>
            <div className="profile-event-detail">
              <div className="profile-event-detail-icon">📅</div>
              <div>
                <div className="profile-event-detail-label">Data</div>
                <div className="profile-event-detail-value">{registration.eventId.date}</div>
              </div>
            </div>
            <div className="profile-event-detail">
              <div className="profile-event-detail-icon">📍</div>
              <div>
                <div className="profile-event-detail-label">Local</div>
                <div className="profile-event-detail-value">{registration.eventId.location}</div>
              </div>
            </div>
            <div className="profile-event-detail">
              <div className="profile-event-detail-icon">🕘</div>
              <div>
                <div className="profile-event-detail-label">Horário</div>
                <div className="profile-event-detail-value">9h00 às 18h35 (Dia 1)</div>
                <div className="profile-event-detail-value">9h00 às 14h00 (Dia 2)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


