import CategoryModel from '../models/Category.js';
import { validationResult } from 'express-validator'

export const getAll = async (req, res) => {
    try{
        const posts = await CategoryModel.find().exec();
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
        const categoryId = req.params.id;
        const updatedDoc = await CategoryModel.findOne(
            { _id: categoryId },
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

export const create = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }       

        const doc = new CategoryModel({
            title: req.body.title,
        });

        const post = await doc.save();
        res.json(post);
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать новую категорию.',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedDoc = await CategoryModel.findOneAndDelete({ _id: categoryId });

        if (!deletedDoc) {
            return res.status(404).json({
                message: "Категория не найдена",
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось удалить категорию.",
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
        await CategoryModel.updateOne({
            _id: categoryId,
        },
        {
            title: req.body.title,
        },
        );

        res.json({success: true});
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось редактировать категорию',
        })
    }
}