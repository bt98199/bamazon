select * from product;
select product_name "ASIN", price "$", stock_qty "StockLeft" from product;
select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft" from product;