import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    userData:{
        type: String, 
        required: true,
    },
    dateCard: {
        type: String,
        required: true, 
    },
    cvv:{
        type: String, 
        required: true,
    },
    adress:{
        type: String, 
        required: true,
    },
    orderItem: [
    {
        type: Array,
        required: true,
    },
    ],
},
{
    timestamps: true,
}
);

export default mongoose.model('Order', OrderSchema);