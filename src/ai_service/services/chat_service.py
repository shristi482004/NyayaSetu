import logging
from typing import List
from schemas.chat import ChatRequest, ChatResponse, ContextChunk
from services.prompts import prompt_manager
from services.gemini_client import gemini_client

logger = logging.getLogger("nyayasetu.ai.chat")

class ChatService:
    def answer_question(self, request: ChatRequest) -> ChatResponse:
        """
        Executes document-grounded question answering:
        1. Assembles candidate context passages into labeled page blocks.
        2. Injects safety fences and instructions forbidding fabrication.
        3. Invokes Gemini and validates output using Pydantic.
        """
        logger.info(f"Processing grounded chat query for document {request.document_id}: '{request.question}'")

        # Format context chunks
        context_blocks: List[str] = []
        for chunk in request.context_chunks:
            context_blocks.append(f"--- [Page {chunk.page_number}] ---\n{chunk.text_content}")
        joined_context = "\n\n".join(context_blocks)

        # Format history
        history_lines: List[str] = []
        for turn in (request.history or []):
            history_lines.append(f"{turn.role.capitalize()}: {turn.content}")
        joined_history = "\n".join(history_lines) if history_lines else "No previous history."

        prompt = prompt_manager.build_chat_prompt(
            context_passages=joined_context,
            conversation_history=joined_history,
            user_question=request.question
        )

        raw_json = gemini_client.generate_json_response(prompt)
        validated_response = ChatResponse.model_validate(raw_json)
        return validated_response

chat_service = ChatService()

