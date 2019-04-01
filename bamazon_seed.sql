DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE product(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(6,2) NULL,
  cogs DECIMAL(6,2) NULL,
  stock_qty int not null default 0,
  change_logid decimal default 0,
  PRIMARY KEY (item_id)
);

create table change_log (
id int not null auto_increment,
delta_type varchar (99) not null,
delta varchar (200),
user_id varchar (30) not null,
add_dt datetime(0), -- can default be now()?
primary key (id)
);

create table department (
id int not null auto_increment,
name varchar(50) not null,
cost_center varchar (20) not null,
user_id varchar (30) not null,
add_dt datetime(0), -- can default be now()?
primary key (id)
);

insert into product (product_name,department_name, price,cogs,stock_qty)
values ('Kindle','ELECTRONICS',100,35,100), ('Echo','ELECTRONICS',80,35,150), ('Echo Dot','ELECTRONICS',60,20,300), ('Echo Show','ELECTRONICS',150,75,75),
('Canada Goose Coat','CLOTHES',995,200,50),('Ugg Boots','CLOTHES',200,75,150),('Dansko Clogs','CLOTHES',115,20,300),('Saws-all','TOOLS',95,55,100),
('Hilti DX460 Nail gun','TOOLS',350,200,50),('Circular Saw','TOOLS',70,50,200),('Belt Sander','TOOLS',130,80,50),('Air Compressor','TOOLS',60,25,100)
;



select * from change_log;
select * from department;
select * from product;