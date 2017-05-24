import Order from '../models/order.model';
import authCtrl from './auth.controller';

function createOrder(req, res, next) {
    let { token, target, weekday, time } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            Order.findOrderByFrom(user._id)
                .then(order => {

                })
                .catch(e => {

                })
        })
        .catch(e => {
            res.json({
                status: 'err',
                msg: e
            })
        })
}

export default { createOrder };