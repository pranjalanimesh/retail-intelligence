import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI (API key is picked up from GEMINI_API_KEY env variable)
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

export async function getTranscriptFromGemini(audioBuffer, mimeType = "audio/wav") {
  try {
    const audioBase64 = audioBuffer.toString('base64');
    const prompt = `
      Please transcribe this audio conversation accurately. 
      Include speaker identification if multiple speakers are present.
      Format the output as a clean transcript with timestamps if possible.
      Focus on capturing the exact words spoken.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: audioBase64,
            mimeType
          }
        },
        prompt
      ]
    });

    return response.text;
  } catch (error) {
    console.error('Error transcribing audio with Gemini:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function getStructuredDataFromGemini(transcript) {
  try {
    const prompt = `
      Analyze this customer service conversation transcript and provide structured insights in the following exact JSON format.

      IMPORTANT REQUIREMENTS:
      1. For each staff performance category, provide exactly 5 total points (goods + bads combined)
      2. Each good/bad should be a concise bullet point (1-2 lines max)
      3. Rate each category from 1-5 based on performance
      4. Audio analysis should identify background music, multiple speakers, and audio quality
      5. Customer insights should be specific and actionable

      Transcript: ${transcript}

      Return ONLY valid JSON in this exact structure:

      {
        "audioAnalysis": {
          "backgroundMusic": { 
            "detected": boolean, 
            "message": "descriptive message", 
            "type": "good/info/warning" 
          },
          "multipleSpeakers": { 
            "detected": boolean, 
            "message": "descriptive message", 
            "type": "good/info/warning" 
          },
          "audioQuality": { 
            "clear": boolean, 
            "message": "descriptive message", 
            "type": "good/info/warning" 
          }
        },
        "staffPerformance": [
          {
            "category": "Product Knowledge",
            "rating": number,
            "rationale": "\\nGoods:\\n- [0-5 goods]\\nBads:\\n- [exactly 5-(number of goods) bads, totaling 5 points]"
          },
          {
            "category": "Relationship Building", 
            "rating": number,
            "rationale": "\\nGoods:\\n- [0-5 goods]\\nBads:\\n- [exactly 5-(number of goods) bads, totaling 5 points]"
          },
          {
            "category": "Selling Skills",
            "rating": number, 
            "rationale": "\\nGoods:\\n- [0-5 goods]\\nBads:\\n- [exactly 5-(number of goods) bads, totaling 5 points]"
          }
        ],
        "overallPerformance": {
          "score": number,
          "summary": "brief performance summary"
        },
        "customerInsights": [
          {
            "title": "What they liked",
            "summary": "brief summary - 1 liner",
            "detail": "detailed explanation in 2 sentences"
          },
          {
            "title": "What they didn't like", 
            "summary": "brief summary - 1 liner",
            "detail": "detailed explanation in 2 sentences"
          },
          {
            "title": "What they want more of",
            "summary": "brief summary - 1 liner",
            "detail": "detailed explanation in 2 sentences"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const responseText = response.text;
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Raw response:', responseText);

      // Return fallback structure if parsing fails
      return {
        audioAnalysis: {
          backgroundMusic: { detected: false, message: "Analysis unavailable", type: "info" },
          multipleSpeakers: { detected: true, message: "Multiple speakers likely present", type: "info" },
          audioQuality: { clear: true, message: "Audio quality assessment unavailable", type: "info" }
        },
        staffPerformance: [
          {
            category: "Product Knowledge",
            rating: 3,
            rationale: "\nGoods:\n- Shows basic product awareness\n- Attempts to answer questions\nBads:\n- Limited detailed knowledge\n- Uncertain about specifications\n- Needs more training"
          },
          {
            category: "Relationship Building", 
            rating: 3,
            rationale: "\nGoods:\n- Polite interaction\n- Shows willingness to help\nBads:\n- Limited personal connection\n- Formal communication style\n- Could be more engaging"
          },
          {
            category: "Selling Skills",
            rating: 3,
            rationale: "\nGoods:\n- Basic sales approach\n- Identifies some needs\nBads:\n- Weak closing techniques\n- Limited upselling\n- Misses opportunities"
          }
        ],
        overallPerformance: {
          score: 3.0,
          summary: "Average Performance - Analysis limited due to processing error"
        },
        customerInsights: [
          {
            title: "What they liked",
            summary: "Service interaction",
            detail: "Customer feedback analysis was limited due to processing constraints."
          },
          {
            title: "What they didn't like",
            summary: "Areas for improvement",
            detail: "Detailed customer concerns could not be extracted from the transcript."
          },
          {
            title: "What they want more of",
            summary: "Enhancement suggestions",
            detail: "Customer preferences require manual review of the transcript."
          }
        ]
      };
    }

  } catch (error) {
    console.error('Error analyzing transcript with Gemini:', error);
    throw new Error('Failed to analyze transcript');
  }
}