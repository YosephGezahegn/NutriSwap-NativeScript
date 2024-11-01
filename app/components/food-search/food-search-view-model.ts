import { Observable, Frame } from '@nativescript/core';
import { Food } from '../../models/food.model';
import { NutritionService } from '../../services/nutrition.service';
import { FoodService } from '../../services/food.service';

export class FoodSearchViewModel extends Observable {
    private nutritionService: NutritionService;
    private foodService: FoodService;
    private _searchQuery: string = '';
    private _searchResults: Food[] = [];
    private _isLoading: boolean = false;

    constructor() {
        super();
        this.nutritionService = global.getResource('nutritionService');
        this.foodService = new FoodService();
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

    get searchResults(): Food[] {
        return this._searchResults;
    }

    set searchResults(value: Food[]) {
        if (this._searchResults !== value) {
            this._searchResults = value;
            this.notifyPropertyChange('searchResults', value);
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

    async onSearch() {
        if (this.searchQuery.trim()) {
            this.isLoading = true;
            try {
                this.searchResults = await this.foodService.searchFoods(this.searchQuery);
            } catch (error) {
                console.error('Search failed:', error);
                // TODO: Show error message to user
            } finally {
                this.isLoading = false;
            }
        }
    }

    onClear() {
        this.searchQuery = '';
        this.searchResults = [];
    }

    async onAddFood(args) {
        const food = args.object.bindingContext;
        this.isLoading = true;
        
        try {
            // Get detailed nutrients for the selected food
            const detailedFood = await this.foodService.getNutrients(food.name);
            if (detailedFood) {
                this.nutritionService.addFood(detailedFood);
            } else {
                this.nutritionService.addFood(food);
            }
            Frame.topmost().goBack();
        } catch (error) {
            console.error('Failed to add food:', error);
            // Fallback to adding the basic food info
            this.nutritionService.addFood(food);
            Frame.topmost().goBack();
        } finally {
            this.isLoading = false;
        }
    }

    async onScanBarcode() {
        try {
            // TODO: Implement actual barcode scanning
            const mockBarcode = '009800146130'; // Example barcode
            const result = await this.foodService.scanBarcode(mockBarcode);
            if (result) {
                this.searchResults = [result];
            }
        } catch (error) {
            console.error('Barcode scanning failed:', error);
        }
    }
}