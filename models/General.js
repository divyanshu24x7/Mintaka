import mongoose from "mongoose";

const GeneralSchema = new mongoose.Schema({
    animeId: { type: Number, required: true, unique: true },
    url: { type: String },
    images: { type: Object },
    trailer: { type: Object },
    approved: { type: Boolean },
    titles: { type: Array },
    title: { type: String },
    title_english: { type: String },
    title_japanese: { type: String },
    title_synonyms: { type: Array },
    type: { type: String },
    source: { type: String },
    episodes: { type: Number },
    status: { type: String },
    airing: { type: Boolean },
    aired: { type: Object },
    duration: { type: String },
    rating: { type: String },  // PG-13, etc. (String instead of number now)
    score: { type: Number },
    scored_by: { type: Number },
    rank: { type: Number },
    popularity: { type: Number },
    members: { type: Number },
    favorites: { type: Number },
    synopsis: { type: String },
    background: { type: String },
    season: { type: String },
    year: { type: Number },
    broadcast: { type: Object },
    producers: { type: Array },
    licensors: { type: Array },
    studios: { type: Array },
    genres: { type: Array },
    explicit_genres: { type: Array },
    themes: { type: Array },
    demographics: { type: Array }
});

const General = mongoose.model('General', GeneralSchema);

export default General;
