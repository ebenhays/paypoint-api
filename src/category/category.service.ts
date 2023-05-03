import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from 'src/utils/constants';
import { ISystemResponse } from 'src/utils/systemResonse';
import { ICategory } from './dto';

@Injectable()
export class CategoryService {
    constructor(private prisma:PrismaService){}

    async createCategory(data:ICategory):Promise<ISystemResponse>{
        const createCategory = await this.prisma.category.create({
            data:{
                categoryName: data.categoryName
            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: createCategory
        }
    }

    async getCategories({limit,offset}):Promise<ISystemResponse>{
       const categories =  await this.prisma.category.findMany({
        take: +limit,
        skip: +offset,
        orderBy:{
            categoryName:'asc'
        }
       })
       return {
        message: SYSTEM_MESSAGE.SUCCESSFUL,
        code: SYSTEM_CODE.SUCCESSFUL,
        data: categories
    }
    }

    async getCategory(data:string):Promise<ISystemResponse>{
        const category = await this.prisma.category.findFirst({
            where:{
                categoryCode: data
            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: category
        }
     }
}
