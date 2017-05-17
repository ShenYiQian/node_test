import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    query: {
      mobile: Joi.string().regex(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).required(),
      pswd: Joi.string().required()
    }
  },

  loginByToken: {
    query: {
      token: Joi.string().required()
    }
  },

  register: {
    query: {
      mobile: Joi.string().regex(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).required(),
      pswd: Joi.string().required(),
      pswdcfm: Joi.string().required()
    }
  },

  profile: {
    query: {
      uname: Joi.string().required(),
      city: Joi.string().required(),
      desc: Joi.string().optional(),
    }
  }
};
