import { IsNotEmpty } from "class-validator";

export class IBarCode{
    @IsNotEmpty()
    barCodeName: string

    @IsNotEmpty()
    barCodeNo: string
}