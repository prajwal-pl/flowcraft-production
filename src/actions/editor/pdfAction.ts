"use server";

import pdf from "pdf-parse";
import { readFile } from "fs/promises";
import fs from "fs";

export const extractText = async (file: File | string) => {
  try {
    let buffer: Buffer;

    if (typeof file === "string") {
      // If file is a path string, read it using fs
      buffer = await readFile(file);
    } else {
      // If file is a File object, convert it to buffer
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const data = await pdf(buffer);
    console.log(data);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};

extractText(
  "file:///C:/Users/prajw/Downloads/19_TPTU_Task_Planning_and_Tool.pdf"
);
