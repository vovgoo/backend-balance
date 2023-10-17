import CategoryModel from '../models/Category.js';
import ItemModel from '../models/Item.js';
import {validationResult} from 'express-validator'

export const getAll = async (req, res) => {
    try{
        const posts = await ItemModel.find().exec();
        res.json(posts);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось получить категории.",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedDoc = await ItemModel.findOne(
            { _id: itemId },
        );

        if (!updatedDoc) {
            return res.status(404).json({
                message: "Категория не найдена",
            });
        }

        res.json(updatedDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось получить категорию.",
        });
    }
}

export const getItemByCategory = async (req, res) => {
try {
    const { categoryId } = req.params; 
    const items = await ItemModel.find({ category: categoryId });

    if (!items) {
    return res.status(404).json({ message: 'Элементы с указанной категорией не найдены.' });
    }

    res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Не удалось получить элементы по категории.' });
    }
}

export const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }        

        const { title, text, price, imageUrl, category, count } = req.body;
        const categorys = await CategoryModel.findOne({ title: category });

        const newItem = new ItemModel({
            title,
            text,
            price,
            count,
            category: categorys._id, 
            ImageUrl: imageUrl,
        });

        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось создать новый элемент.',
        });
    }
}

export const update = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }   
        const categoryId = req.params.id;
        const { title, text, price, imageUrl, category, count } = req.body;
        const categorys = await CategoryModel.findOne({ title: category });

        await ItemModel.updateOne({
            _id: categoryId,
        },
        {
            title,
            text,
            price,
            count,
            category: categorys._id, 
            ImageUrl: imageUrl,
        },
        );

        res.json({success: true});
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось редактировать элемент',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedDoc = await ItemModel.findOneAndDelete({ _id: categoryId });

        if (!deletedDoc) {
            return res.status(404).json({
                message: "Элемент не найден",
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось удалить элемент.",
        });
    }
}