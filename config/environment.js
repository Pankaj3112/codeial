const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory,
});

const development = {
    name: "development",
    asset_path: "./assets",
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'pankajbeniwal3112@gmail.com',
            pass: 'uanvdhjmhnzyigkm',
        },
    },
    
    google_client_ID: "308721804967-uq8pc246k5ldglp6ad77mre6fjbi3v28.apps.googleusercontent.com",
    google_client_Secret: "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",
    google_callback_URL: "http://50.19.136.219/:8000/users/auth/google/callback",
    jwt_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {
    name: "production",
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_SMTP_USER,
            pass: process.env.CODEIAL_SMTP_PW,
        },
    },
    google_client_ID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_key: process.env.CODEIAL_JWT_KEY,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);

// module.exports = production;