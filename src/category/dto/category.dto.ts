import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ICategory {
    @IsNotEmpty()
    @ApiProperty()
    categoryName: string
}