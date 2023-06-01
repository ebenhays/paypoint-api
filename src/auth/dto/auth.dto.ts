import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { Allow, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class ISignup {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @Allow()
    @ApiProperty({ required: false })
    password?: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    lastName: string

    @Allow()
    mustChangePassword?: boolean

    @Allow()
    @ApiProperty({ required: false })
    lastChangedDate?: Date

    @IsEnum(Role)
    @ApiProperty()
    role: Role

    @Allow()
    @ApiProperty({ required: false })
    orgCode?: string

    @IsNotEmpty()
    @ApiProperty()
    primaryPhone?: string

    @Allow()
    @ApiProperty({ required: false })
    secondayPhone?: string

}

export class ISignin {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    @ApiProperty()
    password: string
}

export class IChangePassword {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    @ApiProperty()
    password: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 1,
        minNumbers: 3,
        minSymbols: 1
    })
    @ApiProperty()
    confirmPassword: string
}
