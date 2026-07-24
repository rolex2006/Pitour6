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

// Callback when an incomplete payment is found during Pi SDK authentication
export const onIncompletePaymentFound = (payment: any) => {
  console.log('[Pi SDK] Incomplete payment found:', payment);
  if (payment && payment.identifier && payment.transaction && payment.transaction.txid) {
    completePaymentOnServer(
      payment.identifier,
      payment.transaction.txid,
      payment.metadata?.bookingId || '',
      payment.amount || 0
    ).catch((err) => console.error('[Pi SDK] Incomplete payment resolution error:', err));
  }
};

// Authenticate Pi User with required 'username' and 'payments' scopes
export async function authenticatePiUser(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).Pi) {
    const PiObj = (window as any).Pi;
    initPiSDK();
    const scopes = ['username', 'payments'];
    console.log('[Pi SDK] Requesting Pi authentication with scopes:', scopes);
    const authResult = await PiObj.authenticate(scopes, onIncompletePaymentFound);
    console.log('[Pi SDK] Authentication result:', authResult);
    return authResult;
  }
  return null;
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
