import User from '../models/user.model';
import Info from '../models/info.model';
import authCtrl from './auth.controller';

function profile(req, res, next) {
    let { uname, city, desc, isUser, token } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            user.username = uname;
            user.isUser = isUser;
            if (city) {
                user.city = city;
            }
            if (desc) {
                user.desc = desc;
            }
            user.save()
                .then(saveUser => {
                    return res.json({
                        status: 'ok',
                        user: {
                            city: saveUser.city,
                            desc: saveUser.desc
                        }
                    });
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
            });
        })
}

function updateUser(req, res, next) {
    let { uname, city, desc, token } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            let needUpdate = false;
            if (uname) {
                user.username = uname;
                needUpdate = true;
            }
            if (city) {
                user.city = city;
                needUpdate = true;
            }
            if (desc) {
                user.desc = desc;
                needUpdate = true;
            }
            if (needUpdate) {
                user.save()
                    .then(saveUser => {
                        return res.json({
                            status: 'ok',
                            user: {
                                city: user.city,
                                desc: user.desc
                            }
                        });
                    })
                    .catch(e => {
                        return res.json({
                            status: 'err',
                            msg: e
                        });
                    })
            }
        })
}

function setFreeTime(req, res, next) {
    let { token, office, indexes } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            Info.findInfoByOwner(user._id)
                .then(info => {
                    info.freeTimes[office] = [];
                    for (let i = 0; i < 7; i++) {
                        info.freeTimes[office].push({ state: indexes[i] })
                    }
                    info.markModified('freeTimes');
                    info.save()
                        .then(saveInfo => {
                            return res.json({
                                status: 'ok',
                                info: saveInfo
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
                    const newInfo = new Info();
                    newInfo.owner = user._id;
                    newInfo.freeTimes[office] = [];
                    for (let i = 0; i < 7; i++) {
                        newInfo.freeTimes[office].push({ state: indexes[i] })
                    }

                    newInfo.save()
                        .then(saveInfo => {
                            return res.json({
                                status: 'ok',
                                info: saveInfo
                            });
                        })
                        .catch(e => {
                            return res.json({
                                status: 'err',
                                msg: e
                            });
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

export default { profile, updateUser, setFreeTime };
