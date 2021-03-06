module.exports = function(credentials) {
    /*global console*/
    var yetify = require('yetify'),
        config = require('getconfig'),
        fs = require('fs'),
        sockets = require('./sockets'),
        port = parseInt(process.env.PORT || config.server.port, 10),
        server_handler = function(req, res) {
            res.writeHead(404);
            res.end();
        },
        server = null;
    // Create an http(s) server instance to that socket.io can listen to
    if (config.server.secure) {
        server = require('https').Server({
            key: credentials.key,
            cert: credentials.cert,
            passphrase: config.server.password
        }, server_handler);
    } else {
        server = require('http').Server(server_handler);
    }
    server.listen(port);

    sockets(server, config);

    if (config.uid) process.setuid(config.uid);

    var httpUrl;
    if (config.server.secure) {
        httpUrl = "https://" + config.ip + ":" + port;
    } else {
        httpUrl = "http://" + config.ip + ":" + port;
    }
    console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
};