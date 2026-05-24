from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Node, Edge
from app.schemas import (
    TextIngestRequest,
    TextIngestResponse,
    EntityExtractionResponse,
    SavedEntitiesResponse,
    BuildGraphResponse
)
from app.nlp.extractor import extract_entities
from app.nlp.relationtionship_extractor import extract_relationships

router = APIRouter(
    prefix="/ingest",
    tags=["Ingestion"]
)


@router.post("/text", response_model=TextIngestResponse)
def ingest_text(request: TextIngestRequest):
    """
    Accept raw text from the user.

    For now, this route validates and returns basic text information.
    """

    cleaned_text = request.text.strip()

    if not cleaned_text:
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    words = cleaned_text.split()

    return {
        "message": "Text received successfully.",
        "original_text": cleaned_text,
        "character_count": len(cleaned_text),
        "word_count": len(words)
    }


@router.post("/extract-entities", response_model=EntityExtractionResponse)
def extract_text_entities(request: TextIngestRequest):
    """
    Extract named entities from raw text using spaCy.

    This route extracts entities but does not save them.
    """

    cleaned_text = request.text.strip()

    if not cleaned_text:
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    entities = extract_entities(cleaned_text)

    return {
        "message": "Entities extracted successfully.",
        "original_text": cleaned_text,
        "entities": entities,
        "entity_count": len(entities)
    }


@router.post("/save-entities", response_model=SavedEntitiesResponse)
def save_text_entities(
    request: TextIngestRequest,
    db: Session = Depends(get_db)
):
    """
    Extract named entities from text and save them as graph nodes.
    """

    cleaned_text = request.text.strip()

    if not cleaned_text:
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    extracted_entities = extract_entities(cleaned_text)

    saved_nodes = []

    for entity in extracted_entities:
        entity_text = entity["text"].strip()
        entity_type = entity["type"].strip()

        if not entity_text:
            continue

        existing_node = (
            db.query(Node)
            .filter(Node.label == entity_text)
            .first()
        )

        if existing_node:
            saved_nodes.append(existing_node)
            continue

        new_node = Node(
            label=entity_text,
            type=entity_type,
            description=f"Extracted from text: {cleaned_text[:120]}"
        )

        db.add(new_node)
        db.commit()
        db.refresh(new_node)

        saved_nodes.append(new_node)

    return {
        "message": "Entities extracted and saved successfully.",
        "original_text": cleaned_text,
        "saved_nodes": saved_nodes,
        "saved_count": len(saved_nodes)
    }


@router.post("/build-graph", response_model=BuildGraphResponse)
def build_graph_from_text(
    request: TextIngestRequest,
    db: Session = Depends(get_db)
):
    """
    Extract entities from text, save them as nodes, and create smarter edges.

    Relationship strategy:
    1. First try rule-based semantic relationships.
    2. If no semantic relationships are found, fall back to "mentioned with".
    """

    cleaned_text = request.text.strip()

    if not cleaned_text:
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )

    extracted_entities = extract_entities(cleaned_text)

    saved_nodes = []

    # -----------------------------
    # STEP 1: Save entities as nodes
    # -----------------------------

    for entity in extracted_entities:
        entity_text = entity["text"].strip()
        entity_type = entity["type"].strip()

        if not entity_text:
            continue

        existing_node = (
            db.query(Node)
            .filter(Node.label == entity_text)
            .first()
        )

        if existing_node:
            saved_nodes.append(existing_node)
            continue

        new_node = Node(
            label=entity_text,
            type=entity_type,
            description=f"Extracted from text: {cleaned_text[:120]}"
        )

        db.add(new_node)
        db.commit()
        db.refresh(new_node)

        saved_nodes.append(new_node)

    # Remove duplicate nodes from response
    unique_nodes = []
    seen_node_ids = set()

    for node in saved_nodes:
        if node.id not in seen_node_ids:
            unique_nodes.append(node)
            seen_node_ids.add(node.id)

    created_edges = []

    # Helpful lookup:
    # "Google" -> Node object
    node_lookup = {
        node.label: node
        for node in unique_nodes
    }

    # -----------------------------
    # STEP 2: Try semantic relationships first
    # -----------------------------

    semantic_relationships = extract_relationships(
        cleaned_text,
        extracted_entities
    )

    for rel in semantic_relationships:
        source_label = rel["source"]
        target_label = rel["target"]
        relationship_label = rel["relationship"]
        evidence = rel["evidence"]

        source_node = node_lookup.get(source_label)
        target_node = node_lookup.get(target_label)

        if not source_node or not target_node:
            continue

        existing_edge = (
            db.query(Edge)
            .filter(
                Edge.source_node_id == source_node.id,
                Edge.target_node_id == target_node.id,
                Edge.relationship == relationship_label
            )
            .first()
        )

        if existing_edge:
            created_edges.append(existing_edge)
            continue

        new_edge = Edge(
            source_node_id=source_node.id,
            target_node_id=target_node.id,
            relationship=relationship_label,
            evidence=evidence
        )

        db.add(new_edge)
        db.commit()
        db.refresh(new_edge)

        created_edges.append(new_edge)

    # -----------------------------
    # STEP 3: Fallback if no semantic edges were found
    # -----------------------------
    # If we cannot detect a specific relationship, we still create
    # a simple "mentioned with" graph so the user gets useful output.

    if len(created_edges) == 0:
        for i in range(len(unique_nodes)):
            for j in range(i + 1, len(unique_nodes)):
                source_node = unique_nodes[i]
                target_node = unique_nodes[j]

                existing_edge = (
                    db.query(Edge)
                    .filter(
                        Edge.source_node_id == source_node.id,
                        Edge.target_node_id == target_node.id,
                        Edge.relationship == "mentioned with"
                    )
                    .first()
                )

                if existing_edge:
                    created_edges.append(existing_edge)
                    continue

                new_edge = Edge(
                    source_node_id=source_node.id,
                    target_node_id=target_node.id,
                    relationship="mentioned with",
                    evidence=cleaned_text
                )

                db.add(new_edge)
                db.commit()
                db.refresh(new_edge)

                created_edges.append(new_edge)

    return {
        "message": "Knowledge graph built successfully.",
        "original_text": cleaned_text,
        "nodes": unique_nodes,
        "edges": created_edges,
        "node_count": len(unique_nodes),
        "edge_count": len(created_edges)
    }