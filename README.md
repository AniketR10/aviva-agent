# Agentic Chaser – AdvisoryAI Hackathon Challenge

Agentic Chaser is an intelligent dashboard designed for financial advisors to automate client chasing, track case progress, and generate AI-driven action scripts. It creates a timeline-based workflow to demonstrate agentic behavior in financial advisory contexts.

![Agentic Chaser Dashboard](dashboard.png)

## 🚀 Features

### 1. Active Case Dashboard

- **Real-time Table**  
  Displays a list of active client cases sorted by the most recent import or creation date.

- **Status Tracking**  
  Visual badges showing the latest completed action (e.g., _"Eligible for spousal ISA transfer"_) or a fallback **"No Activity"** status.

- **Dynamic Columns**
  - Client Name & Client ID badges  
  - Latest Action with AI-cleaned text (removes technical prefixes)  
  - Last Update time using real-world relative time (e.g., _"less than a minute ago"_)

- **Case Management**  
  Trash button to delete cases directly from the table row.

---

### 2. Case Details & AI Scripting

- **Comprehensive Client View**  
  A centered modal displaying detailed case information.

- **Header Information**
  - Client Name  
  - Client ID  
  - Provider  

- **Client Intelligence**  
  Three-column layout showing:
  - Identified Risks  
  - Goals  
  - Financial Summary (Net Worth)

- **Activity Timeline**  
  A sorted history of interactions, ensuring the latest actions appear at the top.

- **Agentic Script Generator**
  - Select an **Upcoming Action** to generate a tailored call/email script using **Groq (GPT OSS/120B open source free model)**  
  - **Mark as Done** instantly updates the timeline, marks the action as complete, and refreshes the data



## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)  
- **Database:** Postgres (Neon)  
- **AI / LLM:** Groq SDK (openai/gpt-oss-120b)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **UI Components:** shadcn/ui  
- **Icons:** Lucide React  

---

## ⚙️ Setup Instructions

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agent-chaser-advisoryai.git
cd agent-chaser
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get your API Keys
### Getting a Groq API Key

This project uses **Groq (GPT OSS 120B)** for AI-powered scripting and extraction.

Follow these steps to obtain your API key:

1. Visit the **Groq Console**  
   👉 https://console.groq.com

2. Sign in or create a Groq account.

3. Navigate to the **API Keys** section from the dashboard.

4. Click **Create API Key**.

5. Copy the generated key and store it securely.

### Getting a Neon Database Connection String

This project uses **Neon Serverless Postgres** as the database.

1. Visit the **Neon Dashboard**  
   👉 https://neon.tech

2. Sign in or create a Neon account.

3. Create a new **Project**.

4. Select a **Postgres database** and preferred **region**.

5. Once the project is created, navigate to **Connection Details**.

6. Copy the **Postgres connection string** (disable the connection pooling first, very important).

7. Add the connection string to your environment variables:

```bash
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
```

8. This project uses a **JSON-store approach within Postgres**.  
You must create the initial table in your [**Neon SQL Editor**](https://neon.com/).

```sql
CREATE TABLE app_storage (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  data JSONB
);

-- Initialize with empty data
INSERT INTO app_storage (id, data) 
VALUES (TRUE, '{"cases": [], "virtualDate": "2026-02-07"}');
```
### 4. Configure Environment Variables
Create a .env file in the root directory and add the following keys:
```bash
GROQ_API_KEY="gsk_..."

DATABASE_URL="neon-connection-string"

```

### 5. Run the Application

```bash
npm run dev
```

## 📂 How to Test (Test Files)

This repository includes a `testfiles/` folder containing sample client data.

### ⚠️ Important: File Support

- The system **ONLY accepts `.txt` files**
- Do **NOT** upload PDFs or Word documents

### Testing Workflow

1. Navigate to the dashboard  
2. Click **Import Client**
3. Select a file from the `testfiles/` folder (e.g., `client_a.txt`)  

The AI will automatically extract:

- Client ID  
- Goals  
- Risks  
- Next Actions etc.

…and populate the dashboard accordingly.

