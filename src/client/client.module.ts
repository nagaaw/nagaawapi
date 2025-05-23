import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../core/entities/client.enity';

@Module({
   imports:[
      TypeOrmModule.forFeature([Client]),
    ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
