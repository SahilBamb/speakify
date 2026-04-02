import fitz
import re


def segment_sentences(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z"])', text)
    result = [s.strip() for s in sentences if s.strip()]
    if not result and text:
        result = [text]
    return result


def estimate_duration_ms(text: str, wpm: int = 150) -> int:
    words = len(text.split())
    if words == 0:
        return 500
    return max(500, int(words / wpm * 60 * 1000))


def process_pdf(filepath: str) -> tuple[list[dict], list[dict], int]:
    doc = fitz.open(filepath)
    all_chunks: list[dict] = []
    page_infos: list[dict] = []
    sequence_order = 0
    paragraph_index = 0

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_dict = page.get_text("dict")

        page_width = page_dict["width"]
        page_height = page_dict["height"]
        page_infos.append({
            "page_number": page_num + 1,
            "width": page_width,
            "height": page_height,
        })

        for block in page_dict["blocks"]:
            if block.get("type") != 0:
                continue

            lines_data = []
            full_text = ""

            for line in block.get("lines", []):
                line_text = ""
                for span in line.get("spans", []):
                    line_text += span["text"]
                line_text = line_text.strip()
                if not line_text:
                    continue
                lines_data.append({
                    "text": line_text,
                    "bbox": list(line["bbox"]),
                    "char_start": len(full_text),
                    "char_end": len(full_text) + len(line_text),
                })
                full_text += line_text + " "

            full_text = full_text.strip()
            if not full_text or len(full_text) < 3:
                continue

            paragraph_index += 1
            sentences = segment_sentences(full_text)
            if not sentences:
                continue

            current_pos = 0
            for sent_idx, sentence in enumerate(sentences):
                sent_start = full_text.find(sentence, current_pos)
                if sent_start == -1:
                    sent_start = current_pos
                sent_end = sent_start + len(sentence)
                current_pos = sent_end

                matching_lines = [
                    ld for ld in lines_data
                    if ld["char_end"] > sent_start and ld["char_start"] < sent_end
                ]

                if matching_lines:
                    bbox_x1 = min(l["bbox"][0] for l in matching_lines)
                    bbox_y1 = min(l["bbox"][1] for l in matching_lines)
                    bbox_x2 = max(l["bbox"][2] for l in matching_lines)
                    bbox_y2 = max(l["bbox"][3] for l in matching_lines)
                else:
                    bbox_x1, bbox_y1, bbox_x2, bbox_y2 = block["bbox"]

                sequence_order += 1
                all_chunks.append({
                    "page_number": page_num + 1,
                    "paragraph_index": paragraph_index,
                    "sentence_index": sent_idx,
                    "text": sentence,
                    "bbox_x1": round(bbox_x1, 2),
                    "bbox_y1": round(bbox_y1, 2),
                    "bbox_x2": round(bbox_x2, 2),
                    "bbox_y2": round(bbox_y2, 2),
                    "char_count": len(sentence),
                    "estimated_duration_ms": estimate_duration_ms(sentence),
                    "sequence_order": sequence_order,
                })

    doc.close()
    return all_chunks, page_infos, len(page_infos)
