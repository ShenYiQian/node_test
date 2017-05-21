import Order from '../models/order.model';

function createOrder(req, res, next) {
    return res.json({
        status: 'ok'
    })
}

export default { createOrder };