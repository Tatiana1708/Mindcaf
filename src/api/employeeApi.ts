import axios from 'axios';
import { Employee } from '../types';

const API_URL = 'http://localhost:3000/api';

export const employeeApi = {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async createEmployee(employee: Employee): Promise<Employee> {
    try {
      const response = await axios.post(`${API_URL}/employees`, employee);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      await axios.put(`${API_URL}/employees/${id}`, employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
};