"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function PatientMessages() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => setMessages([]));
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, threadId: "thread-1" }),
    });
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Messages</h2>

      <div className="bg-white rounded-xl border border-slate-200 h-[600px] flex flex-col">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === (session?.user as any)?.patientId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md p-3 rounded-xl text-sm ${
                    msg.senderId === (session?.user as any)?.patientId
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className={`text-xs mt-1 ${
                    msg.senderId === (session?.user as any)?.patientId
                      ? "text-teal-200"
                      : "text-slate-400"
                  }`}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              onClick={handleSend}
              className="bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
