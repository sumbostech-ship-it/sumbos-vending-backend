const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const payments = {};

// TEST
router.get("/test", (req, res) => {
    res.send("ROUTE IS WORKING");
});

// CREATE
router.post("/create", async (req, res) => {
    try {
        const { phone, amount, wallet, product } = req.body;

        if (!phone || !amount || !wallet) {
            return res.status(400).json({
                success: false,
                message: "Missing payment fields"
            });
        }

        const reference = uuidv4();

        payments[reference] = {
            reference,
            phone,
            amount,
            wallet,
            product,
            status: "PENDING",
            createdAt: Date.now()
        };

        return res.json({
            success: true,
            reference,
            status: "PENDING",
            pollUrl: `/payment/status/${reference}`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// STATUS
router.get("/status/:reference", (req, res) => {
    const { reference } = req.params;

    const payment = payments[reference];

    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found"
        });
    }

    return res.json({
        success: true,
        status: payment.status,
        data: payment
    });
});

module.exports = router;
