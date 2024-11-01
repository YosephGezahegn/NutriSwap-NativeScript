export interface DietaryPreferences {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
}

export interface UserGoals {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface User {
    goals: UserGoals;
    preferences: DietaryPreferences;
    currentIntake: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };
}