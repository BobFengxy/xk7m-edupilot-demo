"""
Edu-Pilot RAG 检索服务 (FastAPI)

运行:
    python start_rag.py
    # 默认监听 http://127.0.0.1:8787

接口:
    GET  /api/health                  健康检查
    GET  /api/rag/retrieve?q=xxx&k=5  语义检索
    POST /api/rag/retrieve            同上，body: {"query": "xxx", "k": 5}
"""

from pathlib import Path
from typing import List, Optional

import chromadb
from chromadb.config import Settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).parent
DB_PATH = ROOT / "chroma_db"
COLLECTION_NAME = "edu_pilot_physics"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

print(f"[RAG] 加载模型 {MODEL_NAME} ...")
model = SentenceTransformer(MODEL_NAME)
print(f"[RAG] 连接 Chroma {DB_PATH} ...")
client = chromadb.PersistentClient(path=str(DB_PATH), settings=Settings(anonymized_telemetry=False))
collection = client.get_collection(COLLECTION_NAME)
print(f"[RAG] 就绪。collection size = {collection.count()}")

app = FastAPI(title="Edu-Pilot RAG Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RetrieveRequest(BaseModel):
    query: str
    k: int = 5


class RetrieveHit(BaseModel):
    id: str
    title: str
    chapter: str
    level: str
    difficulty: str
    is_benchmark: bool
    score: float
    snippet: str


class RetrieveResponse(BaseModel):
    query: str
    hits: List[RetrieveHit]


@app.get("/api/health")
def health():
    return {"status": "ok", "entries": collection.count()}


def _do_retrieve(query: str, k: int) -> RetrieveResponse:
    emb = model.encode([query], normalize_embeddings=True).tolist()
    res = collection.query(query_embeddings=emb, n_results=max(1, min(k, 20)))
    hits = []
    for i in range(len(res["ids"][0])):
        meta = res["metadatas"][0][i]
        doc = res["documents"][0][i]
        hits.append(RetrieveHit(
            id=res["ids"][0][i],
            title=meta.get("title", ""),
            chapter=meta.get("chapter", ""),
            level=meta.get("level", ""),
            difficulty=meta.get("difficulty", ""),
            is_benchmark=bool(meta.get("is_benchmark", False)),
            score=1.0 - float(res["distances"][0][i]),
            snippet=doc[:280],
        ))
    return RetrieveResponse(query=query, hits=hits)


@app.get("/api/rag/retrieve", response_model=RetrieveResponse)
def retrieve_get(q: str, k: int = 5):
    return _do_retrieve(q, k)


@app.post("/api/rag/retrieve", response_model=RetrieveResponse)
def retrieve_post(req: RetrieveRequest):
    return _do_retrieve(req.query, req.k)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8787)
