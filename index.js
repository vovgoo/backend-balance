import express from  'express';
import mongoose from "mongoose"
import multer from 'multer'
import {registerValidator, loginValidator, categoryCreateValidator, itemCreateValidator, orderCreateValidator } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as CategoryController from './controllers/CategoryController.js'
import * as ItemController from './controllers/ItemController.js'
import * as OrderController from './controllers/OrderController.js'

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express'
import {Database, Resource} from '@adminjs/mongoose';
import { dark, light, noSidebar } from '@adminjs/themes'

import UserModel from './models/User.js';
import CategoryModel from './models/Category.js';
import ItemModel from './models/Item.js';
import OrderModel from './models/Order.js';

import cors from 'cors';

AdminJS.registerAdapter({
    Database,
    Resource
});

mongoose
    .connect('mongodb+srv://vovgoo:SbL4fmFPN6kUw4PP@cluster0.lhmgywv.mongodb.net/blog?retryWrites=true&w=majority&appName=AtlasApp')
    .then(()=>console.log('Database Success'))  
    .catch((err)=>console.log('Database Error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_,__,cb) =>{
        cb(null, 'uploads');
    },
    filename: (_,file, cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

const admin = new AdminJS({
defaultTheme: dark.id,
availableThemes: [dark],
resources: [
    {
    resource: UserModel
    },
    {
    resource: ItemModel
    },
    {
    resource: CategoryModel
    },
    {
    resource: OrderModel
    }
],
branding: {
    companyName: 'BALANCE | ADMIN',
},
})

const adminRouter = AdminJSExpress.buildRouter(admin)

app.use(admin.options.rootPath, adminRouter)


app.post("/upload", checkAuth, upload.single('image'), (req, res) =>{
    res.json({
        url: `/upload/${req.file.originalname}`
    });
});

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

// registration

app.post("/auth/register", registerValidator, UserController.register);
app.post("/auth/login", loginValidator, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

// Category

app.get('/category', CategoryController.getAll);
app.get('/category/:id', CategoryController.getOne);
app.post('/category', checkAuth, categoryCreateValidator, CategoryController.create);
app.delete('/category/:id', checkAuth, CategoryController.remove);
app.patch('/category/:id', checkAuth, categoryCreateValidator, CategoryController.update);


// Item

app.get('/items/category/:categoryId', ItemController.getItemByCategory);
app.get('/item', ItemController.getAll);
app.get('/item/:id', ItemController.getOne);
app.post('/item', checkAuth, itemCreateValidator, ItemController.create);
app.delete('/item/:id', checkAuth, ItemController.remove);
app.patch('/item/:id', checkAuth, itemCreateValidator, ItemController.update);


// Order

app.post('/order', checkAuth, orderCreateValidator, OrderController.create);
// app.get('/order/users/:userId', OrderController.getOrderByUser);
// app.get('/order', OrderController.getAll);
// app.get('/order/:id', OrderController.getOne);
// app.delete('/order/:id', checkAuth, OrderController.remove);
// app.patch('/order/:id', checkAuth, orderCreateValidator, OrderController.update);


app.listen(3333, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log("Server Success");
})