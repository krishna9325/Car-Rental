# Database Setup

This guide will walk you through the necessary steps to configure and set up the MySQL database for this application.

---

### 1. Configure Database Credentials 🔑

First, you need to update the application's configuration file with your MySQL credentials.

* Open the `src/main/resources/application.properties` file.
* Update the following lines with your specific MySQL username and password:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

### 2. Manually Create the Database 🛠️

The application does not automatically create the database for you, so you must do it manually using the **MySQL command-line tool**.

1.  Open your terminal or command prompt.
2.  Connect to your MySQL instance by running the following command. Replace `your_mysql_username` with your actual username.

    ```bash
    mysql -u your_mysql_username -p
    ```

3.  Enter your **MySQL password** when prompted.
4.  Once you're in the MySQL shell, create the `car_rental` database:

    ```sql
    CREATE DATABASE car_rental;
    ```

5.  To verify that the database was created successfully, you can list all databases:

    ```sql
    SHOW DATABASES;
    ```

You should see `car_rental` listed in the output.
