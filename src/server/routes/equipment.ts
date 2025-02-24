import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create new equipment
router.post('/', async (req, res) => {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        type: req.body.type,
        service: req.body.service,
        status: req.body.status,
        employeeId: req.body.assignedTo || null,
        nombre: req.body.nombre,
        dateInstall: req.body.dateInstall,
        etatBien: req.body.etatBien
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const equipment = await prisma.equipment.update({
      where: { id: req.params.id },
      data: {
        code: req.body.code,
        name: req.body.name,
        type: req.body.type,
        service: req.body.service,
        status: req.body.status,
        employeeId: req.body.assignedTo || null,
        nombre: req.body.nombre,
        dateInstall: req.body.dateInstall,
        etatBien: req.body.etatBien
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.equipment.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

export default router;