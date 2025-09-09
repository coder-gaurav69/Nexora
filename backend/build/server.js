import express from 'express';
import { PORT, FRONTEND_URL } from './config.js';
import cors from 'cors';
import { connectMongoDB } from './mongoose/mongoDB.js';
import getRoute from './routes/getProducts.js';
import postRoute from './routes/postProducts.js';
import cartRoutes from './routes/cartRoutes.js';
import razorPayRoute from './Razorpay/Razorpay.js';
import customAuth from './routes/customAuthRoutes.js';
import cookieParser from 'cookie-parser';
import { googleMiddleware, googleRoute } from './routes/googleAuthRoutes.js';
import ordersRoute from './routes/ordersRoutes.js';
import userRoute from './routes/userRoute.js';
const app = express();
app.use(cookieParser());
app.use(express.json());
// cors 
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PATCH']
}));
// test endpoint
app.get('/', (req, res) => {
    res.send('Welcome to backend');
});
// get produts
app.use('/api', getRoute);
// add produts
app.use('/api', postRoute);
// cartRoutes
app.use('/api', cartRoutes);
// razorPayRoute
app.use('/api/razorpay', razorPayRoute);
// customAuth route
app.use('/api/customAuth', customAuth);
// orderRoute
app.use('/api', ordersRoute);
// user
app.use("/api", userRoute);
// googleAuth route
app.use(googleMiddleware);
app.use('/auth/googleAuth', googleRoute);
app.listen(PORT, () => {
    // connecting mongoDB
    connectMongoDB();
    console.log(`Server is running at http://localhost:${PORT}`);
});
