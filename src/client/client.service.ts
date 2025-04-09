import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../core/entities/client.enity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  findOne(id: number): Promise<Client | null> {
    return this.clientRepository.findOneBy({ id });
  }

  create(client: Client): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async update(id: number, client: Client): Promise<Client> {
    const clientToUpdate: Client | null = await this.clientRepository.findOne({where: {id: id}});
    if(!clientToUpdate){
        throw new NotFoundException('Client not found')
    }
    // Merge the existing client data with the new data
  const updatedClient = { ...clientToUpdate, ...client };

  // Save the updated client data back to the repository
  return this.clientRepository.save(updatedClient);
  }

  remove(id: number): Promise<void> {
    return this.clientRepository.delete(id).then(() => undefined);
  }
}
