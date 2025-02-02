"use client";
import axios from "axios";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!message) return;

    await axios.get(
      `http://127.0.0.1:8000/api/message?message=${encodeURIComponent(message)}`
    );

    setMessage("");
    console.log("Message sent:", message);
  };

  useEffect(() => {
    const pusher = new Pusher("my_key", {
      cluster: "mt1",
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
    });

    const channel = pusher.subscribe("chat");
    channel.bind("chat-message", (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      console.log("messages");
      console.log(messages);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-start justify-center h-screen">
      <div className="border border-black w-1/2 p-3 flex flex-col gap-3">
        {messages.map((m, index) => (
          <div
            key={index}
            className="py-2 px-4 bg-orange-300 rounded-md inline-block ml-auto text-black"
          >
            {m}
          </div>
        ))}

        <div className="flex gap-3">
          <input
            type="text"
            name="message"
            id="message"
            className="w-full rounded-md bg-slate-200 border-0 text-black p-2"
            onChange={handleInputChange}
            value={message}
          />
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-500  rounded-lg text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
