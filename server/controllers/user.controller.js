import User from '../models/user.model';
import Info from '../models/info.model';
import authCtrl from './auth.controller';
import * as stateConst from '../constants/stateConst';

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

function setDailyData(i, state, need) {
    return {
        state: (state == i || state == stateConst.FREE_TIME_STATE_ALLDAY) ? 0 : 1,
        need,
        inviteOrders: [],
        requestOrders: [],
        acceptOrders: []
    };
}

function setOfficeState(info, office, weekday, state, need) {
    let officeData = info.freeTimes[office];
    if (officeData != null) {
        let dailyData = officeData[weekday];
        for(let i = 0; i < 2; i++) {
            dailyData[i] = setDailyData(i, state, need);
        }
    } else {
        officeData = new Array;
        for (let i = 0; i < 7; i++) {
            let dailyData = officeData[i] = [];
            if (i == weekday) {
                for(let j = 0; j < 2; j++) {
                    dailyData[j] = setDailyData(j, state, need);
                }
            } else {
                dailyData[0] = dailyData[1] = {
                    state: 1,
                    need: 0,
                    inviteOrders: [],
                    requestOrders: [],
                    acceptOrders: []
                }
            }
        }
    }
    return officeData;
}

function setFreeTime(req, res, next) {
    let { token, office, weekday, state, need } = req.query;
    need = need ? need : 0;
    authCtrl.checkToken(token)
        .then(user => {
            Info.findInfoByOwner(user._id)
                .then(info => {
                    info.freeTimes[office] = setOfficeState(info, office, weekday, state, need);
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
                    newInfo.freeTimes = {};
                    newInfo.freeTimes[office] = setOfficeState(newInfo, office, weekday, state, need);

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
