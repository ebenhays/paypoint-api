import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async getUsers({limit,offset}):Promise<User[]>{
     const result =  await this.prisma.user.findMany({
            select:{
                firstName: true,
                lastName: true,
                email: true,
                primaryPhone: true,
                secondayPhone: true
            },
            take: +limit,
            skip: +offset
        })
        return result as any
    }

    getLoggedInUser(data:User):User{
        return data
    }
}
