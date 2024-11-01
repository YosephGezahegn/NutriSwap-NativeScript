import { NavigatedData, Page } from '@nativescript/core';
import { FoodSearchViewModel } from './food-search-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new FoodSearchViewModel();
}