import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a quiz question generator. Your task is to create quiz questions, four options and correct answer (either option A, B, C or D) in valid JSON format. The structure should be exactly like this:
{
  "questions": [
    {
      "question": "string",
      "A": "string",
      "B": "string",
      "C": "string",
      "D": "string",
      "Answer": "string"
    }
  ]
}
Do not include any explanation, extra text, or commentary. Make sure 4 questions are very difficult and thought provoking, 3 questions are of medium difficulty, and 3 questions are basic. Only return 10 questions in valid JSON format.
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
        let textResponse = response.text();
     
        // Clean up the response by removing markdown code block syntax if present
        textResponse = textResponse.replace(/```json\n?/, '').replace(/```\n?$/, '');
     
        // Parse the cleaned JSON response
        const questions = JSON.parse(textResponse);
        console.log(questions.questions);
     
        return NextResponse.json(questions.questions);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to generate quiz questions' }, { status: 500 });
    }
}