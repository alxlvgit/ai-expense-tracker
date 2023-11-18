"use server";

import OpenAI from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Get a description of the data on a receipt image
export const imageToText = async (base64Image: string) => {
  const url = `data:image/jpeg;base64,${base64Image}`;
  const openai = new OpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is the date, purchase category and total on this receipt image?",
          },
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices);
  await textToObject(response.choices[0].message.content as string);
};

// Schema for the extraction function
const extractionFunctionSchema = {
  name: "extractor",
  description: "Extracts the date, category and total from a receipt image",
  parameters: zodToJsonSchema(
    z.object({
      total: z.number().describe("The total amount on the receipt"),
      date: z.coerce.date().describe("The date of the receipt"),
      category: z.string().describe("The category of the receipt"),
    })
  ),
};

// Convert extracted text to an object with the date, category and total
const textToObject = async (text: string) => {
  const model = new ChatOpenAI({
    modelName: "gpt-4",
  }).bind({
    functions: [extractionFunctionSchema],
    function_call: { name: "extractor" },
  });

  const result = await model.invoke([new HumanMessage(text)]);
  console.log(
    JSON.parse(result.additional_kwargs.function_call?.arguments as string)
  );
};
