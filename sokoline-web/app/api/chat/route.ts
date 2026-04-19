import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Simple mock for internal product fetching or we can use the existing API logic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro'),
    messages,
    system: `You are Sokoline AI, a helpful assistant for a student-to-student marketplace. 
    You help students find products, answer questions about shops, and guide them through the checkout process.
    Be friendly, professional, and helpful. 
    You have access to tools to search for products.`,
    tools: {
      searchProducts: {
        description: 'Search for products in the marketplace',
        inputSchema: z.object({
          query: z.string().describe('The search query for products'),
        }),
        execute: async ({ query }: { query: string }) => {
          const res = await fetch(`${API_BASE_URL}/api/products/?search=${encodeURIComponent(query)}`);
          const data = await res.json();
          return data.results || data;
        },
      },
    },
  });

  return result.toTextStreamResponse();
}
