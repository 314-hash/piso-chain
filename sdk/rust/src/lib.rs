//! PISO Chain Official Rust SDK.

use sha2::{Digest, Sha256};

pub struct Wallet {
    pub private_key_hex: String,
    pub public_key_hex: String,
    pub address: String,
    pub coin_type: u32,
}

impl Wallet {
    /// Generate a new PISO Chain Wallet.
    pub fn generate_wallet(seed: &[u8], coin_type: u32) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(seed);
        let priv_hash = hasher.finalize();
        let priv_hex = hex::encode(priv_hash);

        let mut pub_hasher = Sha256::new();
        pub_hasher.update(format!("piso-pub-{}", priv_hex).as_bytes());
        let pub_hash = pub_hasher.finalize();
        let pub_hex = hex::encode(pub_hash);

        let mut addr_hasher = Sha256::new();
        addr_hasher.update(format!("piso-addr-{}", pub_hex).as_bytes());
        let addr_hash = addr_hasher.finalize();
        let addr = format!("0x{}", hex::encode(&addr_hash[12..]));

        Wallet {
            private_key_hex: format!("0x{}", priv_hex),
            public_key_hex: format!("0x{}", pub_hex),
            address: addr,
            coin_type,
        }
    }

    /// Recover wallet from private key hex string.
    pub fn recover_wallet(priv_key_hex: &str, coin_type: u32) -> Self {
        let clean_hex = priv_key_hex.trim_start_matches("0x");

        let mut pub_hasher = Sha256::new();
        pub_hasher.update(format!("piso-pub-{}", clean_hex).as_bytes());
        let pub_hash = pub_hasher.finalize();
        let pub_hex = hex::encode(pub_hash);

        let mut addr_hasher = Sha256::new();
        addr_hasher.update(format!("piso-addr-{}", pub_hex).as_bytes());
        let addr_hash = addr_hasher.finalize();
        let addr = format!("0x{}", hex::encode(&addr_hash[12..]));

        Wallet {
            private_key_hex: format!("0x{}", clean_hex),
            public_key_hex: format!("0x{}", pub_hex),
            address: addr,
            coin_type,
        }
    }

    /// Sign transaction payload.
    pub fn sign_transaction(&self, msg_hash: &[u8]) -> Vec<u8> {
        let mut hasher = Sha256::new();
        hasher.update(self.private_key_hex.as_bytes());
        hasher.update(msg_hash);
        hasher.finalize().to_vec()
    }

    /// Verify transaction signature.
    pub fn verify_signature(&self, msg_hash: &[u8], signature: &[u8]) -> bool {
        let expected = self.sign_transaction(msg_hash);
        expected == signature
    }
}
