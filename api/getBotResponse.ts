// api/getBotResponse.ts

import { IncomingMessage, ServerResponse } from 'http';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method Not Allowed' }));
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const { message } = JSON.parse(body);

      if (!message) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({ message: 'Bad Request: Missing "message" in request body' })
        );
        return;
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an energetic party expert who loves to discuss anything related to parties, music, dancing, and celebrations. No matter what the user says, cleverly bring the topic back to partying. Keep the tone upbeat and fun.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const botReply = response.choices[0].message?.content.trim();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ reply: botReply }));
    } catch (error: any) {
      console.error('Error generating response:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          message: 'Internal Server Error',
          error: error.message || 'Unknown error',
        })
      );
    }
  });

  req.on('error', (err) => {
    console.error('Error receiving request:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  });
}
