const fs = require("fs");
const querystring = require("querystring");

function handler(request, response) {
    
  const endpoint = request.url;
// This to get the file type from the request
  const content = endpoint.split(".")[1];

  // this is to set the mime type to send back headers 
  const contentType = {
    css: "text/css",
    ico: "image/vnd.microsoft.icon",
    js: "text/javascript",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    html: "text/html",
    png: "image/png"
  };

  if (endpoint === "/") {
    response.writeHead(200, { "Content-Type": "text/html" });

    fs.readFile(__dirname + "/../" + "/public/index.html", function(
      error,
      file
    ) {
      if (error) {
        console.log(error);
        return;
      }

      response.end(file);
    });
  } else if (endpoint === "/node") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("node"); 
    response.end(); 
  } else if (endpoint === "/girls") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("hi"); 
    response.end(); 
  } else if (endpoint === "/posts") {
    response.writeHead(200, { "Content-Type": "application/json" });
    fs.readFile(__dirname + "/posts.json", function(error, file) {
      if (error) {
        console.log(error);
        return;
      }
      response.end(file);
    });
  } else if (endpoint === "/create/post") {
    let allTheData = "";
    request.on("data", function(chunkOfData) {
      allTheData += chunkOfData;
    });

    request.on("end", function() {
      const convertedData = querystring.parse(allTheData);

      const timestamp = Date.now();

        fs.readFile(__dirname + "/posts.json", function(err, data) {
          if (err) throw err;

          const newData = JSON.parse(data);
          newData[timestamp] = convertedData.post;

          const sendFile = JSON.stringify(newData);

          fs.writeFile(__dirname + "/posts.json", sendFile, function(err) {
            if (err) throw err;
            response.writeHead(302, { location: "/" });
            response.end();
          });
        });
      
    });
  } else {
    fs.readFile(__dirname + "/../" + "/public" + endpoint, function(
      error,
      file
    ) {
      if (error) {
        console.log(error, "wft");
        return;
      }
      response.writeHead(200, { "Content-Type": contentType[content] });
      response.end(file);
    });
  }
}

module.exports = handler;
