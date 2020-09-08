const sgMail = require('@sendgrid/mail')
// const sendGridApiKey = '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'


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.sendWelcomeEmail = (email, name) =>{
    
    sgMail.send({
        to: email,
        from: 'modareda99@gmail.com',
        subject: 'Thanks for joining us',
        text: `Welcome to the app, ${name}`,
    })

}

exports.sendGoodbyeEmail = (email, name) =>{
    
    sgMail.send({
        to: email,
        from: 'modareda99@gmail.com',
        subject: 'We are sorry for you',
        text: `Tell us why ?, ${name}`,
    })

}

exports.sendResetPasswordEmail = (email, token) =>{
    
    sgMail.send({
        to: email,
        from: 'modareda99@gmail.com',
        subject: 'Password reset',
        text: `Here is your link to reset the password ${token}`,
    })

}