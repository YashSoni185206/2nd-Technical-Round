import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// API End-points
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)

app.get('/',(req,res)=>{
     res.send("API Working")
})

app.listen(port, '0.0.0.0', () => console.log('Server Started On PORT : ' + port))
