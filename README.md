# Solana Programs

Solana programs are executable modules on the Solana blockchain, written in languages like Rust and compiled to BPF bytecode.

## Comparison between Solana and Ethereum

| Feature                   | Solana                                                                                      | Ethereum                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Terminology**           | Programs                                                                                    | Smart Contracts                                                                     |
| **Execution Environment** | Runs BPF (Berkeley Packet Filter) bytecode                                                  | Runs EVM (Ethereum Virtual Machine) bytecode                                        |
| **State Management**      | Programs are stateless, with state managed through external accounts.                       | Smart contracts are stateful, with state stored directly within the contract.       |
| **Account Model**         | Uses a unique account model where accounts hold state and are passed as inputs to programs. | Uses a contract-based model where each contract maintains its own state internally. |
|                           | Programs themselves do not maintain state.                                                  |                                                                                     |

## Accounts and Data Storage

- **Accounts**: In Solana, accounts are the primary units of data storage. Each account can hold data and Solana's native token (SOL).
- **Program Accounts**: These are special types of accounts that store the executable code of the programs.
- **State Accounts**: These accounts store the state information that programs need to read from or write to during execution.

## Program Execution

- When a program is invoked, it is provided with a set of accounts that it has permission to read from or write to.
- The program can perform computations and modify the data within these accounts, but it does not retain any state itself between transactions.

## Instructions and Transactions

- **Instructions**:
  - Each instruction to a program includes a list of accounts and the data to be processed.
- **Transactions**:
  - Transactions bundle one or more instructions, which are then processed atomically by the Solana runtime.

# Solana Commands and Setup

## Get Devnet Transaction

To get a confirmed transaction on Devnet, use the following `curl` command:

```sh
curl -X POST https://api.devnet.solana.com -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getConfirmedTransaction",
  "params": ["45jaG1SEb2XgfBKQZkWqB14wMETiKfJYe1HHjs6xqop2i5s7YKWYZ1GpvreXKFn7eGk4nN25ZXa3fHfoBU4Brdcd", {"encoding": "json"}]
}'
```

Alternatively, you can use the Solana CLI:

```sh
solana confirm 45jaG1SEb2XgfBKQZkWqB14wMETiKfJYe1HHjs6xqop2i5s7YKWYZ1GpvreXKFn7eGk4nN25ZXa3fHfoBU4Brdcd --url https://api.devnet.solana.com
```

## command to run script

`npm run debug-solana -- 45jaG1SEb2XgfBKQZkWqB14wMETiKfJYe1HHjs6xqop2i5s7YKWYZ1GpvreXKFn7eGk4nN25ZXa3fHfoBU4Brdcd`

## documentation on how to fork/snapshot solana

https://docs.solanalabs.com/operations/guides/restart-cluster

Deployed walnut program id: CtAceJvdwaiuJvxGaAwj7u4XJNfSZnMKoGp1m2qkKp1f

## deploy contract

build contract: `cargo build-bpf`
build with debug: `cargo build-bpf --debug`

deploy contract: `solana program deploy ./target/deploy/wallnut.so
keypair_path: /Users/master/.config/solana/id.json`

## get solana logs

`solana logs -v`

## run solana in debug mode

`solana-ledger-tool program run -l /Users/master/test-ledger -e debugger target/deploy/walnut.so`

## run solana low level debugger

`solana-lldb`

## vs code setup for step-by-step Debugging

run tasks

- build
- solana-debuger

then run Debugger
