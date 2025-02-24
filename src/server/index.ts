import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all employees
app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Create employee
app.post('/api/employees', async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.create({
      data: req.body
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).send();
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id }
    });
    res.status(200).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});