// SETUP INSTRUCTIONS:
// To use the real Gemini integration (non-mock):
// 1. In your .env.local file, ensure MOCK_GEMINI is unset or set to 'false':
//      MOCK_GEMINI=false
// 2. Add your Gemini/Google API keys and endpoints as needed, e.g.:
//      GEMINI_API_KEY=your-key-here
//      GEMINI_API_URL=https://... (if required)
// 3. Restart your dev server after changing environment variables.
//
// The API will use the real Gemini integration when MOCK_GEMINI is not 'true'.
//
// For testing with mock data, set MOCK_GEMINI=true in .env.local.
//
import { NextResponse } from 'next/server';
import { getBufferFromStream, getTranscriptFromGemini, getStructuredDataFromGemini } from '@/lib/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  // Switch between mock and real mode
  const useMock = process.env.MOCK_GEMINI === 'true';
  if (useMock) {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return NextResponse.json({
      audioAnalysis: {
        backgroundMusic: {
          detected: true,
          message: 'Background music detected - Caution',
          type: 'caution',
        },
        multipleSpeakers: {
          detected: true,
          message: 'Multiple speakers identified - Info',
          type: 'info',
        },
        audioQuality: {
          clear: true,
          message: 'Clear audio quality - Good',
          type: 'good',
        },
      },
      staffPerformance: [
        {
          category: "Product Knowledge",
          rating: 4,
          rationale: `
Goods:
- Deep understanding of product features
- Can answer most customer queries
- Stays updated with new arrivals
Bads:
- Sometimes unsure about pricing
- Misses out on warranty details`
        },
        {
          category: "Relationship Building",
          rating: 5,
          rationale: `
Goods:
- Greets customers warmly
- Remembers repeat customers
- Builds rapport quickly
Bads:
- Can be too informal at times
- Occasionally interrupts`
        },
        {
          category: "Selling Skills",
          rating: 3,
          rationale: `
Goods:
- Good at identifying needs
- Suggests relevant products
Bads:
- Needs to improve closing complex deals
- Sometimes forgets to mention promotions`
        },
      ],
      overallPerformance: {
        score: 4.0,
        summary: "Above Average Performance - Strong foundation with room for growth"
      },
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
    });
  }

  // --- REAL GEMINI INTEGRATION ---
  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const audioBuffer = Buffer.from(await file.arrayBuffer());

  // 1. Send audio to Gemini for transcription
  const transcript = await getTranscriptFromGemini(audioBuffer);

  // 2. Send transcript to Gemini for structured analysis
  const structuredData = await getStructuredDataFromGemini(transcript);

  // 3. Return structured data to frontend
  return NextResponse.json(structuredData);
}