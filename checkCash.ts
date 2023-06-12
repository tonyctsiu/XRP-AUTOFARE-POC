import { XrplClient } from "xrpl-client";
import { utils, derive, sign } from "xrpl-accountlib";

const main = async () => {
  const client = new XrplClient("wss://s.altnet.rippletest.net:51233/");

  if (process.argv.length < 4) {
    console.log("check cash to destination account");
    console.log(
      "Usage: node dist/checkCash <check recipient's FamilySeed> <CheckId> [cash amount]"
    );
    process.exit(1);
  }

  const account = derive.familySeed(process.argv[2]);

  var data = await client.send({
    id: 1,
    command: "account_info",
    account: account.address,
    strict: true,
  });

  if (data.error != null) {
    console.log("Error: ", data.result.error_message);
    process.exit(1);
  }
  console.log("account status: ", data);
  var sequence = data.account_data.Sequence;

  var amount = null;
  if (process.argv.length >= 5) {
    amount = String(parseFloat(process.argv[4]) * 1_000_000);
  }
  var { id, signedTransaction } = sign(
    {
      TransactionType: "CheckCash",
      Account: account.address,
      Amount: amount,
      CheckID: process.argv[3],
      Sequence: sequence,
      Fee: "12",
    },
    account
  );
  console.log("id ", id);
  console.log("signedTransaction ", signedTransaction);

  var result = await client.send({
    command: "submit",
    tx_blob: signedTransaction,
  });
  if (result.engine_result != "tesSUCCESS") {
    console.log("submit error ", result.engine_result);
    process.exit(1);
  }
  console.log("result ", result);
  console.log("waiting for finalization: ");
  await sleep(10000);

  data = await client.send({
    command: "tx",
    transaction: result.tx_json.hash,
  });
  console.log("finality result: ", JSON.stringify(data, null, 2));
  process.exit(1);
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();
