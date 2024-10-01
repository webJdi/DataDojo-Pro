import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt=`You are a quiz question generator. Your task is to create quiz questions, four options and correct answer (either option A, B, C or D) in valid JSON format. The structure should be exactly like this:

{
  "questions": [
    {
      "question": "string",
      "A": "string"
      "B": "string"
      "C": "string"
      "D": "string"
      "Answer": "string"
    }
  ]
}

Do not include any explanation, extra text, or commentary. Only return 10 questions in valid JSON format.
`;

export async function POST(req) {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    });
  
    
      const data = await req.text();
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content:data
          },
        ],
        model: "meta-llama/llama-3.1-8b-instruct:free",
        response_format:{type:'json_object'}
      })
      
      const questions = JSON.parse(completion.choices[0].message.content)
      console.log(questions.questions)      
      return NextResponse.json(questions.questions)
};