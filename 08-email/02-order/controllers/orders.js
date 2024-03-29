const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const handleMongooseValidationError = require('../libs/validationErrors');
const orderMapper = require('../mappers/order');
const orderConfimationMapper = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
    let { product, phone, address } = ctx.request.body;
    let order = new Order({ 
        product,
        phone,
        address,
        user: ctx.user
    });
    let newOrder = await order.save();
    product = await Product.findOne({ id: product });
    const options = {
        to: ctx.user.email,
        template: 'order-confirmation',
        locals: orderConfimationMapper(newOrder, product),
        subject: 'Заказ успешно оформлен',
    }
   await sendMail(options);
    ctx.body = { order: newOrder.id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    let orders = await Order.find({ user: ctx.user.id }).populate('product');
    ctx.body = { orders: orders.map(orderMapper) };
};
