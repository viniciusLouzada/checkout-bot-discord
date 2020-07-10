import mongoose from 'mongoose'

DotEnv.config()
const DB_URI = process.env.DB_URI

export default () =>
    mongoose
        .connect(DB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        .then(console.log('DB connected!'))
        .catch(console.error)
