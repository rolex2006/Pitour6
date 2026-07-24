import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory store for sync
  let serverListings: any[] = [];
  let serverBookings: any[] = [];
  let serverPayments: Record<string, any> = {};

  // API route for Pi payment approval (onReadyForServerApproval callback)
  app.post("/api/payments/approve", async (req, res) => {
    try {
      const { paymentId, bookingId, amount } = req.body;
      console.log("[Pi Payment Server] Approving payment:", paymentId, "for booking:", bookingId);

      if (!paymentId) {
        return res.status(400).json({ error: "paymentId is required" });
      }

      // Record payment status in server memory
      serverPayments[paymentId] = {
        paymentId,
        bookingId,
        amount,
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
      };

      // If Pi Platform API key is available, send approval request to Pi Network API
      const piApiKey = process.env.PI_API_KEY;
      if (piApiKey) {
        const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${piApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!piResponse.ok) {
          const errText = await piResponse.text();
          console.error("[Pi Payment Server] Pi Platform API approval error:", errText);
          serverPayments[paymentId].status = "APPROVAL_FAILED";
          return res.status(400).json({ error: "Pi Platform API approval failed", details: errText });
        }
      }

      return res.json({ success: true, paymentId, status: "APPROVED" });
    } catch (err: any) {
      console.error("[Pi Payment Server] Approval error:", err);
      return res.status(500).json({ error: "Internal server approval error" });
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

      // If Pi Platform API key is available, send completion request to Pi Network API
      const piApiKey = process.env.PI_API_KEY;
      if (piApiKey) {
        const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${piApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ txid })
        });

        if (!piResponse.ok) {
          const errText = await piResponse.text();
          console.error("[Pi Payment Server] Pi Platform API completion error:", errText);
          if (serverPayments[paymentId]) serverPayments[paymentId].status = "COMPLETION_FAILED";
          return res.status(400).json({ error: "Pi Platform API completion failed", details: errText });
        }
      }

      // Update payment record in memory
      serverPayments[paymentId] = {
        ...(serverPayments[paymentId] || {}),
        paymentId,
        txid,
        bookingId,
        amount,
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
      };

      // Update associated booking in server store if present
      if (bookingId) {
        const existingBookingIndex = serverBookings.findIndex((b: any) => b.id === bookingId);
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
    } catch (err: any) {
      console.error("[Pi Payment Server] Completion error:", err);
      return res.status(500).json({ error: "Internal server completion error" });
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

      // Call Pi API to get user info
      const response = await fetch("https://api.minepi.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Pi API error response:", errorText);
        return res.status(401).json({ error: "Invalid access token" });
      }

      const userData = await response.json();
      // userData should contain the user info (e.g., { uid, username, ... })
      return res.json({ success: true, user: userData });
    } catch (error: any) {
      console.error("Pi authentication validation error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development or serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
