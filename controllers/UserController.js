import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator';
import UserModel from '../models/User.js';

export const register = async(req, res)=> {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            firstName: req.body.firstName,
            email: req.body.email,
            passwordHash: Hash,
            avatarUrl: req.body.avatarUrl,
        });
        const user = await doc.save();

        const token = jwt.sign({
           _id: user._id, 
        },
        '>4]owql^}?qp{74)5*X~uz-he+gZ}L{}v1)mTwmQL@rY@;yL',
        {
            expiresIn: '30d',
        },
        );
        
        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token});
    } catch (err) {
        res.status(500).json({ message: "Не удалось зарегистрироваться", });
        console.log(err)
    }
}

export const login = async (req, res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const user = await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({
                message: 'Неверный логин или пароль.',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id, 
            },
            '>4]owql^}?qp{74)5*X~uz-he+gZ}L{}v1)mTwmQL@rY@;yL',
            {
                expiresIn: '30d',
            },
        );
        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token});
    } catch(err){
        res.status(500).json({ message: "Не удалось авторизоваться", });
        console.log(err)
    }
}

export const getMe = async (req, res)=> {
    try{
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден.",
            });
        }
        const {passwordHash, ...userData} = user._doc;

        res.json({...userData});
    } catch(err){
        res.status(500).json({ message: "Не удалось авторизоваться", });
        console.log(err)
    }
}