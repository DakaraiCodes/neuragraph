from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Node, Edge
from app.schemas import (
    NodeCreate,
    NodeOut,
    EdgeCreate,
    EdgeOut,
    GraphResponse,
    VisualGraphResponse
)


router = APIRouter(
    prefix="/graph",
    tags=["Graph"]
)


# -----------------------------
# NODE ROUTES
# -----------------------------

@router.post("/nodes", response_model=NodeOut)
def create_node(node_data: NodeCreate, db: Session = Depends(get_db)):
    """
    Create a new node in the knowledge graph.
    A node represents an entity, concept, person, place, organization, etc.
    """

    new_node = Node(
        label=node_data.label,
        type=node_data.type,
        description=node_data.description
    )

    db.add(new_node)
    db.commit()
    db.refresh(new_node)

    return new_node


@router.get("/nodes", response_model=list[NodeOut])
def get_nodes(db: Session = Depends(get_db)):
    """
    Return all nodes in the knowledge graph.
    """

    nodes = db.query(Node).all()
    return nodes


# -----------------------------
# EDGE ROUTES
# -----------------------------

@router.post("/edges", response_model=EdgeOut)
def create_edge(edge_data: EdgeCreate, db: Session = Depends(get_db)):
    """
    Create a relationship between two existing nodes.
    """

    source_node = db.query(Node).filter(Node.id == edge_data.source_node_id).first()
    target_node = db.query(Node).filter(Node.id == edge_data.target_node_id).first()

    if not source_node:
        raise HTTPException(status_code=404, detail="Source node not found")

    if not target_node:
        raise HTTPException(status_code=404, detail="Target node not found")

    new_edge = Edge(
        source_node_id=edge_data.source_node_id,
        target_node_id=edge_data.target_node_id,
        relationship=edge_data.relationship,
        evidence=edge_data.evidence
    )

    db.add(new_edge)
    db.commit()
    db.refresh(new_edge)

    return new_edge


@router.get("/edges", response_model=list[EdgeOut])
def get_edges(db: Session = Depends(get_db)):
    """
    Return all edges in the knowledge graph.
    """

    edges = db.query(Edge).all()
    return edges


# -----------------------------
# FULL GRAPH ROUTE
# -----------------------------

@router.get("", response_model=GraphResponse)
def get_graph(db: Session = Depends(get_db)):
    """
    Return the full graph: all nodes and all edges.
    """

    nodes = db.query(Node).all()
    edges = db.query(Edge).all()

    return {
        "nodes": nodes,
        "edges": edges
    }


# -----------------------------
# VISUAL GRAPH ROUTE
# -----------------------------

@router.get("/visual", response_model=VisualGraphResponse)
def get_visual_graph(db: Session = Depends(get_db)):
    """
    Return graph data formatted for React Flow.

    React Flow expects nodes like:
    {
        "id": "1",
        "data": {"label": "Alan Turing"},
        "position": {"x": 100, "y": 100}
    }

    And edges like:
    {
        "id": "edge-1",
        "source": "1",
        "target": "2",
        "label": "worked at"
    }
    """

    db_nodes = db.query(Node).all()
    db_edges = db.query(Edge).all()

    visual_nodes = []
    visual_edges = []

    x_spacing = 220
    y_spacing = 140
    nodes_per_row = 4

    for index, node in enumerate(db_nodes):
        row = index // nodes_per_row
        col = index % nodes_per_row

        visual_nodes.append({
            "id": str(node.id),
            "data": {
                "label": node.label,
                "type": node.type
            },
            "position": {
                "x": col * x_spacing,
                "y": row * y_spacing
            }
        })

    for edge in db_edges:
        visual_edges.append({
            "id": f"edge-{edge.id}",
            "source": str(edge.source_node_id),
            "target": str(edge.target_node_id),
            "label": edge.relationship
        })

    return {
        "nodes": visual_nodes,
        "edges": visual_edges
    }