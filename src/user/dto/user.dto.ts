import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class IUser{
    @IsNumberString({no_symbols:true})
    @IsNotEmpty()
    limit: number | string

    @IsNumberString({no_symbols:true})
    @IsNotEmpty()
    offset: number
}