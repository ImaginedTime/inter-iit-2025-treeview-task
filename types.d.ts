type GodownType = {
    id: string;
    name: string;
    parent_godown_id: string;
}

type ItemType = {
    item_id: string;
    name: string;
    quantity: number;
    category: string;
    price: number;
    status: string;
    godown: GodownType;
    godown_id: string;
    brand: string;
    attributes: any;
    image_url: string;
}