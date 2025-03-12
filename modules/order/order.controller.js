const ErrorHandler = require("../../helpers/handle_controllers_error");

class OrderController{
    constructor(orderService){
        this.orderService = orderService;
    }


    getUserOrders = async(req,res) =>{
        try {
            const userId = req.params.userId;
            const result = await this.orderService.getUserOrders(userId);
            return res.json(result);
        } catch (error) {
            return ErrorHandler.handleError(error,res,"Failed to get user orders");
        }
    }
    getOrderById = async(req,res) =>{
        try {
            const orderId = req.params.id;
            const order = await this.orderService.getOrderById(orderId);
            return res.json(order);
        } catch (error) {
            return ErrorHandler.handleError(error,res,"Failed to get order by id");
        }
    }
}

module.exports = OrderController;