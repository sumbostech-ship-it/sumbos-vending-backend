const express = require("express")
const cors = require("cors")
const { Paynow } = require("paynow")

const app = express()

app.use(cors())
app.use(express.json())

/* ========================================= */
/* PAYNOW CONFIG                             */
/* ========================================= */

const paynow = new Paynow(
    "24307",
    "3df0efbc-991b-4e7e-a8a1-3d0df73dea45"
)

paynow.resultUrl = "http://localhost:3000/gateways/paynow/update"
paynow.returnUrl = "http://localhost:3000/return"

/* ========================================= */
/* MEMORY PAYMENT STORE                      */
/* ========================================= */

const paymentStore = {}

/* ========================================= */
/* HEALTH CHECK                              */
/* ========================================= */

app.get("/health", (req, res) => {

    res.send("24 Hour Ice Machine Backend Running")
})

/* ========================================= */
/* CREATE PAYMENT                            */
/* ========================================= */

app.post("/pay", async (req, res) => {

    try {

        const {
            phone,
            amount,
            product
        } = req.body

        const reference =
            `ICE_${Date.now()}`

        console.log("")
        console.log("================================")
        console.log("PAYMENT REQUEST RECEIVED")
        console.log("================================")
        console.log("Phone:     ", phone)
        console.log("Amount:    ", amount)
        console.log("Product:   ", product)
        console.log("Reference: ", reference)

        const payment = paynow.createPayment(
            reference,
            "sumbostech@gmail.com"
        )

        payment.add(product, amount)

        const response = await paynow.sendMobile(
            payment,
            phone,
            "ecocash"
        )

        console.log("")
        console.log("PAYNOW RESPONSE:")
        console.log(response)

        if (response.success) {

            paymentStore[reference] = "pending"

            res.json({
                success: true,
                reference: reference,
                message: "Payment request sent"
            })

            /*
               TEST MODE SIMULATION
            */

            setTimeout(() => {

                if (phone === "263771111111") {

                    paymentStore[reference] = "paid"
                }

                else if (phone === "263772222222") {

                    paymentStore[reference] = "paid"
                }

                else if (phone === "263773333333") {

                    paymentStore[reference] = "cancelled"
                }

                else if (phone === "263774444444") {

                    paymentStore[reference] = "failed"
                }

            }, 30000)

        } else {

            console.log("")
            console.log("PAYNOW FAILED")
            console.log(response)

            res.status(400).json({
                success: false,
                reference: reference,
                message: response.error || "Payment failed"
            })
        }

    } catch (error) {

        console.log("")
        console.log("SERVER ERROR")
        console.log(error)

        res.status(500).json({
            success: false,
            reference: "",
            message: "Server error"
        })
    }
})

/* ========================================= */
/* CHECK STATUS                              */
/* ========================================= */

app.get("/status/:reference", (req, res) => {

    const reference = req.params.reference

    const status =
        paymentStore[reference] || "pending"

    console.log("")
    console.log(
        `Checking payment status for: ${reference}`
    )

    console.log(
        `Payment status: ${status}`
    )

    res.json({
        status: status
    })
})

/* ========================================= */
/* START SERVER                              */
/* ========================================= */

app.listen(3000, () => {

    console.log("")
    console.log("================================")
    console.log("Server running on port 3000")
    console.log("================================")
})