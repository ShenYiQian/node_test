import Order from '../models/order.model';
import authCtrl from './auth.controller';

function create(fromUser, toUser, weekday, timeQuantum) {
    return new Promise(function (resolve, reject) {
        const order = new Order();
        order.fromUser = fromUser;
        order.toUser = toUser;
        order.weekday = weekday;
        order.timeQuantum = timeQuantum;

        order.save()
            .then(newOrder => {
                resolve(newOrder);
            })
            .catch(e => {
                reject(e)
            })
    })
}

function newOrder(req, res, next) {
    let { token, target, weekday, time } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            Order.findOrderByFrom(user._id, target, weekday, time)
                .then(order => {
                    if (order.orderStatus === 0 || order.orderStatus === 3) {
                        res.json({
                            status: 'err',
                            msg: '您已经发过申请了，请不要重复发送'
                        })
                    } else {
                        create(user._id, target, weekday, time)
                            .then(newOrde => {
                                res.json({
                                    status: 'ok',
                                    newOrder
                                })
                            })
                            .catch(e => {
                                res.json({
                                    status: 'err',
                                    msg: e
                                })
                            })
                    }
                })
                .catch(e => {
                    create(user._id, target, weekday, time)
                        .then(newOrder => {
                            res.json({
                                status: 'ok',
                                newOrder
                            })
                        })
                        .catch(e => {
                            res.json({
                                status: 'err',
                                msg: e
                            })
                        })
                })
        })
        .catch(e => {
            res.json({
                status: 'err',
                msg: e
            })
        })
}


export default { newOrder };