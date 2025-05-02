import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = () => {
  mongoose.connection.once("open", () => console.log("DB connection"));
  mongoose.set("strictQuery", true);
  // return mongoose.connect(
  //   `mongodb+srv://${process.env.DB_LINK}?retryWrites=true&w=majority`,
  //   { keepAlive: true }
  // );
  return mongoose.connect(process.env.DB_LINK, { keepAlive: true });

};
