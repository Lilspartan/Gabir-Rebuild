import mongoose from 'mongoose'

const db = process.env.MONGODB_URI

var dbConnect = mongoose.connect(
    db  
)

export default dbConnect;