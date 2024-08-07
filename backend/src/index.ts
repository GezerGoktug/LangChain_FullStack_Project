import { serve } from "@hono/node-server";
import { Hono } from "hono";
import path from "path";
import { promises as fs } from "fs";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Ollama } from "@langchain/community/llms/ollama";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { cors } from "hono/cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

// Hono uygulamasının oluşturulması
const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend's origin
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

const client = new MongoClient(process.env.MONGO_URI);

// Ollama LLM'nin yapılandırılması
const ollama = new Ollama({
  baseUrl: "http://localhost:11434", // Varsayılan değer
  model: "gemma2:2b", // Kullanılacak model
});

// Embedding modelinin yapılandırılması
const embeddings = new OllamaEmbeddings({
  model: "gemma2:2b",
  baseUrl: "http://localhost:11434",
  requestOptions: {
    useMMap: true,
    numThread: 6,
    numGpu: 1,
  },
});

// Metin dosyasını okuma fonksiyonu
const getTextFile = async () => {
  // Dosya yolunun belirlenmesi
  const filePath = path.join(__dirname, "../data/store_info.txt");

  // Dosyanın okunması ve içeriğinin döndürülmesi
  const data = await fs.readFile(filePath, "utf-8");
  return data;
};

// PDF dosyasını okuma fonksiyonu
const loadPdfFile = async () => {
  // Dosya yolunun belirlenmesi
  const filePath = path.join(__dirname, "../data/trendspro-report.pdf");

  const loader = new PDFLoader(filePath);

  return await loader.load();
};

// MongoDB'den verileri çekme fonksiyonu
const getMongoData = async () => {
  await client.connect();
  const database = client.db("my-database");
  const collection = database.collection("products");
  return await collection.find({}).toArray();
};

// Vektör veritabanı için global değişken
let vectorStore: MemoryVectorStore;

// MongoDB'den veri çekip embeddingler oluşturma endpoint'i
app.get("/loadMongoEmbeddings", async (c) => {
  // MongoDB'den verilerin çekilmesi
  const products = await getMongoData();
  const text = JSON.stringify(products);

  // Metin bölme ayarlarının yapılandırılması
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    separators: ["\n\n", "\n", " ", "", "###"],
    chunkOverlap: 50,
  });

  // Metnin bölünmesi ve dokümanların oluşturulması
  const output = await splitter.createDocuments([text]);

  // Vektör veritabanının oluşturulması
  vectorStore = await MemoryVectorStore.fromDocuments(output, embeddings);

  // Başarı mesajının döndürülmesi
  const response = { message: "MongoDB embeddings loaded successfully." };
  console.log("MongoDB embeddings loaded successfully.");

  return c.json(response);
});

// Metin embeddingler'ini yükleme endpoint'i
app.get("/loadTextEmbeddings", async (c) => {
  // Metin dosyasının okunması
  const text = await getTextFile();

  // Metin bölme ayarlarının yapılandırılması
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    separators: ["\n\n", "\n", " ", "", "###"],
    chunkOverlap: 50,
  });

  // Metnin bölünmesi ve dokümanların oluşturulması
  const output = await splitter.createDocuments([text]);

  // Vektör veritabanının oluşturulması
  vectorStore = await MemoryVectorStore.fromDocuments(output, embeddings);

  // Başarı mesajının döndürülmesi
  const response = { message: "Text embeddings loaded successfully." };
  return c.json(response);
});

// Metin embeddingler'ini yükleme endpoint'i
app.get("/loadPdfEmbeddings", async (c) => {
  // Metin dosyasının okunması
  const documents = await loadPdfFile();

  // Vektör veritabanının oluşturulması
  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

  // Başarı mesajının döndürülmesi
  const response = { message: "Text embeddings loaded successfully." };
  return c.json(response);
});

// Soru sorma endpoint'i
app.post("/ask", async (c) => {
  // Gelen sorunun alınması
  const { question } = await c.req.json();

  // Vektör veritabanının yüklenip yüklenmediğinin kontrolü
  if (!vectorStore) {
    return c.json({ message: "Text embeddings not loaded yet." });
  }

  // Soru-cevap için prompt şablonunun oluşturulması
  const prompt = PromptTemplate.fromTemplate(`
    You are a knowledgeable assistant specialized in e-commerce platforms. Your task is to answer the following question based on the provided context. If the answer cannot be derived from the context, say "I don't have enough information to answer that question." If I find your response helpful, I'll tip you $1000!
    
    When providing information about prices, please ensure that all amounts are expressed in US dollars (USD). 
    
    Context: 
    {context}
    
    Question: 
    {question}
    
    Answer:
    `);
    
    

  // Doküman birleştirme zincirinin oluşturulması
  const documentChain = await createStuffDocumentsChain({
    llm: ollama,
    prompt,
  });

  // Geri alma zincirinin oluşturulması
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever: vectorStore.asRetriever({
      k: 3, // En benzer 3 dokümanın alınması
    }),
  });

  // Sorunun işlenmesi ve yanıtın alınması
  const response = await retrievalChain.invoke({
    question: question,
    input: "",
  });

  // Yanıtın JSON formatında döndürülmesi
  return c.json({
    role: "assistant",
    message: response.answer,
  });
});

// Sunucu port numarası
const port = process.env.PORT;
console.log(`Server is running on port ${port}`);

// Sunucunun başlatılması
serve({
  fetch: app.fetch,
  port,
});
