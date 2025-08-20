const express = require("express");
const ProductTracking = require("../models/tracking");
const geoip = require("geoip-lite");

const router = express.Router();

router.post("/product-tracking", async (req, res) => {
  try {
    const { productId, type } = req.body;

    if (!productId || !["like", "add_to_cart"].includes(type)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const ip =
      (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress|| "").trim();
    const geo = geoip.lookup(ip);
    const country = geo?.country || "UnknownCountry";
    const province = geo?.region || "UnknownRegion";
    const city = geo?.city || "UnknownCity";
    const locationKey = `${country}_${province}_${city}`;

    const update = {
        $inc: {
            [`regionStats.${locationKey}`] : 1,
            ...(type === "like" ? {likes: 1} : {}),
            ...(type === "add_to_cart" ? {addToCartCount: 1} : {})
        },
        $push: {
            trackingHistory: { type, region: locationKey, date: new Date() }
        }
    };

    await ProductTracking.findByIdAndUpdate(
        productId, 
        update,
        { upsert: true, new: true}
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error tracking event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/top-products-region", async (req, res) => {
  try {
    const { timeframe = "weekly" } = req.query;

    const ip =
      (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "").trim();
    const geo = geoip.lookup(ip);

    const country = geo?.country || "UnknownCountry";
    const province = geo?.region || "UnknownRegion";
    const city = geo?.city || "UnknownCity";
    const locationKey = `${country}_${province}_${city}`;

    // Date filtering
    let sinceDate = new Date();
    if (timeframe === "daily") sinceDate.setDate(sinceDate.getDate() - 1);
    else if (timeframe === "weekly") sinceDate.setDate(sinceDate.getDate() - 7);
    else if (timeframe === "monthly") sinceDate.setMonth(sinceDate.getMonth() - 1);

    // Aggregate trending products in this region
    const trending = await ProductTracking.aggregate([
      { $match: { "trackingHistory.region": locationKey } },
      { $unwind: "$trackingHistory" },
      {
        $match: {
          "trackingHistory.region": locationKey,
          "trackingHistory.date": { $gte: sinceDate }
        }
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          fileUrl: { $first: "$fileUrl" },
          price: { $first: "$price" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ region: locationKey, timeframe, products: trending });
  } catch (err) {
    console.error("Error getting trending products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
