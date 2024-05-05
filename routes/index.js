var express = require("express");
var router = express.Router();
const client = require("../app_api/models/db");

router.get("/", async function (req, res, next) {
  try {
    console.log("index");
    let token = false;
    if (req.session.token) {
      token = req.session.token;
      console.log("Token:", token);
    }

    res.render("index", { token });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks");
  }
});

router.get("/register", function (req, res, next) {
  console.log("Register Page");
  let token = false;
  if (req.session.token) {
    token = req.session.token;
    console.log("Token:", token);
  }
  res.render("register", { token });
});

router.post("/register", async function (req, res, next) {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send("Passwords do not match");
  }

  try {
    const query =
      "INSERT INTO task_management.users (email, password) VALUES ($1, $2)";
    await client.query(query, [email, password]);

    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

router.get("/login", function (req, res, next) {
  console.log("login Page");
  let token = false;

  res.render("login", { token, message: "" });
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const query =
      "SELECT user_id FROM task_management.users WHERE email = $1 AND password = $2";
    const result = await client.query(query, [email, password]);

    if (result.rows.length > 0) {
      const userId = result.rows[0].user_id;
      req.session.userId = userId;
      req.session.token = true;
      console.log(userId);
      res.redirect("/");
    } else {
      var token = false;
      console.log("here");
      res.render("login", { message: "invaid password or email" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Error authenticating user");
  }
});

module.exports = router;
