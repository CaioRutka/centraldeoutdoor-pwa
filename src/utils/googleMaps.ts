/**
 * Carrega dinamicamente a Google Maps JavaScript API
 * usando a variável de ambiente VITE_GOOGLE_MAPS_API_KEY
 */
export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se a API já foi carregada
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Verifica se já existe um script carregando
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Erro ao carregar Google Maps API')));
      return;
    }

    // Obtém a chave da API da variável de ambiente
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      reject(new Error('VITE_GOOGLE_MAPS_API_KEY não encontrada nas variáveis de ambiente'));
      return;
    }

    // Cria e carrega o script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps API carregada com sucesso');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps API');
      reject(new Error('Erro ao carregar Google Maps API'));
    };

    document.head.appendChild(script);
  });
};

// Declaração global para TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}
