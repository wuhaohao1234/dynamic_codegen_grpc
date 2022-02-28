# grpc-node

## quick start

```shell
npm install
npm run server
npm run client
```

## 教程

### 一、定义proto

```proto
syntax = "proto3";

package add;

service AddService {
  rpc add(AddRequest) returns (AddReply) {}
}

message AddRequest {
  int32 a = 1;
  int32 b = 2;
}

message AddReply {
  int32 message = 1;
}
```

以上分别是

1. proto协议规则
2. package 包
3. service 服务 其中包含请求与响应
   
以上内容解答

接口为AddService.add，请求体包含: a, b 分别为int 响应为message, 也是int

### 二、定义server

```js
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
```

加载add_proto

定义请求接口add，并添加server，绑定端口号为50051， 启动grpc服务

### 三、客户端

```js
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

```

以上分别为加载proto

添加客户端，发送数据: a: 1, b: 2, 拿到响应为3