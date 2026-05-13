require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sumbos Backend Running"
    });
});

/* ✅ IMPORTANT: THIS IS YOUR BASE ROUTE */
app.use("/payment", paymentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});