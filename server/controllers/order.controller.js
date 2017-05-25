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

function listOrders(req, res, next) {
    let { token, page } = req.query;
    page = page || 0;
    authCtrl.checkToken(token)
        .then(user => {
            Order.listByFrom(user._id, {skip: page*50, limit: 50} )
                .then(orders => {
                    let result = [];
                    orders.map(v => {
                        let { toUser, weekday, timeQuantum, orderStatus } = v;
                        result.push({
                            toUser,
                            weekday,
                            timeQuantum,
                            orderStatus
                        });
                        return res.json({
                            status: 'ok',
                            result
                        })
                    })
                })
                .catch(e => {
                    return res.json({
                        status: 'err',
                        msg: e
                    })          
                })
        })
        .catch(e => {
            return res.json({
                status: 'err',
                msg: e
            })
        })
}

function changeStatus(req, res, next) {
    let { token, order, status } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            Order.getOrderById(order)
                .then(getOrder => {
                    if(getOrder.fromUser == user._id && status === 2) {
                        getOrder.changeStatus(status)
                            .then(saveOrder => {
                                return res.json({
                                    status: 'ok',
                                    saveOrder
                                });
                            })
                            .catch(e => {
                                return res.json({
                                    status: 'err',
                                    msg: e
                                });
                            })
                    } else if(getOrder.toUser == user._id && (status === 1 || status === 3)){
                        getOrder.changeStatus(status)
                            .then(saveOrder => {
                                return res.json({
                                    status: 'ok',
                                    saveOrder
                                });
                            })
                            .catch(e => {
                                return res.json({
                                    status: 'err',
                                    msg: e
                                })
                            })
                    } else {
                        return res.json({
                            status: 'err',
                            msg: '您不能进行该操作'
                        })
                    }
                })
                .catch(e => {
                    return res.json({
                        status: 'err',
                        msg: e
                    })
                })
        })
        .catch(e => {
            return res.json({
                status: 'err',
                msg: e
            })
        })
}

export default { newOrder, listOrders, changeStatus };