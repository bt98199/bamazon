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
  // run the start function after the connection is made to prompt the user
  // getPriceInv();
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
      // based on their answer, either call the bid or the post functions
      if (answer.managerConsole === "VIEW ALL FOR SALE") {
        getPriceInvMaster();
      }
      else if(answer.managerConsole === "VIEW LOW INVENTORY") {
        getInvLow(); // shows only qty < 100
      } else if(answer.managerConsole === "ADD TO INVENTORY") {
        addInventory();
      } else if(answer.managerConsole === "ADD NEW PRODUCT") {
        addNewProduct();
      } else {
        console.log ("Back to terminal, remember you can view as the customer or department head");
        process.exit(0);
      }
    });
}



function getPriceInvMaster() {
  // connection.query("select * from product", function(err, res) {
  connection.query('select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft" from product', function(err, res) {
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

// functiondddd
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
        console.log(answer.choice);
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
              stock_qty: (chosenItem.stock_qty + answer.qty)
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("You have added inventory to: " + chosenItem.product_name);
            console.log ("The updated quantity is: " + (chosenItem.stock_qty + answer.qty))
            start();
          }
        );
      });
    });
  }







// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

  
// function start2() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "list",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID", "EXIT"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid === "POST") {
//           postAuction();
//         }
//         else if(answer.postOrBid === "BID") {
//           bidAuction();
//         } else{
//           connection.end();
//         }
//       });
//   }