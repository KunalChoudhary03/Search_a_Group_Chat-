# Search a Group Chat Properly

A high-performance semantic search engine built for synthetic group chat conversations, designed to retrieve contextually relevant messages using local embeddings and manual exact cosine similarity without relying on paid AI APIs.

---

## 1. Project Name
**Search a Group Chat Properly** (Placement / Vibe-Coding Project)

---

## 2. Project Purpose
Modern keyword-based chat search fails when users search for concepts rather than exact words (e.g., searching *"Where did we decide to go for our winter vacation?"* when the group only mentioned *"Manali hotel booked for snowfall season"*). 

This project aims to solve this challenge across a realistic, 6-month synthetic group chat containing:
- **4,600 authentic messages** across **8 distinct participants** (0.24% duplication rate)
- Multi-turn conversation sessions covering **19 realistic student life topic clusters**
- Code-mixed **Hinglish / English** conversations, emojis, typos, and natural turn-taking
- **3 major ground-truth decision threads** (Winter Trip, College HackCon, Project Stack)
- **Interactive Conversation History Timeline** with lazy loading (40 messages/batch)
- **Temporal and sender filters** (filter by participant or date range)
- **Surrounding conversation context expansion** (inspecting ±2 messages before and after)
- **48 evaluation benchmark queries** (100% benchmark accuracy, 12/12 zero-keyword queries)

---

## 3. Tech Stack

### Frontend
- **React (v18)**: Component-based UI library
- **Vite**: Ultra-fast frontend build tooling and dev server
- **Tailwind CSS**: Modern utility-first styling
- **Lucide React**: Clean minimalist iconography

### Backend
- **Node.js**: Modern JavaScript runtime (ES modules)
- **Express.js**: REST API framework
- **Mongoose**: ODM for MongoDB document schema modeling

### Database & Vector Search
- **MongoDB / MongoDB Atlas**: Standard document database storing chat messages and embedding arrays (NOT used as a dedicated vector database)
- **Local Text Embedding Model**: 100% free, local `@xenova/transformers` ONNX model (`Xenova/all-MiniLM-L6-v2`) running on CPU without external AI APIs
- **Exact Cosine Similarity**: Manually implemented in native JavaScript

> **Zero Paid APIs**: No OpenAI, Gemini, Claude, Pinecone, ChromaDB, FAISS, or sklearn dependencies.

---

## 4. Evaluation Benchmark

Run the full evaluation test suite:
```bash
cd backend
npm run test:search
```
`npm run test:search` runs **48 benchmark queries**, reporting:
- 100% benchmark accuracy (48/48 predefined evaluation queries passed)
- 12/12 zero-keyword tests passed (100.0%)

---

## 5. Quickstart & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- *(Optional)* **MongoDB**: Local MongoDB server or MongoDB Atlas URI. If MongoDB is not running locally, the backend automatically boots an embedded local database instance.

---

### Option A: Quickstart from Root (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KunalChoudhary03/Search_a_Group_Chat-.git
   cd Search_a_Group_Chat-
   ```

2. **Install all dependencies** (Root, Backend & Frontend):
   ```bash
   npm run install:all
   ```

3. **Seed dataset & generate embeddings**:
   ```bash
   cd backend
   npm run setup               # Seeds 4,600 messages and generates 384-d local embeddings
   cd ..
   ```

4. **Start both Backend and Frontend concurrently**:
   ```bash
   npm run dev
   ```
   - **Backend API**: `http://localhost:5000`
   - **Frontend UI**: `http://localhost:5173`

---

### Option B: Step-by-Step Manual Setup

#### 1. Backend Setup & Data Seeding
Open your **first terminal**:
```bash
cd backend
npm install

# Seed dataset & compute local vector embeddings
npm run generate:data        # Seeds 4,600 realistic messages & 3 decision threads into MongoDB
npm run generate:embeddings  # Computes and stores 384-d local embeddings
npm run test:search          # Runs 48 benchmark evaluation queries (100% pass)
npm run test:duplicates      # Evaluates dataset uniqueness (0.24% duplicates)

# Start backend server
npm start                    # Starts backend server on http://localhost:5000
```

#### 2. Frontend Setup
Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev                  # Starts Vite dev server on http://localhost:5173
```

To create a production build of the frontend:
```bash
npm run build
```
