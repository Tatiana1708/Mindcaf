import express from 'express';
import { Router } from 'express';
import publicFormRouter from './publicForm';

const router = Router();

// Mount the public form routes
router.use('/public', publicFormRouter);

export default router;