import { NavigatedData, Page } from '@nativescript/core';
import { MenuViewModel } from './menu-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new MenuViewModel();
    }
}