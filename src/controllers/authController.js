const User = require('../models/user')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const AppError = require('../utils/appError')
const {sendResetPasswordEmail} = require('../emails/account')

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

const sendToken = (user, statusCode, res) => {
    // const token = `Bearer ${signToken(user._id)}`
    const token = signToken(user._id)

    const cookieOptions = {
        expires: new Date(Date.now() + 24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') {cookieOptions.secure = true}

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined
    
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    })
}

exports.signup = async (req, res, next) => {
    try{

        // const user = await User.create(req.body);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })

        sendToken(user, 201, res)
        // const token = signToken(user._id)
        // res.status(201).json({
        //     status: 'success',
        //     token,
        //     user
        // })

    } catch(err){
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body

        // Check if email and password exist
        if(!email || !password){
            return next(new AppError('Please provide email and password', 400))
        }

        // Check the use with email
        const user = await User.findOne({email}).select('+password')

        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Invalid data', 401))
        }


        // Everything is right
        sendToken(user, 200, res)

    } catch(err){
        next(err)
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'noUser', {
        expires: new Date(Date.now() + 10 ),
        httpOnly: true
    }),
    res.status(200).json({
        status: 'success'
    })
}

exports.protect = async (req, res, next) => {
    try{
        let token;
        // 1-) Get the token and check if it exist
        if(req.header('Authorization') && req.header('Authorization').startsWith('Bearer')){
            token = req.header('Authorization').replace('Bearer ', '')

        } else if(req.cookies.jwt) {
            token = req.cookies.jwt

        } else {
            return next(new AppError('You aren\'t looged in, Please log in', 401))
        }
        
        // 2-) Validate the token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        // 3-) Check if user still exist
        const user = await User.findById(decoded.id)
        if(!user) {
            return next(new AppError('The token is no longer exist', 401))
        }
        
        // 4-) Check if user changed the password after the token was issued
        if(user.changedPasswordAfter(decoded.iat)){
            return next(new AppError('Password was changed recently, Please log in again', 401))
        }

        req.user = user
        res.locals.user = user
        next()
    } catch(err){
        // next(err)
    }
}

exports.isLoggedIn = async (req, res, next) => {
    try{
        // 1-) Get the token and check if it exist
        if(req.cookies.jwt) {
            const token = req.cookies.jwt

            // 2-) Validate the token
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            
            // 3-) Check if user still exist
            const user = await User.findById(decoded.id)
            if(!user) {
                return next(new AppError('The token is no longer exist', 401))
            }
            
            // 4-) Check if user changed the password after the token was issued
            if(user.changedPasswordAfter(decoded.iat)){
                return next(new AppError('Password was changed recently, Please log in again', 401))
            }
            
            req.user = user
            res.locals.user = user
            return next();
        }
        next()
    } catch(err){
        next(err)
    }
}

exports.restrictTo = (...roles) => {
    return(req, res, next) => {
        // roles is an array  ['admin', 'lead-guide]

        if(!roles.includes(req.user.role)){
            return next(new AppError('You don\'t have the permission', 403))
        }

        next()
    }
}

exports.forgotPassword = async (req, res, next) => {
    try{
        
        // 1-) Get user based on email
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new AppError('There is no user with email address', 404))
        }

        // 2-) Generate random reset token
        const resetToken = user.createPasswordResetToken()

        await user.save();
        
        // 3-) send it to user
        // sendResetPasswordEmail(req.body.email, resetToken)

        res.status(200).json({
            status: 'success',
            message: 'Email was sent'
        })

    } catch(err){
        next(err);
    }
}

exports.resetPassword = async (req, res, next) => {
    try{

        // 1-) Get user from the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})
        
        // 2-) if the token hasn't expired and there is a user, Set the new password
        if(!user) {
            return next(new AppError('Token is invalid or has expired', 400))
        }

        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        
        await user.save()
        
        // 3-) Update ChangedPassword for the user
        // 4-) log the user in
        sendToken(user, 200, res)

    
    } catch(err){
        next(err)
    }
}

exports.updatePassword = async (req, res, next) => {
    try{

        // 1-) Get the user
        const user = await User.findById(req.user.id).select('+password')

        // 2-) Check the posted password
        
        if(!(await user.correctPassword(req.body.oldPassword, user.password))){
            return next(new AppError('Incorrect old password', 401))
        }
        
        // 3-) update the password
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        
        // 4-) Login the user with the new token
        await user.save()
        sendToken(user, 200, res)


    } catch(err){
        next(err)
    }
}

