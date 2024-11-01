import { Observable, Frame } from '@nativescript/core';
import { Food } from '../../models/food.model';
import { NutritionService } from '../../services/nutrition.service';

export class FoodSwapViewModel extends Observable {
    private nutritionService: NutritionService;
    private _currentFood: Food;
    private _suggestions: Food[] = [];

    constructor(food: Food) {
        super();
        this._currentFood = food;
        this.nutritionService = global.getResource('nutritionService');
        this.loadSuggestions();
    }

    get currentFood(): Food {
        return this._currentFood;
    }

    get suggestions(): Food[] {
        return this._suggestions;
    }

    private async loadSuggestions() {
        const swaps = await this.nutritionService.getSuggestedSwaps(this._currentFood);
        this._suggestions = swaps.map(food => ({
            ...food,
            benefitsText: this.getBenefitsText(food)
        }));
        this.notifyPropertyChange('suggestions', this._suggestions);
    }

    private getBenefitsText(food: Food): string {
        const benefits = [];
        const current = this._currentFood.nutrients;
        const suggested = food.nutrients;

        if (suggested.calories < current.calories) {
            benefits.push(`${current.calories - suggested.calories} fewer calories`);
        }
        if (suggested.protein > current.protein) {
            benefits.push(`${suggested.protein - current.protein}g more protein`);
        }
        if (suggested.fiber > current.fiber) {
            benefits.push(`${suggested.fiber - current.fiber}g more fiber`);
        }

        return benefits.join(' • ');
    }

    onSwapFood(args) {
        const newFood = args.object.bindingContext;
        this.nutritionService.swapFood(this._currentFood, newFood);
        Frame.topmost().goBack();
    }
}