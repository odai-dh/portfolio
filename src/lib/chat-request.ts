// Validates the conversation the chat widget sends. Pure, so it is unit-tested.
//
// The 400-character limit is for what visitors type. The assistant's own earlier answers come
// back in the history too and are often longer (up to ~2,000 characters at 500 tokens); limiting
// them as well rejected every question after a long answer ("Something went wrong").
// The history is written by the browser, so assistant turns are still capped, not trusted.

export const MAX_QUESTIONS = 5;
export const MAX_QUESTION_LENGTH = 400;
export const MAX_ANSWER_LENGTH = 3000;

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type ChatRequestResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; status: 400 | 429; error: string };

export function validateChatRequest(body: unknown): ChatRequestResult {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false, status: 400, error: 'Bad request' };

  for (const message of messages) {
    if (typeof message !== 'object' || message === null) return { ok: false, status: 400, error: 'Bad request' };
    const { role, content } = message as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return { ok: false, status: 400, error: 'Bad request' };
    }
    if (role === 'user' && content.length > MAX_QUESTION_LENGTH) return { ok: false, status: 400, error: 'Message too long.' };
    if (role === 'assistant' && content.length > MAX_ANSWER_LENGTH) return { ok: false, status: 400, error: 'Bad request' };
  }

  const userTurns = messages.filter((message) => message.role === 'user').length;
  if (userTurns > MAX_QUESTIONS) return { ok: false, status: 429, error: 'Question limit exceeded.' };

  // Only the most recent turns go to the model
  const recent = (messages as ChatMessage[]).slice(-MAX_QUESTIONS * 2).map(({ role, content }) => ({ role, content }));
  return { ok: true, messages: recent };
}
