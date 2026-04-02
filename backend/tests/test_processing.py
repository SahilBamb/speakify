import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from processing import segment_sentences, estimate_duration_ms


class TestSegmentSentences:
    def test_basic_split(self):
        text = "Hello world. How are you? I am fine."
        result = segment_sentences(text)
        assert len(result) == 3
        assert result[0] == "Hello world."
        assert result[1] == "How are you?"
        assert result[2] == "I am fine."

    def test_empty_input(self):
        assert segment_sentences("") == []
        assert segment_sentences("   ") == []

    def test_single_sentence(self):
        result = segment_sentences("Just one sentence.")
        assert result == ["Just one sentence."]

    def test_no_terminal_punctuation(self):
        result = segment_sentences("No period here")
        assert result == ["No period here"]

    def test_abbreviations_may_split(self):
        result = segment_sentences("Dr. Smith went to Washington")
        assert len(result) >= 1

    def test_quotes(self):
        text = '"Hello there." She said. "How are you?"'
        result = segment_sentences(text)
        assert len(result) >= 2


class TestEstimateDuration:
    def test_empty_string(self):
        assert estimate_duration_ms("") == 500

    def test_short_text(self):
        dur = estimate_duration_ms("Hello")
        assert dur == 500

    def test_longer_text(self):
        text = " ".join(["word"] * 150)
        dur = estimate_duration_ms(text)
        assert dur == 60000

    def test_custom_wpm(self):
        text = " ".join(["word"] * 300)
        dur = estimate_duration_ms(text, wpm=300)
        assert dur == 60000
