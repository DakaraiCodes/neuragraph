from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# -----------------------------
# NODE SCHEMAS
# -----------------------------

class NodeCreate(BaseModel):
    label: str
    type: str = "CONCEPT"
    description: Optional[str] = None


class NodeOut(BaseModel):
    id: int
    label: str
    type: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------------
# EDGE SCHEMAS
# -----------------------------

class EdgeCreate(BaseModel):
    source_node_id: int
    target_node_id: int
    relationship: str
    evidence: Optional[str] = None


class EdgeOut(BaseModel):
    id: int
    source_node_id: int
    target_node_id: int
    relationship: str
    evidence: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------------
# GRAPH RESPONSE SCHEMA
# -----------------------------

class GraphResponse(BaseModel):
    nodes: list[NodeOut]
    edges: list[EdgeOut]

# -----------------------------
# TEXT INGESTION SCHEMAS
# -----------------------------

class TextIngestRequest(BaseModel):
    text: str


class TextIngestResponse(BaseModel):
    message: str
    original_text: str
    character_count: int
    word_count: int

# -----------------------------
# ENTITY EXTRACTION SCHEMAS
# -----------------------------

class ExtractedEntity(BaseModel):
    text: str
    type: str


class EntityExtractionResponse(BaseModel):
    message: str
    original_text: str
    entities: list[ExtractedEntity]
    entity_count: int

# -----------------------------
# ENTITY SAVE RESPONSE SCHEMA
# -----------------------------

class SavedEntitiesResponse(BaseModel):
    message: str
    original_text: str
    saved_nodes: list[NodeOut]
    saved_count: int

# -----------------------------
# GRAPH BUILD RESPONSE SCHEMA
# -----------------------------

class BuildGraphResponse(BaseModel):
    message: str
    original_text: str
    nodes: list[NodeOut]
    edges: list[EdgeOut]
    node_count: int
    edge_count: int

# -----------------------------
# VISUAL GRAPH SCHEMAS
# -----------------------------

class VisualNodeData(BaseModel):
    label: str
    type: str


class VisualNodePosition(BaseModel):
    x: float
    y: float


class VisualNode(BaseModel):
    id: str
    data: VisualNodeData
    position: VisualNodePosition


class VisualEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class VisualGraphResponse(BaseModel):
    nodes: list[VisualNode]
    edges: list[VisualEdge]