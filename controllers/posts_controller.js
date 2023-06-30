module.exports.home = function(req, res){
    return res.end('<h1>Posts!!!</h1>');
};

module.exports.like = function(req, res){
    return res.end('<h1>Liked!!!</h1>');
};