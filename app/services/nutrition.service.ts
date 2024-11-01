import { Observable } from '@nativescript/core';
import { Food, Nutrient } from '../models/food.model';
import { User, DietaryPreferences } from '../models/user.model';

export class NutritionService extends Observable {
    private user: User = {
        goals: {
            dailyCalories: 2000,
            protein: 50,
            carbs: 250,
            fat: 70,
            fiber: 25
        },
        preferences: {
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false,
            isDairyFree: false
        },
        currentIntake: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        }
    };

    private consumedFoods: Food[] = [];

    getCurrentNutrition(): User {
        return this.user;
    }

    addFood(food: Food): void {
        this.consumedFoods.push(food);
        this.updateNutrientTotals();
    }

    swapFood(oldFood: Food, newFood: Food): void {
        const index = this.consumedFoods.findIndex(f => f.id === oldFood.id);
        if (index !== -1) {
            this.consumedFoods[index] = newFood;
            this.updateNutrientTotals();
        }
    }

    private updateNutrientTotals(): void {
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        };

        this.consumedFoods.forEach(food => {
            totals.calories += food.nutrients.calories;
            totals.protein += food.nutrients.protein;
            totals.carbs += food.nutrients.carbs;
            totals.fat += food.nutrients.fat;
            totals.fiber += food.nutrients.fiber;
        });

        this.user.currentIntake = totals;
        this.notifyPropertyChange('currentIntake', this.user.currentIntake);
    }

    async getSuggestedSwaps(food: Food): Promise<Food[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return this.getFoodDatabase()
            .filter(item => {
                // Filter based on dietary preferences
                if (this.user.preferences.isVegetarian && !item.dietaryInfo?.isVegetarian) return false;
                if (this.user.preferences.isVegan && !item.dietaryInfo?.isVegan) return false;
                if (this.user.preferences.isGlutenFree && !item.dietaryInfo?.isGlutenFree) return false;
                if (this.user.preferences.isDairyFree && !item.dietaryInfo?.isDairyFree) return false;

                // Basic nutrition criteria
                return item.nutrients.calories < food.nutrients.calories &&
                       item.id !== food.id &&
                       item.nutrients.protein >= food.nutrients.protein * 0.8; // At least 80% of original protein
            })
            .sort((a, b) => {
                // Sort by nutritional benefit score
                const scoreA = this.calculateNutritionalScore(a, food);
                const scoreB = this.calculateNutritionalScore(b, food);
                return scoreB - scoreA;
            })
            .slice(0, 5); // Return top 5 suggestions
    }

    private calculateNutritionalScore(food: Food, original: Food): number {
        let score = 0;
        
        // Lower calories is better
        score += (original.nutrients.calories - food.nutrients.calories) * 0.5;
        
        // Higher protein is better
        if (food.nutrients.protein > original.nutrients.protein) {
            score += (food.nutrients.protein - original.nutrients.protein) * 2;
        }
        
        // Higher fiber is better
        if (food.nutrients.fiber > original.nutrients.fiber) {
            score += (food.nutrients.fiber - original.nutrients.fiber) * 3;
        }

        return score;
    }

    getRemainingNutrients(): Nutrient {
        return {
            calories: this.user.goals.dailyCalories - this.user.currentIntake.calories,
            protein: this.user.goals.protein - this.user.currentIntake.protein,
            carbs: this.user.goals.carbs - this.user.currentIntake.carbs,
            fat: this.user.goals.fat - this.user.currentIntake.fat,
            fiber: this.user.goals.fiber - this.user.currentIntake.fiber
        };
    }

    private getFoodDatabase(): Food[] {
        return [
            {
                id: '1',
                name: 'Greek Yogurt with Berries',
                nutrients: {
                    calories: 150,
                    protein: 15,
                    carbs: 20,
                    fat: 3,
                    fiber: 4
                },
                servingSize: '1 cup',
                category: 'Breakfast',
                dietaryInfo: {
                    isVegetarian: true,
                    isVegan: false,
                    isGlutenFree: true,
                    isDairyFree: false
                }
            },
            {
                id: '2',
                name: 'Quinoa Buddha Bowl',
                nutrients: {
                    calories: 350,
                    protein: 12,
                    carbs: 45,
                    fat: 15,
                    fiber: 8
                },
                servingSize: '1 bowl',
                category: 'Lunch',
                dietaryInfo: {
                    isVegetarian: true,
                    isVegan: true,
                    isGlutenFree: true,
                    isDairyFree: true
                }
            },
            {
                id: '3',
                name: 'Grilled Chicken Salad',
                nutrients: {
                    calories: 300,
                    protein: 28,
                    carbs: 12,
                    fat: 18,
                    fiber: 6
                },
                servingSize: '1 plate',
                category: 'Lunch',
                dietaryInfo: {
                    isVegetarian: false,
                    isVegan: false,
                    isGlutenFree: true,
                    isDairyFree: true
                }
            }
        ];
    }
}