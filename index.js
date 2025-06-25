import express from "express";

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());

app.route("/ask").post(async (req, res) => {
  console.log("Received request");
  console.log(req.body);
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

  console.log("Sending payload: ", payload);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  const url = `http://localhost:7868/api/v1/run/${process.env.LANGFLOW_FLOW_ID}`;

  const result = await fetch(url, options).catch((err) => {
    console.log(err);
    res.status(500).send("Error fetching data");
    return;
  });

  console.log("Received response: ", result);

  const data = await result.json();
  const message = data.outputs[0].outputs[0].results.message.text;
  res.status(200).send({ response: message });
});

app.listen(port, () => {
  console.log(`Langflow server is running on port ${port}`);
});
