import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.openai.completions.create({
        model: 'text-davinci-003', 
        prompt: prompt,
        max_tokens: 150,
      });

      return response.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateTextModelGPT3(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', 
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
      });
  
      return response?.choices[0]?.message?.content?.trim()!;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }
  

  async generateTextModelGPT4OMini(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 5000,
      });
  
      return response?.choices[0]?.message?.content?.trim()!;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateStream(prompt: string): Promise<ReadableStream> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt },
        ],
        stream: true,
      });
  
      // Convert the response to a ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(content);
          }
          controller.close();
        },
      });
  
      return stream;
    } catch (error) {
      console.error('Error generating stream:', error);
      throw new Error('Failed to generate stream');
    }
  }
  
}