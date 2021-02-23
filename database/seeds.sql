
USE employees_db;
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
    )







