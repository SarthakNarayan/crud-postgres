CREATE DATABASE perntodo;

-- Switch to the database using \c perntodo

CREATE TABLE todo
(
    todo_id SERIAL PRIMARY KEY,
    descp VARCHAR(200) NOT NULL
);