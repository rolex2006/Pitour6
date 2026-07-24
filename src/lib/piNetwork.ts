// Pi Network Centralized Configuration & API Utilities
// Compatible with both Pi Testnet and Pi Mainnet by modifying sandbox setting

export interface PiNetworkConfig {
  sandbox: boolean; // true = Pi Testnet, false = Pi Mainnet
  version: string;
  approvalEndpoint: string;
  completionEndpoint: string;
}

export const PI_CONFIG: PiNetworkConfig = {
  // Set to true for Pi Testnet, set to false when deploying to Pi Mainnet
  sandbox: true,
  version: '2.0',
  approvalEndpoint: '/api/payments/approve',
  completionEndpoint: '/api/payments/complete',
};

// Initialize Pi SDK if available in window object
export function initPiSDK(): boolean {
  if (typeof window !== 'undefined' && (window as any).Pi) {
    try {
      (window as any).Pi.init({
        version: PI_CONFIG.version,
        sandbox: PI_CONFIG.sandbox,
      });
      console.log(`[Pi SDK] Initialized in ${PI_CONFIG.sandbox ? 'TESTNET (Sandbox)' : 'MAINNET'} mode.`);
      return true;
    } catch (err) {
      console.warn('[Pi SDK] Initialization error:', err);
    }
  }
  return false;
}

// Server approval callback
export async function approvePaymentOnServer(paymentId: string, bookingId: string, amount: number) {
  const response = await fetch(PI_CONFIG.approvalEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, bookingId, amount }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Server approval failed');
  }
  return await response.json();
}

// Server completion callback
export async function completePaymentOnServer(paymentId: string, txid: string, bookingId: string, amount: number) {
  const response = await fetch(PI_CONFIG.completionEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, txid, bookingId, amount }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Server completion failed');
  }
  return await response.json();
}
