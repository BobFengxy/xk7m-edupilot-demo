# Edu-Pilot 高中物理 RAG 知识库

本目录为 Edu-Pilot 多模态 AI 互动式教学智能体配套的**本地 RAG 知识库**，共收录高中物理 **30 个核心知识点**，覆盖 7 个章节，每条知识点按 **6 个维度**组织（基础信息 / 教学重难点与课堂设计 / 实验全流程 / 例题·易错·高考 / 课件版式与动画 / 物理学史与拓展）。

其中 `K-02-01《牛顿第一定律》` 与 `K-03-04《研究平抛物体的运动》`是**基准案例（benchmark_ids）**，内容深度最完整，可作为典型 RAG 查询效果展示。

## 文件结构

```
rag-pack/
├── knowledge.json      # 结构化知识库源数据（30 entries × 6 dimensions）
├── build_db.py         # 使用 all-MiniLM-L6-v2 + Chroma 构建本地向量库
├── start_rag.py        # FastAPI 检索服务
├── requirements.txt    # Python 依赖
└── README.md           # 本文件
```

## 快速部署

### 1. 安装依赖
```bash
pip install -r requirements.txt
```
> 首次安装会下载 all-MiniLM-L6-v2 模型（约 80 MB），请保持联网。

### 2. 构建向量数据库
```bash
python build_db.py
```
运行完成后会生成 `./chroma_db/` 持久化目录。

### 3. 启动检索服务
```bash
python start_rag.py
# 默认监听 http://127.0.0.1:8787
```

### 4. 验证
```bash
curl "http://127.0.0.1:8787/api/health"
curl "http://127.0.0.1:8787/api/rag/retrieve?q=平抛运动实验&k=3"
```

## 接口规范

### GET `/api/rag/retrieve?q=<query>&k=<int>`
### POST `/api/rag/retrieve`  body: `{"query": "...", "k": 5}`

响应：
```json
{
  "query": "平抛运动实验",
  "hits": [
    {
      "id": "K-03-04",
      "title": "研究平抛物体的运动（实验）",
      "chapter": "曲线运动",
      "level": "高一",
      "difficulty": "★★★★☆",
      "is_benchmark": true,
      "score": 0.87,
      "snippet": "..."
    }
  ]
}
```

## 与前端联调

前端 `Cloud.jsx` 下载 `rag-pack.zip` 后，教师在本地解压并按本 README 启动服务，前端页面中相关输入框可直接调用 `http://127.0.0.1:8787/api/rag/retrieve`。

生产部署可以将服务反向代理到公网域名或打包为 Docker 镜像。

## 知识库覆盖章节

| 章节 | 条目数 | 代表知识点 |
| --- | --- | --- |
| 运动的描述 | 4 | 参考系、位移/路程、速度/加速度、匀变速规律 |
| 牛顿运动定律 | 5 | ⭐ 牛顿第一定律、第二定律、共点力平衡、超重失重 |
| 曲线运动 | 6 | 平抛运动、⭐ 平抛运动实验、圆周运动、向心力 |
| 万有引力与航天 | 3 | 开普勒定律、万有引力、卫星与宇宙速度 |
| 机械能 | 4 | 功功率、动能定理、机械能守恒 |
| 静电场 | 4 | 库仑定律、电场强度、电势、电容器 |
| 动量守恒定律 | 3 | 动量定理、动量守恒、碰撞 |

共 30 条，⭐ 为 benchmark 基准案例。

## 扩充方式

- 新增知识点：在 `knowledge.json` 的 `entries` 数组追加新条目，保持 `id` 唯一（建议格式 `K-<章号>-<序号>`）。
- 修改字段：确保 6 个维度字段命名一致，便于 `build_db.py` 中 `flatten_entry()` 正确展平。
- 重新构建：`python build_db.py`（会自动清除旧 `chroma_db/`）。

## 许可

本知识库用于 Edu-Pilot 竞赛演示（锐捷网络 A04 赛道）。内容整理自公开中学物理教材与课标。
