import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IPaginate } from '../user/dto';
import { CategoryService } from './category.service';
import { ICategory } from './dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService:CategoryService){}

@Post('create-category')
    createCategory(@Body() data:ICategory){
        return this.categoryService.createCategory(data)
    }


 @Get(':id')
    getCategory(@Param("id") categoryId:string){
        return this.categoryService.getCategory(categoryId)
    }

@Get()
    getCategories(@Query() query: IPaginate){
        return this.categoryService.getCategories(query)
    }

}


   
