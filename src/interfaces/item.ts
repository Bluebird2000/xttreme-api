
export interface IItem {
    name?: string,
    description?: string,
    quantity?: number,
    category?: string,
    category_name?: string,
    properties?: [{ id?: string, value?: string }],
    image?: string,
    tag?: string;
    purchased_total_amount_per_item?: string,
    unit_cost?: string,
    transaction_reference?: string;
    excel_file?: string;

}