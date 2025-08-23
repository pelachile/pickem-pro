/**
 * Cryptographic utilities for Supabase Edge Functions
 * 
 * Provides secure password hashing and verification using
 * the Web Crypto API available in Deno runtime.
 */

/**
 * Hash a password with a random salt using SHA-256
 * 
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password in format "salt:hash"
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate a random 16-byte salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Encode the password + salt
    const encoder = new TextEncoder();
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const passwordData = encoder.encode(password + saltHex);
    
    // Hash the password with salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Return salt:hash format for storage
    return `${saltHex}:${hashHex}`;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against a stored hash
 * 
 * @param password - The plain text password to verify
 * @param storedHash - The stored hash in format "salt:hash"
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Split the stored hash to get salt and hash
    const [saltHex, originalHash] = storedHash.split(':');
    
    if (!saltHex || !originalHash) {
      console.error('Invalid stored hash format');
      return false;
    }
    
    // Encode the password + salt
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password + saltHex);
    
    // Hash the input password with the same salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare the hashes
    return hashHex === originalHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Generate a cryptographically secure random string
 * 
 * @param length - The desired length of the random string
 * @param charset - The character set to use (default: alphanumeric)
 * @returns string - Random string of specified length
 */
export function generateSecureRandomString(
  length: number, 
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
): string {
  const result = [];
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  
  for (let i = 0; i < length; i++) {
    result.push(charset[randomValues[i] % charset.length]);
  }
  
  return result.join('');
}

/**
 * Generate a secure invite code for leagues
 * 
 * @param length - The desired length of the invite code (default: 8)
 * @returns string - Secure alphanumeric invite code
 */
export function generateInviteCode(length: number = 8): string {
  // Use uppercase letters and numbers, excluding easily confused characters
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return generateSecureRandomString(length, charset);
}