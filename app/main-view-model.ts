import { Observable, Frame } from '@nativescript/core';
import { Food } from './models/food.model';
import { NutritionService } from './services/nutrition.service';

export class MainViewModel extends Observable {
    private nutritionService: NutritionService;
    private _todaysMeals: Array<Food & { mealIcon: string }> = [];
    private _nutritionTip: string = '';

    constructor() {
        super();
        this.nutritionService = global.getResource('nutritionService');
        this.loadTodaysMeals();
        this.updateNutrition();
        this.generateNutritionTip();
    }

    get todaysMeals(): Array<Food & { mealIcon: string }> {
        return this._todaysMeals;
    }

    get remainingCalories(): number {
        return this.nutritionService.getRemainingNutrients().calories;
    }

    get remainingProtein(): number {
        return this.nutritionService.getRemainingNutrients().protein;
    }

    get remainingCarbs(): number {
        return this.nutritionService.getRemainingNutrients().carbs;
    }

    get caloriesProgress(): number {
        const consumed = this.nutritionService.getCurrentNutrition().currentIntake.calories;
        const goal = this.nutritionService.getCurrentNutrition().goals.dailyCalories;
        return (consumed / goal) * 100;
    }

    get proteinProgress(): number {
        const consumed = this.nutritionService.getCurrentNutrition().currentIntake.protein;
        const goal = this.nutritionService.getCurrentNutrition().goals.protein;
        return (consumed / goal) * 100;
    }

    get carbsProgress(): number {
        const consumed = this.nutritionService.getCurrentNutrition().currentIntake.carbs;
        const goal = this.nutritionService.getCurrentNutrition().goals.carbs;
        return (consumed / goal) * 100;
    }

    get nutritionTip(): string {
        return this._nutritionTip;
    }

    onAddFoodTap() {
        Frame.topmost().navigate('components/food-search/food-search-page');
    }

    onMenuTap() {
        Frame.topmost().navigate('components/menu/menu-page');
    }

    onQuickAddTap() {
        Frame.topmost().navigate('components/quick-add/quick-add-page');
    }

    onSwapTap(args) {
        const food = args.object.bindingContext;
        Frame.topmost().navigate({
            moduleName: 'components/food-swap/food-swap-page',
            context: { food }
        });
    }

    onSettingsTap() {
        Frame.topmost().navigate('components/settings/settings-page');
    }

    onViewInsightsTap() {
        Frame.topmost().navigate('components/insights/insights-page');
    }

    private loadTodaysMeals() {
        const meals = this.nutritionService.getTodaysFoods();
        this._todaysMeals = meals.map(meal => ({
            ...meal,
            mealIcon: this.getMealIcon(meal.category)
        }));
        this.notifyPropertyChange('todaysMeals', this._todaysMeals);
    }

    private getMealIcon(category: string): string {
        const icons = {
            'Breakfast': '\uf7b6',
            'Lunch': '\uf805',
            'Dinner': '\uf2e7',
            'Snack': '\uf787',
            'default': '\uf805'
        };
        return icons[category] || icons.default;
    }

    private generateNutritionTip() {
        const tips = [
            "Try to eat protein with every meal to stay fuller longer.",
            "Aim for colorful vegetables to get a variety of nutrients.",
            "Stay hydrated! Drink water between meals.",
            "Include fiber-rich foods to improve digestion."
        ];
        this._nutritionTip = tips[Math.floor(Math.random() * tips.length)];
        this.notifyPropertyChange('nutritionTip', this._nutritionTip);
    }

    private updateNutrition() {
        this.notifyPropertyChange('remainingCalories', this.remainingCalories);
        this.notifyPropertyChange('remainingProtein', this.remainingProtein);
        this.notifyPropertyChange('remainingCarbs', this.remainingCarbs);
        this.notifyPropertyChange('caloriesProgress', this.caloriesProgress);
        this.notifyPropertyChange('proteinProgress', this.proteinProgress);
        this.notifyPropertyChange('carbsProgress', this.carbsProgress);
    }
}