const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db-connection");

// using middleware
app.use(cors());
app.use(express.json()); // will give us req.body

// Routes

// Creating a todo
app.post("/todos", async (req, res) => {
  try {
    //   destructuring description
    // const description = req.body.description; same as below
    const { description } = req.body;
    // $1 is a placeholder, description is the value of $1
    // returning * is used when you are inserting updating or deleting and you want to return back the data
    const newTodo = await pool.query(
      "INSERT INTO todo (descp) VALUES ($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Getting all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    // we don't do rows[0] since we have multiple items
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Getting a specific todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specificTodo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1",
      [id]
    );
    res.json(specificTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Updating a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    //  collecting the old to do to show the change
    const specificTodo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1",
      [id]
    );
    const updateTodo = await pool.query(
      " UPDATE todo SET descp = $1 WHERE todo_id = $2 RETURNING *",
      [description, id]
    );

    // checking if returned value is empty if yes then query was unsuccessful
    if (updateTodo.rows[0]) {
      res.json(
        `To do was successfullt updated from ${specificTodo.rows[0].descp} => ${description}`
      );
    } else {
      res.json("Invalid ID");
    }
    // res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// deleting a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    res.json(`Todo ${deletedTodo.rows[0].descp} was deleted`);
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log(" Server started on port 5000....");
});
