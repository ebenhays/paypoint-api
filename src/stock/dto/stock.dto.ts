import { Allow, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class IStock{
    @IsNotEmpty()
    stockName: string
    @Allow()
    stockNo?: string
    @IsNotEmpty()
    categoryId: string
    @Allow()
    marketName?: string
    @IsNumber()
    @IsNotEmpty()
    price:number
    @Allow()
    discount?: number
    @Allow()
    fdbNo?: string
    @Allow()
    manfDate?: Date | null
    @IsNotEmpty()
    @IsDateString()
    expiryDate: Date | string
    @IsNotEmpty()
    @IsNumber()
    noOfBoxes: Number
    @IsNotEmpty()
    @IsNumber()
    itemPerBox: Number
    @Allow()
    picUrl: string
    @Allow()
    barCodeId: string




    
}