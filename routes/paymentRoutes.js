const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // ✅ import uuid

// Temporary in-memory store (replace with DB later)
const payments = {};

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

        console.log("NEW PAYMENT REQUEST");
        console.log(payments[reference]);

        return res.json({
            success: true,
            reference: reference,
            status: "PENDING",
            pollUrl: `/payment/status/${reference}`
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;