import { WebSocket, WebSocketServer } from 'ws';
import { Notification } from '../services/NotificationService';

class WebSocketHandler {
  private static instance: WebSocketHandler;
  private wss: WebSocketServer;
  private clients: Set<WebSocket>;

  private constructor() {
    this.clients = new Set();
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });
  }

  public static getInstance(): WebSocketHandler {
    if (!WebSocketHandler.instance) {
      WebSocketHandler.instance = new WebSocketHandler();
    }
    return WebSocketHandler.instance;
  }

  public handleUpgrade(request: any, socket: any, head: any) {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit('connection', ws, request);
    });
  }

  public broadcastNotification(notification: Notification) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }
}

export default WebSocketHandler;