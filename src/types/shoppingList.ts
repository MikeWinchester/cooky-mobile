
export interface ShoppingList {
    user_id?: string;
    list_id?: string;
    recipe_id?: string;
    name: string;
    description: string;
    items: ShoppingListItem[];
    created_at: string;
    updated_at?: string;
}

export interface ShoppingListItem {
  item_id?: string;
  ingredient_id?: string;
  name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  is_optional?: boolean;
  notes?: string;
}

export interface ShoppingListGet {
    ShoppingList: ShoppingList;
    stats: ShoppingListItemStats;
    formatted_created_at: string,
    item_count: number
}

export interface ShoppingListItemStats {
    total_items: number;
    purchased_items: number;
    pending_items: number;
    completion_percentage: number;
}