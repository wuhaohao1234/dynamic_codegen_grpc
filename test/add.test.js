var PROTO_PATH = require('../src/proto')

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');


describe('test grpc', () => {
  var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
  var add_proto = grpc.loadPackageDefinition(packageDefinition).add;

  var client = new add_proto.AddService('localhost:50051',
    grpc.credentials.createInsecure());
  test('test add_server', () => {
    client.add({ a: 1, b: 2 }, function (err, response) {
      expect(response.message).toBe(3);
    });
  });
})
