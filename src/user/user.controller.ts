import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guard';
import { IPaginate, IUser} from './dto/';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService:UserService){}
    @Get('all')
    getUsers(@Query() query:IPaginate){
        return this.userService.getUsers(query)
    }

    @Get('user')
    getLoggedInUser(@GetUser() user:User){
        return this.userService.getLoggedInUser(user)
    }

    @Patch(':id')
    updateUser(@Param("id") userId:string, @Body() data:IUser){
        return this.userService.updateUser(data,userId)
    }
}

