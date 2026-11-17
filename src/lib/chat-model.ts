// The Groq model behind the chat assistant. Shared by the chat route and the health check, which
// warns when Groq retires it (that has broken the chat twice: History #26).
// llama-3.3-70b-versatile was retired by Groq (2026-10). gpt-oss-120b/20b were tried and rejected: they
// corrupt e-mail addresses mid-answer (stray Harmony tokens after the '@'), which a contact-friendly bot can't have.
export const CHAT_MODEL = 'qwen/qwen3.8-27b';
