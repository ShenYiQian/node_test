import Joi from 'joi';

export default {
  // GET /api/auth/login
  login: {
    query: {
      mobile: Joi.string().regex(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).required(),
      pswd: Joi.string().required()
    }
  },

  // GET /api/auth/loginbytoken
  loginByToken: {
    query: {
      token: Joi.string().required()
    }
  },

  // GET /api/auth/register
  register: {
    query: {
      mobile: Joi.string().regex(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).required(),
      pswd: Joi.string().required(),
      pswdcfm: Joi.string().required()
    }
  },

  // GET /api/user/profile
  profile: {
    query: {
      token: Joi.string().required(),
      uname: Joi.string().required(),
      identity: Joi.number().required(),
      city: Joi.string().required(),
      desc: Joi.string().optional(),
    }
  },

  // GET /api/user/list
  listUser: {
    query: {
      token: Joi.string().required(),
      filters: Joi.string().required()
    }
  },
  
  // GET /api/user/update
  updateUser: {
    query: {
      token: Joi.string().required(),
      uname: Joi.string().optional(),
      city: Joi.strict().optional(),
      desc: Joi.string().optional(),
    }
  },

  // GET /api/user/setfreetime
  setFreeTime: {
    query: {
      token: Joi.string().required(),
      office: Joi.string().required(),
      weekday: Joi.number().min(0).max(6).required(),
      state: Joi.number().min(0).max(3).required(),
      need: Joi.number().optional(),
    }
  },
  
  // GET /api/order/create
  createOrder: {
    query: {
      token: Joi.string().required(),
      sendTo: Joi.string().required(),
    }
  }
};
