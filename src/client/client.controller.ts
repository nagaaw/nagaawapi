import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from '../core/entities/client.enity';


@Controller('clients')
export class ClientController {
  constructor(private readonly ClientService: ClientService) {}

  @Get()
  findAll(): Promise<Client[]> {
    return this.ClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Client | null> {
    return this.ClientService.findOne(id);
  }

  @Post()
  create(@Body() client: Client): Promise<Client> {
    return this.ClientService.create(client);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() client: Client): Promise<Client> {
    return this.ClientService.update(id, client);
  }

  @Patch(':id')
  updatePartial(@Param('id') id: number, @Body() data: any): Promise<Client> {
    return this.ClientService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.ClientService.remove(id);
  }
}
