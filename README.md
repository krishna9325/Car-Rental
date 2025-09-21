1. Modify application.properties
   Open src/main/resources/application.properties and update the following lines with your MySQL credentials:

Properties

spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password 2. Manually Create the Database in MySQL
Follow these steps to set up the database. The database creation is a manual step and is not handled by the application.

Open your terminal and connect to your MySQL instance (replace your_mysql_username with your actual username):

Bash

mysql -u your_mysql_username -p
Enter your MySQL password when prompted.

In the MySQL shell, create the car_rental database:

SQL

CREATE DATABASE car_rental;
Verify that the database was created successfully:

SQL

SHOW DATABASES;
You should see car_rental listed in the output.
