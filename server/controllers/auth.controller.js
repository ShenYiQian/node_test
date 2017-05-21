import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import { sha1, dateDiff } from '../tools/toolutils';

function register(req, res, next) {
  let { mobile, pswd, pswdcfm } = req.query;
  let paramPassed = [mobile, pswd, pswdcfm].some(v => {
    return v != null;
  });
  let errStr = null;
  if (!paramPassed) {
    errStr = '参数错误';
  } else {
    if (pswd.length > 20) {
      errStr = '密码长度过长(20个字符以内)';
    } else if (pswd != pswdcfm) {
      errStr = '两次输入的密码不一致';
    } else {
      User.getUserByMobileNumber(mobile)
        .then((user) => {
          errStr = '该用户已存在';
          return res.json({
            status: 'err',
            msg: errStr
          })
        })
        .catch(e => {
          const user = new User({
            mobileNumber: mobile,
            password: sha1(pswd)
          });

          user.save()
            .then(saveUser => {
              const token = saveUser.genToken();

              return res.json({
                status: 'ok',
                token
              });
            })
            .catch(e => next(e));
        })
    }
    if (errStr) {
      return res.json({
        status: 'err',
        msg: errStr
      });
    }
  }

  if (errStr) {
    return res.json({
      status: 'err',
      msg: errStr
    })
  }
}

function login(req, res, next) {
  console.log('enter login')
  // Ideally you'll fetch this from the db
  let { mobile, pswd } = req.query;
  User.getUserByMobileNumber(mobile)
    .then((user) => {
      if (sha1(pswd) != user.password) {
        return res.json({
          status: 'err',
          msg: '您输入的密码不正确'
        })
      } else {
        console.log('password currect');
        const token = user.genToken();
        console.log('genToken = ' + token);
        return res.json({
          status: 'ok',
          token
        })
      }
    })
    .catch(e => {
      return res.json({
        status: 'err',
        msg: e
      })
    })
}

function loginByToken(req, res, next) {
  let { token } = req.query;
  checkToken(token)
    .then((user) => {
      const newToken = user.genToken();
      return res.json({
        status: 'ok',
        token
      });
    })
    .catch(e => {
      return res.json({
        status: 'err',
        msg: e
      })
    })
}

function checkToken(token) {
  return new Promise(function (resolve, reject) {
    let decode = jwt.verify(token, config.jwtSecret);
    let { userId, loginAt } = decode;
    User.getUserById(userId)
      .then((user) => {
        let days = dateDiff(Date.parse(loginAt), Date.now());
        if (days > 7) {
          reject('您离开时间太长，请重新登陆');
        } else {
          resolve(user);
        }
      })
      .catch(e => {
        reject(e);
      })
  })

}

export default { login, loginByToken, register, checkToken };
