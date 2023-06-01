import { ApiProperty } from "@nestjs/swagger"
import { Allow, IsNotEmpty } from "class-validator"

export class IOrg {
    @IsNotEmpty()
    @ApiProperty()
    orgName: string
    @Allow()
    @ApiProperty({ required: false })
    orgCode?: string
}