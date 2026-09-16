// Django API Client - Подключение к Django Backend
const API_BASE_URL = 'http://localhost:8000/api';

class DjangoApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('django_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('django_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('django_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('django_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.clearToken();
        throw new Error('Необходима авторизация');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `Ошибка ${response.status}`);
      }

      if (response.status === 204) {
        return {};
      }

      return response.json();
    } catch (error: any) {
      if (error.message && error.message.includes('fetch')) {
        throw new Error('Не удалось подключиться к серверу. Убедитесь, что Django backend запущен на http://localhost:8000');
      }
      throw error;
    }
  }

  // АУТЕНТИФИКАЦИЯ
  async login(email: string, password: string) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(data: any) {
    const response = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout/', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getMe() {
    return this.request('/auth/me/');
  }

  async updateProfile(data: any) {
    return this.request('/auth/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.request('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      }),
    });
  }

  // ПОЛЬЗОВАТЕЛИ
  async getUsers() {
    const response = await this.request('/auth/users/');
    return response.results || response;
  }

  async getUser(id: number) {
    return this.request(`/auth/users/${id}/`);
  }

  async getDepartments() {
    const response = await this.request('/auth/departments/');
    return response.results || response;
  }

  // ДОКУМЕНТЫ
  async getDocuments(params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await this.request(`/documents/${queryString}`);
    return response.results || response;
  }

  async getDocument(id: number) {
    return this.request(`/documents/${id}/`);
  }

  async createDocument(data: any) {
    return this.request('/documents/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDocument(id: number, data: any) {
    return this.request(`/documents/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(id: number) {
    return this.request(`/documents/${id}/`, { method: 'DELETE' });
  }

  async sendToApproval(id: number, approvers: number[]) {
    return this.request(`/documents/${id}/send_to_approval/`, {
      method: 'POST',
      body: JSON.stringify({ approvers }),
    });
  }

  async approveDocument(id: number, comment?: string) {
    return this.request(`/documents/${id}/approve/`, {
      method: 'POST',
      body: JSON.stringify({ comment: comment || '' }),
    });
  }

  async rejectDocument(id: number, comment?: string) {
    return this.request(`/documents/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify({ comment: comment || '' }),
    });
  }

  async addComment(id: number, text: string) {
    return this.request(`/documents/${id}/add_comment/`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async archiveDocument(id: number) {
    return this.request(`/documents/${id}/archive/`, {
      method: 'POST',
    });
  }

  // ЗАДАЧИ
  async getTasks(params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await this.request(`/tasks/${queryString}`);
    return response.results || response;
  }

  async getTask(id: number) {
    return this.request(`/tasks/${id}/`);
  }

  async createTask(data: any) {
    return this.request('/tasks/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: any) {
    return this.request(`/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number) {
    return this.request(`/tasks/${id}/`, { method: 'DELETE' });
  }

  async completeTask(id: number) {
    return this.request(`/tasks/${id}/complete/`, {
      method: 'POST',
    });
  }

  async startTask(id: number) {
    return this.request(`/tasks/${id}/start/`, {
      method: 'POST',
    });
  }

  async deferTask(id: number) {
    return this.request(`/tasks/${id}/defer/`, {
      method: 'POST',
    });
  }

  // СОВЕЩАНИЯ
  async getMeetings() {
    const response = await this.request('/meetings/');
    return response.results || response;
  }

  async getMeeting(id: number) {
    return this.request(`/meetings/${id}/`);
  }

  async createMeeting(data: any) {
    return this.request('/meetings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMeeting(id: number, data: any) {
    return this.request(`/meetings/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMeeting(id: number) {
    return this.request(`/meetings/${id}/`, { method: 'DELETE' });
  }

  async startMeeting(id: number) {
    return this.request(`/meetings/${id}/start/`, {
      method: 'POST',
    });
  }

  async completeMeeting(id: number, protocol?: string) {
    return this.request(`/meetings/${id}/complete/`, {
      method: 'POST',
      body: JSON.stringify({ protocol: protocol || '' }),
    });
  }

  async cancelMeeting(id: number) {
    return this.request(`/meetings/${id}/cancel/`, {
      method: 'POST',
    });
  }

  // ПРОВЕРКА СОЕДИНЕНИЯ
  async checkConnection() {
    try {
      await fetch(`${API_BASE_URL}/`, { method: 'HEAD' });
      return true;
    } catch {
      return false;
    }
  }
}

export const djangoApi = new DjangoApiClient();
