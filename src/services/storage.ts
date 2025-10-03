export const storage = {
  async setToken(token: string) { localStorage.setItem('cdo:token', token) },
  async getToken() { return localStorage.getItem('cdo:token') },
  async setUser(user: any) { localStorage.setItem('cdo:user', JSON.stringify(user)) },
  async getUser() { const v = localStorage.getItem('cdo:user'); return v ? JSON.parse(v) : null },
  async clear() { localStorage.removeItem('cdo:token'); localStorage.removeItem('cdo:user') },
};


