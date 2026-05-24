def extract_relationships(text: str, entities: list[dict]):
    """
    Extract simple rule-based relationships from text.

    This is not full AI yet.
    It uses keyword patterns to infer relationships between entities.

    Example:
    "Google was founded by Larry Page and Sergey Brin."

    Output:
    [
        {
            "source": "Google",
            "target": "Larry Page",
            "relationship": "founded by",
            "evidence": "Google was founded by Larry Page and Sergey Brin."
        }
    ]
    """

    relationships = []

    lowered_text = text.lower()

    # Create quick lookup lists by entity type
    people = [entity for entity in entities if entity["type"] == "PERSON"]
    orgs = [entity for entity in entities if entity["type"] == "ORG"]
    places = [
        entity
        for entity in entities
        if entity["type"] in ["GPE", "LOC", "FAC"]
    ]

    # -----------------------------
    # Rule 1: founded by
    # -----------------------------
    # Example:
    # "Google was founded by Larry Page and Sergey Brin."
    if "founded by" in lowered_text:
        for org in orgs:
            for person in people:
                if org["text"] in text and person["text"] in text:
                    relationships.append({
                        "source": org["text"],
                        "target": person["text"],
                        "relationship": "founded by",
                        "evidence": text
                    })

    # -----------------------------
    # Rule 2: worked at
    # -----------------------------
    # Example:
    # "Alan Turing worked at Bletchley Park."
    if "worked at" in lowered_text or "works at" in lowered_text:
        for person in people:
            for org in orgs + places:
                if person["text"] in text and org["text"] in text:
                    relationships.append({
                        "source": person["text"],
                        "target": org["text"],
                        "relationship": "worked at",
                        "evidence": text
                    })

    # -----------------------------
    # Rule 3: located in
    # -----------------------------
    # Example:
    # "OpenAI is located in San Francisco."
    if "located in" in lowered_text or "based in" in lowered_text:
        for org in orgs:
            for place in places:
                if org["text"] in text and place["text"] in text:
                    relationships.append({
                        "source": org["text"],
                        "target": place["text"],
                        "relationship": "located in",
                        "evidence": text
                    })

    # -----------------------------
    # Rule 4: born in
    # -----------------------------
    # Example:
    # "Alan Turing was born in London."
    if "born in" in lowered_text:
        for person in people:
            for place in places:
                if person["text"] in text and place["text"] in text:
                    relationships.append({
                        "source": person["text"],
                        "target": place["text"],
                        "relationship": "born in",
                        "evidence": text
                    })

    # Remove duplicate relationships
    unique_relationships = []
    seen = set()

    for rel in relationships:
        key = (
            rel["source"],
            rel["target"],
            rel["relationship"]
        )

        if key not in seen:
            unique_relationships.append(rel)
            seen.add(key)

    return unique_relationships