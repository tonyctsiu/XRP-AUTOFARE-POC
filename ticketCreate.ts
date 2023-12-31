import { XrplClient } from "xrpl-client";
import { utils, derive, sign } from "xrpl-accountlib";

const main = async () => {
  const client = new XrplClient("wss://s.altnet.rippletest.net:51233/");

  if (process.argv.length < 3) {
    console.log("create check to destination account");
    console.log("Usage: node dist/ticketCreate <source FamilySeed> ");
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

  var sequence = data.account_data.Sequence;

  var { id, signedTransaction } = sign(
    {
      TransactionType: "TicketCreate",
      Account: account.address,
      TicketCount: 1,
      Sequence: sequence,
      Fee: "12",
    },
    account
  );
  console.log("account info: ", data);
  console.log("id ", id);
  console.log("signedTransaction ", signedTransaction);
  var result = await client.send({
    command: "submit",
    tx_blob: signedTransaction,
  });

  console.log("transaction send result: ", result);
  if (result.engine_result_code != 0) {
    console.log("Exit on error");
    process.exit(1);
  }

  const subscribeData = await client.send({
    command: "subscribe",
    accounts: [account.address],
  });
  console.log("Subscribe: ", subscribeData);
  client.on("transaction", (data) => {
    console.log("transaction result: ", JSON.stringify(data, null, 2));
    if (data.engine_result_code != 0) {
      process.exit(1);
    }
    let affectedNodes = data.meta.AffectedNodes;
    console.log(
      "Seeking new sequence number for affectNodes = ",
      affectedNodes
    );
    if (affectedNodes == null) {
      console.log("new ticket number not found");
    }
    affectedNodes.forEach((item: any) => {
      if (item.hasOwnProperty("CreatedNode")) {
        console.log(
          "new sequence number =",
          item.CreatedNode.NewFields.TicketSequence
        );
      }
    });
    process.exit(1);
  });
  //  process.exit(1);
};

main();
