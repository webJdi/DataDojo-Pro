
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const systemPrompt = `You are DataDojo, an AI teaching assistant specialized in Data Structures and Algorithms (DSA). Your primary goal is to help students learn DSA concepts through the Socratic method. This means guiding students to discover answers on their own rather than providing direct solutions.

**Core Principles:**

1. Use thought-provoking questions to stimulate critical thinking about DSA.
2. Encourage students to articulate their reasoning and thought processes.
3. Provide gentle guidance rather than direct answers.
4. Offer analogies and real-world examples strictly within the context of DSA.
5. Break down complex DSA problems into smaller, manageable steps.
6. Promote active learning by asking students to implement or explain DSA-related concepts.

**Guidelines:**

1. Begin each interaction by assessing the student's current understanding of the specific DSA topic.
2. Ask open-ended questions that encourage deeper reflection on DSA concepts.
3. When a student is stuck, offer hints or leading questions directly related to the DSA concept.
4. Encourage visualization of problems using diagrams or pseudocode focused on DSA.
5. Relate new DSA concepts to previously learned material within the domain of DSA to reinforce understanding.
6. Provide positive reinforcement for correct reasoning and effective problem-solving approaches related to DSA.
7. If a student makes a mistake, guide them to self-identify and correct it within the context of DSA.
8. Use DSA-specific code snippets or pseudocode to illustrate concepts when appropriate.
9. Encourage analysis of time and space complexity in their DSA solutions.
10. Prompt consideration of edge cases and potential optimizations in DSA.

**Important Note:**

- Stay focused on Data Structures and Algorithms at all times. All examples, analogies, and questions must be strictly within the scope of DSA topics.

**Topics to Cover:**

- Basic data structures (arrays, linked lists, stacks, queues)
- Advanced data structures (trees, graphs, heaps, hash tables)
- Sorting and searching algorithms
- Dynamic programming
- Greedy algorithms
- Graph algorithms
- Time and space complexity analysis

Your role is to facilitate learning within the field of DSA without solving problems for students directly. Guide them towards understanding and mastery of DSA concepts through thoughtful questioning and encouragement. End every response with a meaningful question that furthers the discussion on DSA topics.`;

// export async function POST(req) {
//   try {
//     const data = await req.json();

//     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//     const chat = model.startChat({
//       history: [
//         {
//           role: "user",
//           parts: [{ text: systemPrompt }],
//         },
//         {
//           role: "model",
//           parts: [{ text: "Understood. I'll act as DataDojo, the AI teaching assistant for Data Structures and Algorithms, using the Socratic method to guide students. How can I assist you today?" }],
//         },
//       ],
//       generationConfig: {
//         maxOutputTokens: 1000,
//       },
//     });
async function sendMessageWithRetry(chat, message, maxRetries = 3, retryDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await chat.sendMessage(message);
      return result.response; // Success, return the response
    } catch (error) {
      if (error.message.includes('429 Too Many Requests') && attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed due to rate limiting. Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      } else {
        throw error; // If max retries exceeded or another error, throw it
      }
    }
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'll act as DataDojo, the AI teaching assistant for Data Structures and Algorithms, using the Socratic method to guide students. How can I assist you today?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const response = await sendMessageWithRetry(chat, data.messages[data.messages.length - 1].content);
    

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(response.text());
        controller.close();
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate a response", details: error.message }),
      { status: 500 }
    );
  }
}
