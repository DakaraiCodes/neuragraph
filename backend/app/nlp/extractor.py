import spacy

# Load spaCy's small English NLP model one time when the app starts.
# This model can detect entities like people, organizations, places, dates, events, etc.
nlp = spacy.load("en_core_web_sm")


def extract_entities(text: str):
    """
    Extract named entities from raw text.

    Example:
    Input: "Alan Turing worked at Bletchley Park."
    Output:
    [
        {"text": "Alan Turing", "type": "PERSON"},
        {"text": "Bletchley Park", "type": "ORG"}
    ]
    """

    # Process the text with spaCy
    doc = nlp(text)

    entities = []

    # Loop through all named entities spaCy finds
    for ent in doc.ents:
        entity = {
            "text": ent.text,
            "type": ent.label_
        }

        entities.append(entity)

    return entities