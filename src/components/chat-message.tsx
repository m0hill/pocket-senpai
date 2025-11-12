interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
  isLast?: boolean
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className="flex gap-2 mb-3">
      <div className="flex-1">
        <div className={`text-xs font-mono ${isUser ? "text-right" : "text-left"}`}>
          <div className="text-muted-foreground mb-1">
            {isUser ? (
              <span>
                <span className="text-orange-400">{">"}</span> ユーザーメッセージ
              </span>
            ) : (
              <span>
                <span className="text-blue-400">{">"}</span> アシスタント応答
              </span>
            )}
          </div>
          <div
            className={`px-3 py-2 border ${
              isUser
                ? "border-orange-600/60 bg-orange-500/5 text-foreground ml-4"
                : "border-blue-600/60 bg-blue-500/5 text-foreground"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  )
}

