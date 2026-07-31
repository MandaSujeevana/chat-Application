import { MongoClient } from "mongodb";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = process.env.MONGO_URI || "mongodb+srv://mandamini006_db_user:INsLm9PayjabNSGg@imessagee.xmohsud.mongodb.net/?appName=imessagee";

try {
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected!");
  await client.close();
} catch (err) {
  console.error(err);
}