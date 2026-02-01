import Groq from "groq-sdk";
import { Case } from "@/lib/types";
import { saveDb, getDb } from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function ingestClientFile(rawText: string) {
  const prompt = `
    You are a Data Entry Agent for a Financial Advisor.
    Extract data from the client file text below.

    TEXT:
    ${rawText}

    TASK:
    Map the text to the following JSON structure. 
    - For 'goals', extract the top 3 specific goals (e.g. "Lexus upgrade", "Retire at 65").
    - For 'risks', include health issues and job security concerns.
    - For 'occupations', combine Name + Job Title.
    - For 'protection', summarize the Life Cover/Critical Illness status.
    - For 'status', if "PENDING" items exist, set to 'discovery'.
    - For 'urgency', set to 'high' if there is a 'shortfall' or 'health issue' mentioned.

    OUTPUT JSON STRUCTURE:
    {
      "clientName": "Name & Name",
      "providerName": "Largest pension provider mentioned (or 'General Portfolio')",
      "policyNumber": "Policy number if found (or generate placeholder)",
      "status": "discovery",
      "urgency": "normal" | "high",
      "clientContext": {
         "netWorth": "Value from Financial Summary",
         "incomeSummary": "Household Income Value",
         "goals": ["Goal 1", "Goal 2", "Goal 3"],
         "risks": ["Risk 1", "Risk 2"],
         "occupations": ["Alan: Presenter", "Lynne: Receptionist"],
         "protection": ["Alan: £200k Life", "Lynne: £150k Life"],
         "nextReviewDate": "Date from top of file",
         "notes": "Brief summary of 'Notes' section"
      },
      "latestLog": "Summary of the most recent item in 'Recent Communication'"
    }
  `;

  const completion = await groq.chat.completions.create({
    messages: [
        { role: "system", content: "You are a JSON extractor." }, 
        { role: "user", content: prompt }
    ],
    model: "openai/gpt-oss-120b",
    response_format: { type: "json_object" },
  });

  const extracted = JSON.parse(completion.choices[0]?.message?.content || "{}");
  const ctx = extracted.clientContext || {};

  const newCase: Case = {
    id: `case-${Date.now()}`,
    clientName: extracted.clientName || "Unknown Client",
    providerName: extracted.providerName || "General Portfolio",
    policyNumber: extracted.policyNumber || "Pending",
    status: extracted.status || 'discovery',
    urgency: extracted.urgency || 'normal',
    dateCreated: new Date().toISOString(),
    lastUpdateDate: new Date().toISOString(),
    nextActionDate: new Date().toISOString(),
    clientContext: {
      netWorth: ctx.netWorth,
      incomeSummary: ctx.incomeSummary,
      goals: ctx.goals || [],
      risks: ctx.risks || [],
      occupations: ctx.occupations || [],
      protection: ctx.protection || [],
      nextReviewDate: ctx.nextReviewDate,
      notes: ctx.notes
    },
    history: [
      {
        id: '1',
        date: new Date().toISOString(),
        actor: 'Agent',
        action: extracted.latestLog || "Imported client file."
      }
    ]
  };

  const db = getDb();
  db.cases.push(newCase);
  saveDb(db);

  return newCase;
}