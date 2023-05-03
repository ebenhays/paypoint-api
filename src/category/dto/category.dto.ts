import { IsNotEmpty } from "class-validator";

export class ICategory{
    @IsNotEmpty()
    categoryName:string
}