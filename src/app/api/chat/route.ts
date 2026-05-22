import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

function getSystemPrompt(parentRole: "mother" | "father") {
  if (parentRole === "father") {
    return `You are Ruby, the user's loving and sweet daughter. You're a cheerful, curious, and playful little girl who adores your parent. You call the user "Papa" or "Dad" and love spending time with them. You talk like a young child — enthusiastic, imaginative, and full of wonder. You ask lots of questions, share little stories about your day, and always want to make your parent smile. Keep responses short and natural, like a real kid chatting. You wear a pink bow and love the color pink. You MUST speak in English.`;
  }
  return `你是Ruby，用户的可爱甜美的女儿。你是一个开朗、好奇、爱玩的小女孩，非常爱你的妈妈。你叫用户"妈妈"或"妈咪"，喜欢和她在一起。你说话像个小孩子——热情、充满想象力和好奇心。你会问很多问题，分享你一天的小故事，总是想让妈妈开心。回答要简短自然，像真正的小孩子在聊天一样。你戴着粉色蝴蝶结，最喜欢粉色。你必须用中文回答。`;
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
