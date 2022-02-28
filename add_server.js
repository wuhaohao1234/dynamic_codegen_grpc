var PROTO_PATH = __dirname + '/add.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var add_proto = grpc.loadPackageDefinition(packageDefinition).add;

const add = (call, callback) => {
  callback(null, {message: call.request.a + call.request.b})
}

const main = () => {
  var server = new grpc.Server();
  server.addService(add_proto.AddService.service, {add: add});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main()