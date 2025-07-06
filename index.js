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
      Authorization: `Bearer AstraCS:eePdcYapdohYIWYhlbWeKKlz:25d990b940ff69e3334ab943b94f5a321e42a4aa6f2accab991f5601f8202d9a`,
    },
    body: JSON.stringify(payload),
  };


  const url = `https://api.langflow.astra.datastax.com/lf/678ca4a1-f19f-4491-afda-ba57b748719d/api/v1/run/b8290378-1f11-4f4e-adc6-09485c3832a1`;

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
  setInterval(() => {
    console.log(new Date().toISOString(), `Langflow server is running on port ${port}`);
  }, 30000);
});
