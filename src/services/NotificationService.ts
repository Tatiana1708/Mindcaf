import WebSocketHandler from '../server/websocket';
import { Procedure } from '../types';

export interface Notification {
  id: string;
  procedureId: string;
  procedureTitle: string;
  requesterName: string;
  requesterEmail: string;
  status: 'unread' | 'read';
  createdAt: string;
  type: 'form_submission' | 'info';
  message?: string;
  description?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private static subscribers: ((notification: any) => void)[] = [];

  private constructor() {}

  public static sendNotification(params: { type: string; message: string; description: string; procedureTitle?: string; requesterName?: string; requesterEmail?: string }): void {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      procedureId: '',
      procedureTitle: params.procedureTitle || '',
      requesterName: params.requesterName || '',
      requesterEmail: params.requesterEmail || '',
      status: 'unread',
      createdAt: new Date().toISOString(),
      type: params.type as 'info',
      message: params.message,
      description: params.description
    };

    NotificationService.getInstance().notifications.push(notification);
    NotificationService.subscribers.forEach(subscriber => subscriber(notification));
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public sendNotification(procedure: Procedure, formData: any): Notification {
    const wsHandler = WebSocketHandler.getInstance();
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      procedureId: procedure.id,
      procedureTitle: procedure.title,
      requesterName: `${formData.firstName} ${formData.lastName}`,
      requesterEmail: formData.email,
      status: 'unread',
      createdAt: new Date().toISOString(),
      type: 'form_submission'
    };

    this.notifications.push(notification);
    NotificationService.subscribers.forEach(subscriber => subscriber(notification));
    wsHandler.broadcastNotification(notification);
    return notification;
  }

  public getNotifications(): Notification[] {
    return this.notifications;
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.status = 'read';
    }
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => n.status === 'unread').length;
  }

  public static subscribe(callback: (notification: any) => void): void {
    NotificationService.subscribers.push(callback);
  }

  public static unsubscribe(callback: (notification: any) => void): void {
    const index = NotificationService.subscribers.indexOf(callback);
    if (index > -1) {
      NotificationService.subscribers.splice(index, 1);
    }
  }
}

export default NotificationService;