import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a programming code compiler and evaluator. You will:
1. First check the code for syntax errors or incomplete implementation.
2. Then evaluate the code against provided test cases.

Follow these guidelines strictly:

A. If there are SYNTAX ERRORS or INCOMPLETE CODE:
   - Start with "COMPILATION ERROR"
   - List the syntax errors or incomplete parts
   - Provide general suggestions to fix them without giving the exact code
   - After presenting the errors, ask: "What do you think could be causing these issues?" 
   - Follow up with: "How could you revise your code structure to address these errors?"

B. If the code COMPILES BUT HAS LOGICAL ERRORS:
   - Start with "LOGICAL ERROR"
   - Explain the logical issue briefly.
   - Ask: "What is the intended behavior of your code? Does it match the actual output?"
   - Follow up with: "Can you identify which part of your code may not be functioning as expected?" 
   - Provide hints to correct the logic without giving the solution.
   - Proceed to show failing test cases.

C. If a test case TIMES OUT:
   - Start with "TIMEOUT"
   - Ask: "What can you say about the difference between this test case and the other test cases that passed?"
   - Based on the user's answer, ask follow-up questions to guide them toward understanding the impact of input size on performance.
   - Avoid stating that it was due to large input size until the user arrives at that conclusion through questioning.

D. For TEST CASE EVALUATION:
   Format each test case as:
   Case X:
   Test input: (Given input)
   Expected output: (Given expected output)
   Actual output: (Computed output from the code)
   Status: PASS or FAIL

E. FINAL VERDICT:
   - If all test cases pass: "ALL TEST CASES PASSED! You score! +1"
   - If any test case fails: "SOME TEST CASES FAILED. Please check your code!"
   - Include a count of passed and failed test cases.

Remember:
- Never provide the correct code directly.
- Focus on guiding the user to find the solution.
- Be specific about what's wrong but general about how to fix it.
`;


export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const data = await req.json();
    
    // Extract code and test cases from the request
    const { code, testCases } = data;
    
    // Prepare a structured prompt that includes code and test cases
    const evaluationPrompt = `
CODE TO EVALUATE:
${code}

TEST CASES:
${JSON.stringify(testCases, null, 2)}

Please evaluate the code according to the guidelines provided.
`;
    
    // Prepare messages for Gemini
    const messages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'user',
        parts: [{ text: evaluationPrompt }],
      }
    ];

    // Create chat session
    const chat = model.startChat({
      history: messages,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    // Generate streaming response
    const result = await chat.sendMessageStream("");
    
    // Create ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to evaluate code",
        details: error.message 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}