import { Equipment } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const equipmentService = {
  async getAllEquipment(): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipment`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    return response.json();
  },

  async createEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    const response = await fetch('http://localhost:3001/api/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipment),
    });
    if (!response.ok) {
      throw new Error('Failed to create equipment');
    }
    return response.json();
  },

  async updateEquipment(id: string, equipment: Partial<Equipment>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipment),
    });
    if (!response.ok) {
      throw new Error('Failed to update equipment');
    }
  },

  async deleteEquipment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete equipment');
    }
  },
};