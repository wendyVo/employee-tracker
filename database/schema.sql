/* Schema for SQL database/table */
DROP DATABASE IF EXISTS employees_db;


CREATE DATABASE employees_db;
USE employees_db;


CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) UNSIGNED NOT NULL,
  department_id INT  UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  INDEX dept_id (department_id),
  CONSTRAINT department_fk FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);


CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    INDEX roleId (role_id),
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX manId (manager_id),
    CONSTRAINT manager_fk FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

/* ON DELETE CASCADE: SQL Server deletes the rows in the child table that is corresponding*/
/* to the row deleted from the parent table.*/

/*ON DELETE SET NULL: SQL Server sets the rows in the child table to NULL if the corresponding
 rows in the parent table are deleted. To execute this action, the foreign key columns must be 
 nullable.*/


