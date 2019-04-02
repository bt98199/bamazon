use bamazon;

select * from product;
select product_name "ASIN", price "$", stock_qty "StockLeft" from product;
select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft", created_by, create_dte from product;

select d.id as Dep_ID, d.name as Dep_Name, d.rev_center, concat("$",format(sum(p.product_sales),2)) as Total_Sales, concat("$",format(sum(p.product_gross),2)) as Gross_Profit, concat("$",format(sum(d.over_head_costs) / count(*),2)) as OH_Cost, concat("$",format(sum(p.product_gross) - (sum(d.over_head_costs) / count(*)),2)) as EBITDA, d.user_id as CreatedBy, d.add_dt as Last_Updated from department d left join product p on d.name = p.department_name group by 1,2,3,8,9 order by 1;


