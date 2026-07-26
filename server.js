import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store for listings & bookings
let serverListings = [
  {
    id: "tour-1",
    title: "جولة الأهرامات وأبو الهول الملكية الخاصة",
    category: "Guided Tours",
    location: "الجيزة، مصر",
    rating: 4.9,
    reviewsCount: 128,
    price: 15,
    usdPrice: 450,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80",
    description: "جولة خاصة فاخرة إلى أهرامات الجيزة العظيمة، تمثال أبو الهول، ومعبد الوادي مع مرشد سياحي مصري معتمد.",
    hostName: "Pyramid Elite Tours",
    hostVerified: true
  },
  {
    id: "tour-2",
    title: "رحلة يخت فاخر في البحر الأحمر والغوص",
    category: "Cruises & Boats",
    location: "الغردقة، مصر",
    rating: 4.85,
    reviewsCount: 94,
    price: 10,
    usdPrice: 300,
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "رحلة يوم كامل على يخت VIP حول جزيرة جفتون، تشمل الغوص بين الشعاب المرجانية، وجبة غداء فاخرة، والتوصيل من الفندق.",
    hostName: "Red Sea Captains",
    hostVerified: true
  },
  {
    id: "tour-3",
    title: "سفاري الصحراء مع العشاء البدوي وقيادة البيتش باجي",
    category: "Desert Safari",
    location: "دبي والغردقة",
    rating: 4.95,
    reviewsCount: 210,
    price: 8,
    usdPrice: 240,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    description: "مغامرة تشويق عبر الكثبان الرملية الذهبية، قيادة الدراجات الرباعية، تليها حفلة شواء بدوية تقليدية ورصد النجوم.",
    hostName: "Sahara Adventures",
    hostVerified: true
  },
  {
    id: "tour-4",
    title: "منطاد شروق الشمس فوق معابد الأقصر ووادي الملوك",
    category: "Historical Sites",
    location: "الأقصر، مصر",
    rating: 4.92,
    reviewsCount: 175,
    price: 12,
    usdPrice: 360,
    imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
    description: "تحليق ساحر فوق متحف الأقصر المفتوح مع شروق الشمس، ثم استكشاف مقبرة توت عنخ آمون مع مرشد متخصص.",
    hostName: "Nile Sunrise Flyers",
    hostVerified: true
  },
  {
    id: "tour-5",
    title: "فيلا فاخرة مطلة على النيل وسبا صحي 5 نجوم",
    category: "Hotels & Villas",
    location: "أسوان، مصر",
    rating: 4.88,
    reviewsCount: 82,
    price: 25,
    usdPrice: 750,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "فيلا خاصة فاخرة تطل مباشرة على جزيرة الفنتين مع حمام سباحة إنفينيتي، نادل خاص، وباقة سبا استجمام.",
    hostName: "Nubian Haven Resorts",
    hostVerified: true
  }
];

let serverBookings = [];
let serverPayments = {};

// Check Pi Network environment key configuration status
app.get("/api/pi/config-status", (req, res) => {
  const piApiKey = process.env.PI_API_KEY || process.env.PI_SERVER_API_KEY || process.env.PI_API_SECRET;
  const piWalletSeed = process.env.PI_WALLET_PRIVATE_SEED || process.env.PI_SEED;
  return res.json({
    hasApiKey: !!piApiKey,
    hasWalletSeed: !!piWalletSeed,
    network: "testnet",
    endpoints: ["/api/payments/approve", "/api/payments/complete"]
  });
});

// API route for Pi payment approval (onReadyForServerApproval callback)
app.post("/api/payments/approve", async (req, res) => {
  try {
    const { paymentId, bookingId, amount } = req.body;
    console.log("[Pi Payment Server] Approving payment:", paymentId, "for booking:", bookingId);

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required" });
    }

    serverPayments[paymentId] = {
      paymentId,
      bookingId,
      amount,
      status: "APPROVED",
      approvedAt: new Date().toISOString(),
    };

    const piApiKey = process.env.PI_API_KEY || process.env.PI_SERVER_API_KEY || process.env.PI_API_SECRET;
    
    if (piApiKey) {
      console.log(`[Pi Payment Server] Calling Pi Platform API: POST https://api.minepi.com/v2/payments/${paymentId}/approve`);
      const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${piApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!piResponse.ok) {
        const errText = await piResponse.text();
        console.error("[Pi Payment Server] Pi Platform API approval error:", errText);
        serverPayments[paymentId].status = "APPROVAL_FAILED";
        return res.status(400).json({ error: "Pi Platform API approval failed", details: errText });
      }

      const piData = await piResponse.json().catch(() => ({}));
      console.log("[Pi Payment Server] Pi Platform API approval successful:", piData);
      serverPayments[paymentId].piData = piData;
    } else {
      console.warn("[Pi Payment Server] PI_API_KEY not found in environment. Proceeding with local state approval.");
    }

    return res.json({ success: true, paymentId, status: "APPROVED" });
  } catch (err) {
    console.error("[Pi Payment Server] Approval error:", err);
    return res.status(500).json({ error: "Internal server approval error", details: err.message });
  }
});

