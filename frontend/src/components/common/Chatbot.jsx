import { useState } from "react";
import api from "../../services/api";
import { Bot, X, Send } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "أهلاً! أنا مساعدك الذكي 🚗 قولي إيه اللي بتدور عليه!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { message: userMessage });
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "حصل خطأ، حاول تاني!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زرار الفتح/الغلق */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full 
             bg-gradient-to-br from-indigo-500 to-purple-600 
             text-white shadow-lg hover:scale-110 transition-transform 
             flex items-center justify-center z-[9999]"
      >
        {open ? <X size={28} /> : <Bot size={30} />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-8 w-[350px] h-[500px] 
                     bg-white rounded-2xl shadow-2xl flex flex-col 
                     border border-gray-200 overflow-hidden z-[9999]"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
            <p className="m-0 font-bold text-base flex items-center gap-2">
              <Bot size={26} /> مساعد DriveWay
            </p>
            <p className="m-0 text-sm text-slate-400">اسألني عن أي عربية</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 text-sm leading-relaxed rtl
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[18px_18px_4px_18px]"
                        : "bg-slate-100 text-slate-900 rounded-[18px_18px_18px_4px]"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-2 rounded-[18px_18px_18px_4px] text-slate-500 text-sm">
                  جاري الكتابة...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                         text-sm outline-none rtl"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 
                         text-white rounded-lg font-bold hover:opacity-90 transition"
            >
              <Send size={19} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
