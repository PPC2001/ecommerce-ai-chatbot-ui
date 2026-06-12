import {
  useRef,
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { Send, Bot, User, Trash2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
}

const MAX_INPUT_LENGTH = 2000;

const SUGGESTED_PROMPTS = [
  '🎧 Best headphones under $300?',
  '💻 Recommend a laptop for work',
  '🎁 Gift ideas for a fitness lover',
  '📱 Compare your best smartphones',
  '☕ Best coffee maker for home?',
];

export function ChatInterface({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearChat,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !isLoading) {
        onSendMessage(trimmed);
        setInput('');
      }
    }
  }

  function handleSuggestedPrompt(prompt: string) {
    if (isLoading) return;
    // Strip emoji prefix from prompt for cleaner message
    const cleanPrompt = prompt.replace(/^[\p{Emoji}\s]+/u, '').trim();
    onSendMessage(cleanPrompt);
  }

  const charsLeft = MAX_INPUT_LENGTH - input.length;
  const isNearLimit = charsLeft < 200;

  return (
    <main className="chat-main" role="main" aria-label="AI Chat Interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar-wrapper">
            <div className="chat-avatar-bot">
              <Sparkles size={16} />
            </div>
            <span className="chat-status-dot" aria-hidden="true" />
          </div>
          <div>
            <p className="chat-title">ShopBot</p>
            <p className="chat-subtitle">AI Shopping Assistant · Online</p>
          </div>
        </div>
        <button
          id="clear-chat-btn"
          className="clear-chat-btn"
          onClick={onClearChat}
          aria-label="Clear chat history"
          title="Clear chat"
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="message-row message-row-bot" aria-live="polite" aria-label="ShopBot is typing">
            <div className="message-avatar message-avatar-bot">
              <Bot size={14} />
            </div>
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Error */}
      {error && (
        <div className="chat-error" role="alert" aria-live="assertive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length <= 1 && !isLoading && (
        <div className="suggested-prompts" role="list" aria-label="Suggested questions">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="prompt-chip"
              role="listitem"
              onClick={() => handleSuggestedPrompt(prompt)}
              aria-label={`Ask: ${prompt}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form className="chat-form" onSubmit={handleSubmit} aria-label="Send a message">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            placeholder="Ask ShopBot anything about our products..."
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={MAX_INPUT_LENGTH}
            aria-label="Type your message"
            aria-describedby={isNearLimit ? 'char-count' : undefined}
            disabled={isLoading}
          />
          {isNearLimit && (
            <span
              id="char-count"
              className={`char-count ${charsLeft < 50 ? 'char-count-danger' : 'char-count-warn'}`}
              aria-live="polite"
            >
              {charsLeft}
            </span>
          )}
        </div>
        <button
          id="send-message-btn"
          type="submit"
          className="send-btn"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
        </button>
      </form>

      <p className="chat-disclaimer">
        AI responses may not be 100% accurate. Verify important product details before purchasing.
      </p>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Individual Chat Message
// ---------------------------------------------------------------------------

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`message-row ${isUser ? 'message-row-user' : 'message-row-bot'}`}
      role="article"
      aria-label={`${isUser ? 'You' : 'ShopBot'} at ${time}`}
    >
      {!isUser && (
        <div className="message-avatar message-avatar-bot" aria-hidden="true">
          <Bot size={14} />
        </div>
      )}

      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
        {/* React Markdown renders safely — no dangerouslySetInnerHTML */}
        <div className="message-content">
          {isUser ? (
            // User content rendered as plain text — safe by default in React
            <p>{message.content}</p>
          ) : (
            // Bot content rendered via ReactMarkdown (safe, no innerHTML)
            <ReactMarkdown
              components={{
                // Prevent any script or dangerous tags
                script: () => null,
                iframe: () => null,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <time className="message-time" dateTime={message.timestamp.toISOString()}>
          {time}
        </time>
      </div>

      {isUser && (
        <div className="message-avatar message-avatar-user" aria-hidden="true">
          <User size={14} />
        </div>
      )}
    </div>
  );
}
