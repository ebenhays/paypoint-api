import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Delete,
    Query,
    UseGuards,
    ParseArrayPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guard';
import { IBatch, IDailysales, ITxnDate, ITxnId } from './dto';
import { SalesService } from './sales.service';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
    constructor(private salesService: SalesService) { }

    @Post('create-daily-sales')
    createDailySales(@Body(new ParseArrayPipe({ items: IDailysales })) data: IDailysales[], @GetUser() userInfo: any) {
        return this.salesService.addDailySales(data, userInfo)
    }

    @Post('checkout')
    checkoutSales(@GetUser() userInfo: any) {
        return this.salesService.checkoutSales(userInfo)
    }

    @Get('daily-temp-txn')
    getDailySalesTempByDate(@Query() query: ITxnDate) {
        return this.salesService.getDailySalesTempByDate(query)
    }

    @Get('daily-temp-batch')
    getDailySalesTempByBatch(@Query() query: IBatch) {
        return this.salesService.getDailySalesTempByBatch(query)
    }

    @Patch('daily-temp/:id')
    updateDailySalesTemp(@Param('id') salesId: string, @Body() data: IDailysales) {
        return this.salesService.updateDailySalesTemp(data, salesId)
    }

    @Delete('daily-temp/:id')
    deleteDailySalesTemp(@Param('id') salesId: string) {
        return this.salesService.deleteDailySalesTemp(salesId)
    }

}
