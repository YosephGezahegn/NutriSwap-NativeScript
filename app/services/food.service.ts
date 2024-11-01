import { Food } from '../models/food.model';
import { Http } from '@nativescript/core';

export class FoodService {
    private readonly API_KEY = 'ff618faa597ec35d5aaf445b204f6bf2';
    private readonly APP_ID = '2a3d6a6e';
    private readonly BASE_URL = 'https://trackapi.nutritionix.com/v2';

    async searchFoods(query: string): Promise<Food[]> {
        try {
            const response = await Http.request({
                url: `${this.BASE_URL}/search/instant`,
                method: 'GET',
                headers: {
                    'x-app-id': this.APP_ID,
                    'x-app-key': this.API_KEY
                },
                parameters: {
                    query,
                    detailed: true
                }
            });

            if (response.statusCode !== 200) {
                throw new Error(`API request failed with status ${response.statusCode}`);
            }

            const data = response.content.toJSON();
            return this.transformNutritionixResults(data.branded || []);
        } catch (error) {
            console.error('Failed to fetch foods:', error);
            return [];
        }
    }

    async getNutrients(query: string): Promise<Food | null> {
        try {
            const response = await Http.request({
                url: `${this.BASE_URL}/natural/nutrients`,
                method: 'POST',
                headers: {
                    'x-app-id': this.APP_ID,
                    'x-app-key': this.API_KEY,
                    'Content-Type': 'application/json'
                },
                content: JSON.stringify({
                    query: query
                })
            });

            if (response.statusCode !== 200) {
                throw new Error(`API request failed with status ${response.statusCode}`);
            }

            const data = response.content.toJSON();
            return this.transformNaturalLanguageResult(data.foods[0]);
        } catch (error) {
            console.error('Failed to fetch nutrients:', error);
            return null;
        }
    }

    async scanBarcode(barcode: string): Promise<Food | null> {
        try {
            const response = await Http.request({
                url: `${this.BASE_URL}/search/item`,
                method: 'GET',
                headers: {
                    'x-app-id': this.APP_ID,
                    'x-app-key': this.API_KEY
                },
                parameters: {
                    upc: barcode
                }
            });

            if (response.statusCode !== 200) {
                throw new Error(`API request failed with status ${response.statusCode}`);
            }

            const data = response.content.toJSON();
            return this.transformNutritionixResults([data.foods[0]])[0];
        } catch (error) {
            console.error('Failed to fetch barcode data:', error);
            return null;
        }
    }

    private transformNutritionixResults(items: any[]): Food[] {
        return items.map(item => ({
            id: item.nix_item_id || String(Math.random()),
            name: item.food_name || item.brand_name_item_name || 'Unknown Food',
            nutrients: {
                calories: Math.round(item.nf_calories) || 0,
                protein: Math.round(item.nf_protein) || 0,
                carbs: Math.round(item.nf_total_carbohydrate) || 0,
                fat: Math.round(item.nf_total_fat) || 0,
                fiber: Math.round(item.nf_dietary_fiber) || 0
            },
            servingSize: `${item.serving_qty || 1} ${item.serving_unit || 'serving'}`,
            category: this.getCategoryFromTags(item.tags || []),
            dietaryInfo: {
                isVegetarian: this.isVegetarian(item),
                isVegan: this.isVegan(item),
                isGlutenFree: this.isGlutenFree(item),
                isDairyFree: this.isDairyFree(item)
            }
        }));
    }

    private transformNaturalLanguageResult(item: any): Food {
        return {
            id: String(Math.random()),
            name: item.food_name,
            nutrients: {
                calories: Math.round(item.nf_calories) || 0,
                protein: Math.round(item.nf_protein) || 0,
                carbs: Math.round(item.nf_total_carbohydrate) || 0,
                fat: Math.round(item.nf_total_fat) || 0,
                fiber: Math.round(item.nf_dietary_fiber) || 0
            },
            servingSize: `${item.serving_qty} ${item.serving_unit}`,
            category: this.getCategoryFromTags(item.tags || []),
            dietaryInfo: {
                isVegetarian: this.isVegetarian(item),
                isVegan: this.isVegan(item),
                isGlutenFree: this.isGlutenFree(item),
                isDairyFree: this.isDairyFree(item)
            }
        };
    }

    private getCategoryFromTags(tags: string[]): string {
        const categoryMap: { [key: string]: string } = {
            'breakfast': 'Breakfast',
            'lunch': 'Lunch',
            'dinner': 'Dinner',
            'snack': 'Snack'
        };

        for (const tag of tags) {
            const category = categoryMap[tag.toLowerCase()];
            if (category) return category;
        }

        return 'Other';
    }

    private isVegetarian(food: any): boolean {
        const nonVegKeywords = ['meat', 'chicken', 'beef', 'pork', 'fish'];
        const name = (food.food_name || '').toLowerCase();
        return !nonVegKeywords.some(keyword => name.includes(keyword));
    }

    private isVegan(food: any): boolean {
        const nonVeganKeywords = ['meat', 'chicken', 'beef', 'pork', 'fish', 'milk', 'cheese', 'egg'];
        const name = (food.food_name || '').toLowerCase();
        return !nonVeganKeywords.some(keyword => name.includes(keyword));
    }

    private isGlutenFree(food: any): boolean {
        const glutenKeywords = ['wheat', 'bread', 'pasta', 'flour'];
        const name = (food.food_name || '').toLowerCase();
        return !glutenKeywords.some(keyword => name.includes(keyword));
    }

    private isDairyFree(food: any): boolean {
        const dairyKeywords = ['milk', 'cheese', 'yogurt', 'cream'];
        const name = (food.food_name || '').toLowerCase();
        return !dairyKeywords.some(keyword => name.includes(keyword));
    }
}