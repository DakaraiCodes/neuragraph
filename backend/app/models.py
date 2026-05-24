from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)

    # Example: "Alan Turing", "Bletchley Park", "Computer Science"
    label = Column(String, index=True, nullable=False)

    # Example: PERSON, ORG, LOCATION, CONCEPT
    type = Column(String, default="CONCEPT")

    # Optional longer description for future AI summaries
    description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Edge(Base):
    __tablename__ = "edges"

    id = Column(Integer, primary_key=True, index=True)

    # source_node_id = where the relationship starts
    source_node_id = Column(Integer, ForeignKey("nodes.id"), nullable=False)

    # target_node_id = where the relationship points
    target_node_id = Column(Integer, ForeignKey("nodes.id"), nullable=False)

    # Example: "worked at", "founded", "located in", "related to"
    relationship = Column(String, nullable=False)

    # Later we can store the original sentence this came from
    evidence = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())