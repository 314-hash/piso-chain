import { ethers } from "ethers";

export interface WalletInfo {
  address: string;
  mnemonic: string;
  privateKey: string;
  publicKey: string;
}

export class PISOWallet {
  /**
   * Generate new 24-word BIP-39 HD Wallet.
   */
  public static generateWallet(coinType: number = 2026): WalletInfo {
    const randomWallet = ethers.Wallet.createRandom();
    const mnemonic = randomWallet.mnemonic?.phrase || "";
    const path = `m/44'/${coinType}'/0'/0/0`;
    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(mnemonic),
      path
    );

    return {
      address: wallet.address,
      mnemonic: mnemonic,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    };
  }

  /**
   * Recover wallet from BIP-39 mnemonic string.
   */
  public static recoverWallet(mnemonic: string, coinType: number = 2026): WalletInfo {
    const path = `m/44'/${coinType}'/0'/0/0`;
    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(mnemonic),
      path
    );

    return {
      address: wallet.address,
      mnemonic: mnemonic,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    };
  }

  /**
   * Sign transaction hash with private key.
   */
  public static async signTransaction(privateKey: string, messageHash: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(ethers.getBytes(messageHash));
  }

  /**
   * Verify signature against message.
   */
  public static verifySignature(message: string, signature: string, expectedAddress: string): boolean {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  }
}
