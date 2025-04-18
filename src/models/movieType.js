import mongoose, { Schema } from "mongoose";

const movieTypeSchema = new Schema({
    name: {
        type: String,
        required:true,
        index: true
    },
    imdbId: {
        type: Number
    }
}, {timestamps:true})

movieTypeSchema.index({ "$**": 'text' })
export default mongoose.model('MovieType', movieTypeSchema)