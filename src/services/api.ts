import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface APIResponse<T> { success: boolean; message?: string; data?: T }
export interface UserProfile { name: string; company: string; position: string; phone: string; cpf: string }
export interface StoredUser { _id: string; email: string; role: string; profile: UserProfile }
export interface RegisterPayload { email: string; password: string; profile: UserProfile }

class CentralDeOutdoorAPI {
  private client: AxiosInstance;
  private token: string | null = null;
  private currentUserEmail: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'https://app.centraldeoutdoor.org.br/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.token) config.headers.Authorization = `Bearer ${this.token}`;
      return config;
    });
    this.client.interceptors.response.use((r) => r, (e) => {
      if (e.response?.status === 401) this.token = null;
      return Promise.reject(e);
    });
  }

  setToken(token: string | null) { this.token = token }
  setCurrentUserEmail(email: string | null) { this.currentUserEmail = email }

  async login(email: string, password: string): Promise<{ user: StoredUser; token: string }> {
    const res: AxiosResponse<APIResponse<{ user: StoredUser; token: string }>> = await this.client.post('/auth/login', { email, password });
    if (res.data.success && res.data.data) return res.data.data;
    throw new Error(res.data.message || 'Login failed');
  }

  async register(payload: RegisterPayload): Promise<{ message: string }> {
    const res: AxiosResponse<APIResponse<{ message: string }>> = await this.client.post('/auth/register', payload);
    if (res.data.success) {
      return { message: res.data.message || 'Conta criada com sucesso' };
    }
    throw new Error(res.data.message || 'Registro falhou');
  }

  async getEvents() {
    const res: AxiosResponse<APIResponse<any[]>> = await this.client.get('/events');
    if (res.data.success && res.data.data) return res.data.data;
    throw new Error(res.data.message || 'Failed to fetch events');
  }

  async getEvent(id: string) {
    const res: AxiosResponse<APIResponse<any>> = await this.client.get(`/events/${id}`);
    if (res.data.success && res.data.data) return res.data.data;
    throw new Error(res.data.message || 'Failed to fetch event');
  }

  async getEventSection<T = any>(eventId: string, section: string): Promise<T> {
    const res: AxiosResponse<APIResponse<T>> = await this.client.get(`/events/${eventId}/${section}`);
    if (res.data.success && res.data.data) return res.data.data as T;
    throw new Error(res.data.message || `Failed to fetch ${section}`);
  }

  async getUserRegistrations() {
    const res: AxiosResponse<APIResponse<any[]>> = await this.client.get('/user/registrations');
    if (res.data.success && res.data.data) return res.data.data;
    throw new Error(res.data.message || 'Failed to fetch registrations');
  }

  async getUserRegistration(eventId: string) {
    const res: AxiosResponse<APIResponse<any>> = await this.client.get(`/user/registrations/${eventId}`);
    if (res.data.success && res.data.data) return res.data.data;
    throw new Error(res.data.message || 'Failed to fetch registration');
  }

  async getGoogleDriveUrl(eventId: string): Promise<string> {
    const res: AxiosResponse<APIResponse<{ googleDriveURL: string }>> = 
      await this.client.get(`/events/${eventId}/google-drive`);
    if (res.data.success && res.data.data) {
      return res.data.data.googleDriveURL;
    }
    throw new Error(res.data.message || 'Failed to fetch Google Drive URL');
  }
}

export const api = new CentralDeOutdoorAPI();
export default api;


