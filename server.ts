/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header and environment key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API endpoint to process content generation (n8n proxy vs. fallback/Direct Gemini Mode)
app.post("/api/generate", async (req, res) => {
  const { 
    mode, 
    webhookUrl, 
    payload,
    requestType = "generate",
    originalInput,
    generatedResult,
    editRequest,
    publishSetting,
    finalContent,
    complianceCheck,
    meta
  } = req.body;

  // Mode validation
  const targetWebhook = webhookUrl || "https://n8n.cally.co.kr/webhook-test/9876ac2a-24bd-453d-8398-775f16a18c6d";

  if (mode === "n8n") {
    try {
      console.log(`Forwarding payload (${requestType}) to n8n: ${targetWebhook}`);
      let n8nBody: any = {};
      
      if (requestType === "generate") {
        n8nBody = {
          requestType: "generate",
          data: payload || originalInput
        };
      } else if (requestType === "edit") {
        n8nBody = {
          requestType: "edit",
          originalInput: originalInput,
          generatedResult: generatedResult,
          editRequest: editRequest,
          meta: meta || {
            requestedAt: new Date().toISOString(),
            source: "instagram-ai-content-webapp"
          }
        };
      } else if (requestType === "publish") {
        n8nBody = {
          requestType: "publish",
          publishSetting: publishSetting,
          finalContent: finalContent,
          complianceCheck: complianceCheck,
          meta: meta || {
            requestedAt: new Date().toISOString(),
            source: "instagram-ai-content-webapp"
          }
        };
      }

      const response = await fetch(targetWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(n8nBody),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook replied with status ${response.status}`);
      }

      // Read response texts or JSON
      const text = await response.text();
      let responseData: any;
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        // If n8n returns raw string or HTML, map it to our format
        if (requestType === "publish") {
          responseData = {
            message: "n8n 배포 요청 처리가 완료되었습니다.",
            status: publishSetting?.publishMode === "scheduled" ? "scheduled" : "published",
            instagramAccount: publishSetting?.instagramAccount || "unknown",
            publishDate: publishSetting?.publishDate || "즉시",
            publishTime: publishSetting?.publishTime || ""
          };
        } else {
          responseData = {
            title: "n8n 생성 결과",
            caption: text,
            hashtags: payload?.hashtagRule?.brandHashtags ? [payload.hashtagRule.brandHashtags] : ["#인스타그램", "#마케팅"],
            imageUrls: payload?.productInfo?.imageUrls ? [payload.productInfo.imageUrls] : ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1000"],
            imagePrompt: "n8n Generated Mock Image Direction Guidelines"
          };
        }
      }

      return res.json({ success: true, data: responseData, source: "n8n" });
    } catch (err: any) {
      console.error("n8n client error:", err);
      return res.status(500).json({
        success: false,
        error: `n8n webhook request failed: ${err.message}. Please verify the webhook connection settings.`,
      });
    }
  } else {
    // Mode is Direct Gemini AI
    if (requestType === "publish") {
      // Simulate successful publish/schedule
      const pubMode = publishSetting?.publishMode || "instant";
      let message = "콘텐츠 생성이 완료되었습니다.";
      let status = "published";
      
      if (pubMode === "scheduled") {
        message = "예약 발행 요청이 등록되었습니다.";
        status = "scheduled";
      } else if (pubMode === "pending_admin") {
        message = "관리자 승인 대기 상태로 저장되었습니다.";
        status = "review_pending";
      } else if (pubMode === "pending_brand") {
        message = "브랜드사 승인 대기 상태로 저장되었습니다.";
        status = "review_pending";
      } else if (pubMode === "draft") {
        message = "초안 저장이 완료되었습니다.";
        status = "draft";
      } else {
        message = "배포 요청이 완료되었습니다.";
        status = "published";
      }

      return res.json({
        success: true,
        data: {
          message,
          status,
          instagramAccount: publishSetting?.instagramAccount || "unknown",
          publishDate: publishSetting?.publishDate || "즉시",
          publishTime: publishSetting?.publishTime || "",
          adminMemo: publishSetting?.adminMemo || ""
        },
        source: "gemini"
      });
    }

    if (!ai) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY environment variable is missing on the server. Please configure it in your Secrets settings to use the Direct Gemini AI generator.",
      });
    }

    try {
      let prompt = "";
      const currentPayload = payload || originalInput;

      if (requestType === "generate") {
        console.log("Generating direct Instagram content using Gemini AI...");
        prompt = `
Generate a highly engaging Instagram content plan, caption, visual instructions, hashtags, and card news based on the following input parameters:

${JSON.stringify(currentPayload, null, 2)}

Ensure you strictly respect the following instructions:
1. Caption: Format it elegantly. Hook the user with a strong first sentence matching the hook style "${currentPayload.captionRule?.hookStyle || 'Strong Statement'}". Use clear line breaks and line styles like "${currentPayload.captionRule?.lineBreakStyle || 'Friendly paragraphing'}". Include relevant emoticons if useEmoji is true (current value: ${currentPayload.captionRule?.useEmoji}). Make sure CTA instructions are clearly present. Mention brand name and product name as requested.
2. CardNews: Create exactly ${currentPayload.publishSetting?.imageCount || 3} sequential slides for a carousel/card-news format under "cardNews". Each slide should offer short, impactful titles or actionable wisdom text that users would swipe through.
3. Hashtags: Provide a list of recommended hashtags matching the selected hashtag rules. Create ${currentPayload.hashtagRule?.hashtagCount || 10} hashtags, strictly omitting any forbidden tags described in "${currentPayload.hashtagRule?.prohibitedHashtags || 'none'}".
4. Visual Direction: Suggest 2 to 3 Unsplash image URLs under "imageUrls" that align perfectly with the target look: Visual Type ("${currentPayload.imageDirection?.visualType || 'minimal'}"), style/mood ("${currentPayload.imageDirection?.style || 'clean'}"), and brand colors ("${currentPayload.imageDirection?.brandColor || 'dark elegant'}"). Select from realistic high-quality Unsplash keywords like "wellness", "workspace", "cosmetics", "fashion", "cozy-interior", "minimal-branding" or return standard solid assets relative to their core customer demographic "${currentPayload.targetCustomer?.interests || 'lifestyle'}".
5. ImagePrompt: Populate the "imagePrompt" field with a beautiful, descriptive, English midjourney-style image prompt that represents the background aesthetic requested: "${currentPayload.imageDirection?.style || 'clean'} - ${currentPayload.imageDirection?.backgroundMood || 'ambient lighting'}".
6. Compliance: Adhere strictly to verification standards (No exaggeration: ${currentPayload.complianceRule?.noExaggeration}, No medical/legal/financial claim assertions: ${currentPayload.complianceRule?.noMedicalLegalFinancialClaims}). Ensure tone is polite and matches the Tone & Manner ("${currentPayload?.toneAndManner?.tone?.join(", ") || 'professional, friendly'}").
`;
      } else if (requestType === "edit") {
        console.log(`Editing content using Gemini AI... Target: ${editRequest?.editTarget}`);
        prompt = `
You are an expert Instagram copywriter, Social Media Strategist, and Art Director.
The user wants to EDIT a previously generated Instagram content post.

Original inputs: ${JSON.stringify(originalInput, null, 2)}
Original generated content: ${JSON.stringify(generatedResult, null, 2)}

User's edit request:
- Target area to edit: ${editRequest?.editTarget || 'all'} (Options could be: caption, cardNews, imagePrompt, hashtags, toneAndManner, cta, compliance, or all)
- Specific instructions: "${editRequest?.editInstruction}"

Please update the Instagram post content based strictly on the instructions.
1. If the target edit area is "caption", alter the caption copy while keeping cardNews, imageUrls, hashtags, and recommends exactly identical to the original content unless affected.
2. If the target edit area is "cardNews", rewrite the carousel sentences while keeping the original structure/slide count unless requested otherwise.
3. If the target edit area is "hashtags", rewrite hashtags list.
4. If the target edit area is "imagePrompt", update the "imagePrompt" field details to matches custom styling guidelines.
5. If the target edit area is "all", rewrite everything.
Ensure you always return a completely populated valid JSON response matching the required schema exactly. Keep as much of the other original fields intact as possible.
`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, multi-industry Instagram Copywriter, Social Media Strategist, and Art Director. You generate ready-to-publish social media plans in strict JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The main title/headline of the post planning brief."
              },
              caption: {
                type: Type.STRING,
                description: "The complete copy/caption of the Instagram post. Include emojis, paragraph breaks, and CTAs."
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Optimized list of hashtags (e.g., ['#brand', '#product'])"
              },
              imageUrls: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of high-quality mock image URLs (e.g., thematic Unsplash URLs or stock-photo URLs related to the product/brand style)."
              },
              cardNews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slide: { type: Type.INTEGER },
                    text: { type: Type.STRING, description: "Text content printed clearly on this slide" }
                  },
                  required: ["slide", "text"]
                },
                description: "Carousel card news narrative broken down by consecutive slides."
              },
              imagePrompt: {
                type: Type.STRING,
                description: "Detailed, descriptive, English Midjourney-style image prompt for generating visuals."
              },
              recommends: {
                type: Type.OBJECT,
                properties: {
                  recommendTime: { type: Type.STRING, description: "Recommended posting timezone/time of the day." },
                  checkListPass: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Details on why it conforms to the selected safety filters and parameters."
                  }
                },
                required: ["recommendTime", "checkListPass"]
              }
            },
            required: ["title", "caption", "hashtags", "imageUrls"],
          }
        }
      });

      const responseText = response.text || "{}";
      const cleanedText = responseText.trim();
      const parsedData = JSON.parse(cleanedText);

      // Supply some premium fallback high quality stock images if model replies with empty or invalid assets
      if (!parsedData.imageUrls || parsedData.imageUrls.length === 0) {
        parsedData.imageUrls = generatedResult?.imageUrls || [
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
          "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&q=80"
        ];
      } else {
        // Map any arbitrary strings to solid stock photos if they're not fully qualified HTTP URLs
        parsedData.imageUrls = parsedData.imageUrls.map((url: string, index: number) => {
          if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            return url;
          }
          // fallback nice design images
          const queries = ["branding", "instagram", "creative-office", "cosmetic-bottle", "minimalist"];
          const q = queries[index % queries.length];
          return `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&sig=${index}`;
        });
      }

      if (!parsedData.imagePrompt) {
        parsedData.imagePrompt = editRequest ? (generatedResult?.imagePrompt || "Minimal aesthetic lifestyle portrait") : "Minimal aesthetic beauty background";
      }

      return res.json({ success: true, data: parsedData, source: "gemini" });
    } catch (err: any) {
      console.error("Gemini AI API Error:", err);
      return res.status(500).json({
        success: false,
        error: `Gemini Content request failed: ${err.message}`,
      });
    }
  }
});

// Serve static assets and handle routing in development & production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Instagram AI Webapp] Server running on port ${PORT}`);
  });
}

startServer();
