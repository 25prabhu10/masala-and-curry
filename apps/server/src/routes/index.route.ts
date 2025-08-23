import { createRoute } from '@hono/zod-openapi'
import { createDb } from '@mac/db'
import {
  allergen,
  category,
  menuAvailability,
  menuItem,
  menuItemAllergen,
  menuItemVariant,
} from '@mac/db/schemas'
import { API_SERVER_DESCRIPTION } from '@mac/resources/app'
import { INTERNAL_SERVER_ERROR, OK } from '@mac/resources/http-status-codes'
import { HTTPException } from 'hono/http-exception'

import createRouter from '@/lib/create-router'
import { jsonContent } from '@/lib/openapi/helpers'
import { createMessageObjectSchema } from '@/lib/openapi/schemas'

const router = createRouter()
  .openapi(
    createRoute({
      description: API_SERVER_DESCRIPTION,
      method: 'get',
      path: '/',
      responses: {
        [OK]: jsonContent(
          createMessageObjectSchema(API_SERVER_DESCRIPTION),
          API_SERVER_DESCRIPTION
        ),
      },
      summary: 'API Server',
      tags: ['Index'],
    }),
    (c) =>
      c.json(
        {
          message: API_SERVER_DESCRIPTION,
        },
        OK
      )
  )
  .openapi(
    createRoute({
      description: 'Seed data for the D1 database',
      method: 'get',
      path: '/seed',
      responses: {
        [OK]: jsonContent(
          createMessageObjectSchema('Seed data for the D1 database'),
          'Seed data for the D1 database'
        ),
      },
      summary: 'Seed data for the D1 database',
      tags: ['Database'],
    }),
    async (c) => {
      try {
        const db = await createDb(c.env.DB)

        const startTime = Date.now()

        // Clear existing data (in development environments)
        await db.delete(menuItemAllergen)
        await db.delete(menuItemVariant)
        await db.delete(menuAvailability)
        await db.delete(menuItem)
        await db.delete(allergen)
        await db.delete(category)

        // Insert Categories
        const categoryItems = await db
          .insert(category)
          .values([
            {
              description: 'Traditional Indian teas, lassis, and refreshing beverages',
              displayOrder: 1,
              isActive: true,
              name: 'Drinks',
            },
            {
              description:
                'Start your meal with our delicious vegetarian and non-vegetarian appetizers',
              displayOrder: 2,
              isActive: true,
              name: 'Appetizers',
            },
            {
              description: 'Comforting and nourishing soups with authentic flavors',
              displayOrder: 3,
              isActive: true,
              name: 'Soups',
            },
            {
              description: 'Rich and flavorful vegetarian curries and specialties',
              displayOrder: 4,
              isActive: true,
              name: 'Vegetarian Entrees',
            },
            {
              description: 'Authentic meat and seafood dishes with bold spices',
              displayOrder: 5,
              isActive: true,
              name: 'Non-Vegetarian Entrees',
            },
            {
              description: 'Freshly baked naan, roti, and Indian flatbreads',
              displayOrder: 6,
              isActive: true,
              name: 'Breads',
            },
            {
              description: 'Aromatic basmati rice dishes and layered biryanis',
              displayOrder: 7,
              isActive: true,
              name: 'Rice & Biryani',
            },
            {
              description: 'Clay oven specialties with perfect char and smoky flavors',
              displayOrder: 8,
              isActive: true,
              name: 'Tandoor & Kebabs',
            },
            {
              description: 'Authentic Nepali dishes including momos and noodles',
              displayOrder: 9,
              isActive: true,
              name: 'Nepali Entrees',
            },
            {
              description: 'Traditional sweets, sides, and accompaniments',
              displayOrder: 10,
              isActive: true,
              name: 'Desserts & Sides',
            },
          ])
          .returning()

        // Insert Allergens
        const allergenItems = await db
          .insert(allergen)
          .values([
            { isActive: true, name: 'Dairy' },
            { isActive: true, name: 'Nuts' },
            { isActive: true, name: 'Gluten' },
            { isActive: true, name: 'Soy' },
            { isActive: true, name: 'Eggs' },
            { isActive: true, name: 'Mustard' },
            { isActive: true, name: 'Sesame' },
            { isActive: true, name: 'Sulfites' },
          ])
          .returning()

        const drinksId = categoryItems.find((c) => c.name === 'Drinks')?.id || ''
        const appetizersId = categoryItems.find((c) => c.name === 'Appetizers')?.id || ''
        const soupsId = categoryItems.find((c) => c.name === 'Soups')?.id || ''
        const vegId = categoryItems.find((c) => c.name === 'Vegetarian Entrees')?.id || ''
        const nonVegId = categoryItems.find((c) => c.name === 'Non-Vegetarian Entrees')?.id || ''
        const breadsId = categoryItems.find((c) => c.name === 'Breads')?.id || ''
        const riceBiryaniId = categoryItems.find((c) => c.name === 'Rice & Biryani')?.id || ''
        const tandoorId = categoryItems.find((c) => c.name === 'Tandoor & Kebabs')?.id || ''
        const nepaliId = categoryItems.find((c) => c.name === 'Nepali Entrees')?.id || ''
        const dessertsId = categoryItems.find((c) => c.name === 'Desserts & Sides')?.id || ''

        // Insert Menu Items - Beverages
        const menuItem1 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 4,
              calories: 25,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Warm lemon flavored tea, sweetened with sugar, GLUTEN FREE',
              displayOrder: 1,
              ingredients: 'Black tea, lemon, sugar',
              isAvailable: true,
              isPopular: false,
              isVegan: true,
              isVegetarian: true,
              name: 'Indian Lemon Tea',
              preparationTime: 5,
              spiceLevel: 0,
            },
            {
              basePrice: 4,
              calories: 80,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Spiced milk tea with black tea & spices (Vegan upon request)',
              displayOrder: 2,
              ingredients: 'Black tea, milk, cardamom, cinnamon, ginger, cloves',
              isAvailable: true,
              isPopular: true,
              isVegan: false,
              isVegetarian: true,
              name: 'Indian Masala Tea',
              preparationTime: 8,
              spiceLevel: 1,
            },
            {
              basePrice: 4.99,
              calories: 150,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Mangoes, yogurt, and hint of cardamom',
              displayOrder: 3,
              ingredients: 'Mango, yogurt, cardamom, sugar',
              isAvailable: true,
              isPopular: true,
              isVegan: false,
              isVegetarian: true,
              name: 'Mango Lassi',
              preparationTime: 5,
              spiceLevel: 0,
            },
            {
              basePrice: 4.99,
              calories: 140,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Rooh Afza, yogurt, and hint of cardamom',
              displayOrder: 4,
              ingredients: 'Rooh Afza, yogurt, cardamom, sugar',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Rose Lassi',
              preparationTime: 5,
              spiceLevel: 0,
            },
            {
              basePrice: 4.99,
              calories: 120,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Black salt, cumin powder, and yogurt',
              displayOrder: 5,
              ingredients: 'Yogurt, black salt, cumin powder, mint',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Salt Lassi',
              preparationTime: 5,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItem2 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 4.99,
              calories: 140,
              categoryId: drinksId,
              currency: 'USD',
              description: 'Coke, Sprite, Diet Coke, Lemonade, Pepsi, Dr. Pepper',
              displayOrder: 6,
              ingredients: 'Carbonated beverages',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Soft Drinks',
              preparationTime: 2,
              spiceLevel: 0,
            },
            {
              basePrice: 7,
              calories: 180,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Spiced potatoes and peas in crispy pastry with chutney',
              displayOrder: 1,
              ingredients: 'Potatoes, green peas, onions, cumin, coriander, pastry',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Vegetable Samosa',
              preparationTime: 15,
              spiceLevel: 1,
            },
            {
              basePrice: 7,
              calories: 200,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Onion fritters in chickpea flour batter',
              displayOrder: 2,
              ingredients: 'Onions, chickpea flour, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Onion Bhaji',
              preparationTime: 12,
              spiceLevel: 2,
            },
            {
              basePrice: 7,
              calories: 220,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Crispy fritters made with mixed vegetables and spiced chickpea flour batter',
              displayOrder: 3,
              ingredients: 'Mixed vegetables, chickpea flour, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Vegetable Pakodas',
              preparationTime: 12,
              spiceLevel: 2,
            },
            {
              basePrice: 9,
              calories: 180,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Cauliflower sautéed with garlic, ginger, spices',
              displayOrder: 4,
              ingredients: 'Cauliflower, garlic, ginger, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Lasoni Gobi',
              preparationTime: 15,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem3 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 9,
              calories: 250,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Fried mushrooms in tangy soy-garlic sauce',
              displayOrder: 5,
              ingredients: 'Mushrooms, soy sauce, garlic, ginger, bell peppers',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Mushroom Manchurian',
              preparationTime: 18,
              spiceLevel: 2,
            },
            {
              basePrice: 9,
              calories: 300,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Samosa pieces with yogurt, chutney, onions, tomatoes, pomegranate',
              displayOrder: 6,
              ingredients: 'Samosa, yogurt, chutney, onions, tomatoes, pomegranate',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Samosa Chaat',
              preparationTime: 10,
              spiceLevel: 1,
            },
            {
              basePrice: 8,
              calories: 150,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Crispy puris filled with spiced potatoes and chilled tangy water — a fun burst of flavor',
              displayOrder: 7,
              ingredients: 'Puri, potatoes, tamarind water, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Panipuri',
              preparationTime: 8,
              spiceLevel: 2,
            },
            {
              basePrice: 9,
              calories: 200,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Puffed rice tossed with potatoes, chutneys, and spices — crunchy, tangy, and bold',
              displayOrder: 8,
              ingredients: 'Puffed rice, potatoes, chutneys, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Chatpat',
              preparationTime: 8,
              spiceLevel: 2,
            },
            {
              basePrice: 8,
              calories: 280,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Crispy potato patties topped with yogurt, chutneys, and spices for a burst of flavors',
              displayOrder: 9,
              ingredients: 'Potato patties, yogurt, chutneys, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Aloo Tikki Chaat',
              preparationTime: 12,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem4 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 9,
              calories: 320,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Juicy chicken bites coated in spiced chickpea batter - crispy, golden, and full of flavor',
              displayOrder: 10,
              ingredients: 'Chicken, chickpea flour, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Pakodas',
              preparationTime: 15,
              spiceLevel: 3,
            },
            {
              basePrice: 10.99,
              calories: 280,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Tender shrimp dipped in a seasoned chickpea batter - crisp, spiced, and irresistibly savory',
              displayOrder: 11,
              ingredients: 'Shrimp, chickpea flour, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Pakodas',
              preparationTime: 15,
              spiceLevel: 3,
            },
            {
              basePrice: 10,
              calories: 400,
              categoryId: appetizersId,
              currency: 'USD',
              description:
                'Crispy chicken wings tossed in bold Indian spices - smoky, tangy, and full of kick',
              displayOrder: 12,
              ingredients: 'Chicken wings, Indian spices, yogurt marinade',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Masala Wings',
              preparationTime: 20,
              spiceLevel: 3,
            },
            {
              basePrice: 10.99,
              calories: 800,
              categoryId: appetizersId,
              currency: 'USD',
              description: 'Combination of veg samosa, veg pakodas, chicken pakodas and aloo tikki',
              displayOrder: 13,
              ingredients: 'Samosa, pakodas, aloo tikki, chutneys',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Appetizers Basket',
              preparationTime: 20,
              spiceLevel: 2,
            },
            {
              basePrice: 7.99,
              calories: 150,
              categoryId: soupsId,
              currency: 'USD',
              description:
                'Comforting lentil broth simmered with spices and herbs - light, warm, and nourishing',
              displayOrder: 1,
              ingredients: 'Lentils, turmeric, cumin, ginger, garlic',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Daal Soup',
              preparationTime: 15,
              spiceLevel: 1,
            },
          ])
          .returning()

        const menuItem5 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 7.99,
              calories: 120,
              categoryId: soupsId,
              currency: 'USD',
              description:
                'Creamy tomato blend with garlic and herbs - smooth, tangy, and soul-warming',
              displayOrder: 2,
              ingredients: 'Tomatoes, cream, garlic, herbs',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Tomato Soup',
              preparationTime: 12,
              spiceLevel: 1,
            },
            {
              basePrice: 7.99,
              calories: 180,
              categoryId: soupsId,
              currency: 'USD',
              description:
                'Hearty chicken and lentil broth with aromatic spices - warm, comforting, and deliciously mild',
              displayOrder: 3,
              ingredients: 'Chicken, lentils, coconut milk, curry spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Mulligatawny Soup',
              preparationTime: 20,
              spiceLevel: 1,
            },
          ])
          .returning()

        const menuItem6 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 7.99,
              calories: 160,
              categoryId: soupsId,
              currency: 'USD',
              description:
                'Smooth coconut broth simmered with fresh vegetables and mild spices - creamy, comforting, and gently aromatic',
              displayOrder: 4,
              ingredients: 'Coconut milk, mixed vegetables, mild spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Vegi-Coconut Soup',
              preparationTime: 15,
              spiceLevel: 1,
            },
            {
              basePrice: 15,
              calories: 220,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Spiced potatoes and cauliflower simmered in fragrant turmeric and cumin - comforting and flavorful',
              displayOrder: 1,
              ingredients: 'Potatoes, cauliflower, turmeric, cumin, coriander',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Aloo Gobi',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 250,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Tender potatoes and green peas cooked in a savory tomato gravy - classic, hearty, and mild',
              displayOrder: 2,
              ingredients: 'Potatoes, green peas, tomatoes, onions, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Aloo Matar',
              preparationTime: 25,
              spiceLevel: 1,
            },
            {
              basePrice: 15,
              calories: 200,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Smoky roasted eggplant mashed with onions and spices - rich, earthy, and satisfying',
              displayOrder: 3,
              ingredients: 'Eggplant, onions, tomatoes, ginger, garlic, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Baingan Bharta',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 380,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Soft paneer and potato dumplings in a creamy, spiced tomato gravy - indulgent and comforting',
              displayOrder: 4,
              ingredients: 'Paneer, potatoes, cashews, cream, tomatoes, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Malai Kofta',
              preparationTime: 35,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem7 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 15,
              calories: 350,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Slow-cooked black lentils in a buttery, spiced tomato sauce - rich, hearty, and protein-packed',
              displayOrder: 5,
              ingredients: 'Black lentils, kidney beans, butter, cream, tomatoes, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Dal Makhani',
              preparationTime: 40,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 280,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Yellow lentils tempered with garlic, cumin, and mustard seeds - simple, flavorful, and warming',
              displayOrder: 6,
              ingredients: 'Yellow lentils, garlic, cumin, mustard seeds, turmeric',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Dal Tadka',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 180,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Crispy okra sautéed with aromatic spices - crunchy, savory, and perfectly spiced',
              displayOrder: 7,
              ingredients: 'Okra, onions, tomatoes, coriander, turmeric',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Bhindi Masala',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 17,
              calories: 320,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Soft paneer cubes and green peas in a mild, creamy tomato sauce - comforting and rich',
              displayOrder: 8,
              ingredients: 'Paneer, green peas, tomatoes, cream, mild spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Matar Paneer',
              preparationTime: 25,
              spiceLevel: 1,
            },
            {
              basePrice: 17,
              calories: 380,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Paneer cubes in a luxurious creamy gravy with cashews and mild spices - rich, smooth, and elegant',
              displayOrder: 9,
              ingredients: 'Paneer, cashews, cream, mild spices, saffron',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Shahi Paneer',
              preparationTime: 30,
              spiceLevel: 1,
            },
          ])
          .returning()

        const menuItem8 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 18,
              calories: 320,
              categoryId: vegId,
              currency: 'USD',
              description: 'Slow-cooked leafy greens blended with spices and paneer cubes',
              displayOrder: 10,
              ingredients: 'Paneer, spinach, onions, ginger, garlic, cream',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Saag Paneer',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 17,
              calories: 280,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Chickpeas cooked with onions, tomatoes, and warming spices - hearty and full of flavor',
              displayOrder: 11,
              ingredients: 'Chickpeas, tomatoes, onions, ginger, garlic, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Chana Masala',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 18,
              calories: 380,
              categoryId: vegId,
              currency: 'USD',
              description:
                'Paneer cubes in a velvety tomato butter sauce - creamy, mild, flavorful and crowd-pleasing',
              displayOrder: 12,
              ingredients: 'Paneer, tomatoes, cream, butter, cashews, garam masala',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Paneer Makhani',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 420,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Slow-cooked chicken in a velvety tomato-butter sauce, finished with cream and a hint of smoky spice',
              displayOrder: 1,
              ingredients: 'Chicken, tomatoes, cream, butter, cashews, garam masala',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Butter Chicken',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 20,
              calories: 450,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Char-grilled chicken simmered in a creamy, spiced tomato sauce-rich, smoky, and full of flavor',
              displayOrder: 2,
              ingredients: 'Chicken tikka, tomatoes, onions, cream, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Tikka Masala',
              preparationTime: 35,
              spiceLevel: 3,
            },
          ])
          .returning()

        const menuItem9 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 18,
              calories: 380,
              categoryId: nonVegId,
              currency: 'USD',
              description: 'Slow-cooked leafy greens blended with spices and tender chicken pieces',
              displayOrder: 3,
              ingredients: 'Chicken, spinach, onions, ginger, garlic, cream',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Saag',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 480,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Rich, creamy curry made with chicken simmered in yogurt, cream, and aromatic spices - smooth and indulgent',
              displayOrder: 4,
              ingredients: 'Chicken, yogurt, cashews, almonds, coconut, mild spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Korma',
              preparationTime: 35,
              spiceLevel: 1,
            },
            {
              basePrice: 17,
              calories: 400,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Tangy, spicy curry with marinated chicken cooked slow in a vinegar and chili sauce - bold, fiery, and flavorful',
              displayOrder: 5,
              ingredients: 'Chicken, vinegar, red chilies, garlic, ginger, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Vindaloo',
              preparationTime: 30,
              spiceLevel: 4,
            },
            {
              basePrice: 17,
              calories: 380,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Spicy, smoky curry with chicken cooked in a traditional wok - bold and flavorful',
              displayOrder: 6,
              ingredients: 'Chicken, bell peppers, onions, tomatoes, kadai spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Kadai',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 17,
              calories: 360,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Stir-fried chicken tossed with bell peppers and bold spices - tangy, spicy, and vibrant',
              displayOrder: 7,
              ingredients: 'Chicken, bell peppers, onions, tomatoes, jalfrezi spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Jalfrezi',
              preparationTime: 25,
              spiceLevel: 3,
            },
          ])
          .returning()

        const menuItem10 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 20,
              calories: 380,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Classic spiced gravy with tender chicken - savory, aromatic, and full of flavor',
              displayOrder: 8,
              ingredients: 'Chicken, onions, tomatoes, ginger, garlic, curry spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Curry',
              preparationTime: 25,
              spiceLevel: 3,
            },
          ])
          .returning()

        const menuItem11 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 18,
              calories: 450,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Creamy coconut-based curry with tender chicken - mild, aromatic, and comforting',
              displayOrder: 9,
              ingredients: 'Chicken, coconut milk, curry leaves, mild spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Coconut Curry',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 420,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Slow-cooked chicken in a rich, spiced tomato and yogurt gravy - bold, hearty, and deeply aromatic',
              displayOrder: 10,
              ingredients: 'Chicken, yogurt, tomatoes, Kashmiri spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Rogan Josh',
              preparationTime: 35,
              spiceLevel: 3,
            },
            {
              basePrice: 19,
              calories: 400,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Tender chicken simmered in a rich tomato-based curry with a perfect blend of sweet, sour, and mild heat',
              displayOrder: 11,
              ingredients: 'Chicken, tomatoes, tamarind, jaggery, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Pathia',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 19,
              calories: 440,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'A royal-style chicken dish slow-cooked in a rich, spiced gravy-flavorful, aromatic, and indulgent',
              displayOrder: 12,
              ingredients: 'Chicken, royal spices, rich gravy, aromatics',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Shehshan',
              preparationTime: 35,
              spiceLevel: 3,
            },
            {
              basePrice: 18,
              calories: 420,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Crispy chicken glazed in a sweet and tangy honey sauce with a hint of garlic',
              displayOrder: 13,
              ingredients: 'Chicken, honey, garlic, ginger, soy sauce',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Honey Chicken',
              preparationTime: 25,
              spiceLevel: 1,
            },
          ])
          .returning()

        const menuItem12 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 22,
              calories: 520,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Tender lamb in a velvety tomato butter sauce - creamy, mild, flavorful and crowd-pleasing',
              displayOrder: 14,
              ingredients: 'Lamb, tomatoes, cream, butter, cashews, garam masala',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Lamb Makhani',
              preparationTime: 45,
              spiceLevel: 2,
            },
            {
              basePrice: 20,
              calories: 500,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Classic spiced gravy with tender lamb - savory, aromatic, and full of flavor',
              displayOrder: 15,
              ingredients: 'Lamb, onions, tomatoes, ginger, garlic, curry spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Lamb Curry',
              preparationTime: 45,
              spiceLevel: 3,
            },
            {
              basePrice: 20,
              calories: 550,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Slow-cooked lamb in a rich, spiced tomato and yogurt gravy - bold, hearty, and deeply aromatic',
              displayOrder: 16,
              ingredients: 'Lamb, yogurt, fennel, ginger, Kashmiri red chili, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Lamb Rogan Josh',
              preparationTime: 50,
              spiceLevel: 3,
            },
            {
              basePrice: 20,
              calories: 320,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Tender shrimp in a velvety tomato butter sauce - creamy, mild, flavorful and crowd-pleasing',
              displayOrder: 17,
              ingredients: 'Shrimp, tomatoes, cream, butter, cashews, garam masala',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Makhani',
              preparationTime: 20,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 300,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Classic spiced gravy with tender shrimp - savory, aromatic, and full of flavor',
              displayOrder: 18,
              ingredients: 'Shrimp, onions, tomatoes, ginger, garlic, curry spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Curry',
              preparationTime: 20,
              spiceLevel: 3,
            },
          ])
          .returning()

        const menuItem13 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 20,
              calories: 380,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Tender salmon in a velvety tomato butter sauce - creamy, mild, flavorful and crowd-pleasing',
              displayOrder: 19,
              ingredients: 'Salmon, tomatoes, cream, butter, cashews, garam masala',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Salmon Makhani',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 22,
              calories: 400,
              categoryId: nonVegId,
              currency: 'USD',
              description:
                'Salmon fillets cooked in a rich, spiced tomato-based curry - flavorful and elegant',
              displayOrder: 20,
              ingredients: 'Salmon, tomatoes, onions, curry spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Salmon Masala',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 3.5,
              calories: 200,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'Soft tandoor-baked flatbread brushed with butter - warm, fluffy, and comforting',
              displayOrder: 1,
              ingredients: 'Flour, yogurt, baking powder, butter',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Butter Naan',
              preparationTime: 8,
              spiceLevel: 0,
            },
            {
              basePrice: 4,
              calories: 220,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Classic naan topped with garlic and herbs - aromatic, soft, and savory',
              displayOrder: 2,
              ingredients: 'Flour, yogurt, garlic, cilantro, butter',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Garlic Naan',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5,
              calories: 280,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'Naan stuffed with melted cheese and garlic - rich, gooey, and flavorful',
              displayOrder: 3,
              ingredients: 'Flour, yogurt, cheese, garlic, herbs',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Garlic Cheese Naan',
              preparationTime: 12,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItem14 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 5,
              calories: 250,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Soft naan filled with sweet coconut - lightly crisp, nutty, and unique',
              displayOrder: 4,
              ingredients: 'Flour, yogurt, coconut, sugar',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Coconut Naan',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5,
              calories: 300,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Stuffed with cheese and spicy jalapenos - melty, bold, and fiery',
              displayOrder: 5,
              ingredients: 'Flour, cheese, jalapenos, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Cheese and Jalapeno Naan',
              preparationTime: 12,
              spiceLevel: 3,
            },
            {
              basePrice: 4.5,
              calories: 240,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'Leavened bread stuffed with spiced onions - soft, savory, and satisfying',
              displayOrder: 6,
              ingredients: 'Flour, onions, spices, yogurt',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Onion Kulcha',
              preparationTime: 12,
              spiceLevel: 1,
            },
            {
              basePrice: 5,
              calories: 260,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Naan filled with sweet dates - soft, warm, and mildly sweet',
              displayOrder: 7,
              ingredients: 'Flour, dates, sugar, butter',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Dates Naan',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5,
              calories: 280,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Stuffed with melty cheese - soft, rich, and comforting',
              displayOrder: 8,
              ingredients: 'Flour, mozzarella cheese, herbs',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Cheese Naan',
              preparationTime: 10,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItem15 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 3.5,
              calories: 120,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'Whole wheat flatbread cooked in the tandoor - rustic, light, and earthy',
              displayOrder: 9,
              ingredients: 'Whole wheat flour, water, salt',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Roti',
              preparationTime: 5,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItem16 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 4,
              calories: 250,
              categoryId: breadsId,
              currency: 'USD',
              description: 'Flaky layered flatbread - buttery, crisp, and golden',
              displayOrder: 10,
              ingredients: 'Whole wheat flour, ghee, salt',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Plain Paratha',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5,
              calories: 300,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'Paratha stuffed with spiced mashed potatoes - hearty, warm, and flavorful',
              displayOrder: 11,
              ingredients: 'Whole wheat flour, potatoes, spices, ghee',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Aloo Paratha',
              preparationTime: 15,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem17 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 10,
              calories: 700,
              categoryId: breadsId,
              currency: 'USD',
              description:
                'A mix of butter, garlic, and cheese naan - perfect for sharing and pairing',
              displayOrder: 12,
              ingredients: 'Butter naan, garlic naan, cheese naan',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Breads Basket',
              preparationTime: 15,
              spiceLevel: 0,
            },
            {
              basePrice: 4,
              calories: 220,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Fragrant basmati rice with toasted cumin seeds - light, earthy, and flavorful',
              displayOrder: 1,
              ingredients: 'Basmati rice, cumin seeds, ghee, salt',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Jeera Rice',
              preparationTime: 20,
              spiceLevel: 0,
            },
            {
              basePrice: 16,
              calories: 400,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Stir-fried basmati rice with chicken - savory, aromatic, and satisfying',
              displayOrder: 2,
              ingredients: 'Basmati rice, chicken, eggs, vegetables, soy sauce',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Fried Rice',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 350,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description: 'Stir-fried basmati rice with eggs - savory, aromatic, and satisfying',
              displayOrder: 3,
              ingredients: 'Basmati rice, eggs, vegetables, soy sauce',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Egg Fried Rice',
              preparationTime: 20,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 380,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description: 'Stir-fried basmati rice with shrimp - savory, aromatic, and satisfying',
              displayOrder: 4,
              ingredients: 'Basmati rice, shrimp, vegetables, soy sauce',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Fried Rice',
              preparationTime: 25,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem18 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 14,
              calories: 450,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Aromatic basmati rice layered with spiced vegetables - rich, fragrant, and full of flavor',
              displayOrder: 5,
              ingredients: 'Basmati rice, mixed vegetables, saffron, biryani spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Veg Biryani',
              preparationTime: 40,
              spiceLevel: 2,
            },
            {
              basePrice: 18,
              calories: 550,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Aromatic basmati rice layered with spiced chicken - rich, fragrant, and full of flavor',
              displayOrder: 6,
              ingredients: 'Basmati rice, chicken, yogurt, saffron, biryani spices, fried onions',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Biryani',
              preparationTime: 45,
              spiceLevel: 3,
            },
            {
              basePrice: 20,
              calories: 500,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Aromatic basmati rice layered with spiced shrimp - rich, fragrant, and full of flavor',
              displayOrder: 7,
              ingredients: 'Basmati rice, shrimp, saffron, biryani spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Biryani',
              preparationTime: 40,
              spiceLevel: 3,
            },
            {
              basePrice: 20,
              calories: 620,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Aromatic basmati rice layered with spiced lamb - rich, fragrant, and full of flavor',
              displayOrder: 8,
              ingredients: 'Basmati rice, lamb, yogurt, saffron, whole spices, mint',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Lamb Biryani',
              preparationTime: 55,
              spiceLevel: 3,
            },
            {
              basePrice: 19,
              calories: 480,
              categoryId: riceBiryaniId,
              currency: 'USD',
              description:
                'Aromatic basmati rice layered with spiced paneer - rich, fragrant, and full of flavor',
              displayOrder: 9,
              ingredients: 'Basmati rice, paneer, saffron, biryani spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Paneer Biryani',
              preparationTime: 40,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem19 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 18,
              calories: 400,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Chicken marinated in yogurt and bold spices, then cooked in a blazing clay oven for that perfect outer char and juicy interior',
              displayOrder: 1,
              ingredients: 'Chicken with bone, yogurt, tandoori spices, garam masala',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Tandoori (with bone)',
              preparationTime: 35,
              spiceLevel: 3,
            },
            {
              basePrice: 22,
              calories: 350,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Salmon marinated in yogurt and bold spices, then cooked in a blazing clay oven for that perfect outer char and juicy interior',
              displayOrder: 2,
              ingredients: 'Salmon, yogurt, tandoori spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Salmon Tandoori',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 22,
              calories: 280,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Shrimp marinated in yogurt and bold spices, then cooked in a blazing clay oven for that perfect outer char and juicy interior',
              displayOrder: 3,
              ingredients: 'Shrimp, yogurt, tandoori spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Shrimp Tandoori',
              preparationTime: 20,
              spiceLevel: 3,
            },
            {
              basePrice: 17,
              calories: 250,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Tofu marinated in yogurt and bold spices, then cooked in a blazing clay oven for that perfect outer char and juicy interior',
              displayOrder: 4,
              ingredients: 'Tofu, yogurt, tandoori spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Tofu Tandoori',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 18,
              calories: 300,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Paneer marinated in yogurt and bold spices, then cooked in a blazing clay oven for that perfect outer char and juicy interior',
              displayOrder: 5,
              ingredients: 'Paneer, yogurt, tandoori spices, herbs',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Paneer Tandoori',
              preparationTime: 25,
              spiceLevel: 3,
            },
          ])
          .returning()

        const menuItem20 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 20,
              calories: 320,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Boneless chicken pieces marinated with aromatic spices and grilled to perfection - juicy, spicy, and charred',
              displayOrder: 6,
              ingredients: 'Chicken breast, yogurt, tandoori masala, garlic, ginger',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Tikka Kabab (boneless)',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 20,
              calories: 340,
              categoryId: tandoorId,
              currency: 'USD',
              description:
                'Boneless chicken pieces marinated with aromatic spices and grilled to perfection - juicy, spicy, and charred',
              displayOrder: 7,
              ingredients: 'Chicken, cream, mild spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Malai Kabab',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 17,
              calories: 220,
              categoryId: tandoorId,
              currency: 'USD',
              description: 'Tofu pieces marinated with aromatic spices and grilled to perfection',
              displayOrder: 8,
              ingredients: 'Tofu, yogurt, spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Tofu Kabab',
              preparationTime: 20,
              spiceLevel: 3,
            },
            {
              basePrice: 18,
              calories: 280,
              categoryId: tandoorId,
              currency: 'USD',
              description: 'Paneer pieces marinated with aromatic spices and grilled to perfection',
              displayOrder: 9,
              ingredients: 'Paneer, yogurt, spices, herbs',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Paneer Kabab',
              preparationTime: 20,
              spiceLevel: 3,
            },
            {
              basePrice: 23.99,
              calories: 480,
              categoryId: nonVegId,
              currency: 'USD',
              description: 'Bone-in goat meat in spicy traditional curry',
              displayOrder: 3,
              ingredients: 'Goat meat, onions, tomatoes, bay leaves, whole spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Goat Curry',
              preparationTime: 60,
              spiceLevel: 4,
            },
          ])
          .returning()

        const menuItem21 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 23.99,
              calories: 500,
              categoryId: nonVegId,
              currency: 'USD',
              description: 'Fiery Goan curry with tender lamb',
              displayOrder: 4,
              ingredients: 'Lamb, vinegar, red chilies, garlic, ginger, Portuguese spices',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Lamb Vindaloo',
              preparationTime: 45,
              spiceLevel: 5,
            },
            {
              basePrice: 15,
              calories: 450,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Hand-wrapped Nepali dumplings filled with seasoned chicken - served with special tomato chutney',
              displayOrder: 1,
              ingredients: 'Chicken, flour wrapper, onions, garlic, ginger, cilantro',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken MoMo (10 pcs)',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 13,
              calories: 350,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Hand-wrapped Nepali dumplings filled with seasoned vegetables - served with special tomato chutney',
              displayOrder: 2,
              ingredients: 'Mixed vegetables, flour wrapper, herbs, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Veg MoMo (10 pcs)',
              preparationTime: 30,
              spiceLevel: 2,
            },
            {
              basePrice: 17,
              calories: 480,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Stir-fried noodles with chicken and vegetables - Nepali style comfort food',
              displayOrder: 3,
              ingredients: 'Noodles, chicken, cabbage, carrots, soy sauce, spices',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Chowmein',
              preparationTime: 25,
              spiceLevel: 2,
            },
            {
              basePrice: 15,
              calories: 380,
              categoryId: nepaliId,
              currency: 'USD',
              description: 'Stir-fried noodles with vegetables - Nepali style comfort food',
              displayOrder: 4,
              ingredients: 'Noodles, mixed vegetables, soy sauce, spices',
              isAvailable: true,
              isPopular: false,

              isVegan: true,
              isVegetarian: true,
              name: 'Veg Chowmein',
              preparationTime: 20,
              spiceLevel: 2,
            },
          ])
          .returning()

        const menuItem22 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 18,
              calories: 420,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Crispy chicken pieces tossed in sweet and spicy sauce - Indo-Chinese fusion',
              displayOrder: 5,
              ingredients: 'Chicken, bell peppers, onions, chilli sauce, soy sauce',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Chilli',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 18,
              calories: 420,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Crispy chicken pieces tossed in sweet and spicy sauce - Indo-Chinese fusion',
              displayOrder: 6,
              ingredients: 'Chicken, peppers, onions, chilli sauce',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: false,
              name: 'Chilli Chicken',
              preparationTime: 25,
              spiceLevel: 3,
            },
            {
              basePrice: 19,
              calories: 380,
              categoryId: nepaliId,
              currency: 'USD',
              description: 'Traditional Nepali grilled chicken marinated in authentic spices',
              displayOrder: 7,
              ingredients: 'Chicken, traditional Nepali spices, herbs',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: false,
              name: 'Chicken Sekuwa',
              preparationTime: 30,
              spiceLevel: 3,
            },
            {
              basePrice: 16,
              calories: 520,
              categoryId: nepaliId,
              currency: 'USD',
              description:
                'Traditional Nepali platter with lentil curry, rice, vegetables, and accompaniments',
              displayOrder: 8,
              ingredients: 'Lentils, rice, mixed vegetables, pickles, papad',
              isAvailable: true,
              isPopular: true,

              isVegan: true,
              isVegetarian: true,
              name: 'Dal Bhat Thali',
              preparationTime: 35,
              spiceLevel: 2,
            },
            {
              basePrice: 5.5,
              calories: 180,
              categoryId: dessertsId,
              currency: 'USD',
              description:
                'Traditional Indian ice cream infused with sweet mango - creamy, rich, and refreshing',
              displayOrder: 1,
              ingredients: 'Mango, milk, cream, sugar, cardamom',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Mango Kulfi',
              preparationTime: 5,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItem23 = await db
          .insert(menuItem)
          .values([
            {
              basePrice: 5,
              calories: 160,
              categoryId: dessertsId,
              currency: 'USD',
              description: 'Traditional Indian ice cream - creamy, rich, and refreshing',
              displayOrder: 2,
              ingredients: 'Milk, cream, sugar, cardamom, pistachios',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Kulfi',
              preparationTime: 5,
              spiceLevel: 0,
            },
            {
              basePrice: 6.5,
              calories: 220,
              categoryId: dessertsId,
              currency: 'USD',
              description:
                'Soft cheese dumplings in sweetened milk - delicate, creamy, and aromatic',
              displayOrder: 3,
              ingredients: 'Paneer, milk, sugar, cardamom, pistachios',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Rasmalai (2 pcs)',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5.5,
              calories: 280,
              categoryId: dessertsId,
              currency: 'USD',
              description:
                'Golden fried dough balls soaked in rose-scented syrup - sweet, soft, and indulgent',
              displayOrder: 4,
              ingredients: 'Milk powder, flour, sugar syrup, rose water, cardamom',
              isAvailable: true,
              isPopular: true,

              isVegan: false,
              isVegetarian: true,
              name: 'Gulab Jamun (2 pcs)',
              preparationTime: 10,
              spiceLevel: 0,
            },
            {
              basePrice: 5.5,
              calories: 200,
              categoryId: dessertsId,
              currency: 'USD',
              description:
                'Creamy rice pudding with cardamom and nuts - comfort dessert at its finest',
              displayOrder: 5,
              ingredients: 'Rice, milk, sugar, cardamom, almonds, raisins',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Kheer',
              preparationTime: 15,
              spiceLevel: 0,
            },
            {
              basePrice: 6,
              calories: 250,
              categoryId: dessertsId,
              currency: 'USD',
              description:
                'Warm carrot pudding with ghee and nuts - rich, comforting, and aromatic',
              displayOrder: 6,
              ingredients: 'Carrots, milk, ghee, sugar, cardamom, nuts',
              isAvailable: true,
              isPopular: false,

              isVegan: false,
              isVegetarian: true,
              name: 'Gajar Halwa',
              preparationTime: 20,
              spiceLevel: 0,
            },
          ])
          .returning()

        const menuItems = [
          ...menuItem1,
          ...menuItem2,
          ...menuItem3,
          ...menuItem4,
          ...menuItem5,
          ...menuItem6,
          ...menuItem7,
          ...menuItem8,
          ...menuItem9,
          ...menuItem10,
          ...menuItem11,
          ...menuItem12,
          ...menuItem13,
          ...menuItem14,
          ...menuItem15,
          ...menuItem16,
          ...menuItem17,
          ...menuItem18,
          ...menuItem19,
          ...menuItem20,
          ...menuItem21,
          ...menuItem22,
          ...menuItem23,
        ]

        // Insert Menu Item Allergens
        await db.insert(menuItemAllergen).values([
          // Dairy allergens for items containing dairy
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Mango Lassi')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Rose Lassi')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Salt Lassi')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Samosa Chaat')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Chicken Tikka Masala')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Dal Makhani')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Dairy')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Paneer Makhani')?.id || '',
            severity: 'contains',
          },

          // Gluten allergens for items containing wheat/gluten
          {
            allergenId: allergenItems.find((a) => a.name === 'Gluten')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Vegetable Samosa')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Gluten')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Samosa Chaat')?.id || '',
            severity: 'contains',
          },

          // Nuts allergens for items containing nuts
          {
            allergenId: allergenItems.find((a) => a.name === 'Nuts')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            severity: 'contains',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Nuts')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Chicken Tikka Masala')?.id || '',
            severity: 'may_contain',
          },
          {
            allergenId: allergenItems.find((a) => a.name === 'Nuts')?.id || '',
            menuItemId: menuItems.find((m) => m.name === 'Paneer Makhani')?.id || '',
            severity: 'contains',
          },
        ])

        // Insert some menu availability records
        await db.insert(menuAvailability).values([
          {
            dayOfWeek: 0,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 1,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 2,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 3,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 4,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 5,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 6,
            endTime: '22:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Butter Chicken')?.id || '',
            startTime: '11:00',
          },
          {
            dayOfWeek: 0,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 1,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 2,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 3,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 4,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 5,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
          {
            dayOfWeek: 6,
            endTime: '20:00',
            isActive: true,
            menuItemId: menuItems.find((m) => m.name === 'Indian Masala Tea')?.id || '',
            startTime: '08:00',
          },
        ])

        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(`Seeding completed in ${duration}ms`)

        return c.json({ message: 'Successfully seeded Masala and Curry restaurant data' }, OK)
      } catch (error) {
        console.error('Seeding error:', error)
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: 'Failed to seed data for the D1 database',
        })
      }
    }
  )

export default router
