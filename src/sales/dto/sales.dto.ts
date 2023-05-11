import {IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class IDailysales{
    @IsNotEmpty()
    stockId: string
    @IsNumber()
    qty: number
    @IsNumber()
    price: number
    @IsNumber()
    customerAmt: number
}

export class ITxnDate{
    @IsDateString()
    startDate: string
    @IsDateString()
    endDate: string
}

export class IBatch{
    @IsNotEmpty()
    batchNo: string
}

export class ITxnId{
    @IsNotEmpty()
    id: string
}