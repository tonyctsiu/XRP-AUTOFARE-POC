import { XrplClient } from "xrpl-client";
import { utils, derive, sign } from "xrpl-accountlib";

const main = async () => {
  const client = new XrplClient("wss://s.altnet.rippletest.net:51233/");

  if (process.argv.length < 3) {
    console.log("create check to destination account");
    console.log("Usage: node dist/ticketCreate <source FamilySeed> ");
    console.log(
      "if sequence no is empty, the sequence no queried from blockchain is used."
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
  console.log("account info: ", data);
  process.exit(1);
};

main();
