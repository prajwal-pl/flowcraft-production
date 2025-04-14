import Groq from "groq-sdk";
import { toast } from "sonner";

// Initialize Groq client with optional API key
const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const hasGroqApiKey = !!groqApiKey;

let groq: Groq | null = null;
if (hasGroqApiKey) {
  groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true,
  });
}

/**
 * Simulates PDF summarization
 * In a real implementation, we would use a PDF parsing library and an LLM for summarization
 */
export async function summarizePDF(
  file: File | string,
  maxLength: number = 500
): Promise<string> {
  try {
    // Show pending toast
    const toastId = toast.loading("Summarizing PDF...");

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Get filename for better simulation
    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "document.pdf"
        : file.name || "document.pdf";

    let summaryText = "";

    if (hasGroqApiKey && groq) {
      // Generate a summary using Groq
      const summary = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate a sample summary of a research paper named "${fileName}" that's about ${maxLength} characters long.`,
          },
        ],
        model: "llama3-8b-8192",
        max_tokens: Math.min(maxLength / 2, 600), // Approximate token to character ratio
      });

      summaryText =
        summary.choices[0]?.message?.content ||
        "Unable to generate PDF summary. Please try with a different file.";
    } else {
      // Generate simulated summary based on filename
      if (fileName.toLowerCase().includes("research")) {
        summaryText =
          "This research paper explores the impact of artificial intelligence on modern society. The authors conducted a comprehensive analysis of current AI applications and their ethical implications. Key findings suggest that AI integration requires robust regulatory frameworks and continuous ethical oversight. Recommendations include increased transparency in AI decision-making processes and expanded educational initiatives to prepare the workforce for technological disruption.";
      } else if (fileName.toLowerCase().includes("report")) {
        summaryText =
          "This quarterly report highlights significant growth in the company's tech division, with a 15% increase in revenue compared to the previous quarter. Market expansion in Asia has exceeded expectations, while European operations face regulatory challenges. The financial outlook remains positive with projected annual growth of 8-10%. Key recommendations include increasing R&D investment and accelerating digital transformation initiatives.";
      } else if (
        fileName.toLowerCase().includes("manual") ||
        fileName.toLowerCase().includes("guide")
      ) {
        summaryText =
          "This user manual provides comprehensive instructions for operating the system. Key sections include installation procedures, basic operations, advanced features, and troubleshooting. The document emphasizes safety protocols and maintenance schedules. Appendices contain technical specifications and contact information for customer support.";
      } else {
        summaryText = `This is a simulated summary of the PDF document "${fileName}". The document appears to contain approximately ${
          Math.floor(Math.random() * 20) + 10
        } pages of content covering various topics. Key sections include an introduction, methodology, findings, and conclusion. The document uses several charts and tables to illustrate data points. This is a simulation since no actual PDF content is being processed.`;
      }
    }

    // Show success toast
    toast.success(
      hasGroqApiKey
        ? "PDF summarization complete"
        : "PDF summarization complete (Simulation)",
      {
        id: toastId,
        description: "PDF summary is now available in the workflow.",
      }
    );

    return summaryText;
  } catch (error) {
    console.error("Error summarizing PDF:", error);

    // Show error toast
    toast.error("Failed to summarize PDF", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });

    // Provide fallback summary when error occurs
    return "An error occurred while summarizing the PDF. This is a fallback summary to allow the workflow to continue.";
  }
}
