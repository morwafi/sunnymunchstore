const express = require("express");
const crypto = require('crypto');

const router = express.Router();

// Generate PayFast signature
function generatePayfastSignature(data, passPhrase = "") {
  const keys = Object.keys(data).filter(k => data[k] !== "" && k !== "signature").sort();

  let str = keys
    .map(k => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, "+")}`)
    .join("&");

  if (passPhrase) {
    str += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(str).digest("hex");
}

// Create payment route (returns parameters & signature to frontend)
router.post("/create-payment", (req, res) => {
  try {
    const { email, orderId, amount, itemName } = req.body;
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const pfData = {
      merchant_id: process.env.PF_MERCHANT_ID,
      merchant_key: process.env.PF_MERCHANT_KEY,
      return_url: process.env.PF_RETURN_URL,
      cancel_url: process.env.PF_CANCEL_URL,
      notify_url: process.env.PF_NOTIFY_URL,
      email_address: email,
      m_payment_id: orderId,
      amount: numericAmount.toFixed(2),
      item_name: itemName,
    };

    pfData.signature = generatePayfastSignature(pfData, process.env.PF_PASSPHRASE);

    // Return all parameters to frontend
    res.json({ pfData });
  } catch (err) {
    console.error("PayFast creation error:", err.message);
    res.status(500).json({ error: "Failed to create PayFast payment" });
  }
});

// IPN webhook
router.post('/ipn', (req, res) => {
  const ipnData = req.body;

  const expectedSig = generatePayfastSignature(ipnData, process.env.PF_PASSPHRASE);
  if (expectedSig !== ipnData.signature) {
    console.error("PayFast IPN signature mismatch");
    return res.status(400).send("Invalid signature");
  }

  console.log("IPN received:", ipnData);

  // Here: update order in DB based on ipnData.payment_status
  res.sendStatus(200);
});

router.get("/payment-success", (req, res) => {
  res.send("Payment successful ✅");
});

router.get("/payment-cancelled", (req, res) => {
  res.send("Payment cancelled ❌");
});

module.exports = router;
