import { Fragment, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import api from "../utils/api";

interface Message {
  role: "user" | "assistant";
  message: string;
}

const processMessage = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, index) => {
    let processedLine = line;
    processedLine = processedLine.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    processedLine = processedLine.replace(/_(.*?)_/g, "<em>$1</em>");
    processedLine = processedLine.replace(/\*/g, "•");
    return (
      <Fragment key={index}>
        <div
          dangerouslySetInnerHTML={{
            __html: processedLine,
          }}
        />
        <br />
      </Fragment>
    );
  });
};

const Chat = () => {
  useEffect(() => {
    const loadTextEmbedding = async (): Promise<void> =>
      await api.get("/loadMongoEmbeddings");

    loadTextEmbedding();
  }, []);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      message: "Welcome, you can ask any question you want about our store.",
    },
  ]);

  const handleMessage = async () => {
    try {
      setMessages([
        ...messages,
        {
          role: "user",
          message: text,
        },
      ]);
      setLoading(true);
      const { data } = await api.post("/ask", {
        question: text,
      });

      setMessages([
        ...messages,
        {
          role: "user",
          message: text,
        },
        data,
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full h-screen py-6 ">
      <video
        className="absolute top-0 left-0 right-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/chat.mp4"
      ></video>
      <div className="relative custom-container backdrop-blur-md outline outline-violet-100 shadow-xl shadow-violet-100/30   rounded-2xl h-full">
        <div
          id="chat-scroll"
          className="flex flex-col gap-4 p-3 sm:p-6 max-h-[85%] overflow-y-auto "
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className={`${
                message.role === "user" && "ms-auto"
              }  text-white flex gap-2  max-w-full min-[500px]:max-w-[90%] sm:max-w-[75%] md:max-w-[50%]  w-max`}
            >
              {message.role === "assistant" && (
                <GiArtificialIntelligence
                  size={45}
                  className="bg-white text-black p-2 rounded-full"
                />
              )}
              <div className="py-2  px-3 bg-black/30 flex-1 rounded-lg">
                {processMessage(message.message)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="  text-white flex gap-2  max-w-full min-[500px]:max-w-[90%] sm:max-w-[75%] md:max-w-[50%]  w-max">
              <GiArtificialIntelligence
                size={45}
                className="bg-white text-black p-2 rounded-full"
              />
              <div className="pt-20   bg-black/30 flex-1 h-48 min-w-96 rounded-lg">
                <div className="loader mx-auto"></div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 right-0 left-0  p-4 text-white flex gap-6 items-center border-t border-slate-200">
          <input
            onChange={(e) => setText(e.target.value)}
            placeholder="Send message"
            type="text"
            className="flex-1 bg-transparent outline-none "
          />
          <FaArrowRight
            size={35}
            onClick={handleMessage}
            className="bg-violet-700 cursor-pointer   p-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
