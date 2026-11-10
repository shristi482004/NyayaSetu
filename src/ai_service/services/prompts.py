import re
from typing import List

class PromptManager:
    """Manages versioned prompt templates, injection defense, and schema fences."""

    @staticmethod
    def sanitize_untrusted_input(raw_text: str) -> str:
        """
        Sanitize input text to neutralize prompt injection attempts.
        Strips common injection delimiters and excessive control characters.
        """
        if not raw_text:
            return ""
        # Remove custom delimiter forgery attempts
        sanitized = raw_text.replace("[/DOCUMENT_TEXT]", "").replace("[DOCUMENT_TEXT]", "")
        sanitized = sanitized.replace("[/DOCUMENT_CONTEXT]", "").replace("[DOCUMENT_CONTEXT]", "")
        sanitized = sanitized.replace("```json", "").replace("```", "")
        # Neutralize override commands
        sanitized = re.sub(r"(?i)(ignore previous instructions|disregard above rules|system override)", "[FILTERED_INSTRUCTION]", sanitized)
        return sanitized

    @staticmethod
    def build_analysis_prompt(document_text: str) -> str:
        """
        Builds the unified legal analysis prompt commanding Gemini to produce
        Summary, FAQs, Timeline, Flowchart, Arguments, and Action Items in strict JSON.
        """
        sanitized_text = PromptManager.sanitize_untrusted_input(document_text)

        return f"""You are an expert impartial legal intelligence assistant for NyayaSetu.
Your mandate is to analyze the provided legal document and produce a strictly compliant JSON object.

CRITICAL SAFETY AND GROUNDING RULES:
1. Base all statements strictly and exclusively on the text enclosed within [DOCUMENT_TEXT].
2. Do not invent facts, dates, rulings, statutory sections, or case law.
3. If any party name, date, or fact is unknown or unstated, output "[UNKNOWN]".
4. Do not cite fictional statutes or judgments. If a citation is mentioned but incomplete, use "[CITE]".
5. Provide a clear, non-technical plainLanguageSummary accessible to ordinary citizens.
6. The flowchart must capture ordered procedural stages (e.g. Notice Receipt -> Response Window -> Filing -> Hearing -> Appellate Option).
7. Action items must be concrete, actionable next steps with realistic priorities (High, Medium, Low).
8. Arguments must clearly isolate contested claims and evidentiary bases.
9. Output ONLY a valid JSON object matching the exact schema specified below. Do not wrap in markdown or backticks.

[DOCUMENT_TEXT]
{sanitized_text}
[/DOCUMENT_TEXT]

Respond with a JSON object strictly adhering to this structure:
{{
  "summary": {{
    "disputeType": "string",
    "keyParties": ["string"],
    "factualBackground": ["string"],
    "legalIssues": ["string"],
    "rulingsOrObligations": ["string"],
    "plainLanguageSummary": "string"
  }},
  "faqs": [
    {{
      "question": "string",
      "answer": "string",
      "relevantClauseOrPage": "string"
    }}
  ],
  "timeline": [
    {{
      "date": "string",
      "event": "string",
      "sourcePage": 1
    }}
  ],
  "flowchart": [
    {{
      "stepNumber": 1,
      "stageName": "string",
      "description": "string",
      "actionRequired": "string",
      "deadlineOrTimeframe": "string"
    }}
  ],
  "arguments": [
    {{
      "claim": "string",
      "evidenceOrBasis": "string",
      "counterArgument": "string"
    }}
  ],
  "actionItems": [
    {{
      "priority": "High | Medium | Low",
      "action": "string",
      "responsibleParty": "string",
      "deadline": "string"
    }}
  ],
  "disclaimer": "NyayaSetu provides informational assistance only and does not constitute formal legal counsel."
}}"""

    @staticmethod
    def build_chat_prompt(context_passages: str, conversation_history: str, user_question: str) -> str:
        """
        Builds the document-grounded question answering prompt.
        """
        sanitized_context = PromptManager.sanitize_untrusted_input(context_passages)
        sanitized_question = PromptManager.sanitize_untrusted_input(user_question)

        return f"""You are NyayaSetu Legal Document Assistant.
Answer the user's question based EXCLUSIVELY on the document excerpts provided inside [DOCUMENT_CONTEXT].

GROUNDING AND UNCERTAINTY RULES:
1. Answer directly and concisely based ONLY on the evidence inside [DOCUMENT_CONTEXT].
2. Identify which source pages contain the factual basis, and record them in the cited_pages array.
3. If the answer cannot be found in [DOCUMENT_CONTEXT], set is_unknown to true and output:
   "I cannot find this information in the uploaded document. [UNKNOWN]"
4. Never assume facts outside the provided excerpts.
5. Output ONLY a valid JSON object matching the requested schema.

[DOCUMENT_CONTEXT]
{sanitized_context}
[/DOCUMENT_CONTEXT]

[CONVERSATION_HISTORY]
{conversation_history}
[/CONVERSATION_HISTORY]

User Question: {sanitized_question}

Respond with a JSON object matching:
{{
  "answer": "string",
  "cited_pages": [1],
  "confidence": "High | Medium | Low",
  "is_unknown": false,
  "disclaimer": "NyayaSetu provides informational assistance only and does not constitute formal legal counsel."
}}"""

prompt_manager = PromptManager()

