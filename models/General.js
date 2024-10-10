import mongoose from "mongoose";

const GeneralSchema = new mongoose.Schema({
    animeId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    genre:{
        type: Object,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
})

const General = mongoose.model('General',GeneralSchema)

export default General