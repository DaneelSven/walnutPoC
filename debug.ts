import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import { exec } from "child_process";

const keypairPath = process.env.HOME + "/.config/solana/id.json";
const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
);
const payer = Keypair.fromSecretKey(secretKey);

async function fetchTransaction(transactionSignature: string) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    const transaction = await connection.getConfirmedTransaction(
      transactionSignature
    );

    if (transaction) {
      const transactionDetails = JSON.stringify(transaction, null, 2);
      fs.writeFileSync("transactionDetails.json", transactionDetails);
      console.log("Transaction details saved to transactionDetails.json");

      return transaction;
    } else {
      console.log("Transaction not found");
      throw new Error("Transaction not found");
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}

async function recreateTransaction(txDetails: any) {
  const connection = new Connection("http://localhost:8899", "confirmed");

  const instructions = txDetails.transaction.instructions.map((ix: any) => {
    const newKeys = ix.keys.map((key: any) => {
      if (key.isSigner) {
        return {
          pubkey: payer.publicKey,
          isSigner: true,
          isWritable: key.isWritable,
        };
      }
      return {
        pubkey: new PublicKey(key.pubkey),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      };
    });

    return new TransactionInstruction({
      keys: newKeys,
      programId: new PublicKey(ix.programId),
      data: Buffer.from(ix.data),
    });
  });

  const { blockhash } = await connection.getRecentBlockhash();

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: payer.publicKey,
  }).add(...instructions);

  transaction.sign(payer);

  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);
    console.log("Transaction signature:", signature);

    return await new Promise((resolve, reject) => {
      exec(
        `solana confirm ${signature} --verbose --url http://localhost:8899`,
        (error, stdout, stderr) => {
          if (error) {
            reject(`Error: ${stderr}`);
          } else {
            resolve(stdout);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}

async function main() {
  if (process.argv.length !== 3) {
    console.error("Usage: walnut debug solana <tx-hash>");
    process.exit(1);
  }

  const txHash = process.argv[2];
  try {
    const txDetails = await fetchTransaction(txHash);
    const logs = (await recreateTransaction(txDetails)) as string;

    console.log("Transaction Logs:\n", logs);

    fs.writeFileSync("transactionLogs.txt", logs);
    console.log("Logs written to transactionLogs.json");
  } catch (error) {
    console.error("Failed to debug transaction:", error);
  }
}

main().catch(console.error);
