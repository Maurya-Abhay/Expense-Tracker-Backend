
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    expenses: [
        {
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
