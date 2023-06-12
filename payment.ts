import { XrplClient } from "xrpl-client";
import { utils, derive, sign } from "xrpl-accountlib";
const main = async () => {
  const client = new XrplClient("wss://s.altnet.rippletest.net:51233/");

  if (process.argv.length < 5) {
    console.log("sending payment to destination account");
    console.log("Usage: node dist/payment <FamilySeed> <destinationAddr> XRP");
    process.exit(1);
  }

  const account = derive.familySeed(process.argv[2]);

  const data = await client.send({
    id: 1,
    command: "account_info",
    account: account.address,
    strict: true,
  });

  if (data.error != null) {
    console.log("Error: ", data.result.error_message);
    process.exit(1);
  }
  console.log("data ", data);
  var sequence = data.account_data.Sequence;
  var { id, signedTransaction } = sign(
    {
      TransactionType: "Payment",
      Account: account.address,
      Destination: process.argv[3],
      Amount: String(parseFloat(process.argv[4]) * 1_000_000),
      Sequence: sequence,
      Fee: String(12),
    },
    account
  );
  console.log("id ", id);
  console.log("signedTransaction ", signedTransaction);

  var result = await client.send({
    command: "submit",
    tx_blob: signedTransaction,
  });
  console.log("result1 ", result);

  process.exit(1);
};

main();
