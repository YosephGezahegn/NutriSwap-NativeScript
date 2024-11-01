export interface Nutrient {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface Food {
    id: string;
    name: string;
    nutrients: Nutrient;
    servingSize: string;
    category: string;
    dietaryInfo?: {
        isVegetarian: boolean;
        isVegan: boolean;
        isGlutenFree: boolean;
        isDairyFree: boolean;
    };
}