import { Role } from "@prisma/client"
import {Allow, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class ISignup{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Allow()
    password?: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @Allow()
    mustChangePassword?:boolean

    @Allow()
    lastChangedDate?:Date

    @IsEnum(Role)
    role:Role

    @Allow()
    orgCode?:string

    @IsNotEmpty()
    primaryPhone?: string

    @Allow()
    secondayPhone?: string

}

export class ISignin{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    password:string
}

export class IChangePassword{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    password:string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    confirmPassword:string
}
