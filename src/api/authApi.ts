import { Request, Response, RequestHandler } from 'express';
import { authService } from '../services/authService';

export const authApi = {
  login: (async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      const result = await authService.login(username, password);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      return res.status(401).json({
        success: false,
        message: errorMessage
      });
    }
  }),

  register: (async (req: Request, res: Response) => {
    try {
      const { username, password, service } = req.body;

      if (!username || !password || !service) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, and service are required'
        });
      }

      const result = await authService.register(username, password, service);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  })
};