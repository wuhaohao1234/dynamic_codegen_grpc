var PROTO_PATH = __dirname + '/add.proto';

var parseArgs = require('minimist');
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

function main() {
  
  var client = new add_proto.AddService('localhost:50051',
                                       grpc.credentials.createInsecure());

  client.add({a: 1, b: 2}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

main();

