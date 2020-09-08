const AppError = require('../utils/appError')
const User = require('../models/user')
const { deleteOne, updateOne, getOne, getAll} = require('./handlerFactory')



const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach((key) => {
        if(allowedFields.includes(key)){
            newObj[key] = obj[key]
        }
    })

    return newObj;
}

// User Route Controllers
exports.getAllUsers = getAll(User)

exports.updateMe = async (req, res, next) =>  {
    try{
        // 1-) Create error if user tries to updated password
        if(req.body.password || req.body.passwordConfirm){
            return next(new AppError('Password Can\'t be changed from the URL', 400))
        }

        // 2-) Update the document
        const filteredBody = filterObj(req.body, 'name', 'email')
        const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {new: true, runValidators: true})

        // const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            updatedUser
        })

    } catch(err){
        next(err)
    }
}

exports.deleteMe = async (req, res, next) => {
    try{

        await User.findByIdAndUpdate(req.user.id, {active: false})

        res.status(204).json({
            status: 'success'
        })
        
    } catch(err){
        next(err)
    }
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next()
}

exports.getUser = getOne(User)

exports.createUser = (req, res) => {
    res.status(204).json({
        status: 'error',
        message: 'This route is not ready',
    })
}

// Don't update user with this
exports.updateUser = updateOne(User)

exports.deleteUser = deleteOne(User)

