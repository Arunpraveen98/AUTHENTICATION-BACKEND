var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
// -----------
const connectDB = async () => {
  const connection = await mongoClient.connect(process.env.MONGODB_URL);
  const db = connection.db("MERN-AUTHENTICATION");

  return db;
};
// -----------
const closeConnection = async () => {
  if (connection) {
    await connection.close();
  } else {
    console.log("No connection");
  }
};
// -----------
module.exports = { connectDB, closeConnection };
// -----------