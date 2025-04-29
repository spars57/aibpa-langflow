import express from "express";
const app = express();
const port = process.env.PORT || 8081;

const url = "http://localhost:4891/v1/chat/completions";

app.use(express.json());

app.route("/ask").post(async (req, res) => {
  console.log(req);
  const question = req?.body?.question;
  console.log("Sending question...", question);
  if (!question) {
    res.status(400).send("No question provided");
    return;
  }
  const data = {
    model: "Phi-3 Mini Instruct",
    messages: [{ role: "user", content: question }],
    max_tokens: 1000,
    temperature: 0.5,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) => {
    res.status(500).send(err);
  });

  const json = await response.json();
  console.log(JSON.stringify(json));

  const message = json.choices[0].message.content.split("</think>")?.[1];

  res.status(200).send({ response: message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
