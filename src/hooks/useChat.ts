import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types';
import { sendChatMessage, ApiError } from '../services/api';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content:
        "👋 Hi there! I'm **ShopBot**, your personal AI shopping assistant! I can help you find the perfect products, compare options, suggest gifts, and more.\n\nWhat are you looking for today? 🛍️",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(uuidv4());

  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    // Enforce max message length client-side (backend also validates)
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    setError(null);

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build history from current messages (exclude the initial bot greeting)
      const history = messages
        .filter((m) => m.role !== 'assistant' || messages.indexOf(m) > 0)
        .slice(-MAX_HISTORY_LENGTH)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await sendChatMessage({
        message: trimmed,
        conversation_history: history,
        session_id: sessionIdRef.current,
      });

      // Update session ID if backend returns one
      if (response.session_id) {
        sessionIdRef.current = response.session_id;
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Generic error messages — do not surface internal details
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setError('Too many messages. Please wait a moment before trying again.');
        } else if (err.status >= 500) {
          setError('Our AI assistant is temporarily unavailable. Please try again shortly.');
        } else {
          setError('Failed to send message. Please try again.');
        }
      } else {
        setError('Connection error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    sessionIdRef.current = uuidv4();
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content:
          "👋 Chat cleared! I'm ready to help you find something new. What are you shopping for? 🛍️",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
