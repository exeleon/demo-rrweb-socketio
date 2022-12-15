import { Module } from '@nestjs/common';
import { AdminsGateway } from './admins.gateway';
import { ClientsGateway } from './clients.gateway';

@Module({
  providers: [AdminsGateway, ClientsGateway],
})
export class EventsModule {}
