process.env.PORT = 3100;
const http = require("http"),
  fs = require("fs"),
  createPool = require("mysql").createPool;

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  connectionLimit: 5,
});

const server = http.createServer((req, res) => {
  const urlArr = req.url.split("/");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.url === "/") {
    const html = fs.readFileSync(__dirname + "/src/index.html", "utf8");
    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
  } else if (req.url.startsWith("/api")) {
    res.writeHead(200, { "content-type": "application/json" });
    if (urlArr[2] === "products") {
      if (urlArr[3]) {
        pool.query(
          `SELECT * FROM project.products where productID = ${urlArr[3]};`,
          onResponseDefault
        );
      } else {
        pool.query(`SELECT * FROM project.products;`, onResponseDefault);
      }
    } else if (urlArr[2] === "orders") {
      if (urlArr[3]) {
        pool.query(
          `SELECT * FROM project.orders where orderID = ${urlArr[3]};`,
          onResponseDefault
        );
      } else {
        pool.query(`SELECT * FROM project.orders;`, onResponseDefault);
      }
    } else if (urlArr[2] === "categories") {
      if (urlArr[3]) {
        pool.query(
          `SELECT * FROM project.categories where categoryID = ${urlArr[3]};`,
          onResponseDefault
        );
      } else {
        pool.query(`SELECT * FROM project.categories;`, onResponseDefault);
      }
    } else if (urlArr[2] === "users") {
      if (urlArr[3]) {
        pool.query(
          `SELECT * FROM project.users where userID = ${urlArr[3]};`,
          onResponseDefault
        );
      } else {
        pool.query(`SELECT * FROM project.users;`, onResponseDefault);
      }
    } else if (urlArr[2] === "orderdetails") {
      if (urlArr[3]) {
        pool.query(
          `SELECT * FROM project.orderdetails where orderID = ${urlArr[3]};`,
          onResponseDefault
        );
      } else {
        pool.query(`SELECT * FROM project.orderdetails;`, onResponseDefault);
      }
    } else if (urlArr[2] === "cart") {
      const userId = urlArr[3];
      const statement = `SELECT project.products.name, project.orderdetails.quantity, project.orderdetails.unitPrice
      FROM project.orders
      LEFT JOIN project.orderdetails ON project.orderdetails.orderID = project.orders.orderID
      LEFT JOIN project.products ON project.orderdetails.productID = project.products.productID
      WHERE project.orders.userID = ${userId};`;
      if (userId) {
        return pool.query(statement, onResponseDefault);
      }
      res.end("");
    }
  }

  function onResponseDefault(err, data) {
    console.log("onResponseDefault", { err, data });
    return res.end(JSON.stringify(data, null, 2));
  }
});

server.listen(process.env.PORT, () =>
  console.log(`Server is listening on ${process.env.PORT}`)
);
