import difflib

def calculate_score(original_sentence: str, corrected_sentence: str):
    if not isinstance(corrected_sentence, str):
        corrected_sentence = str(corrected_sentence)

    original_words = original_sentence.lower().strip().split()
    corrected_words = corrected_sentence.lower().strip().split()

    if not original_words:  # Avoid division by zero
        return 0

    # Use SequenceMatcher to check similarity ratio
    similarity = difflib.SequenceMatcher(None, original_sentence, corrected_sentence).ratio()
    score = round(similarity * 100)

    return score
