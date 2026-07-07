import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { tarotCards, SajuFallbacks } from "./src/lib/fortuneData";

// Load configuration
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely using process.env.GEMINI_API_KEY
let ai: any = null;
const isGeminiEnabled = !!process.env.GEMINI_API_KEY;

if (isGeminiEnabled) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini GenAI Client initialized successfully to power emotional fortunetelling.");
  } catch (err) {
    console.error("Failed to initialize Gemini GenAI Client:", err);
  }
}

// ---------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    geminiEnabled: isGeminiEnabled,
    environment: process.env.NODE_ENV || "development"
  });
});

// ads.txt for Google AdSense verification
app.get("/ads.txt", (req, res) => {
  res.type("text/plain");
  res.send("google.com, pub-8035431829602969, DIRECT, f08c47fec0942fa0");
});

// robots.txt for search engines
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /\nSitemap: https://todayluck.shop/sitemap.xml");
});

// sitemap.xml for search engines
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://todayluck.shop/</loc>
    <lastmod>2026-07-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// 2. Gemini-Powered / Poetic Tarot interpretive AI endpoint
app.post("/api/fortune/tarot", async (req, res) => {
  const { cardName, category, question } = req.body;

  if (!cardName) {
    return res.status(400).json({ error: "Card name is required." });
  }

  // Find exact card info for injecting as context
  const cardData = tarotCards.find(c => c.name.includes(cardName) || cardName.includes(c.name)) || tarotCards[0];

  // If Gemini is disabled or fails, use high-fidelity poetic fallback
  if (!ai) {
    let fallbackText = cardData.generalMeaning;
    if (category === "연애" || category === "하루타로 상대방 마음" || category === "하루궁합") {
      fallbackText = cardData.loveMeaning;
    } else if (category === "진로" || category === "하루진로") {
      fallbackText = cardData.careerMeaning;
    }

    const compiledFallback = `[하루운세 아날로그 찻잔풀이] 
당신이 뽑으신 카드는 '${cardData.name}'입니다. 

카드의 별빛 기운: 
${cardData.image}

이 기류가 지긋이 전하는 흐름:
${fallbackText}

고유의 수용적 속삭임:
${cardData.generalMeaning}

“하루운세의 모든 답변은 자기 이해와 다정한 위로를 돕기 위한 은유적인 조언입니다. 작은 쉼표가 되셨기를 바랄게요.”`;

    return res.json({
      reading: compiledFallback,
      card: cardData,
      isAiPowered: false
    });
  }

  try {
    const prompt = `
사용자가 감성 사주 타로 서비스 '하루운세'에서 무료 또는 유료 힐링 리딩을 진행하고 있습니다.
사용자가 뽑은 타로 카드는 '${cardData.name}'이며, 카드의 상징은 "${cardData.image}"입니다.

고객의 고민 분야: [${category || "종합 운세 / 감성 위로"}]
고객이 적은 실제 고민/질문: "${question || "오늘 나의 소중한 하루 흐름과 마음의 쉼표가 궁금해요."}"

상대방의 마음, 진로, 일, 궁합 등 적힌 카테고리 기질에 맞게, 매우 몽환적이고 다정하며 차분한 어조(존댓말)로 타로 카드를 풀이해주세요.
아래 세 가지 가치를 충족해 소설처럼 정성스럽고 길게 풀어 주세요:
1. 카드가 지닌 이미지 속 별빛과 밤하늘의 기운을 들어 문학적인 위로를 전합니다.
2. 질문에 귀지그리여 들었음을 증명하듯 구체적인 조언을 전해주세요.
3. 절대적인 미래 예측이 아닌, 자아 성찰과 자기 이해를 돕기 위한 다정한 참고용 속삭임 형태로 완성해주세요.

마지막에는 마음을 정돈해 주는 한 줄의 감성 처방(“오늘 하루, 당신의 마음길에 은은한 국화차 한 잔을 건넵니다.”) 같은 하루운세 시그니처 배웅 인사를 꼭 곁들여 주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    res.json({
      reading: response.text,
      card: cardData,
      isAiPowered: true
    });
  } catch (err: any) {
    console.error("Gemini Tarot error, falling back:", err);
    // Graceful fallback during API error or key issues
    res.json({
      reading: `[하루운세 임시 리딩] 카드는 '${cardData.name}'입니다.\n\n${cardData.generalMeaning}\n\n오늘 당신의 지친 영혼에 따뜻한 무릎덮개를 전해 드릴게요. 다 잘 될 것입니다.`,
      card: cardData,
      isAiPowered: false
    });
  }
});

// 3. Gemini-Powered / Poetic Saju traditional interpretive AI endpoint
app.post("/api/fortune/saju", async (req, res) => {
  const { name, gender, birthdate, birthTime, birthPlace, topic, content } = req.body;

  if (!name || !birthdate) {
    return res.status(400).json({ error: "Name and birthdate are required." });
  }

  // Safe fallback Saju if Gemini is disabled
  if (!ai) {
    let key: keyof typeof SajuFallbacks = "total";
    if (topic && (topic.includes("연애") || topic.includes("궁합") || topic.includes("마음"))) {
      key = "love";
    } else if (topic && (topic.includes("진로") || topic.includes("일") || topic.includes("직업"))) {
      key = "career";
    } else if (topic && (topic.includes("종합") || topic.includes("하루종합운"))) {
      key = "general";
    }

    const fallbacks = SajuFallbacks[key] || SajuFallbacks.total;
    const fallbackSeed = name.length % fallbacks.length;
    const reading = fallbacks[fallbackSeed] || SajuFallbacks.total[0];

    const compiledFallback = `[하루운세 사주 단결 리딩]
${name} 님의 태어나신 시간(${birthTime || "모름"})과 사주 명리 기포를 정밀하게 호흡해 풀어냅니다.

운의 성향과 마음결 흐름:
${reading}

명리 관점의 감성 조언:
사주 속 오행의 균형은 당신이 겪는 찰나의 폭풍이 영구적이지 않음을 잔잔하게 속삭이고 있습니다. 
밤이 깊을수록 별은 더욱 영롱하게 영혼을 밝힙니다. 당신이 걷는 오늘의 걸음에 행운의 꽃가루가 조용히 머물 것입니다.

“하루운세의 사주 리딩은 사유와 자기 탐색을 돕기 위한 조언일 뿐이니, 내일의 지혜로운 나침반으로만 삼아주세요.”`;

    return res.json({
      reading: compiledFallback,
      isAiPowered: false
    });
  }

  try {
    const prompt = `
사용자가 감성 명리 사주 서비스 ‘하루운세’에서 1:1 리서치 카운슬링(상담 신청서) 내용을 바탕으로 사주 기류풀이를 신청하셨습니다.

[신청 정보]
- 신청자: ${name} (${gender || "기재안함"})
- 양력/음력 명세: 생년월일 ${birthdate}, 태어난 시간: ${birthTime || "모름"}, 태어난 위치: ${birthPlace || "기재안함"}
- 주요 상담 주제: ${topic}
- 고민의 핵심: "${content || "종합적인 제 사주 성향과 올해의 기분 좋은 기운 흐름이 알고 싶어요."}"

[가이드라인]
가상의 동양 명리 대가('하루사주 신선')의 관점을 담되, 차가운 예측가적 냉정함이 아니라, 사용자의 마음을 가볍게 다독여 주며 위로하는 잔잔하고 문학적인 밤하늘 풍의 어조(존댓말)로 한글 리포트를 길고 풍성하게 작성해 주세요.
- 사용자의 타고난 성향(목, 화, 토, 금, 수 오행의 아름다운 조화)을 사주 음양 흐름에 빗대어 따스하게 설명해 주세요.
- 고민하시는 질문(${content})에 사주 기류를 담아 정성 들여 성심성의껏 리딩해주고, 구체적이며 감정적으로 힘이 되는 조언을 전하세요.
- 절대적인 미래 단정이 아닌, 스스로 주도해 미래를 가꿔 가도록 내면의 길잡이가 되는 다정다감한 문구로 글을 마쳐주세요.
- 밤하늘, 별과 은하수, 다정한 차 한 잔 같은 포근하고 몽환적인 감성 숲 메타포를 가미해주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    res.json({
      reading: response.text,
      isAiPowered: true
    });
  } catch (err: any) {
    console.error("Gemini Saju error, falling back:", err);
    res.json({
      reading: `${name} 님의 생일 사주 명리를 분석한 결과, 온화하고 품위 있는 기품이 올해 운세 흐름을 강건하게 에워싸고 있습니다. 고민하시는 ${topic} 관련한 일은 머지않아 슬기롭게 해결될 것입니다. 늘 다정한 마음의 쉼터 하루운세가 응원합니다.`,
      isAiPowered: false
    });
  }
});

