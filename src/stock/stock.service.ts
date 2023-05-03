import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { gen } from 'n-digit-token'
import { PrismaService } from 'src/prisma/prisma.service';
import { IStock } from './dto';
import * as moment from 'moment';
import { ISystemResponse } from 'src/utils/systemResonse';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from 'src/utils/constants';

@Injectable()
export class StockService {
    constructor(private prisma:PrismaService){}

    async createNewStock(data:IStock):Promise<ISystemResponse>{
        if(moment(data.expiryDate).isSameOrBefore(new Date())){
            throw new BadRequestException('Please check expiry date')
        }
        const saveStock = await this.prisma.stock.create({
            data:{
                stockName: data.stockName,
                categoryId: data.categoryId,
                marketName: data.marketName,
                price: data.price,
                fbdNo: data.fdbNo,
                manfDate: data.manfDate,
                expiryDate: new Date(data.expiryDate) ,
                noOfBoxes: +data.noOfBoxes,
                itemPerbox: +data.itemPerBox,
                totalItems: +data.noOfBoxes * +data.itemPerBox,
                picUrl: data.picUrl,
                productCode: gen(6)
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: saveStock
        }
    }

    async getStocks({limit,offset}):Promise<ISystemResponse> {
        const stocks = await this.prisma.stock.findMany({
            take:+limit,
            skip: +offset,
            include:{
                category:true
            },
            orderBy:{
                stockName:'asc'
            }         
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: stocks
        }
    }

    async getStock(data:string):Promise<ISystemResponse> {
        const stock = await this.prisma.stock.findMany({
            where:{
                stockNo: data
            },
            include:{
                category:true
            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: stock
        }
    }

    async updateStock(data:IStock,stockId:string):Promise<ISystemResponse>{
        const updateProd = await this.prisma.stock.update({
            where:{
                stockNo: stockId
            },
            data:{
                stockName: data.stockName,
                categoryId: data.categoryId,
                marketName: data.marketName,
                manfDate: data.manfDate ?? null,
                price: data.price,
                discount: data.discount,
                fbdNo: data.fdbNo,
                expiryDate: new Date(data.expiryDate),
                noOfBoxes: +data.noOfBoxes,
                itemPerbox: +data.itemPerBox,
                totalItems: +data.noOfBoxes * +data.itemPerBox,
                picUrl: data.picUrl,
                barCodeId: data.barCodeId
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: updateProd
        }
    }

    async deleteStock(stockId:string):Promise<ISystemResponse>{
        const findItem = await this.prisma.stock.findFirst({
            where:{
                stockNo: stockId
            }
        })
        if(!findItem) throw new NotFoundException('Cannot delete this item')
        await this.prisma.stock.delete({
            where:{
                stockNo: stockId
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data:'Item deleted successfully'
        }
    }

}
