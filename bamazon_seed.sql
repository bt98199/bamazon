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
  product_sales decimal (12,2) default 0,
  product_gross decimal (12,2) default 0,
  create_dte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id)
);

create table change_log (
id int not null auto_increment,
sourceid varchar(4),
delta_type varchar (99) not null,
delta varchar (200),
user_id varchar (30) not null,
add_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
primary key (id)
);

create table department (
id int not null auto_increment,
name varchar(50) not null,
over_head_costs int not null,
rev_center varchar (20) not null,
user_id varchar (30) not null,
add_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
primary key (id)
);

insert into product (product_name,department_name, price,cogs,stock_qty)
values ('Kindle','ELECTRONICS',100,35,100), ('Echo','ELECTRONICS',80,35,150), ('Echo Dot','ELECTRONICS',60,20,300), ('Echo Show','ELECTRONICS',150,75,75),
('Canada Goose Coat','CLOTHES',995,200,50),('Ugg Boots','CLOTHES',200,75,150),('Dansko Clogs','CLOTHES',115,20,300),('Saws-all','TOOLS',95,55,100),
('Hilti DX460 Nail gun','TOOLS',350,200,50),('Circular Saw','TOOLS',70,50,200),('Belt Sander','TOOLS',130,80,50),('Air Compressor','TOOLS',60,25,100)
;

-- insert into department (name,over_head_costs, rev_center,user_id,add_dt)
-- values ('ELECTRONICS',300,'EE100','SYSADMIN',now()), ('CLOTHES',200,'TX100','SYSADMIN',now()), ('TOOLS',100,'TO555','SYSADMIN',now()), ('COSMETICS',150,'CS105','SYSADMIN',now())
-- ;
insert into department (name,over_head_costs, rev_center,user_id)
values ('ELECTRONICS',3000,'EE100','SYSADMIN'), ('CLOTHES',2000,'TX100','SYSADMIN'), ('TOOLS',1000,'TO555','SYSADMIN'), ('COSMETICS',1500,'CS105','SYSADMIN')
;

insert into change_log (sourceid,delta_type, delta, user_id)
values ('A001','TABLE_CREATION','SQL QUERY bamazon_seed.sql','SYSADMIN')
;

select * from change_log;
select * from department;
select * from product;





