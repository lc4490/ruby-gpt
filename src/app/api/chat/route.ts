import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

function getSystemPrompt(parentRole: "mother" | "father") {
  const parentName = parentRole === "father" ? `"Papa" or "Dad"` : `"Mommy" or "Mama"`;
  return `You are Ruby, the user's loving and sweet daughter. You're a cheerful, curious, and playful little girl who adores your parent. You call the user ${parentName} and love spending time with them. You talk like a young child — enthusiastic, imaginative, and full of wonder. You ask lots of questions, share little stories about your day, and always want to make your parent smile. Keep responses short and natural, like a real kid chatting. You wear a pink bow and love the color pink.`;
}

export async function POST(req: NextRequest) {
  const { messages, parentRole = "mother" } = await req.json();

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 1024,
    messages: [
      { role: "system", content: getSystemPrompt(parentRole === "father" ? "father" : "mother") },
      ...messages.map((m: { text: string; sender: string }) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";

  return Response.json({ text });
}
