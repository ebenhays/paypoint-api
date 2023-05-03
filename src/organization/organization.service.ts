import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from 'src/utils/constants';
import { ISystemResponse } from 'src/utils/systemResonse';
import { IOrg } from './dto';

@Injectable()
export class OrganizationService {
    constructor(private prisma: PrismaService){}

  async createOrg(data:IOrg):Promise<ISystemResponse>{
        const createOrg = await this.prisma.organization.create({
            data:{
                orgName:data.orgName
            },
            select:{
                orgName:true,
                orgCode:true
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: createOrg
        }
    }

    async getOrganizations({limit,offset}):Promise<ISystemResponse>{
        const orgs =  await this.prisma.organization.findMany({
            take: +limit,
            skip:+offset
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: orgs
        }
    }

    async getOrganization(orgId:string):Promise<ISystemResponse>{
        const org =  await this.prisma.organization.findFirst({
            where:{
                orgCode: orgId
            },
            orderBy:{
                orgName:'asc'
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: org
        }
    }
}
