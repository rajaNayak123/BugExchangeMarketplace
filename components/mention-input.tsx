"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AtSign, User, X, ChevronDown, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  reputation: number;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "Type your message... Use @username to mention someone",
  className = "",
  rows = 3,
  disabled = false,
}: MentionInputProps) {
  const { data: session } = useSession();
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mentionQuery.length >= 2) {
      searchUsers(mentionQuery);
    } else {
      setSearchResults([]);
    }
  }, [mentionQuery]);

  useEffect(() => {
    if (showMentions && searchResults.length > 0) {
      setSelectedMentionIndex(0);
    }
  }, [searchResults, showMentions]);

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch(
        `/api/users?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowMentions(data.length > 0);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);

    // Check if we're typing a mention
    const beforeCursor = newValue.slice(0, cursorPos);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      if (query.length >= 1) {
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMentions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (searchResults[selectedMentionIndex]) {
          insertMention(searchResults[selectedMentionIndex]);
        }
        break;
      case "Escape":
        setShowMentions(false);
        break;
    }
  };

  const insertMention = (user: User) => {
    if (!textareaRef.current) return;

    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);

    // Find the start of the mention (@username)
    const mentionStart = beforeCursor.lastIndexOf("@");
    if (mentionStart === -1) return;

    // Replace @username with @Full Name
    const newValue =
      beforeCursor.slice(0, mentionStart) + `@${user.name} ` + afterCursor;
    onChange(newValue);

    // Set cursor position after the inserted mention
    const newCursorPos = mentionStart + user.name.length + 2; // +2 for @ and space
    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    textareaRef.current.focus();

    // Hide mentions dropdown
    setShowMentions(false);
    setMentionQuery("");
  };

  const handleMentionClick = (user: User) => {
    insertMention(user);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      mentionsRef.current &&
      !mentionsRef.current.contains(e.target as Node)
    ) {
      setShowMentions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderMentionsDropdown = () => {
    if (!showMentions || searchResults.length === 0) return null;

    return (
      <div
        ref={mentionsRef}
        className="absolute z-50 w-80 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        style={{
          top: textareaRef.current
            ? textareaRef.current.offsetTop + textareaRef.current.offsetHeight
            : 0,
          left: textareaRef.current ? textareaRef.current.offsetLeft : 0,
        }}
      >
        <div className="p-2 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Mention someone: @{mentionQuery}
            </span>
          </div>
        </div>
        <div className="py-1">
          {searchResults.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedMentionIndex
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
              onClick={() => handleMentionClick(user)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} />
                <AvatarFallback>
                  {user.name ? (
                    user.name[0].toUpperCase()
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.reputation}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
        rows={rows}
        disabled={disabled}
      />

      {renderMentionsDropdown()}

      {/* Mention help text */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <AtSign className="h-3 w-3" />
        <span>Use @username to mention someone</span>
      </div>
    </div>
  );
}
