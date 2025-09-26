const axios = require("axios");
const crypto = require("crypto");
const express = require("express");
const { cp } = require("fs");
const routes = express.Router();
const qs = require("querystring")
// ✅ Step 1: Signature string generator
function generateSignature(data, passPhrase = null) {
  let sigString = "";
  for (let key in data) {
    if(data.hasOwnProperty(key)){
      if(data[key] !== ""){
        sigString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
      }
    }
  }

  let tempString = sigString.slice(0, -1); // Remove trailing '&'
  if (passPhrase) {
    tempString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }

  console.log("Signature string:", sigString);

  return crypto.createHash("md5").update(tempString).digest("hex");
}

// ✅ Step 2: POST body (URL-encoded)
function dataToString(dataArray) {
  let pfParamString = "";

  for (let key in dataArray) {
    if (dataArray.hasOwnProperty(key)) {
      pfParamString += `${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}&`;
    }
  }
  return pfParamString.slice(0, -1);
}

async function generatePaymentIdentifier(pfParamString) {
  console.log("PayFast request body:", pfParamString);
 let identifier = null;
try {
  const res = await axios.post(
    "https://sandbox.payfast.co.za/onsite/process",
    pfParamString,
  );
  console.log("PayFast response:", res.data);
  identifier = res.data.uuid || null;
} catch (err) {
  console.error("PayFast error:", err.response?.data || err.message);
  identifier = null;
}
return identifier;

}

// ✅ Main route
routes.post("/create-payment", async (req, res) => {
  try {
    const { email, orderId, amount, itemName } = req.body;

    const myData = {
      merchant_id : "10030343",
      merchant_key: "jxbs6ert20gg3",
      return_url : "http://managementdev.sunnymunch.com/payment-success",
      cancel_url: "http://managementdev.sunnymunch.com/payment-cancel",
      notify_url : "http://managementdev.sunnymunch.com/ipn",
      name_first : "Test",
      name_last : "Buyer",
      email_address : email,
      m_payment_id : orderId,
      amount : parseFloat(amount).toFixed(2),
      item_name : itemName,
    };
    const passPhrase = "11060209Morwafi";

    // Generate signature
    myData["signature"] = generateSignature(myData, passPhrase);
    console.log("Generated signature:", myData["signature"]);
    // Convert to encoded param string
    const pfParamString = dataToString(myData);

    // Get UUID
    const identifier = await generatePaymentIdentifier(pfParamString);

    console.log('retrieved uuid', identifier);
    if (!identifier) {
      return res.status(400).json({ error: "Failed to generate UUID" });
    }

    // ✅ Send UUID back to frontend
    res.json({ uuid: identifier });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

module.exports = routes;
