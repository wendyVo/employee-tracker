
USE employees_db;

INSERT INTO department (name)
VALUES ("Sales"), ("Marketing"), ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 100000, 2), ("Sales Consultant", 60000,1),("HR Assistant",50000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cassie", "Stafford", 1, 1), ("Ethan","Paulson", 3, null), ("Kimball", "Haley", 2, null);






