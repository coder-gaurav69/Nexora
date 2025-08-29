import express from 'express';
import { orderMiddleWare } from '../middleware/orderMiddleWare.js';
import { orderController, getOrderController, updateOrderController, updateOrderStatus } from '../Controller/orderController.js';
const orderRoute = express.Router();
orderRoute.post("/createOrder", orderMiddleWare, orderController);
orderRoute.get("/getOrderDetails", getOrderController);
orderRoute.patch("/updateOrder/:orderId", updateOrderController);
orderRoute.patch("/updateOrderStatus", updateOrderStatus);
export default orderRoute;
