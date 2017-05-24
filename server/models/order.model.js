import mongoose, { Schema } from 'mongoose';

const OrderSchema = new mongoose.Schema({
    fromUser: {
        type: Schema.Types.ObjectId,
        required: true
    },
    toUser: {
        type: Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        default: Date.now()
    },
    orderStatus: {
        type: Number,
        // 0 request 1 refuse 2 cancel 3 accept
        min: 0,
        max: 3,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

OrderSchema.methods = {
    changeStatus(status) {
        this.orderStatus = status;
        this.save()
            .then(saveOrder => {
                return Promise.resolve(saveOrder);
            })
            .catch(e => {
                return Promise.reject(e);
            })
    }
};

OrderSchema.statics = {
    listByFrom(fromUser, {skip = 0, limit = 50} = {}) {
        return this.find({fromUser})
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },

    listByTo(toUser, {skip = 0, limit = 50} = {}) {
        return this.find({toUser})
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },

    findOrderById(id) {
        return this.findById(id)
            .exec()
            .then(order => {
                if(order) {
                    return order;
                }
                return Promise.reject('没有找到这条记录');
            });
    },

    findOrderByFrom(fromUser) {
        return this.find({fromUser})
            .exec()
            .then(order => {
                if(order) {
                    return order;
                }
                return Promise.reject('没有找到用户');
            });
    }
}

export default mongoose.model('Order', OrderSchema);