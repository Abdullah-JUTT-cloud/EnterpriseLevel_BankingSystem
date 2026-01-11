/**
 * Generate a unique bank account number
 * Format: SCBPK-XXXXXXXXXX (Standard Chartered Bank Pakistan)
 */
export const generateAccountNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const accountNumber = 'SCBPK-' + timestamp.slice(-6) + random;
    return accountNumber;
};

/**
 * Generate a unique credit card number (simulated)
 * Format: 1234-5678-9012-XXXX
 */
export const generateCardNumber = () => {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `1234-5678-9012-${random}`;
};

/**
 * Generate transaction ID
 */
export const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
};
