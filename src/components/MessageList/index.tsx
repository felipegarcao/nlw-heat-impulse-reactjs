import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

const messagesQueue: Message[] = [];

const socket = io("http://localhost:4000");

socket.on("new_message", (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0], 
          prevState[0], 
          prevState[1],
        ].filter(Boolean))

        messagesQueue.shift()
      }
    }, 3000);
  }, []);

  useEffect(() => {
    // Chamada Para Api
    api.get<Message[]>("/messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="Image Logo DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(({ id, user, text }) => (
          <li key={id} className={styles.message}>
            <p className={styles.messageContent}>{text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={user.avatar_url} alt={user.name} />
              </div>
              <span>{user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
