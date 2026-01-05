
import { GoogleGenAI, Type } from "@google/genai";
import { FileContent, AnalysisResult, ProgrammingLanguage } from "../types";

export class GeminiService {
  /**
   * Analyzes a single file's content using Gemini to produce structural analysis and documentation.
   */
  async analyzeFile(file: FileContent): Promise<{ analysis: AnalysisResult; documentation: string }> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analyze the following ${file.language} source code and generate:
      1. Structural analysis in JSON format (functions, classes, complexity, warnings, suggestions).
      2. Comprehensive documentation in the standard style for this language (e.g., JSDoc for JS/TS, PEP 257 for Python).
      
      Code:
      \`\`\`${file.language}
      ${file.content}
      \`\`\`
      
      Return the result as a single JSON object with 'analysis' and 'documentation' keys.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                functions: { type: Type.ARRAY, items: { type: Type.STRING } },
                classes: { type: Type.ARRAY, items: { type: Type.STRING } },
                complexity: { type: Type.STRING, description: "Low, Medium, or High" },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["functions", "classes", "complexity", "warnings", "suggestions"],
            },
            documentation: { type: Type.STRING },
          },
          required: ["analysis", "documentation"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  }

  /**
   * Generates a project-level README based on a list of files.
   */
  async generateProjectREADME(files: FileContent[]): Promise<string> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const fileSummary = files.map(f => `File: ${f.path}\nLanguage: ${f.language}\nContent Preview: ${f.content.substring(0, 300)}...`).join('\n\n---\n\n');
    
    const prompt = `
      Based on the provided project files, generate a professional README.md.
      The README should include:
      - Project Title and Description
      - Features
      - File/Folder structure
      - Installation instructions (infer from files like package.json or requirements.txt if available, otherwise suggest defaults)
      - Usage examples based on the code analysis
      - API Documentation summary (if applicable)

      Files:
      ${fileSummary}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return response.text || "Failed to generate README.";
  }
}
