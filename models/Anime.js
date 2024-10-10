import mongoose from "mongoose";

const AnimeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      animeId: {
        type: Number,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
})

const Anime = mongoose.model('Anime',AnimeSchema)

export default Anime