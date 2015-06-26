"use strict";

var restify = require('restify');
var Logger = require('bunyan');

var log = new Logger.createLogger({
	name: 'pandonos',
	serializers: {
		req: Logger.stdSerializers.req
	}
});

var server = restify.createServer({name: 'pandonos', log: log});

server.use(restify.CORS());
server.use(restify.dateParser());
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false}));

server.use(restify.throttle({
	burst: 100,
	rate: 50,
	ip: true,
	overrides: {
		'127.0.0.1': {
			rate: 0,        // unlimited
			burst: 0
		}
	}
}));

//log request
server.pre(function (request, response, next) {
	request.log.info({req: request}, JSON.stringify(request.body));
	next();
});

server.get("/ping", function ping(req, res, next) {
	res.send("pong");
	next();
});

server.post('/pandonos', function (req, res, next) {
	res.send("ok");
	next();
});


server.listen(3000, function () {
	console.log('%s listening at %s', server.name, server.url);
});