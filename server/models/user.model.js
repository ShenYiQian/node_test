import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { dateDiff } from '../tools/toolutils';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  city: {
    type: String,
    default: ''
  },
  hospital: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  uploadImages: [
    {
      type: String,
    }
  ],
  identity: {
    type: Number,
    default: 0   //   0 no define 1 doctor 2 hospital
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  console.log('update at now = ' + this.updatedAt);
  next();
});

/**
 * Methods
 */
UserSchema.methods = {
  genToken() {
    let hours = dateDiff(Date.parse(this.updatedAt), Date.now(), 'h');
    if (hours > 4) {
      this.save()
        .then(saveUser => {
          return jwt.sign({
            userId: saveUser._id,
            loginAt: saveUser.updatedAt
          }, config.jwtSecret);
        })
        .catch(e => {
          return Promise.reject(e);
        })
    } else {
      return jwt.sign({
        userId: this._id,
        loginAt: this.updatedAt
      }, config.jwtSecret);
    }
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        return Promise.reject('没有找到用户');
      });
  },

  getUserById(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        return Promise.reject('没有找到用户');
      });
  },

  getUserByMobileNumber(mobileNumber) {
    return this.findOne({ mobileNumber })
      .exec()
      .then((user) => {
        if (user) {
          console.log('find user by mobile = ' + mobileNumber);
          return user;
        }
        return Promise.reject('没有找到用户');
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
