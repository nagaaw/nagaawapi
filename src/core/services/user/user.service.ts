import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {

    constructor( @InjectRepository(User)
        private readonly userRepository: Repository<User>,){

    }
    
 async findById  (userId: number, manager?: EntityManager): Promise<User | null> {
    if(manager){
        return await manager.findOne(User,{where: {id: userId}})
    }
     return await this.userRepository.findOne({where: {id:userId}})
    }
}
