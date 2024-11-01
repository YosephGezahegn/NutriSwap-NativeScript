import { Observable, Frame } from '@nativescript/core';
import { Food } from '../../models/food.model';
import { FoodService } from '../../services/food.service';
import { NutritionService } from '../../services/nutrition.service';

interface FoodItem extends Food {
    imageUrl: string;
    description: string;
    price: string;
}

export class FoodBrowseViewModel extends Observable {
    private foodService: FoodService;
    private nutritionService: NutritionService;
    private _foods: FoodItem[] = [];
    private _searchQuery: string = '';
    private _isLoading: boolean = false;
    private _activeFilters: {
        maxPrice?: number;
        dietary?: string[];
        category?: string;
    } = {};

    constructor() {
        super();
        this.foodService = new FoodService();
        this.nutritionService = global.getResource('nutritionService');
        this.loadFoods();
    }

    get foods(): FoodItem[] {
        return this._foods;
    }

    set foods(value: FoodItem[]) {
        if (this._foods !== value) {
            this._foods = value;
            this.notifyPropertyChange('foods', value);
        }
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    async loadFoods() {
        this.isLoading = true;
        try {
            const foods = await this.foodService.searchFoods(this.searchQuery || 'healthy');
            this.foods = foods.map(food => ({
                ...food,
                imageUrl: this.getFoodImage(food.name),
                description: this.generateDescription(food),
                price: this.generatePrice()
            }));
        } catch (error) {
            console.error('Failed to load foods:', error);
            // TODO: Show error message
        } finally {
            this.isLoading = false;
        }
    }

    async onSearch() {
        if (this.searchQuery.trim()) {
            await this.loadFoods();
        }
    }

    onClear() {
        this.searchQuery = '';
        this.loadFoods();
    }

    onAddFood(args) {
        const food = args.object.bindingContext;
        this.nutritionService.addFood(food);
        // Show success message
        // TODO: Implement toast notification
    }

    onFilterTap() {
        // TODO: Show filter modal
        console.log('Filter tapped');
    }

    onItemLoading(args) {
        // Implement lazy loading for images
        if (args.ios) {
            args.ios.layer.cornerRadius = 8;
        }
    }

    private getFoodImage(foodName: string): string {
        // In a real app, you would use actual food images from your API
        return `https://source.unsplash.com/300x300/?${encodeURIComponent(foodName)}`;
    }

    private generateDescription(food: Food): string {
        const benefits = [];
        
        if (food.nutrients.protein > 15) {
            benefits.push('High in protein');
        }
        if (food.nutrients.fiber > 5) {
            benefits.push('Good source of fiber');
        }
        if (food.dietaryInfo?.isVegan) {
            benefits.push('Vegan');
        }
        if (food.dietaryInfo?.isGlutenFree) {
            benefits.push('Gluten-free');
        }

        return benefits.join(' • ');
    }

    private generatePrice(): string {
        // In a real app, this would come from your API
        return `$${(Math.random() * 20 + 5).toFixed(2)}`;
    }

    applyFilters(filters: { maxPrice?: number; dietary?: string[]; category?: string }) {
        this._activeFilters = filters;
        this.loadFoods();
    }
}