import { Length, IsNotEmpty, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreateItemDTO {
    @IsNotEmpty({
        message: 'name is required'
    })
    @MaxLength(30, {
        message: 'name should not exceed 30 characters'
    })
    name: string;

    @IsOptional()
    @MaxLength(150, {
        message: 'description should not exceed 150 characters'
    })
    description: string;

    @MinLength(1, {
        message: 'quantity should not be less than 1'
    })
    quantity: number;

    @IsNotEmpty({
        message: 'category is required'
    })
    @Length(3, 150, {
        message: 'category should be between 3 and 150 characters'
    })
    category: string;

    @IsOptional()
    @MaxLength(100, {
        message: 'tag should not exceed 100 characters length'
    })
    tag?: string;

    @IsOptional()
    reorder_level?: number;

    constructor(name?: string, description?: string, quantity?: number, category?: string, tag?: string, reorder_level?: number ) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.category = category;
        this.tag = tag;
        this.reorder_level = reorder_level
    }
}