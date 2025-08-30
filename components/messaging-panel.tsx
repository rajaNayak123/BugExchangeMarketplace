"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  User,
  Search,
  Plus,
  X,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  reputation: number;
}

interface Conversation {
  id: string;
  participants: {
    user: User;
  }[];
  lastMessageAt: string;
  messages: {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
  }[];
}

interface Message {
  id: string;
  content: string;
  sender: User;
  createdAt: string;
  attachments: string[];
  isRead?: boolean;
}

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
}

export function MessagingPanel({
  isOpen,
  onClose,
  initialConversationId,
}: MessagingPanelProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchConversations();
    }
  }, [isOpen, session]);

  // Handle initial conversation ID when opening the panel
  useEffect(() => {
    if (isOpen && initialConversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.id === initialConversationId
      );
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [isOpen, initialConversationId, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);

      // Simulate other user typing (in real app, this would come from WebSocket)
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          // 30% chance to show typing
          setOtherUserTyping(true);
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(typingInterval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when they come into view
  useEffect(() => {
    if (messages.length > 0 && selectedConversation) {
      // Mark all messages in the current conversation as read
      messages.forEach((message) => {
        if (message.sender.id !== session?.user?.id) {
          // Only mark other users' messages as read
          markMessageAsReadOnView(message.id);
        }
      });
    }
  }, [messages, selectedConversation, session?.user?.id]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing indicator after 2 seconds
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      // Mark message as read in local state immediately for better UX
      setReadMessages((prev) => new Set([...prev, messageId]));

      // In a real implementation, you would also send this to the server
      // For now, we'll keep the local state update for immediate feedback
      // When you're ready to implement server-side tracking, uncomment this:
      // await fetch(`/api/messages/${messageId}/mark-read`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      // });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markMessageAsReadOnView = (messageId: string) => {
    // Mark message as read when it comes into view (more realistic)
    if (!readMessages.has(messageId)) {
      setReadMessages((prev) => new Set([...prev, messageId]));
    }
  };

  const getOnlineStatus = (userId: string) => {
    // Mock online status - in real app, this would come from WebSocket
    const onlineUsers = ["user1", "user2"]; // Example online users
    return onlineUsers.includes(userId);
  };

  const getLastSeen = (userId: string) => {
    // Mock last seen - in real app, this would come from database
    const lastSeenMap: { [key: string]: Date } = {
      user1: dayjs().subtract(5, "minute").toDate(), // 5 minutes ago
      user2: dayjs().subtract(30, "minute").toDate(), // 30 minutes ago
    };
    return lastSeenMap[userId] || dayjs().subtract(1, "day").toDate(); // Default: 1 day ago
  };

  const formatLastSeen = (date: Date) => {
    try {
      const now = dayjs();
      const lastSeen = dayjs(date);

      // Check if date is valid
      if (!lastSeen.isValid()) {
        return "unknown";
      }

      if (now.diff(lastSeen, "minute") < 1) {
        return "just now";
      } else if (now.diff(lastSeen, "hour") < 1) {
        return `${now.diff(lastSeen, "minute")}m ago`;
      } else if (now.diff(lastSeen, "day") < 1) {
        return `${now.diff(lastSeen, "hour")}h ago`;
      } else if (now.diff(lastSeen, "week") < 1) {
        return `${now.diff(lastSeen, "day")}d ago`;
      } else if (now.diff(lastSeen, "month") < 1) {
        return `${now.diff(lastSeen, "week")}w ago`;
      } else if (now.diff(lastSeen, "year") < 1) {
        return lastSeen.format("MMM D");
      } else {
        return lastSeen.format("MMM D, YYYY");
      }
    } catch (error) {
      console.error("Error formatting last seen:", error);
      return "unknown";
    }
  };

  const formatConversationTime = (dateString: string) => {
    try {
      const date = dayjs(dateString);
      const now = dayjs();

      // Check if date is valid
      if (!date.isValid()) {
        return "Invalid date";
      }

      if (now.diff(date, "day") < 1) {
        return date.format("h:mm A");
      } else if (now.diff(date, "week") < 1) {
        return date.format("ddd");
      } else if (now.diff(date, "year") < 1) {
        return date.format("MMM D");
      } else {
        return date.format("MMM D, YYYY");
      }
    } catch (error) {
      console.error("Error formatting conversation time:", error);
      return "Invalid date";
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);

        // Mark messages as seen
        markMessagesAsSeen(conversationId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const markMessagesAsSeen = async (conversationId: string) => {
    try {
      // Mark all messages in the conversation as seen
      const response = await fetch(
        `/api/conversations/${conversationId}/mark-seen`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Update local state to show all messages as read
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            // Mark all messages as read when conversation is opened
            isRead: true,
          }))
        );

        // Add all message IDs to readMessages set
        const messageIds = messages.map((msg) => msg.id);
        setReadMessages((prev) => new Set([...prev, ...messageIds]));
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/users?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const startConversation = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantIds: [userId] }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setConversations((prev) => [conversation, ...prev]);
        setSelectedConversation(conversation);
        setShowNewConversation(false);
        setSearchQuery("");
        setSearchResults([]);
        toast.success("Conversation started");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");

        // Mark message as read
        markMessageAsRead(message.id);

        // Update conversation in list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? { ...conv, lastMessageAt: new Date().toISOString() }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = dayjs(dateString);
      const now = dayjs();

      // Check if date is valid
      if (!date.isValid()) {
        return "Invalid date";
      }

      if (now.diff(date, "minute") < 1) {
        return "Just now";
      } else if (now.diff(date, "hour") < 1) {
        return `${now.diff(date, "minute")}m ago`;
      } else if (now.diff(date, "day") < 1) {
        return `${now.diff(date, "hour")}h ago`;
      } else if (now.diff(date, "week") < 1) {
        return `${now.diff(date, "day")}d ago`;
      } else if (now.diff(date, "month") < 1) {
        return `${now.diff(date, "week")}w ago`;
      } else if (now.diff(date, "year") < 1) {
        return date.format("MMM D");
      } else {
        return date.format("MMM D, YYYY");
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(
      (p) => p.user.id !== session?.user?.id
    )?.user;
  };

  const handleClose = () => {
    setSelectedConversation(null);
    setMessages([]);
    setNewMessage("");
    setSearchQuery("");
    setSearchResults([]);
    setShowNewConversation(false);
    setOtherUserTyping(false);
    setIsTyping(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={handleClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl border flex h-[80vh]">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r bg-gray-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewConversation(!showNewConversation)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {showNewConversation && (
            <div className="px-4 pb-3">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="mb-2"
              />
              {searchResults.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => startConversation(user.id)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>
                          {user.name ? (
                            user.name[0].toUpperCase()
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a conversation with someone</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  const lastMessage = conversation.messages[0];

                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-blue-100 border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser?.image || ""} />
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {otherUser?.name ? (
                                otherUser.name[0].toUpperCase()
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {otherUser && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                                getOnlineStatus(otherUser.id)
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold truncate text-gray-800">
                              {otherUser?.name}
                            </p>
                            <span
                              className="text-xs text-gray-500 cursor-help"
                              title={dayjs(conversation.lastMessageAt).format(
                                "MMM D, YYYY [at] h:mm A"
                              )}
                            >
                              {dayjs(conversation.lastMessageAt).format(
                                "h:mm A"
                              )}
                            </span>
                          </div>
                          {lastMessage && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-600 truncate">
                                {lastMessage.sender.id === session?.user?.id
                                  ? "You: "
                                  : ""}
                                {lastMessage.content}
                              </p>
                              <p className="text-xs text-gray-400">
                                {dayjs(lastMessage.createdAt).format("h:mm A")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          getOtherParticipant(selectedConversation)?.image || ""
                        }
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {getOtherParticipant(
                          selectedConversation
                        )?.name?.[0].toUpperCase() || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {getOtherParticipant(selectedConversation) && (
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                          getOnlineStatus(
                            getOtherParticipant(selectedConversation)?.id || ""
                          )
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {getOtherParticipant(selectedConversation)?.name}
                    </h4>

                    <p
                      className={`text-sm ${
                        getOtherParticipant(selectedConversation) &&
                        getOnlineStatus(
                          getOtherParticipant(selectedConversation)?.id || ""
                        )
                          ? "text-green-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {otherUserTyping ? (
                        <span className="text-blue-600 font-medium">
                          typing...
                        </span>
                      ) : (
                        getOtherParticipant(selectedConversation) &&
                        (getOnlineStatus(
                          getOtherParticipant(selectedConversation)?.id || ""
                        )
                          ? "Online"
                          : `Last seen at ${dayjs(
                              getLastSeen(
                                getOtherParticipant(selectedConversation)?.id ||
                                  ""
                              )
                            ).format("h:mm A")}`)
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500">
                      Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-3 ${
                        message.sender.id === session?.user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          message.sender.id === session?.user?.id
                            ? "bg-green-500 text-white rounded-br-md ml-auto"
                            : "bg-white text-gray-900 rounded-bl-md border border-gray-200 mr-auto"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <div
                          className={`flex items-center mt-1 ${
                            message.sender.id === session?.user?.id
                              ? "justify-end text-green-100"
                              : "justify-start text-gray-400"
                          }`}
                        >
                          <span
                            className="text-xs cursor-help"
                            title={dayjs(message.createdAt).format(
                              "MMM D, YYYY [at] h:mm A"
                            )}
                          >
                            {dayjs(message.createdAt).format("h:mm A")}
                          </span>
                          {message.sender.id === session?.user?.id && (
                            <div className="ml-2 flex items-center">
                              {readMessages.has(message.id) ||
                              message.isRead ? (
                                // Double blue ticks for read messages
                                <>
                                  <div className="w-3 h-3 rounded-full bg-blue-500 opacity-100"></div>
                                  <div className="w-3 h-3 rounded-full bg-blue-500 opacity-100 ml-1"></div>
                                </>
                              ) : (
                                // Single gray tick for sent messages
                                <div className="w-3 h-3 rounded-full bg-gray-400 opacity-70"></div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />

                {/* Other User Typing Indicator */}
                {otherUserTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-2 right-2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
