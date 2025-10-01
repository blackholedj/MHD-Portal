// src/pages/Chat.js
import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../supabaseClient'; // odkomentujte
import { useAuth } from '../contexts/AuthContext'; // odkomentujte
import { FaTrash, FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, profile, isAdmin } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Zde přijde logika pro načtení zpráv z tabulky 'messages' ze Supabase
    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          fetchMessages(); // Znovu načteme zprávy při jakékoliv změně
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    // const { data, error } = await supabase.from('messages').select('*, profiles(full_name)').order('created_at');
    // if (error) console.error('Error fetching messages:', error);
    // else setMessages(data);
    const { data, error } = await supabase
      .from("messages")
      .select("*, profile:profiles(full_name)")
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching messages:", error);
    else setMessages(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Zde přijde logika pro vložení nové zprávy do tabulky 'messages'
    // Musíte poslat 'content' a 'user_id'
    // const { error } = await supabase.from('messages').insert([{ content: newMessage, user_id: user.id }]);
    // if (!error) {
    //     setNewMessage('');
    //     fetchMessages(); // Znovu načteme zprávy
    // }
    if (newMessage.trim() === "") return;

    const { error } = await supabase
      .from("messages")
      .insert([{ content: newMessage, user_id: user.id }]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
    }
  };

  const handleDeleteMessage = async (id) => {
    // Zde přijde logika pro smazání zprávy (pouze pro admina)
    // if (!isAdmin) return;
    // await supabase.from('messages').delete().eq('id', id);
    // fetchMessages();
    if (!isAdmin) return;
    if (window.confirm("Opravdu chcete smazat tuto zprávu?")) {
      await supabase.from("messages").delete().eq("id", id);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nástěnka (Chat)</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col h-[70vh]">
        <div className="flex-grow overflow-y-auto mb-4 p-4 space-y-4 border rounded-md bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.user_id === user.id ? "justify-end" : ""
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-lg ${
                  msg.user_id === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <strong className="text-sm">
                    {msg.user_id === user.id
                      ? "Vy"
                      : msg.profile?.full_name || "Uživatel"}
                  </strong>
                  {isAdmin && msg.user_id !== user.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
                <p>{msg.content}</p>
                <span
                  className={`text-xs mt-1 block text-right ${
                    msg.user_id === user.id ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Napsat vzkaz..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPaperPlane />
            <span className="hidden sm:inline ml-2">Odeslat</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
