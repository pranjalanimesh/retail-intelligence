import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Gemini/audio helpers
export async function getBufferFromStream(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function getTranscriptFromGemini(audioBuffer) {
  // TODO: Implement Gemini or Google Speech-to-Text API call
  // Return the transcript as a string
  return "This is a mock transcript of the audio conversation.";
}

export async function getStructuredDataFromGemini(transcript) {
  // TODO: Implement Gemini API call for structured data extraction
  // Return the structured data object
  return {
    audioAnalysis: {
      backgroundMusic: { detected: false, message: "No background music detected", type: "good" },
      multipleSpeakers: { detected: true, message: "Multiple speakers identified - Info", type: "info" },
      audioQuality: { clear: true, message: "Clear audio quality - Good", type: "good" },
    },
    staffPerformance: [
      {
        category: "Product Knowledge",
        rating: 4,
        rationale: `\nGoods:\n- Deep understanding of product features\n- Can answer most customer queries\n- Stays updated with new arrivals\nBads:\n- Sometimes unsure about pricing\n- Misses out on warranty details`
      },
      {
        category: "Relationship Building",
        rating: 5,
        rationale: `\nGoods:\n- Greets customers warmly\n- Remembers repeat customers\n- Builds rapport quickly\nBads:\n- Can be too informal at times\n- Occasionally interrupts`
      },
      {
        category: "Selling Skills",
        rating: 3,
        rationale: `\nGoods:\n- Good at identifying needs\n- Suggests relevant products\nBads:\n- Needs to improve closing complex deals\n- Sometimes forgets to mention promotions`
      },
    ],
    customerInsights: [
      {
        title: "What they liked",
        summary: "Friendly staff and quick checkout.",
        detail: "Customers appreciated the welcoming attitude and efficient service. Many mentioned the staff's willingness to help and the smooth billing process as highlights of their visit."
      },
      {
        title: "What they didn't like",
        summary: "Limited product variety.",
        detail: "Several customers felt the store lacked options in certain categories, especially in accessories and new arrivals. Some also mentioned that a few items were out of stock."
      },
      {
        title: "What they want more of",
        summary: "More discounts and loyalty rewards.",
        detail: "Customers expressed interest in more frequent promotions, exclusive member deals, and a better loyalty program. They also suggested special events for regular shoppers."
      },
    ],
  };
}
