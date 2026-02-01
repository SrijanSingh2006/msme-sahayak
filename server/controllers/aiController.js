const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // Updated to the current supported high-quality model

/**
 * AI LOAN ELIGIBILITY CHECKER (Groq Version)
 * Generates a simple, key-point scorecard as requested.
 */
exports.checkLoanEligibility = async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("GROQ_API_KEY is missing in .env file");
        return res.status(500).json({ message: "Groq API key not configured on the server." });
    }

    const { 
        turnover, profit, years, amount, businessType, collateral, 
        existingLoans, existingLoanDetails, creditScore, loanPurpose, language 
    } = req.body;

    const targetLanguage = language === 'hi' ? 'Hindi' : 'English';

    const systemPrompt = `
        Act as a friendly and straightforward loan advisor for an Indian MSME owner. 
        Your goal is to provide a simple, easy-to-understand "scorecard" of their loan application.
        Use simple language and avoid heavy financial jargon.
    `;

    const userPrompt = `
        Generate a response EXCLUSIVELY in ${targetLanguage}.
        
        Applicant Details:
        - Annual Turnover: ₹${turnover}
        - Annual Net Profit: ₹${profit}
        - Years in Business: ${years}
        - Business Type: ${businessType}
        - Collateral Available: ${collateral}
        - Has Existing Loans: ${existingLoans}
        ${existingLoans === 'Yes' ? `- Details of Existing Loans: "${existingLoanDetails}"` : ''}
        - Purpose of Loan: "${loanPurpose}"
        - Desired Loan Amount: ₹${amount}
        - Credit Score: ${creditScore || "Not Provided"}

        Based on this, generate a response in Markdown with this exact format:

        ### Your Loan Eligibility Scorecard
        **Overall Verdict:** (A single, simple sentence summarizing the chance of approval.)
        ---
        **Key Factors:**
        * **Profitability:** (Assess as Strong/Good/Fair/Weak + one simple reason.)
        * **Business Stability:** (Assess as Strong/Good/Fair/Weak + one simple reason.)
        * **Repayment Capacity:** (Assess as Strong/Good/Fair/Weak + one simple reason.)
        * **Security:** (Assess as Strong/Good/Fair/Weak + one simple reason.)
        ---
        **Top 3 Recommendations:**
        1. (Actionable advice #1)
        2. (Actionable advice #2)
        3. (Actionable advice #3)
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 800
            })
        });
        
        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error (Eligibility):", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || `Groq API returned ${response.status}`);
        }

        const aiResponse = data?.choices?.[0]?.message?.content;
        if (!aiResponse) throw new Error("Groq returned an empty choices array.");

        res.json({ analysis: aiResponse });

    } catch (error) {
        console.error("Groq Eligibility Detailed Error:", error.message);
        res.status(500).json({ message: "AI service temporarily unavailable. Please try again later." });
    }
};

/**
 * AI GOVERNMENT SCHEME FINDER (Groq Version)
 * Finds relevant schemes based on business description.
 */
exports.findRelevantSchemes = async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("GROQ_API_KEY is missing in .env file");
        return res.status(500).json({ message: "Groq API key not configured." });
    }

    const { businessDescription, language } = req.body;
    const targetLanguage = language === 'hi' ? 'Hindi' : 'English';

    const systemPrompt = `You are an Indian MSME policy expert helping business owners find government support.`;

    const userPrompt = `
        Business Description: "${businessDescription}"
        
        Task:
        Find 4–6 Indian government MSME schemes most relevant to this description.
        
        Requirements:
        - Respond ONLY in ${targetLanguage}.
        - Use Markdown.
        - For each scheme, provide:
          1. Title
          2. A one-sentence summary of the benefit
          3. The direct official website link (URL).
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.5,
                max_tokens: 1000
            })
        });
        
        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error (Schemes):", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || `Groq API returned ${response.status}`);
        }

        const aiResponse = data?.choices?.[0]?.message?.content;
        if (!aiResponse) throw new Error("Groq could not generate scheme content.");

        res.json({ schemes: aiResponse, sources: [] });

    } catch (error) {
        console.error("Groq Scheme Detailed Error:", error.message);
        res.status(500).json({ message: "Failed to fetch schemes. Please try again." });
    }
};