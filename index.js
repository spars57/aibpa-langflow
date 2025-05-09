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

  const payload = {
    input_value: question,
    output_type: "chat",
    input_type: "chat",
    session_id: "user_1",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  const url = `https://api.langflow.astra.datastax.com/lf/${process.env.LANGFLOW_ID}/api/v1/run/${process.env.LANGFLOW_FLOW_ID}`;

  const result = await fetch(url, options);

  const data = await result.json();
  const message = data.outputs[0].outputs[0].results.message.text;
  res.status(200).send({ response: message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
