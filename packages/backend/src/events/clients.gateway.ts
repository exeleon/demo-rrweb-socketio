import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { ClientSocket } from './interfaces/sockets';

@WebSocketGateway({ cors: true, namespace: '/clients' })
export class ClientsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() namespace: Namespace;

  handleConnection(client: ClientSocket) {
    const sessionId = client.handshake.query.session_id;
    console.log('🚀 Client connected', sessionId);

    if (!sessionId) {
      console.error('Unauthenticated client');
      client.disconnect();
      return;
    }

    client.sessionId = sessionId as string;

    this.namespace.server
      .of('/admins')
      .to('admins_room')
      .emit('session_start', {
        id: sessionId,
      });
  }

  handleDisconnect(client: Socket) {
    const sessionId = client.handshake.query.session_id;
    console.log('🚀 Client disconnected', sessionId);

    this.namespace.server.of('/admins').to('admins_room').emit('session_end', {
      id: sessionId,
    });
  }

  @SubscribeMessage('dom_event')
  handleEvent(client: Socket, data: any) {
    const sessionId = client.handshake.query.session_id;
    console.log('🚀 Client event', sessionId);
    this.namespace.server
      .of('/admins')
      .to(`events_${sessionId}`)
      .emit('dom_event', data);
  }
}
