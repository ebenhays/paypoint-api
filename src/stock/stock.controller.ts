import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { IPaginate } from '../user/dto';
import { IStock } from './dto';
import { StockService } from './stock.service';

@ApiTags('stock')
@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
    constructor(private stockService: StockService) { }

    @Post('create-stock')
    async addStock(@Body() data: IStock) {
        return this.stockService.createNewStock(data)
    }

    @Get(':id')
    getStock(@Param("id") stockId: string) {
        return this.stockService.getStock(stockId)
    }

    @Get()
    getStocks(@Query() query: IPaginate) {
        return this.stockService.getStocks(query)
    }

    @Patch(':id')
    updateStock(@Body() data: IStock, @Param("id") stockId: string) {
        return this.stockService.updateStock(data, stockId)
    }

    @Delete(':id')
    deleteStock(@Param("id") stockId: string) {
        return this.stockService.deleteStock(stockId)
    }
}