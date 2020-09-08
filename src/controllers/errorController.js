const AppError = require('../utils/appError')

const DEVError = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')){

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })

    } else {
        res.status(err.statusCode).render('_404', {
            title: '404',
            message: err.message,
        })
    }
}

const PROError = (err, req, res) => {

    if(req.originalUrl.startsWith('/api')){
        if(err.isOperational){
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            console.log('ERROR 🔥', err)
            
            res.status(500).send({
                status: 'error',
                message: 'Something went wrong'
            })
        }
    } else {
        res.status(500).render('_404', {
            title: '404',
            message: "Please try again",
        })
    }

}

const handleCastErroeDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDublicateFields = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Dublicate field value: ${value}, Please try another value!`
    return new AppError(message, 400)
}

const handleValidationError = (err) => {

    const errors = Object.values(err.errors).map(el => {
        return el.message
    })

    const message = `Invalid input data ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token, Please log in again', 401)


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if(process.env.NODE_ENV === 'development'){

        DEVError(err, req, res)

    } else if(process.env.NODE_ENV === 'production'){

        let error = {...err}

        if(error.name === 'CastError'){
            error = handleCastErroeDB(error)
        }

        if(error.code === 11000){
            error = handleDublicateFields(error)
        }

        if(error.name === 'ValidationError'){
            error = handleValidationError(error)
        }

        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'){
            error = handleJWTError(error)
        }

        PROError(error, req, res)
    }

    
}