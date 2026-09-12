const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ================= LOGIN PAGE =================
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

// ================= SIGNUP PAGE =================
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
    },
    user: {},
  });
};

// ================= SIGNUP =================
exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .trim()
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain atleast one special character"),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        user: {},
      });
    }

    try {
      // Email ko clean + lowercase rakhenge
      const cleanEmail = email.trim().toLowerCase();

      // Check existing user
      const existingUser = await User.findOne({
        email: cleanEmail,
      });

      if (existingUser) {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: ["Email already registered. Please login."],
          oldInput: {
            firstName,
            lastName,
            email,
            userType,
          },
          user: {},
        });
      }

      // Password hash
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : "",
        email: cleanEmail,
        password: hashedPassword,
        userType,
      });

      await user.save();

      console.log("User registered:", cleanEmail, userType);

      res.redirect("/login");

    } catch (error) {
      console.log("Signup error:", error);

      res.status(500).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: ["Signup failed. Please try again."],
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        user: {},
      });
    }
  },
];

// ================= LOGIN =================
exports.postLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // IMPORTANT
    // Login email ko bhi signup jaisa clean karna
    email = email.trim().toLowerCase();

    console.log("Login attempt:", email);

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      console.log("User not found:", email);

      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: { email },
        user: {},
      });
    }

    // Password check
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      console.log("Wrong password for:", email);

      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid Password"],
        oldInput: { email },
        user: {},
      });
    }

    // Login session
    req.session.isLoggedIn = true;
    req.session.user = user;

    await req.session.save();

    console.log(
      "Login successful:",
      user.email,
      "Type:",
      user.userType
    );

    res.redirect("/");

  } catch (error) {
    console.log("Login error:", error);

    res.status(500).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Something went wrong during login"],
      oldInput: {
        email: req.body.email || "",
      },
      user: {},
    });
  }
};

// ================= LOGOUT =================
exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Logout error:", error);
      return res.redirect("/");
    }

    res.redirect("/login");
  });
};