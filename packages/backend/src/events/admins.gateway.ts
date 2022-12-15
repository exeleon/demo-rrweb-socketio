import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { ClientSocket } from './interfaces/sockets';

@WebSocketGateway({ cors: true, namespace: '/admins' })
export class AdminsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() namespace: Namespace;

  async handleConnection(client: Socket) {
    const adminToken = client.handshake.query.admin_token;
    console.log('🅰️  Admin connected', adminToken);

    if (!adminToken) {
      console.error('Unauthenticated admin');
      client.disconnect();
      return;
    }

    const sessions = await this._getActiveSessions();
    client.join('admins_room');
    client.emit('active_sessions', sessions);
  }

  handleDisconnect(client: Socket) {
    const adminToken = client.handshake.query.admin_token;
    console.log('🅰️  Admin disconnected', adminToken);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { session_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.rooms.forEach((room) => {
      if (room.startsWith('events_')) {
        console.log('🅰️  Admin unsubscribed to', room);
        client.leave(room);
      }
    });
    client.join(`events_${data.session_id}`);
    console.log('🅰️  Admin subscribed to', data.session_id);
  }

  private async _getActiveSessions() {
    const sockets = await this.namespace.server.of('/clients').fetchSockets();
    return sockets.map((socket) => ({
      id: (socket as unknown as ClientSocket).sessionId,
    }));
  }
}
