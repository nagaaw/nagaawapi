import { Controller, Get, Param } from '@nestjs/common';
import { User } from '../core/entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get(':id')
    findUserById(@Param('id') id: number): Promise<User | null>{
      return  this.userService.findUserById(id);
    } 
}
