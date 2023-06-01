import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class IBarCode {
    @IsNotEmpty()
    @ApiProperty()
    barCodeName: string

    @IsNotEmpty()
    @ApiProperty()
    barCodeNo: string
}