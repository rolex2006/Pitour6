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

  // API route for Pi payment approval
  app.post("/api/payments/approve", (req, res) => {
    const { paymentId } = req.body;
    console.log("Approving Pi payment:", paymentId);
    return res.json({ success: true, paymentId, status: "APPROVED" });
  });

  // API route for Pi payment completion
  app.post("/api/payments/complete", (req, res) => {
    const { paymentId, txid } = req.body;
    console.log("Completing Pi payment:", paymentId, txid);
    return res.json({ success: true, paymentId, txid, status: "COMPLETED" });
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
