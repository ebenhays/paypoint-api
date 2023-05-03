import { Role, Status } from "@prisma/client";
import { Allow, IsEmail, IsEnum, IsNotEmpty, IsNumberString } from "class-validator";

export class IPaginate{
    @IsNumberString({no_symbols:true})
    @IsNotEmpty()
    limit: number | string

    @IsNumberString({no_symbols:true})
    @IsNotEmpty()
    offset: number
}

export class IUser{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    orgId: string

    @IsNotEmpty()
    @IsEnum(Status)
    status: Status

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role

    @IsNotEmpty()
    primaryPhone:string

    @Allow()
    secondaryPhone:string

}