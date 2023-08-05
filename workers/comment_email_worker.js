const queue = require('../config/kue');
const commentsMailer = require('../mailers/comment_mailer');

// Process function is called whenever a job is added to the queue
// job is the job that is added to the queue
// done is a callback function that is called when the job is done
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job');

    commentsMailer.newComment(job.data);

    done();
});