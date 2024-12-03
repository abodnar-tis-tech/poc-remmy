"use client";

import { useState } from "react";

export default function HomePage() {
  const [accessToken, setAccessToken] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?access_token=${accessToken}`);
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <main>
      <h1>Instagram Messages</h1>
      <div>
        <a href="/api/auth">Log in with Instagram</a>
      </div>
      <div>
        <input
          type="text"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter Access Token"
        />
        <button onClick={fetchMessages}>Fetch Messages</button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <p>
                <strong>From:</strong> {msg.from?.id}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(msg.created_time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
