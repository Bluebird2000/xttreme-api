import { Length, IsNotEmpty, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreatItemDTO {
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
    properties: [{ id?: string, value?: string }];

    @IsOptional()
    image: string;

    @IsOptional()
    @MaxLength(100, {
        message: 'tag should not exceed 100 characters length'
    })
    tag?: string;

    @IsOptional()
    purchased_total_amount_per_item?: string;

    @IsOptional()
    unit_cost?: string;

    @IsOptional()
    transaction_reference?: string;

    constructor(name?: string, description?: string, quantity?: number, category?: string, properties?: [{ id?: string, value?: string }], image?: string, tag?: string, purchased_total_amount_per_item?: string, unit_cost?: string, transaction_reference?: string) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.category = category;
        this.properties = properties;
        this.image = image;
        this.tag = tag;
        this.purchased_total_amount_per_item = purchased_total_amount_per_item;
        this.unit_cost = unit_cost;
        this.transaction_reference = transaction_reference;
    }
}