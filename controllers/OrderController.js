import OrderModel from '../models/Order.js';
import { validationResult } from 'express-validator'

export const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const { user, cardNumber, userData, dateCard, cvv, adress, orderItem } = req.body;

        const newOrder = new OrderModel({
            user,
            cardNumber,
            userData,
            dateCard,
            cvv,
            adress,
            orderItem,
        });

        const order = await newOrder.save();

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось создать новый заказ.',
        });
    }
}