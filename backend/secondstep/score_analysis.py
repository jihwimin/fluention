def calculate_score(original_sentence: str, corrected_sentence: str):
    if not isinstance(corrected_sentence, str):
        corrected_sentence = str(corrected_sentence)  # ✅ Ensure it's a string

    original_words = set(original_sentence.split())
    corrected_words = set(corrected_sentence.split())

    if len(original_words) == 0:
        return 0  # Avoid division by zero

    similarity = len(original_words & corrected_words) / len(original_words)
    return round(similarity * 100)
