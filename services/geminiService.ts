
import { GoogleGenAI } from "@google/genai";
import { Subject, AttendanceRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAttendanceInsights = async (
  subjects: Subject[],
  attendance: AttendanceRecord[]
): Promise<string> => {
  try {
    const summary = subjects.map(sub => {
      const subjectRecords = attendance.filter(r => r.subjectId === sub.id && r.status !== 'cancelled');
      const presentCount = subjectRecords.filter(r => r.status === 'present' || r.status === 'late').length;
      const total = subjectRecords.length;
      const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0';
      return `${sub.name}: ${percentage}% (${presentCount}/${total})`;
    }).join('\n');

    const prompt = `
      You are an academic mentor for a college student. 
      Analyze the following attendance data and provide a concise, motivating, and actionable insight (max 3 sentences).
      Be strict if attendance is low (below 75%), and congratulatory if high.
      
      Data:
      ${summary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep pushing forward!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at the moment.";
  }
};
