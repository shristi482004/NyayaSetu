# AI Prompts Specification — NyayaSetu

This document records the exact versioned prompt templates utilized across the Gemini integration.
For full context and system architecture, refer to [18_ai_architecture_and_prompt_design.md](file:///Users/shristishristi/Desktop/NyayaSetu/docs/18_ai_architecture_and_prompt_design.md).

## Version Control: v1.0.0
- Model target: Gemini 2.0 / Gemini 1.5 Pro
- Default Temperature: 0.2
- Safety Thresholds: BLOCK_ONLY_HIGH
- Fencing Strategy: Multi-token delimiters (`[DOCUMENT_TEXT]`, `[DOCUMENT_CONTEXT]`)

