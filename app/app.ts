import { Application } from '@nativescript/core';
import { NutritionService } from './services/nutrition.service';

// Register services as globals
Application.setResource('nutritionService', new NutritionService());

Application.run({ moduleName: 'app-root' });