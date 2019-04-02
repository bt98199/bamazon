use bamazon;

select * from product;
select product_name "ASIN", price "$", stock_qty "StockLeft" from product;
select product_name "ASIN", department_name "DEPARTMENT", price "$", concat(round(round(((price-cogs)/price),2)*100,0),"%") "GrossMargin", stock_qty "StockLeft" from product;

select d.id as Dep_ID, d.name as Dep_Name, d.rev_center, concat("$",format(sum(p.product_sales),2)) as Total_Sales, concat("$",format(sum(p.product_gross),2)) as Gross_Profit, concat("$",format(sum(d.over_head_costs) / count(*),2)) as OH_Cost, concat("$",format(sum(p.product_gross) - (sum(d.over_head_costs) / count(*)),2)) as EBITDA from department d left join product p on d.name = p.department_name group by 1,2,3 order by 1;

select s.artist, count(*) 'Debut Hits'
from top5000 s inner join top_albums a on (s.year = a.year and s.artist = a.band)
where s.artist = upper(‘QUEEN’)
group by s.artist
order by count(*) desc;
;
