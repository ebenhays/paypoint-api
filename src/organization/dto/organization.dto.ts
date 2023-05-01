import { Allow, IsNotEmpty } from "class-validator"

export class IOrg{
    
    @IsNotEmpty()
    orgName: string
    @Allow()
    orgCode?: string
}