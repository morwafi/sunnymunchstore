const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");

const PAYFAST_URL = "https://sandbox.payfast.co.za/onsite/process"; // use www.payfast.co.za when live
const MERCHANT_ID = "10000100";
const MERCHANT_KEY = "46f0cd694581a";
const PASSPHRASE = "jt7NOE43FZPn"; // only if enabled

function generateSignature(data, passphrase = "") {
  // Sort keys alphabetically
  const keys = Object.keys(data).filter(k => data[k] !== "" && k !== "signature").sort();

  // Build parameter string
  const paramString = keys
    .map(k => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, "+")}`)
    .join("&");

  // Add passphrase if required
  const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString;

  // Return MD5 hash
  return crypto.createHash("md5").update(stringToHash).digest("hex");
}

async function getPayfastUUID(req, res) {
  try {
    const { email, orderId, amount, itemName } = req.body;

    let data = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: "http://managementdev.sunnymunch.com/payment-success",
      cancel_url: "http://managementdev.sunnymunch.com/payment-cancel",
      notify_url: "http://managementdev.sunnymunch.com/ipn",
      name_first: "Test",
      name_last: "Buyer",
      email_address: email,
      m_payment_id: orderId,
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName,
    };

    data.signature = generateSignature(data, PASSPHRASE);

    const response = await axios.post(PAYFAST_URL, qs.stringify(data), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(response.data); // { uuid: "123-abc" }
  } catch (err) {
    console.error("PayFast error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get PayFast UUID" });
  }
}
