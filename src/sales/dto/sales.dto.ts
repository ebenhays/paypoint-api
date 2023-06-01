import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class IDailysales {
    @IsNotEmpty()
    @ApiProperty()
    stockId: string
    @IsNumber()
    @ApiProperty()
    qty: number
    @IsNumber()
    @ApiProperty()
    price: number
    @IsNumber()
    @ApiProperty()
    customerAmt: number
}

export class ITxnDate {
    @IsDateString()
    @ApiProperty()
    startDate: string
    @IsDateString()
    @ApiProperty()
    endDate: string
}

export class IBatch {
    @IsNotEmpty()
    @ApiProperty()
    batchNo: string
}

export class ITxnId {
    @IsNotEmpty()
    @ApiProperty()
    id: string
}