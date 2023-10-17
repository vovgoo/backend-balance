import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true, 
    },
    text:{
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        get: v => (v.toFixed(2)),
        set: v => (parseFloat(v.toFixed(2))),
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    count:{
        type: Number,
        required: true,
    },
    ImageUrl: String,
}, 
{
    timestamps: true,
},
);

export default mongoose.model('Item', ItemSchema);