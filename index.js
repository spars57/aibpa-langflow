import { LangflowClient } from "@datastax/langflow-client";

const apiKey = process.env.LANGFLOW_API_KEY;
const langflowId = process.env.LANGFLOW_ID;
const flowId = process.env.FLOW_ID;

const client = new LangflowClient({
  langflowId,
  apiKey,
});

const flow = client.flow(flowId);

import express from "express";
const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());

app.route("/ask").post(async (req, res) => {
  const question = req?.body?.question;
  if (!question) {
    res.status(400).send("No question provided");
    return;
  }
  const result = await flow.run(question, {}).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
  const chatOutputText = result?.chatOutputText();
  const response = {
    question: question,
    response: chatOutputText,
  };
  res.status(200).send(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
