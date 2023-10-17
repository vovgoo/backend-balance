import {body} from 'express-validator'
import CategoryModel from './models/Category.js'

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
    body('firstName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
];

export const categoryCreateValidator = [
    body('title', "Введите заголовок категории").isLength({ min: 3 }).isString(),
];

export const itemCreateValidator = [
    body('title', "Введите заголовок товара").isLength({ min: 3 }).isString(),
    body('count', 'Введите корректное целое число').isInt({ min: 0 }),
    body('text', "Введите описание товара").isLength({ min: 10 }).isString(),
    body('imageUrl', "Неверная ссылка на изображение").optional().isString(),
    body('price', 'Введите корректную цену').custom((value) => {
        if (typeof value !== 'number') {
          return false;
        }
  
        const priceString = value.toString(); // Преобразуем число в строку
        const decimalCount = (priceString.split('.')[1] || '').length;
        return decimalCount === 2; // Проверяем, что есть два знака после запятой
      }),
    body('category', 'Введите корректную категорию')
    .isString()
    .custom(async (value) => {
        const category = await CategoryModel.findOne({ title: value });
        if (!category) {
            throw new Error('Категория с таким названием не найдена');
        }
        return true;
    }),
];

export const orderCreateValidator = [
    body('user', 'Поле "user" обязательно для заполнения').isMongoId(),
    body('cardNumber', 'Поле "cardNumber" обязательно для заполнения').isString(),
    body('userData', 'Поле "userData" обязательно для заполнения').isString(),
    body('dateCard', 'Поле "dateCard" обязательно для заполнения').isString(),
    body('cvv', 'Поле "cvv" обязательно для заполнения').isString(),
    body('adress', 'Поле "adress" обязательно для заполнения').isString(),
    body('orderItem', 'Поле "orderItem" обязательно для заполнения').isArray(),
];