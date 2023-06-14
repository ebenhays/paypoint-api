import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { gen } from 'n-digit-token';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from 'src/utils/constants';
import { ISystemResponse } from 'src/utils/systemResonse';
import { IDailysales } from './dto';
import * as _ from 'lodash'
import * as moment from 'moment';

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }

    async addDailySales(data: IDailysales[], userInfo: any): Promise<ISystemResponse> {
        const salesData = []
        const batchNo = gen(6)
        for (let sales of data) {
            salesData.push({
                qty: sales.qty,
                customerAmt: sales.customerAmt,
                price: sales.price,
                txnDate: new Date(),
                stockId: sales.stockId,
                batchNo,
                teller: userInfo.fullName,
                tellerId: userInfo.userName
            })
        }

        await this.prisma.dailySaleTemp.createMany({
            data: salesData
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Saved Successfully',
        }
    }

    async getDailySalesTempByDate({ startDate, endDate }): Promise<ISystemResponse> {
        let dailySalesrec = await this.prisma.dailySaleTemp.findMany({
            where: {
                txnDate: {
                    lte: new Date(endDate),
                    gte: new Date(startDate),
                }

            },
            select: {
                teller: true,
                batchNo: true,
                total: true,
                qty: true,
                txnDate: true,
                txnId: true,
                customerAmt: true,
                customerBalance: true,
                stock: {
                    select: {
                        stockName: true,
                        stockNo: true,
                        price: true,
                    }
                }
            },
            orderBy: {
                txnDate: 'asc'
            }
        })
        _.each(dailySalesrec, (v, i) => {
            const formatDate = moment(v.txnDate).format('YYYY-MM-DD')
            dailySalesrec[i]["salesDate"] = formatDate
        })

        const regroup = _.groupBy(dailySalesrec, 'salesDate')
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: regroup
        }
    }

    async getDailySalesTempByBatch({ batchNo }): Promise<ISystemResponse> {
        let dailySalesrec = await this.prisma.dailySaleTemp.findMany({
            where: {
                batchNo
            },
            select: {
                teller: true,
                batchNo: true,
                total: true,
                qty: true,
                txnDate: true,
                txnId: true,
                customerAmt: true,
                customerBalance: true,
                stock: {
                    select: {
                        stockName: true,
                        stockNo: true,
                        price: true,
                    }
                }
            },
            orderBy: {
                txnDate: 'asc'
            }
        })
        _.each(dailySalesrec, (v, i) => {
            const formatDate = moment(v.txnDate).format('YYYY-MM-DD')
            dailySalesrec[i]["salesDate"] = formatDate
        })

        const regroup = _.groupBy(dailySalesrec, 'salesDate')
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: regroup
        }
    }

    async updateDailySalesTemp(updateData: IDailysales, txnId: string): Promise<ISystemResponse> {
        const custBal = this.calculateCustomerBalance(
            updateData.customerAmt,
            updateData.qty,
            updateData.price)
        if (custBal < 0) throw new BadRequestException('Total items amount greater than customer amount')

        const findSaleItem = await this.findSalesTempById(txnId)
        if (!findSaleItem) throw new NotFoundException('could not find this item')

        const updateDailySalesTemp = await this.prisma.dailySaleTemp.update({
            where: {
                txnId
            },
            data: {
                qty: updateData.qty,
                customerAmt: updateData.customerAmt,
            },
            select: {
                qty: true,
                price: true,
                customerAmt: true,
                customerBalance: true,
                txnDate: true,
                txnId: true,
                batchNo: true,
                teller: true,
                tellerId: true,
                total: true,
                stock: {
                    select: {
                        stockName: true,
                        stockNo: true
                    }
                }
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: updateDailySalesTemp,
        }
    }

    async deleteDailySalesTemp(id: string): Promise<ISystemResponse> {
        const findSaleItem = await this.findSalesTempById(id)
        if (!findSaleItem) throw new NotFoundException('could not find this item')
        await this.prisma.dailySaleTemp.delete({
            where: {
                txnId: id
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Item deleted successfully'
        }
    }

    async checkoutSales(userInfo: any): Promise<ISystemResponse> {
        //move sales to DailySaleEod
        const findSales = await this.findSalesTempByTeller(userInfo.userName)
        if (!findSales) throw new NotFoundException(
            `No sales found for this teller ${userInfo.userName}`)
        const salesRec = []
        for (let data of findSales) {
            salesRec.push({
                txnDate: new Date(data.txnDate),
                qty: data.qty,
                price: data.price,
                customerAmt: data.customerAmt,
                batchNo: data.batchNo,
                teller: data.teller,
                stockId: data.stockId,
                tellerId: data.tellerId,
                txnId: data.txnId
            })
        }

        //save record to dailySaleEOD for history
        await this.prisma.dailySaleEod.createMany({
            data: salesRec
        })

        await this.prisma.dailySaleTemp.deleteMany({
            where: {
                tellerId: userInfo.userName
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully Saved'
        }
    }

    private calculateCustomerBalance(customerAmt: number, qty: number, price: number): number {
        const total = customerAmt - (qty * price)
        if (total < 0) return -1
        return total
    }

    private async findSalesTempById(salesId: string) {
        const findSaleItem = await this.prisma.dailySaleTemp.findUnique({
            where: {
                txnId: salesId
            }
        })
        if (!findSaleItem) return null
        return findSaleItem


    }

    private async findSalesTempByTeller(tellerId: string) {
        const findSaleItem = await this.prisma.dailySaleTemp.findMany({
            where: {
                tellerId: tellerId
            }
        })
        if (!findSaleItem) return null
        return findSaleItem


    }
}
