import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { IPaginate } from '../user/dto';
import { IOrg } from './dto';
import { OrganizationService } from './organization.service';


@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
    constructor(private orgService: OrganizationService) { }

    @Post('create-org')
    createOrg(@Body() data: IOrg) {
        return this.orgService.createOrg(data)
    }

    @Get('org')
    getOrganizations(@Query() query: IPaginate) {
        return this.orgService.getOrganizations(query)
    }

    @Get(':id')
    getOrganization(@Param('id') orgId: string) {
        return this.orgService.getOrganization(orgId)
    }
}
