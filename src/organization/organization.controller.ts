import { Body, Controller, Post } from '@nestjs/common';
import { IOrg } from './dto';
import { OrganizationService } from './organization.service';

@Controller('org')
export class OrganizationController {
    constructor(private orgService:OrganizationService){}

    @Post('create-org')
    createOrg(@Body() data:IOrg){
        return this.orgService.createOrg(data)
    }
}
