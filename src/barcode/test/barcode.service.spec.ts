import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "../../prisma/prisma.service"
import { SYSTEM_CODE, SYSTEM_MESSAGE } from "../../utils/constants"
import { BarcodeService } from "../barcode.service"
import { IBarCode } from "../dto"



const mockBarcode: IBarCode = {
    barCodeName: 'My barcode',
    barCodeNo: "00001"
}

const mockPrismaService = {
    barCode: {
        create: jest.fn().mockResolvedValue({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            barCodeUid: expect.any(String)
        }),
        update: jest.fn().mockResolvedValue({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo
        }),
        findFirst: jest.fn().mockResolvedValue({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            Stock: {
                stockName: expect.any(String),
                stockNo: expect.any(String)
            }
        }),

        findMany: jest.fn().mockResolvedValue([{
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            barCodeUid: expect.any(String),
            Stock: {
                stockName: expect.any(String),
                stockNo: expect.any(String)
            }
        }]),

        delete: jest.fn().mockResolvedValue(undefined)
    }
}

describe('Testing barcode Service', () => {
    let barcodeService: BarcodeService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BarcodeService, {
                provide: PrismaService,
                useValue: mockPrismaService
            }]
        }).compile()

        barcodeService = module.get<BarcodeService>(BarcodeService)
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should create a barcode', async () => {
        const actual = await barcodeService.createBarCode(mockBarcode)
        expect(mockPrismaService.barCode.create).toHaveBeenCalledTimes(1)

        expect(mockPrismaService.barCode.create).toHaveReturnedWith(Promise.resolve({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            barCodeUid: expect.any(String),
        }))

        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: mockBarcode.barCodeName,
                barCodeNo: mockBarcode.barCodeNo,
                barCodeUid: expect.any(String)
            }
        })
    })

    test('should update barcode', async () => {
        const actual = await barcodeService.updateBarCode(mockBarcode, '123')
        expect(mockPrismaService.barCode.update).toHaveBeenCalledTimes(1)

        expect(mockPrismaService.barCode.update).toHaveReturnedWith(Promise.resolve({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
        }))

        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: mockBarcode.barCodeName,
                barCodeNo: mockBarcode.barCodeNo
            }
        })
    })

    test('should get barcode', async () => {
        const actual = await barcodeService.getBarCode('123')
        expect(mockPrismaService.barCode.findFirst).toHaveBeenCalledTimes(1)

        expect(mockPrismaService.barCode.findFirst).toHaveReturnedWith(Promise.resolve({
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            Stock: {
                stockName: expect.any(String),
                stockNo: expect.any(String)
            }
        }))

        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: mockBarcode.barCodeName,
                barCodeNo: mockBarcode.barCodeNo,
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)
                }
            }
        })
    })

    test('should get barcodes', async () => {
        const actual = await barcodeService.getBarCodes({ limit: 10, offset: 0 })
        expect(mockPrismaService.barCode.findMany).toHaveBeenCalledTimes(1)

        expect(mockPrismaService.barCode.findMany).toHaveReturnedWith(Promise.resolve([{
            barCodeName: mockBarcode.barCodeName,
            barCodeNo: mockBarcode.barCodeNo,
            Stock: {
                stockName: expect.any(String),
                stockNo: expect.any(String)
            }
        }]))

        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: [{
                barCodeName: mockBarcode.barCodeName,
                barCodeNo: mockBarcode.barCodeNo,
                barCodeUid: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)
                }
            }]
        })
    })

    test('should delete barcode', async () => {
        const actual = await barcodeService.deleteBarcode('123')
        expect(mockPrismaService.barCode.findFirst).toHaveBeenCalledTimes(1)
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully deleted barcode'
        })
    })

})