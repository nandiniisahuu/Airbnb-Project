const Home = require("../models/home");
const Booking = require("../models/booking");
const User = require("../models/user");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find();

    const bookings = await Booking.find({
      status: "confirmed",
    }).populate("user");

    const bookingsByHome = {};

    bookings.forEach((booking) => {
      bookingsByHome[booking.home.toString()] = booking;
    });

    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      bookingsByHome: bookingsByHome,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (error) {
    console.log("Error while loading host homes:", error);
    res.status(500).send("Unable to load host homes");
  }
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(houseName, price, location, rating, description);
  console.log(req.file);

  if (!req.file) {
    return res.status(422).send("No image provided");
  }

  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } =
    req.body;;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated ", result);
        })
        .catch((err) => {
          console.log("Error while updating ", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};



exports.getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("home")
      .populate("user");

    // Sirf wahi bookings rakho jinke homes abhi exist karte hain
    const validBookings = bookings.filter(booking => booking.home);

    res.render("host/host-bookings", {
      bookings: validBookings,
      pageTitle: "Host Bookings",
      currentPage: "host-bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (error) {
    console.log("Error while fetching host bookings:", error);
    res.status(500).send("Unable to fetch host bookings");
  }
};


exports.postHostCancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    await Booking.findByIdAndDelete(bookingId);

    console.log("Host cancelled booking:", bookingId);

    res.redirect("/host/host-home-list");

  } catch (error) {
    console.log("Error while cancelling host booking:", error);
    res.status(500).send("Unable to cancel booking");
  }
};


exports.postCancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    await Booking.findByIdAndDelete(bookingId);

    console.log("Host cancelled booking:", bookingId);

    res.redirect("/host/host-home-list");

  } catch (error) {
    console.log("Error while host cancelling booking:", error);
    res.status(500).send("Unable to cancel booking");
  }
};