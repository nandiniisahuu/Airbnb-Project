const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");

exports.getIndex = async (req, res, next) => {
  try {
    console.log("Session Value: ", req.session);

    // HOST KO GUEST HOME PAGE PAR MAT DIKHAO
    if (req.session.user && req.session.user.userType === "host") {
      return res.redirect("/host/host-home-list");
    }

    const registeredHomes = await Home.find();

    let bookedHomeIds = [];

    if (req.session.user) {
      const bookings = await Booking.find({
        user: req.session.user._id,
        status: "confirmed",
      });

      bookedHomeIds = bookings.map((booking) => booking.home.toString());
    }

    res.render("store/index", {
      registeredHomes: registeredHomes,
      bookedHomeIds: bookedHomeIds,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("Error while loading homes:", error);
    res.status(500).send("Unable to load homes");
  }
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookings = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const bookings = await Booking.find({ user: userId }).populate("home");

    console.log("BOOKINGS:", bookings);

    res.render("store/bookings", {
      bookings: bookings,
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.log("Error while fetching bookings:", error);
    res.status(500).send("Unable to fetch bookings");
  }
};

exports.postBookHome = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const homeId = req.params.homeId;
    const userId = req.session.user._id;

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).send("Home not found");
    }

    const existingBooking = await Booking.findOne({
      home: homeId,
      status: "confirmed",
    });

    if (existingBooking) {
      return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home Already Booked | StayNest</title>
      <link rel="stylesheet" href="/output.css">
    </head>

    <body class="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div class="w-full max-w-md">

        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">

          <div class="mx-auto mb-6 w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <span class="text-4xl">🔒</span>
          </div>

          <span class="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4">
            Booking Unavailable
          </span>

          <h2 class="text-2xl font-bold text-gray-900">
            Home Already Booked
          </h2>

          <p class="text-gray-500 mt-3 leading-6">
            Sorry, this property has already been booked by another guest.
            Please explore other available homes on StayNest.
          </p>

          <div class="mt-7 flex flex-col gap-3">

            <a
              href="/homes"
              class="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              🏠 Browse Available Homes
            </a>

            <a
              href="/bookings"
              class="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              📋 View My Bookings
            </a>

          </div>

        </div>

        <p class="text-center text-sm text-gray-400 mt-5">
          StayNest · Find your perfect stay
        </p>

      </div>

    </body>
    </html>
  `);
    }

    const booking = await Booking.create({
      home: homeId,
      user: userId,
      status: "confirmed",
    });

    console.log("Booking created:", booking);

    res.redirect("/bookings");
  } catch (error) {
    if (error.code === 11000) {
      return res.send(`
        <h2>Sorry, this home has already been booked.</h2>
        <a href="/homes">Go back to Homes</a>
      `);
    }

    console.log("Error while booking:", error);
    res.status(500).send("Booking failed");
  }
};

exports.postCancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.session.user._id;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    await Booking.findByIdAndDelete(bookingId);

    console.log("Booking cancelled:", bookingId);

    res.redirect("/bookings");
  } catch (error) {
    console.log("Error while cancelling booking:", error);
    res.status(500).send("Unable to cancel booking");
  }
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");

  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;

  const user = await User.findById(userId);

  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }

  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;

  const user = await User.findById(userId);

  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((fav) => fav != homeId);

    await user.save();
  }

  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};
