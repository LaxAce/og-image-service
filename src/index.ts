import cors from "cors";
import express from "express";
import routes from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/v1/images", routes)

app.listen(port, () => console.log(`Listening on port ${port}!`));
