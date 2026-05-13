const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")

// =====================================
// TEMP PAYMENT STORAGE
// =====================================

const payments = {}

// =====================================
// INITIATE PAYMENT
// =====================================

router.post("/initiate", async (req, res) => {

    try {

        const {

            phone,
            amount,
            wallet,
            product

        } = req.body

        // =====================================
        // VALIDATION
        // =====================================

        if (!phone || !amount || !wallet) {

            return res.status(400).json({

                success: false,
                message: "Missing payment fields"

            })
        }

        // =====================================
        // CREATE TRANSACTION REFERENCE
        // =====================================

        const reference = uuidv4()

        // =====================================
        // STORE PAYMENT
        // =====================================

        payments[reference] = {

            reference,

            phone,

            amount,

            wallet,

            product,

            status: "PENDING",

            createdAt: Date.now()
        }

        // =====================================
        // LOG PAYMENT
        // =====================================

        console.log("NEW PAYMENT REQUEST")

        console.log(payments[reference])

        // =====================================
        // RETURN RESPONSE
        // =====================================

        return res.json({

            success: true,

            reference: reference,

            status: "PENDING",

            pollUrl: `/payments/status/${reference}`
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({

            success: false,
            message: "Server error"

        })
    }
})

// =====================================
// CHECK PAYMENT STATUS
// =====================================

router.get("/status/:reference", (req, res) => {

    try {

        const reference = req.params.reference

        const payment = payments[reference]

        if (!payment) {

            return res.status(404).json({

                success: false,
                message: "Payment not found"
            })
        }

        return res.json({

            success: true,

            payment
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({

            success: false,
            message: "Server error"
        })
    }
})

// =====================================
// MOCK PAYMENT SUCCESS
// =====================================
// TEMPORARY TEST ENDPOINT
// Used to simulate Ecocash/InnBucks success
// =====================================

router.post("/mock-success/:reference", (req, res) => {

    try {

        const reference = req.params.reference

        const payment = payments[reference]

        if (!payment) {

            return res.status(404).json({

                success: false,
                message: "Payment not found"
            })
        }

        payment.status = "PAID"

        payment.paidAt = Date.now()

        console.log("PAYMENT SUCCESS")

        console.log(payment)

        return res.json({

            success: true,

            message: "Payment marked as PAID",

            payment
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({

            success: false,
            message: "Server error"
        })
    }
})

module.exports = router