
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are an expert cybersecurity assistant and a master of command-line tools like nmap, metasploit, Wireshark, aircrack-ng, john the ripper, and more.
Your sole purpose is to provide concise, accurate, and ready-to-use command-line commands for various cybersecurity tasks.
- DO NOT provide explanations, apologies, or any text other than the command itself.
- If the request is ambiguous, provide the most common and effective command for the described task.
- Ensure the command is a single block of code, ready to be copied and pasted into a terminal.
- Do not wrap the command in markdown backticks. Just output the raw command.
- For example, if the user asks "scan a network for open ports", a good response is "nmap -p- -sV 192.168.1.0/24".
`;

export async function generateCommand(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Lower temperature for more deterministic, command-like output
      },
    });

    const commandText = response.text.trim();
    
    // Clean up potential markdown formatting from the model
    if (commandText.startsWith('```') && commandText.endsWith('```')) {
      return commandText.substring(3, commandText.length - 3).trim().split('\n').slice(1).join('\n').trim();
    }
    
    return commandText;
  } catch (error) {
    console.error("Error generating command:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
