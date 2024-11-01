import { NavigatedData, Page } from '@nativescript/core';
import { FoodSwapViewModel } from './food-swap-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const currentFood = page.navigationContext.food;
    page.bindingContext = new FoodSwapViewModel(currentFood);
}