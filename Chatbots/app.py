from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence,RunnablePassthrough,RunnableParallel
from langchain_core.output_parsers import StrOutputParser
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
import os 

parser = StrOutputParser()
# init the fast api app 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title='Bandhu Chat'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOADING THE MODELS AND DATABASES

print("Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-m3"
)

print("Connecting to Pinecone...")

vector_store = PineconeVectorStore(
    index_name="bandhu-db",
    embedding=embedding_model,
    pinecone_api_key=os.getenv("PINECONE_API_KEY")
)

print("Loading Gemini...")

model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0
)

# retriever
retriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,
        "fetch_k": 25,
        "lambda_mult": 0.75
    }
)

# Combining docs
def combine_docs(docs):
    return "\n\n".join(
        doc.page_content
        for doc in docs
    )

# Prompt 

template = PromptTemplate(
    template = """You are an expert Student Handbook Guidelines Assistant.
Your role is to answer student questions using ONLY the information provided in the retrieved handbook context.
Instructions
Carefully read:
The retrieved handbook context
The student's question
Provide a clear, accurate, and student-friendly response based strictly on the handbook rules.
Use simple, direct language. Explain policies in an easy-to-understand way without using complex legal or administrative wording.
Remain fully grounded in the retrieved context:
Do NOT invent policies, penalties, procedures, deadlines, or exceptions.
Do NOT assume information that is not explicitly stated.
Do NOT use outside knowledge.
If faculty names, contact numbers, office details,
or tabular information are present in the retrieved
context, extract them exactly as written.

Do not summarize numbers.
Do not alter phone numbers.
Do not infer missing digits.
If the answer is partially available:
Answer only the portion supported by the context.
Clearly mention what is not specified in the handbook context.
If the retrieved context does not contain enough information:
Say that the handbook does not provide a clear answer.
Suggest checking with the relevant university/college authority or handbook section.
Do NOT fabricate an answer.
Maintain a helpful, professional, and neutral tone.
When appropriate, structure the response as:
Answer concisely (50-150 words).
Only expand if the handbook explicitly provides detailed procedures.
Relevant Rule / Guideline
STRICT RULES:
1. Answer ONLY from the most directly relevant lines.
2. Ignore unrelated handbook text even if retrieved.
3. Do not broaden to nearby policies or committees unless explicitly asked.
4. Every factual statement must be directly supported by retrieved text.
Retrieved Context
{context}
Student Question
{question} """,
    input_variables=['context','question']
)


# request class

class Query(BaseModel):
    query:str
    
# apis

# base api request
@app.get("/")
def root():
    return {
        'Status':'running',
        'Name of service':'Bandhu Chat'
    }

# Defining the Chain workflow
retrieval_chain = (
        {
            'question':RunnablePassthrough(),
            'context': retriever | combine_docs
        }
    )
main_chain = RunnableSequence(retrieval_chain,template,model,parser)

# query request api
@app.post("/request")
async def root(request:Query):
    query = request.query
    response = await main_chain.ainvoke(query)
    
    return {
        'query':query,
        'answer':response
    }
    
    

