import User from '../models/user.model';
import Info from '../models/info.model';
import authCtrl from './auth.controller';

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.user;
    user.username = req.body.username;
    user.mobileNumber = req.body.mobileNumber;

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

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
                            city: user.city,
                            desc: user.desc
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
    let { token } = req.query;
    authCtrl.checkToken(token)
        .then(user => {
            Info.findInfoByOwner(user._id)
                .then(info => {

                })
                .catch(e => {

                })
        })
        .catch(e => {
            return res.json({
                status: 'err',
                msg: e
            })
        })
    return res.json({
        status: 'ok'
    });
}

export default { update, profile, updateUser };
