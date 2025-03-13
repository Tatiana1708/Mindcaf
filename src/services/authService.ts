// import { authApi, LoginResponse } from '../api/auth';

// export type { LoginResponse };

// export const authService = {
//   login: async (username: string, password: string): Promise<LoginResponse> => {
//     return authApi.login(username, password);
//   },

//   register: async (username: string, password: string, service: string) => {
//     return authApi.register(username, password, service);
//   },

//   verifyToken: (token: string) => {
//     try {
//       // For frontend token verification, we only need to check if the token is valid JWT
//       const parts = token.split('.');
//       if (parts.length !== 3) throw new Error('Invalid token format');
//       return JSON.parse(atob(parts[1])); // Decode payload
//     } catch (error) {
//       throw new Error('Invalid token');
//     }
//   },
// };