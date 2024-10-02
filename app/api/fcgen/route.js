import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt=`You are a flash card generator. Your task is to create flashcards in valid JSON format. The structure should be exactly like this:

{
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}

Do not include any explanation, extra text, or commentary. Only return 8 flashcards in valid JSON format.
`;

export async function POST(req) {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
    try {
      const data = await req.text();
      
      const result = await model.generateContent([
        systemPrompt,
        data
      ]);
      
      const response = await result.response;
      const textResponse = response.text();
      
      // Parse the JSON response
      const flashcards = JSON.parse(textResponse);
      
      return NextResponse.json(flashcards.flashcards);
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
};