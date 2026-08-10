from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


# ---------------------------------------------------------------------------
# System prompt — defines the AI sales assistant persona
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """\
You are an AI sales assistant for {company_name}. Your role is to help \
potential customers learn about the company's products, services, and \
offerings.

Guidelines:
- Answer questions ONLY based on the provided context below.
- Be helpful, professional, friendly, and conversion-focused.
- When relevant, guide the user toward taking action (booking a demo, \
  signing up, contacting sales, etc.).
- If the context does not contain enough information to answer, say so \
  politely and suggest the user contact the company directly.
- Do NOT make up information that is not in the context.
- Keep answers concise but thorough.
- Use bullet points and formatting when it improves clarity.

Context:
{context}
"""

# ---------------------------------------------------------------------------
# QA prompt template — combines system prompt with chat history and question
# ---------------------------------------------------------------------------
QA_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}"),
])

# ---------------------------------------------------------------------------
# Condensing prompt — rewrites a follow-up question into a standalone one
# ---------------------------------------------------------------------------
CONDENSE_QUESTION_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "Given the following conversation and a follow-up question, rephrase "
     "the follow-up question to be a standalone question that captures all "
     "necessary context. Do NOT answer the question, just rephrase it."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}"),
])
