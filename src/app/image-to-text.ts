"use server";

import OpenAI from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

type ImageToTextResponse = Promise<
  | { failure?: undefined; success: string }
  | { failure: string; success?: undefined }
>;

type TextToObjectResponse = Promise<
  | {
      failure?: undefined;
      success: { date: string; category: string; total: number };
    }
  | { failure: string; success?: undefined }
>;

// Get a description of the data on a receipt image
export const imageToText = async (base64Image: string): ImageToTextResponse => {
  try {
    const url = `data:image/jpeg;base64,${base64Image}`;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 80,
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
    const result = response.choices?.[0]?.message?.content;
    if (!result) {
      return { failure: "Could not extract text from image" };
    }
    return { success: result };
  } catch (error) {
    console.error(error);
    return { failure: "Could not extract text from image" };
  }
};

// Schema for the extraction function
const extractionFunctionSchema = {
  name: "extractor",
  description: "Extracts the date, category and total from a receipt image",
  parameters: zodToJsonSchema(
    z.object({
      total: z.number().describe("The total amount on the receipt"),
      date: z.coerce
        .date()
        .describe("The date of the receipt in the format MM-DD-YYYY"),
      category: z
        .enum(["grocery", "transportation", "clothing", "other"])
        .describe("The category of the receipt"),
    })
  ),
};

// Convert extracted text to an object with the date, category and total
export const textToObject = async (text: string): TextToObjectResponse => {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo", // use gpt-4 for production for better and faster results
    }).bind({
      functions: [extractionFunctionSchema],
      function_call: { name: "extractor" },
    });

    const result = await model.invoke([new HumanMessage(text)]);
    console.log(
      JSON.parse(result.additional_kwargs.function_call?.arguments as string)
    );
    const structuredData = result?.additional_kwargs?.function_call?.arguments;
    if (!structuredData) {
      return { failure: "Could not extract structured data from text" };
    }
    // Prevent the user to upload any receipts where the date, category or total is not visible and not extracted
    const obj = JSON.parse(structuredData);
    if (!obj.date) {
      return { failure: "Could not extract date from the text" };
    }
    if (!obj.category) {
      return { failure: "Could not extract category from the text" };
    }
    if (!obj.total) {
      return { failure: "Could not extract total from the text" };
    }
    return { success: obj };
  } catch (error) {
    console.error(error);
    return { failure: "Could not extract structured data from text" };
  }
};
