import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { StockModule } from './stock/stock.module';
import { CategoryModule } from './category/category.module';
import { BarcodeModule } from './barcode/barcode.module';
import { SalesModule } from './sales/sales.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    AuthModule, 
    UserModule, 
    PrismaModule, 
    OrganizationModule, StockModule, CategoryModule, BarcodeModule, SalesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
