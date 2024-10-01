import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a programming code compiler. You will strictly take the code, written either in python, javascript, or C, take in the test case inputs, compute the program using the test case inputs and check if it matches with test case outputs which are given to you. Strictly return the result in the following format:
Case 1:
Test input: (Given to you)

Expected output: (Given to you)

Code output: (Compute the output based on the code and input and return the result only. Don't explain the result. Please focus on getting the correct output here. This is your main task)

...so on

Your prime objective is to compute and judge the program written, whether it is written correctly or not.

At the beginning, mention "You score! +1" if all the Code outputs and Expected outputs match, else mention "Please check your code!"
`;

// The POST method to handle the incoming API request
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  });

  try {
    const data = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data.messages, 
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      stream: true, 
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text); 
            }
          }
        } catch (err) {
          controller.error(err); 
        } finally {
          controller.close(); 
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate a response" }),
      { status: 500 }
    );
  }
}
