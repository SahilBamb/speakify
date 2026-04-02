import os
import json
from openai import OpenAI

LLM_TIMEOUT = 120

_client = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY environment variable is required. "
                "Export it before starting the server."
            )
        _client = OpenAI(api_key=api_key, timeout=LLM_TIMEOUT)
    return _client


def generate_book_outline(topic: str) -> dict:
    """
    Returns {"title": str, "description": str,
             "chapters": [{"number": int, "title": str, "summary": str}, ...]}
    """
    client = get_client()
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.8,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a creative author and educator. "
                    "Given a topic, generate a compelling book outline. "
                    "Respond ONLY with valid JSON matching this schema:\n"
                    '{"title": "...", "description": "one-paragraph synopsis", '
                    '"chapters": [{"number": 1, "title": "...", "summary": "2-3 sentence description"}, ...]}\n'
                    "Generate between 6 and 12 chapters. "
                    "Make chapter titles engaging. Do not include any text outside the JSON."
                ),
            },
            {"role": "user", "content": f"Create a book outline about: {topic}"},
        ],
    )
    text = resp.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    return json.loads(text)


def generate_chapter_content(
    book_title: str,
    chapter_number: int,
    chapter_title: str,
    chapter_summary: str,
    previous_context: str = "",
) -> str:
    """Returns the full prose text of a single chapter (1500-3000 words)."""
    client = get_client()

    context_block = ""
    if previous_context:
        context_block = f"\n\nContext from earlier chapters:\n{previous_context}\n"

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.8,
        max_tokens=4096,
        messages=[
            {
                "role": "system",
                "content": (
                    f'You are writing a book titled "{book_title}". '
                    "Write engaging, well-structured prose. "
                    "Use clear paragraphs. Do not include chapter titles or numbers in your output — "
                    "just the body text. Aim for 1500-2500 words."
                    f"{context_block}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Write Chapter {chapter_number}: \"{chapter_title}\"\n\n"
                    f"Chapter brief: {chapter_summary}"
                ),
            },
        ],
    )
    return resp.choices[0].message.content.strip()
