import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createServer } from 'http';
import publicFormRouter from './routes/publicForm';
import WebSocketHandler from './websocket';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const app = express();
const server = createServer(app);
const wsHandler = WebSocketHandler.getInstance();

const wsServer = createServer();
wsServer.on('upgrade', (request, socket, head) => {
  wsHandler.handleUpgrade(request, socket, head);
});

wsServer.listen(3001, () => {
  console.log('WebSocket server is running on port 3001');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Public routes
app.use('/api/public', publicFormRouter);

// // Auth middleware
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       res.status(401).json({ error: 'No token provided' });
//       return;
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//     });

//     if (!user) {
//       res.status(401).json({ error: 'Invalid token' });
//       return;
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//     return;
//   }
// };

// // Auth routes
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, password, service } = req.body;

//     if (!username || !password || !service) {
//       return res.status(400).json({ error: 'Username, password and service are required' });
//     }

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { username },
//     });

//     if (existingUser) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = await prisma.user.create({
//       data: {
//         username,
//         password: hashedPassword,
//         service,
//         role: 'service_user' // Default role for new users
//       },
//     });

//     const token = jwt.sign({ userId: user.id }, JWT_SECRET);
//     res.status(201).json({
//       token,
//       user: { username: user.username, role: user.role, service: user.service }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'An error occurred during registration' });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await prisma.user.findUnique({
//       where: { username },
//     });

//     if (!user) {
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       res.status(401).json({ error: 'Invalid credentials' });
//       return;
//     }
    
//     const token = jwt.sign({ userId: user.id }, JWT_SECRET);
//     res.json({ token, user: { username: user.username, role: user.role, service: user.service } });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred during login' });
//   }
// });

// export default app;