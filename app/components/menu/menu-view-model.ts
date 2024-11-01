import { Observable } from '@nativescript/core';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    calories: number;
    dietaryInfo: string;
}

export class MenuViewModel extends Observable {
    private _selectedCategory: string = 'breakfast';
    private _menuItems: MenuItem[] = [
        {
            id: '1',
            name: 'Classic Eggs Benedict',
            description: 'Poached eggs, Canadian bacon, hollandaise sauce on English muffins',
            price: '$14.99',
            imageUrl: 'https://source.unsplash.com/300x300/?eggs-benedict',
            category: 'breakfast',
            calories: 650,
            dietaryInfo: 'Contains eggs & gluten'
        },
        {
            id: '2',
            name: 'Avocado Toast',
            description: 'Smashed avocado, cherry tomatoes, microgreens on sourdough',
            price: '$12.99',
            imageUrl: 'https://source.unsplash.com/300x300/?avocado-toast',
            category: 'breakfast',
            calories: 420,
            dietaryInfo: 'Vegetarian'
        },
        {
            id: '3',
            name: 'Grilled Salmon Bowl',
            description: 'Fresh salmon, quinoa, roasted vegetables, lemon-dill sauce',
            price: '$18.99',
            imageUrl: 'https://source.unsplash.com/300x300/?salmon-bowl',
            category: 'lunch',
            calories: 580,
            dietaryInfo: 'Gluten-free'
        },
        {
            id: '4',
            name: 'Mediterranean Salad',
            description: 'Mixed greens, feta, olives, cucumbers, red onions, Greek dressing',
            price: '$13.99',
            imageUrl: 'https://source.unsplash.com/300x300/?greek-salad',
            category: 'lunch',
            calories: 380,
            dietaryInfo: 'Vegetarian'
        },
        {
            id: '5',
            name: 'Filet Mignon',
            description: '8oz grass-fed beef, garlic mashed potatoes, seasonal vegetables',
            price: '$34.99',
            imageUrl: 'https://source.unsplash.com/300x300/?steak',
            category: 'dinner',
            calories: 820,
            dietaryInfo: 'Gluten-free'
        },
        {
            id: '6',
            name: 'Mushroom Risotto',
            description: 'Arborio rice, wild mushrooms, parmesan, truffle oil',
            price: '$22.99',
            imageUrl: 'https://source.unsplash.com/300x300/?risotto',
            category: 'dinner',
            calories: 620,
            dietaryInfo: 'Vegetarian'
        }
    ];

    constructor() {
        super();
    }

    get selectedCategory(): string {
        return this._selectedCategory;
    }

    set selectedCategory(value: string) {
        if (this._selectedCategory !== value) {
            this._selectedCategory = value;
            this.notifyPropertyChange('selectedCategory', value);
            this.notifyPropertyChange('filteredMenuItems', this.filteredMenuItems);
        }
    }

    get filteredMenuItems(): MenuItem[] {
        return this._menuItems.filter(item => item.category === this._selectedCategory);
    }

    selectCategory(args) {
        const button = args.object;
        const category = button.text.toLowerCase();
        console.log('Category selected:', category); // Debug log
        this.selectedCategory = category;
    }
}