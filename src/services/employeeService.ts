import { Employee } from '../types';
import { employeeApi } from '../api/employeeApi';

export const employeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    return employeeApi.getAllEmployees();
  },

  async createEmployee(employee: Employee): Promise<Employee> {
    return employeeApi.createEmployee(employee);
  },

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    return employeeApi.updateEmployee(id, employee);
  },

  async deleteEmployee(id: string): Promise<void> {
    return employeeApi.deleteEmployee(id);
  }
};