import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 100,
  messages: [{ role: "user", content: "Say hello in one word." }],
});
console.log(response.content);
