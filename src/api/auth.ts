import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface User {
  username: string;
  service: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}


export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An error occurred during login');
    }
  },

  register: async (
    username: string, 
    password: string, 
    service: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await axios.post<RegisterResponse>(`${API_URL}/auth/register`, {
        username,
        password,
        service,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An error occurred during registration');
    }
  },
};