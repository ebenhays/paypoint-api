import { Test, TestingModule } from "@nestjs/testing"
import { IPaginate } from "src/user/dto"
import { SYSTEM_CODE, SYSTEM_MESSAGE } from "../../utils/constants"
import { BarcodeController } from "../barcode.controller"
import { BarcodeService } from "../barcode.service"
import { IBarCode } from "../dto"

describe('Testing barcode Controller', () => {
    let barcodeController: BarcodeController

    const barcodeServiceMock = {
        createBarCode: jest.fn().mockResolvedValue({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String)
            }
        }),
        getBarCode: jest.fn().mockResolvedValue({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)
                }
            }
        }),
        getBarCodes: jest.fn().mockResolvedValue({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)
                }
            }
        }),
        updateBarCode: jest.fn().mockResolvedValue({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
            }
        }),
        deleteBarcode: jest.fn().mockResolvedValue({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully deleted barcode'
        })

    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BarcodeController],
            providers: [BarcodeService]
        }).overrideProvider(BarcodeService)
            .useValue(barcodeServiceMock)
            .compile()

        barcodeController = module.get<BarcodeController>(BarcodeController);
    })

    test('create-barcode', async () => {
        const mockCreateBarcode: IBarCode = {
            barCodeName: 'my special barcode',
            barCodeNo: 'UID001'
        }
        const actual = await barcodeController.createBarcode(mockCreateBarcode)
        expect(barcodeServiceMock.createBarCode).toHaveBeenCalled()
        expect(barcodeServiceMock.createBarCode).toHaveBeenCalledWith(mockCreateBarcode)
        expect(barcodeServiceMock.createBarCode).toHaveReturnedWith(Promise.resolve({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String)
            }
        }))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String)
            }
        })
    })

    test('get barcode by id', async () => {
        const mockGetBarcodeById: string = 'UID001'
        const actual = await barcodeController.getBarcode(mockGetBarcodeById)
        expect(barcodeServiceMock.getBarCode).toHaveBeenCalled()
        expect(barcodeServiceMock.getBarCode).toHaveBeenCalledWith(mockGetBarcodeById)
        expect(barcodeServiceMock.getBarCode).toHaveReturnedWith(Promise.resolve({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)

                }
            }
        }))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)

                }
            }
        })
    })

    test('get all barcodes', async () => {
        const mockGetQueryParam: IPaginate = {
            limit: 1,
            offset: 0
        }
        const actual = await barcodeController.getBarcodes(mockGetQueryParam)
        expect(barcodeServiceMock.getBarCodes).toHaveBeenCalled()
        expect(barcodeServiceMock.getBarCodes).toHaveBeenCalledWith(mockGetQueryParam)
        expect(barcodeServiceMock.getBarCodes).toHaveReturnedWith(Promise.resolve({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)

                }
            }
        }))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),
                barCodeUid: expect.any(String),
                Stock: {
                    stockName: expect.any(String),
                    stockNo: expect.any(String)
                }
            }
        })
    })

    test('update barcode', async () => {
        const mockUpdateBarcode: IBarCode = {
            barCodeName: 'my special barcode',
            barCodeNo: 'UID001'
        }
        const actual = await barcodeController.updateBarcode(mockUpdateBarcode, 'bar001')
        expect(barcodeServiceMock.updateBarCode).toHaveBeenCalled()
        expect(barcodeServiceMock.updateBarCode).toHaveBeenCalledWith(mockUpdateBarcode, 'bar001')
        expect(barcodeServiceMock.updateBarCode).toHaveReturnedWith(Promise.resolve({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),

            }
        }))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: {
                barCodeName: expect.any(String),
                barCodeNo: expect.any(String),

            }
        })
    })

    test('delete barcode', async () => {
        const actual = await barcodeController.deleteBarcode('bar001')
        expect(barcodeServiceMock.deleteBarcode).toHaveBeenCalled()
        expect(barcodeServiceMock.deleteBarcode).toHaveBeenCalledWith('bar001')
        expect(barcodeServiceMock.deleteBarcode).toHaveReturnedWith(Promise.resolve({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully deleted barcode'
        }))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: 'Successfully deleted barcode'
        })
    })
})