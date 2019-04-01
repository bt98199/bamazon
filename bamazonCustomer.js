var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  getPriceInv();
  // start();
});


function getPriceInv() {
  // connection.query("select * from product", function(err, res) {
  connection.query('select product_name "ASIN", price "$", stock_qty "StockLeft" from product', function(err, res) {
    // for (var i = 0; i < res.length; i++) {
    //   console.log(res[i].product_name + " | " + res[i].price + " | " + res[i].stock_qty);
    // }
    // console.log (res);
    console.table(res);
    console.log("-----------------------------------");
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
      console.log("RESPONSE: ", response);
      if (response.confirm) {
        start();
      }
      else {
        console.log ("Thanks for browsing with us!");
        process.exit(0);
      }
    });


  }






// functiondddd
function start() {
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
            var invInfo = [];
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
          message: "What quantity would you like to buy"
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
          // qty was high enough, so update db, let the user know, and start over
          console.log("\n" + answer.qty);
          connection.query(
            "UPDATE product SET ? WHERE ?",
            [
              {
                stock_qty: (chosenItem.stock_qty - answer.qty)
                // stock_qty: 50
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("You have made your purchase! Thank you");
              console.log ("New Qty: " + (chosenItem.stock_qty - answer.qty) + " Your total purchase (pre-tax) was: $" + (answer.qty*chosenItem.price))
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