// 4. Admin email notification endpoint
app.post("/api/reservations/notify", async (req, res) => {
  const { id, name, gender, birthdate, birthTime, birthPlace, topic, content, phone, email } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || "lch200048@gmail.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser || "no-reply@todayluck.shop";

  const emailSubject = `[오늘럭] 새로운 상담 신청 도착 (${name}님 / ${topic})`;
  const emailHtml = `
    <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa; color: #1e293b;">
      <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #4f46e5; margin: 0; font-size: 22px;">🔮 새로운 1:1 상담 예약 신청</h2>
        <p style="font-size: 13px; color: #64748b; margin: 5px 0 0 0;">오늘럭(TodayLuck) 웹사이트를 통해 새로운 상담이 신청되었습니다.</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; width: 30%; color: #475569; font-size: 14px;">예약 ID</th>
          <td style="padding: 10px; font-weight: bold; color: #0f172a; font-size: 14px;">${id || '신규 접수'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">상담 상품</th>
          <td style="padding: 10px; font-weight: bold; color: #4f46e5; font-size: 14px;">${topic}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">신청자명</th>
          <td style="padding: 10px; color: #0f172a; font-size: 14px;">${name} (${gender || '미지정'})</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">생년월일</th>
          <td style="padding: 10px; color: #0f172a; font-size: 14px;">${birthdate} (${birthTime || '모름'})</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">출생지</th>
          <td style="padding: 10px; color: #0f172a; font-size: 14px;">${birthPlace || '모름/미지정'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">연락처</th>
          <td style="padding: 10px; color: #0f172a; font-size: 14px;">${phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <th style="text-align: left; padding: 10px; color: #475569; font-size: 14px;">이메일</th>
          <td style="padding: 10px; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
        </tr>
      </table>

      <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px;">📝 고민 및 질문 내용</h4>
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${content}</p>
      </div>

      <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        본 메일은 오늘럭(TodayLuck) 웹서비스 신청 즉시 발송되는 관리자 자동 알림 메일입니다.<br/>
        관리자 페이지에서 답변을 작성하시거나 신청자 이메일(${email})로 직접 소통해 주세요.
      </div>
    </div>
  `;

  // Log to server console so developer always sees the backup reservation details
  console.log(`[Notification Engine] New reservation received. ID: ${id || 'NEW'}. Topic: ${topic}. Name: ${name}. Email: ${email}`);

  // Check if SMTP is configured
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(`[Notification Engine] SMTP server is not fully configured (SMTP_HOST, SMTP_USER, SMTP_PASS are missing).`);
    console.info(`[Notification Engine] Simulated mail delivery successful to Admin (${adminEmail}). Reservation details printed above.`);
    return res.json({
      success: true,
      simulated: true,
      message: "SMTP is not configured in the Secrets panel, but the system simulated the delivery and saved details to server console logs."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for port 465, false for other ports (like 587)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log(`[Notification Engine] Real email notification sent successfully to admin: ${adminEmail}`);
    res.json({ success: true, simulated: false });
  } catch (err: any) {
    console.error(`[Notification Engine] Failed to send real email via SMTP:`, err);
    res.status(500).json({
      error: "Failed to send email via SMTP",
      details: err.message,
      simulatedFallback: true
    });
  }
});

// ---------------------------------------------------------
// VITE CLIENT INTEGRATION MIDDLEWARE & STATIC SERVING
// ---------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode - Mount Vite's development middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Production Mode - Serve pre-built static client files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Production static files serving mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[하루운세] Full-stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
