import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from '../utils/constants';
import { ISystemResponse } from '../utils/systemResonse';
import { IBarCode } from './dto';

@Injectable()
export class BarcodeService {
    constructor(private prisma: PrismaService) { }

    async createBarCode(data: IBarCode): Promise<ISystemResponse> {
        const saveBarcode = await this.prisma.barCode.create({
            data: {
                barCodeName: data.barCodeName,
                barCodeNo: data.barCodeNo
            },
            select: {
                barCodeName: true,
                barCodeNo: true,
                barCodeUid: true
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: saveBarcode
        }
    }

    async updateBarCode(data: IBarCode, barcodeId: string): Promise<ISystemResponse> {
        const updatebarcode = await this.prisma.barCode.update({
            where: {
                barCodeUid: barcodeId
            },
            data: {
                barCodeName: data.barCodeName,
                barCodeNo: data.barCodeNo,
            },
            select: {
                barCodeName: true,
                barCodeNo: true
            }
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: updatebarcode
        }
    }

    async getBarCode(data: string): Promise<ISystemResponse> {
        const getbarcode = await this.prisma.barCode.findFirst({
            where: {
                barCodeUid: data
            },
            select: {
                barCodeName: true,
                barCodeNo: true,
                Stock: {
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
            data: getbarcode
        }
    }

    async getBarCodes({ limit, offset }): Promise<ISystemResponse> {
        const getbarcodes = await this.prisma.barCode.findMany({
            select: {
                barCodeName: true,
                barCodeNo: true,
                barCodeUid: true,
                Stock: {
                    select: {
                        stockName: true,
                        stockNo: true
                    }
                }
            },
            take: +limit,
            skip: +offset
        })

        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: getbarcodes
        }
    }

    async deleteBarcode(data: string): Promise<ISystemResponse> {
        const getBarcode = await this.prisma.barCode.findFirst({
            where: {
                barCodeUid: data
            }
        })
        if (!getBarcode) throw new NotFoundException('Cannot delete this item')
        await this.prisma.barCode.delete({
            where: {
                barCodeUid: getBarcode.barCodeUid
            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully deleted barcode'
        }
    }
}
