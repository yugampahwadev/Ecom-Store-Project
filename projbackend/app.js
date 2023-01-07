require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

const port = process.env.PORT;

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