// API route for Pi payment completion (onReadyForServerCompletion callback)
app.post("/api/payments/complete", async (req, res) => {
  try {
    const { paymentId, txid, bookingId, amount } = req.body;
    console.log("[Pi Payment Server] Completing payment:", paymentId, "TxID:", txid, "for booking:", bookingId);

    if (!paymentId || !txid) {
      return res.status(400).json({ error: "paymentId and txid are required" });
    }

    const piApiKey = process.env.PI_API_KEY || process.env.PI_SERVER_API_KEY || process.env.PI_API_SECRET;

    if (piApiKey) {
      console.log(`[Pi Payment Server] Calling Pi Platform API: POST https://api.minepi.com/v2/payments/${paymentId}/complete`);
      const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${piApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      });

      if (!piResponse.ok) {
        const errText = await piResponse.text();
        console.error("[Pi Payment Server] Pi Platform API completion error:", errText);
        if (serverPayments[paymentId]) serverPayments[paymentId].status = "COMPLETION_FAILED";
        return res.status(400).json({ error: "Pi Platform API completion failed", details: errText });
      }

      const piData = await piResponse.json().catch(() => ({}));
      console.log("[Pi Payment Server] Pi Platform API completion successful:", piData);
      if (serverPayments[paymentId]) serverPayments[paymentId].piData = piData;
    } else {
      console.warn("[Pi Payment Server] PI_API_KEY not found in environment. Proceeding with local state completion.");
    }

    serverPayments[paymentId] = {
      ...(serverPayments[paymentId] || {}),
      paymentId,
      txid,
      bookingId,
      amount,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };

    if (bookingId) {
      const existingBookingIndex = serverBookings.findIndex((b) => b.id === bookingId);
      if (existingBookingIndex !== -1) {
        serverBookings[existingBookingIndex].status = "paid";
        serverBookings[existingBookingIndex].paymentStatus = "completed";
        serverBookings[existingBookingIndex].txHash = txid;
        serverBookings[existingBookingIndex].paymentId = paymentId;
        serverBookings[existingBookingIndex].paidAt = new Date().toISOString();
      }
    }

    return res.json({
      success: true,
      paymentId,
      txid,
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[Pi Payment Server] Completion error:", err);
    return res.status(500).json({ error: "Internal server completion error", details: err.message });
  }
});

// API route to fetch payments
app.get("/api/payments", (req, res) => {
  return res.json(Object.values(serverPayments));
});

// API routes for listings
app.get("/api/listings", (req, res) => {
  return res.json(serverListings);
});

app.post("/api/listings", (req, res) => {
  if (Array.isArray(req.body)) {
    serverListings = req.body;
  } else {
    serverListings.unshift(req.body);
  }
  return res.json({ success: true, count: serverListings.length });
});

// API routes for bookings
app.get("/api/bookings", (req, res) => {
  return res.json(serverBookings);
});

app.post("/api/bookings", (req, res) => {
  if (Array.isArray(req.body)) {
    serverBookings = req.body;
  } else {
    serverBookings.unshift(req.body);
  }
  return res.json({ success: true, count: serverBookings.length });
});

// API route for Pi user authentication validation
app.post("/api/authenticate-pi", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    const response = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(401).json({ error: "Invalid access token", details: errorText });
    }

    const userData = await response.json();
    return res.json({ success: true, user: userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Serve index.html directly from root folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Static assets fallback
app.use(express.static(__dirname));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Pi Tour Explorer Server running on http://0.0.0.0:${PORT}`);
});
