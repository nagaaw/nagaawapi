import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}


    async  findUserById(id: number): Promise<User>{
       const user = await this.userRepository.findOneBy({id});

       if(!user) throw new NotFoundException('User not found');

       return user;
        
     }
}
