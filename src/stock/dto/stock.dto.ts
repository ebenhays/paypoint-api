import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class IStock {
    @IsNotEmpty()
    @ApiProperty()
    stockName: string
    @Allow()
    @ApiProperty({ required: false })
    stockNo?: string
    @IsNotEmpty()
    @ApiProperty()
    categoryId: string
    @Allow()
    @ApiProperty({ required: false })
    marketName?: string
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number
    @Allow()
    @ApiProperty({ required: false })
    discount?: number
    @Allow()
    @ApiProperty({ required: false })
    fdbNo?: string
    @Allow()
    @ApiProperty({ required: false })
    manfDate?: Date | null
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    expiryDate: Date | string
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    noOfBoxes: Number
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    itemPerBox: Number
    @Allow()
    @ApiProperty({ required: false })
    picUrl: string
    @Allow()
    @ApiProperty({ required: false })
    barCodeId: string





}