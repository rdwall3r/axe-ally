import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 100,
  messages: [{ role: "user", content: "Say hello in one word." }],
});
console.log(response.content);
