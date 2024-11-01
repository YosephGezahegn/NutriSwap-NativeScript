import { NavigatedData, Page } from '@nativescript/core';
import { FoodBrowseViewModel } from './food-browse-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new FoodBrowseViewModel();
    }
}