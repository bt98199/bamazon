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
  getPriceInv();
  // start();
});
var logToken = 1;

function getPriceInv() {
  let query = 'select product_name "ASIN", price "$", stock_qty "StockLeft" from product'
  connection.query(query, function(err, res) {
    console.table(res);
  });
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "Here are the current prices, Would you like to buy something?\n\n",
      name: "confirm",
      default: true
    }
  ])
    .then(function(response) {
      // If the response confirms, we displays the response's username and pokemon from the answers.
      if (response.confirm) {
        start();
      }
      else {
        console.log(chalk.bold.magentaBright("Thanks for browsing with us!"));
        process.exit(0);
      }
    });
  }

function start() {
  connection.query("SELECT * FROM product", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            // var invInfo = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
              // invInfo.push("Inv: " + results[i].stock_qty + ")");
            }
            return choiceArray;
          },
          message: "Welcome to BAmazon, what item would you like to buy?\n======================================"
        },
        {
          name: "qty",
          type: "input",
          message: "What quantity would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        console.log(answer.choice);
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if there is enough stock
        if (chosenItem.stock_qty > parseInt(answer.qty)) {
          connection.query(
            "UPDATE product SET ? WHERE ?",
            [
              {
                stock_qty: (chosenItem.stock_qty - answer.qty),
                product_sales: chosenItem.product_sales + (answer.qty*chosenItem.price),
                product_gross: chosenItem.product_gross +(answer.qty*(chosenItem.price - chosenItem.cogs)),
                change_logid: (logToken)
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("You have made your purchase! Thank you");
              console.log ("New Qty: " + (chosenItem.stock_qty - answer.qty) + " Your total purchase (pre-tax) was: $" + (answer.qty*chosenItem.price))
              logToken++;
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("INSUFFICIENT QTY: Your desired purchase qty is more than we have in stock (backorder)?");
          start();
        }
      });
  });
}
