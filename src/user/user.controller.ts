import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guard';
import { IUser } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService:UserService){}
    @Get('all')
    getUsers(@Query() query:IUser){
        return this.userService.getUsers(query)
    }

    @Get('user')
    getLoggedInUser(@GetUser() user:User){
        return this.userService.getLoggedInUser(user)
    }
}

