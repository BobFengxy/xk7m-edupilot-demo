"""
Edu-Pilot RAG 知识库构建脚本
使用 sentence-transformers (all-MiniLM-L6-v2) + Chroma 本地向量数据库

运行方式:
    pip install -r requirements.txt
    python build_db.py

输出:
    ./chroma_db/   — 持久化向量数据库目录
"""

import json
import os
from pathlib import Path

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).parent
KB_PATH = ROOT / "knowledge.json"
DB_PATH = ROOT / "chroma_db"
COLLECTION_NAME = "edu_pilot_physics"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def flatten_entry(entry: dict) -> str:
    """将一个知识点 6 维度内容展平为一段可被向量化的长文本。"""
    parts = [
        f"标题: {entry['title']}",
        f"章节: {entry['chapter']}",
        f"学段: {entry.get('level', '')}",
        f"难度: {entry.get('difficulty', '')}",
        f"重点: {'; '.join(entry.get('key_points', []))}",
        f"难点: {'; '.join(entry.get('difficulties', []))}",
        f"教学设计: {entry.get('teaching_design', '')}",
    ]
    for exp in entry.get("experiments", []):
        parts.append(f"实验 {exp.get('name', '')}: " + "; ".join(exp.get("steps", []) or [exp.get("conclusion", "")]))
    for ex in entry.get("examples", []):
        parts.append(f"例题: {ex.get('q', '')} 答: {ex.get('a', '')}")
    parts.append("易错: " + "; ".join(entry.get("common_mistakes", [])))
    parts.append("高考参考: " + "; ".join(entry.get("gaokao_refs", [])))
    parts.append("版式: " + "; ".join(entry.get("slide_templates", [])))
    parts.append("动画: " + "; ".join(entry.get("animation_suggestions", [])))
    parts.append(f"物理学史: {entry.get('history', '')}")
    parts.append("拓展: " + "; ".join(entry.get("extensions", [])))
    return "\n".join(p for p in parts if p.strip())


def main():
    print(f"[1/4] 读取知识库: {KB_PATH}")
    with open(KB_PATH, "r", encoding="utf-8") as f:
        kb = json.load(f)
    entries = kb["entries"]
    print(f"      共 {len(entries)} 个知识点")

    print(f"[2/4] 加载 embedding 模型: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    print(f"[3/4] 初始化 Chroma 数据库: {DB_PATH}")
    if DB_PATH.exists():
        import shutil
        shutil.rmtree(DB_PATH)
    client = chromadb.PersistentClient(path=str(DB_PATH), settings=Settings(anonymized_telemetry=False))
    collection = client.create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})

    print("[4/4] 向量化并写入数据库...")
    docs, ids, metas, embs = [], [], [], []
    for e in entries:
        text = flatten_entry(e)
        docs.append(text)
        ids.append(e["id"])
        metas.append({
            "title": e["title"],
            "chapter": e["chapter"],
            "level": e.get("level", ""),
            "difficulty": e.get("difficulty", ""),
            "is_benchmark": e["id"] in kb["meta"].get("benchmark_ids", []),
        })
    embs = model.encode(docs, show_progress_bar=True, normalize_embeddings=True).tolist()
    collection.add(ids=ids, documents=docs, metadatas=metas, embeddings=embs)
    print(f"完成！已写入 {len(ids)} 条向量到 {DB_PATH}")
    print(f"Benchmark 标注的知识点: {kb['meta'].get('benchmark_ids', [])}")


if __name__ == "__main__":
    main()
