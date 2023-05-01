import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IOrg } from './dto';

@Injectable()
export class OrganizationService {
    constructor(private prisma: PrismaService){}

  async createOrg(data:IOrg){
        const org = await this.prisma.organization.create({
            data:{
                orgName:data.orgName
            },
            select:{
                orgName:true,
                orgCode:true
            }
        })

        return org
    }
}
