const express = require('express')
const path = require('path')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')


// register new function
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception Shutting down')
    process.exit(1)
})


const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

require('./db/mongoose')

const viewRouter = require('./routes/viewRoutes')
const userRouter = require('./routes/userRoutes')
const groupRouter = require('./routes/groupRoutes')
const quizRouter = require('./routes/quizRoutes')
const answerRouter = require('./routes/answerRoutes')
const postRouter = require('./routes/postRoutes')


const app = express();

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

// Serving static files
app.use(express.static(path.join(__dirname, '../public')))

// Security HTTP headers
app.use(helmet())


app.use(express.json({limit: '10kb'}));   // This is a middleware
app.use(cookieParser())

//Data Sanitization against NoSQL
app.use(mongoSanitize())

//Data Sanitization against XSS
app.use(xss())

app.use(hpp({
    whitelist: []
}))


// Limit rate od requests
const limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: 'Too many requests, Please try again in an hour'
})
app.use('/api', limiter)


app.use(viewRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/groups', groupRouter)
// /api/v1/groups/:groupid/quiz
app.use('/api/v1/groups', quizRouter)
// /api/v1/groups/:groupid/quiz/:quizid/answer
app.use('/api/v1/groups', answerRouter)
// /api/v1/groups/:groupid/post
app.use('/api/v1/groups', postRouter)


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 400));
})


app.use(globalErrorHandler)

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection Shutting down')
    server.close(() => {
        process.exit(1)
    })
})
