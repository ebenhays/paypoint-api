import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPaginate } from '../user/dto';
import { BarcodeService } from './barcode.service';
import { IBarCode } from './dto';

@ApiTags('barcode')
@Controller('barcodes')
export class BarcodeController {
    constructor(private barcodeService: BarcodeService) { }

    @Post('create-barcode')
    createBarcode(@Body() data: IBarCode) {
        return this.barcodeService.createBarCode(data)
    }

    @Get(':id')
    getBarcode(@Param("id") barCodeId: string) {
        return this.barcodeService.getBarCode(barCodeId)
    }

    @Get()
    getBarcodes(@Query() query: IPaginate) {
        return this.barcodeService.getBarCodes(query)
    }

    @Patch(':id')
    updateBarcode(@Body() data: IBarCode, @Param('id') barcodeId: string) {
        return this.barcodeService.updateBarCode(data, barcodeId)
    }

    @Delete(':id')
    deleteBarcode(@Param("id") barCodeId: string) {
        return this.barcodeService.deleteBarcode(barCodeId)
    }
}
