import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from 'src/utils/constants';
import { ISystemResponse } from 'src/utils/systemResonse';
import { IUser } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async getUsers({limit,offset}):Promise<ISystemResponse>{
     const result =  await this.prisma.user.findMany({
            select:{
                firstName: true,
                lastName: true,
                email: true,
                primaryPhone: true,
                secondayPhone: true,
                organization:{
                    select:{
                        orgName:true,
                        orgCode: true
                    }
                }
            },
            take: +limit,
            skip: +offset,

            orderBy:{
                firstName: 'asc'
            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: result
        }
    }

    getLoggedInUser(data:User):User{
        return data
    }

    async updateUser(data:IUser,userId:string):Promise<ISystemResponse>{
        const findUser = await this.prisma.user.findFirst({
            where:{
                userGuid: userId
            }
        })
        if(!findUser) throw new NotFoundException('Cannot update this user')

        const updateUser = await this.prisma.user.update({
            where:{
                userGuid: userId
            },
            data:{
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                orgId: data.orgId,
                status: data.status,
                role: data.role,
                primaryPhone: data.primaryPhone,
                secondayPhone: data.secondaryPhone
            },
            select:{
                firstName:true,
                lastName: true,
                lastChangedDate: true,
                email: true,
                status: true,
                role: true,
                primaryPhone: true,
                secondayPhone: true
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: updateUser
        }
    }
}
