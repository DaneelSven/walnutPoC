const solanaWeb3 = require("@solana/web3.js");
const fs = require("fs");
const { Keypair, Transaction, TransactionInstruction } = solanaWeb3;

const fromKeypair = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(fs.readFileSync("/Users/master/.config/solana/id.json", "utf8"))
  )
);

const programId = new solanaWeb3.PublicKey(
  "CtAceJvdwaiuJvxGaAwj7u4XJNfSZnMKoGp1m2qkKp1f"
);
const connection = new solanaWeb3.Connection(
  "http://localhost:8899",
  "confirmed"
);

async function ensureFunds() {
  const balance = await connection.getBalance(fromKeypair.publicKey);
  if (balance < solanaWeb3.LAMPORTS_PER_SOL) {
    console.log("Airdropping 2 SOL...");
    const airdropSignature = await connection.requestAirdrop(
      fromKeypair.publicKey,
      2 * solanaWeb3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    console.log("Airdrop complete");
  }
}

async function sendTransaction() {
  await ensureFunds();

  let instruction = new TransactionInstruction({
    keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
    programId: programId,
    data: Buffer.alloc(0), // No additional data required for this instruction
  });

  let transaction = new Transaction().add(instruction);

  try {
    let signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    console.log("Transaction successful with signature:", signature);
    console.log("You should see the Program logs in your solana logs terminal");
  } catch (err) {
    console.error("Transaction failed:", err);
  }
}

sendTransaction();
