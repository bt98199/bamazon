var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "managerConsole",
      type: "rawlist",
      message: "Hello Manager, what would you like to do?",
      choices: ["VIEW ALL FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT", "EXIT"]
    })
    .then(function(answer) {
      switch (answer.managerConsole) {
  
        case "VIEW ALL FOR SALE":
          getPriceInvMaster();
          break;
        case "VIEW LOW INVENTORY":
          getInvLow(); // shows only qty < 100
          break;
        case "ADD TO INVENTORY":
          addInventory();
          break;
        case "ADD NEW PRODUCT":
          addNewProduct();
          break;
        default:
        console.log ("Back to terminal, remember you can view as the customer or department head");
        process.exit(0);
        }
    });
}



function getPriceInvMaster() {
  // connection.query("select * from product", function(err, res) {
  connection.query('select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft", created_by, create_dte from product', function(err, res) {
    console.table(res);
    start();
  });
  }

  function getInvLow() {
    // connection.query("select * from product", function(err, res) {
    connection.query('select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft" from product where stock_qty < 100', function(err, res) {
      console.table(res);
      start();
    });
    }

function addInventory() {
  // query the database for all items currently for sale
  connection.query("SELECT * FROM product", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What product are you adding inventory to??\n======================================"
        },
        {
          name: "qty",
          type: "input",
          message: "Enter the quanity of inventory you are adding"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        console.log("\n" + answer.qty);
        connection.query(
          "UPDATE product SET ? WHERE ?",
          [
            {
              stock_qty: (parseInt(chosenItem.stock_qty) + parseInt(answer.qty))
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("You have added inventory to: " + chosenItem.product_name);
            console.log ("The updated quantity is: " + 
            (parseInt(chosenItem.stock_qty) + parseInt(answer.qty))
            )
            getPriceInvMaster();
          }
        );
      });
    });
  }

  function addNewProduct() {
  connection.query("SELECT name  FROM department", function(err, results) {
  if (err) throw err;
  inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What new product are you adding"
      },
      {
        name: "department_name",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].name);
          }
          return choiceArray;
        },
        message: "To which department is this assigned?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the customer facing price per item?"
      },
      {
        name: "cogs",
        type: "input",
        message: "What is the estimted Cost of Goods Sold per item?"
      },
      {
        name: "stock_qty",
        type: "input",
        message: "What starting quantity are you adding to inventory?"
      }
    ])
    .then(function(answer) {
      let query = "insert into product set ?"
      connection.query(query,
        {
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: answer.price,
          cogs: answer.cogs,
          stock_qty: answer.stock_qty,
          created_by: "MANAGER"
        },
        function(err) {
          if (err) throw err;
          console.log("You have updated inventory with a new product, which has been assigned ASIN: (max id + 1.. need to add");
          getPriceInvMaster();
        }
      );
    });
    });
}