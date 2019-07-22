const http = require("http");
const handler = require('./src/handler');


const server = http.createServer(handler);

server.listen(3000, function() {
  console.log(
    "The magic is happening on port 3000.  Ready to accept requests!"
  );
});
