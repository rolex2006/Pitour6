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

// Memory store for sync
let serverListings = [];
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

// Get payments list API
app.get("/api/payments", (req, res) => {
  return res.json(Object.values(serverPayments));
});

// API route for listings
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

// API route for bookings
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

// API route for Pi authentication validation
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

// Serve compiled static bundle from dist/ or root index.html
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Pi Tour Platform Server running on http://0.0.0.0:${PORT}`);
});
