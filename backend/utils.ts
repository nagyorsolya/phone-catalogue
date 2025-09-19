import fs from "fs";
import path from "path";

export interface Phone {
  id: number;
  name: string;
  manufacturer: string;
  description: string;
  color: string;
  price: number;
  imageFileName: string;
  screen: string;
  processor: string;
  ram: number;
}

/**
 * Loads and parses the phones data from the JSON file
 * @returns Promise<Phone[]> Array of phone objects
 * @throws Error if file reading or JSON parsing fails
 */
export const loadPhonesData = (): Phone[] => {
  try {
    const phonesData = fs.readFileSync(
      path.join(__dirname, "static", "phones.json"),
      "utf8"
    );
    return JSON.parse(phonesData);
  } catch (error) {
    console.error("Error reading phones data:", error);
    throw new Error("Failed to load phones data");
  }
};
