import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { loadGoogleMapsAPI } from '../utils/googleMaps';

interface Venue {
  _id: string;
  name: string;
  shortAddress: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  rating?: string;
  facilities: string[];
}

export default function Venue() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!eventId) return;
    loadVenueData();
  }, [eventId]);

  useEffect(() => {
    if (venue?.coordinates && mapRef.current) {
      initializeMap();
    }
  }, [venue]);

  const loadVenueData = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const venueData = await api.getEventSection(eventId, 'venue');
      setVenue(venueData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do local');
      console.error('Erro ao carregar venue:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async () => {
    if (!venue?.coordinates || !mapRef.current) return;

    try {
      // Carrega a Google Maps API dinamicamente
      await loadGoogleMapsAPI();

      const mapOptions: google.maps.MapOptions = {
        center: {
          lat: venue.coordinates.latitude,
          lng: venue.coordinates.longitude
        },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Adicionar marcador
      const marker = new google.maps.Marker({
        position: {
          lat: venue.coordinates.latitude,
          lng: venue.coordinates.longitude
        },
        map: map,
        title: venue.name,
        animation: google.maps.Animation.DROP
      });

      // Adicionar info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #333;">${venue.name}</h3>
            <p style="margin: 0; color: #666;">${venue.shortAddress}</p>
            <p style="margin: 5px 0 0 0; color: #666;">${venue.neighborhood}, ${venue.city}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Abrir info window automaticamente
      infoWindow.open(map, marker);
    } catch (error) {
      console.error('Erro ao carregar Google Maps:', error);
      // Fallback: mostrar mensagem de erro ou botão para abrir no Google Maps
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOpenMaps = () => {
    if (!venue?.coordinates) return;
    const url = `https://maps.google.com/maps?q=${venue.coordinates.latitude},${venue.coordinates.longitude}`;
    window.open(url, '_blank');
  };

  const handleOpenInGoogleMaps = () => {
    if (!venue?.coordinates) return;
    const url = `https://maps.google.com/maps?q=${venue.coordinates.latitude},${venue.coordinates.longitude}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (!venue?.phone) return;
    window.open(`tel:${venue.phone}`, '_self');
  };

  const handleWebsite = () => {
    if (!venue?.website) return;
    const website = venue.website.startsWith('http') ? venue.website : `https://${venue.website}`;
    window.open(website, '_blank');
  };

  if (loading) {
    return (
      <div className="venue-loading-container">
        <div className="venue-spinner"></div>
        <div className="venue-loading-text">Carregando informações do local...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venue-error-container">
        <div className="venue-error-text">❌ {error}</div>
        <button className="venue-retry-button" onClick={loadVenueData}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-error-container">
        <div className="venue-error-text">Dados do local não encontrados</div>
      </div>
    );
  }

  return (
    <div className="venue-container">
      {/* Header */}
      <div className="venue-header">
        <button 
          className="venue-back-button"
          onClick={handleGoBack}
        >
          ←
        </button>
        
        <div className="venue-header-title">Local do Evento</div>
      </div>

      <div className="venue-scroll-container">
        {/* Mapa */}
        <div className="venue-map-container">
          <div 
            ref={mapRef}
            className="venue-map"
            style={{ width: '100%', height: '300px' }}
          />
          
          <button 
            className="venue-map-overlay-button"
            onClick={handleOpenInGoogleMaps}
          >
            <div className="venue-map-overlay-text">Abrir no Google Maps</div>
            <div className="venue-map-overlay-icon">🗺️</div>
          </button>
        </div>

        {/* Informações do Local */}
        <div className="venue-info">
          <div className="venue-header-info">
            <div className="venue-name">{venue.name}</div>
            {venue.rating && (
              <div className="venue-rating-container">
                <div className="venue-stars">⭐⭐⭐⭐⭐</div>
                <div className="venue-rating-text">{venue.rating}</div>
              </div>
            )}
          </div>

          <div className="venue-address-container">
            <div className="venue-address-icon">📍</div>
            <div className="venue-address-text">
              <div className="venue-address">{venue.shortAddress}</div>
              <div className="venue-neighborhood">{venue.neighborhood}</div>
              <div className="venue-city-zip">{venue.city} • {venue.zipCode}</div>
            </div>
          </div>

          {venue.description && (
            <div className="venue-description">{venue.description}</div>
          )}

          {/* Ações */}
          <div className="venue-actions-container">
            <button className="venue-action-button" onClick={handleCall}>
              <div className="venue-action-icon">📞</div>
              <div className="venue-action-text">Ligar</div>
            </button>
            
            <button className="venue-action-button" onClick={handleWebsite}>
              <div className="venue-action-icon">🌐</div>
              <div className="venue-action-text">Website</div>
            </button>
            
            <button className="venue-action-button" onClick={handleOpenInGoogleMaps}>
              <div className="venue-action-icon">🧭</div>
              <div className="venue-action-text">Direções</div>
            </button>
          </div>

          {/* Facilidades */}
          <div className="venue-facilities-container">
            <div className="venue-facilities-title">Facilidades Disponíveis</div>
            <div className="venue-facilities-grid">
              {venue.facilities.map((facility, index) => (
                <div key={index} className="venue-facility-item">
                  <div className="venue-facility-icon">✅</div>
                  <div className="venue-facility-text">{facility}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="venue-contact-container">
            <div className="venue-contact-title">Informações de Contato</div>
            
            <button className="venue-contact-item" onClick={handleCall}>
              <div className="venue-contact-icon">📱</div>
              <div>
                <div className="venue-contact-label">Telefone</div>
                <div className="venue-contact-value">{venue.phone}</div>
              </div>
            </button>
            
            <button className="venue-contact-item" onClick={handleWebsite}>
              <div className="venue-contact-icon">🌍</div>
              <div>
                <div className="venue-contact-label">Website</div>
                <div className="venue-contact-value">{venue.website}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


