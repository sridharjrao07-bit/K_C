"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

interface Message {
  id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
}

export default function MessagesInbox() {
  const { t } = useLanguage();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
                    id,
                    subject,
                    content,
                    is_read,
                    created_at,
                    sender:profiles!sender_id(full_name, avatar_url)
                `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data as any);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [supabase]);

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, is_read: true } : m
    ));
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6f5c46] to-[#8c7358] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-bold">{t("messages.inbox") || "Messages"}</h2>
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#c65d51] text-white text-sm px-3 py-1 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-[#e5d1bf]">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">{t("messages.noMessages") || "No messages yet"}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              onClick={() => openMessage(message)}
              className={`p-4 cursor-pointer hover:bg-[#faf7f2] transition-colors ${!message.is_read ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold overflow-hidden flex-shrink-0">
                  {message.sender?.avatar_url ? (
                    <img src={message.sender.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    message.sender?.full_name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${!message.is_read ? 'text-[#6f5c46] font-bold' : 'text-gray-700'}`}>
                      {message.sender?.full_name || "Unknown"}
                    </span>
                    {!message.is_read && (
                      <span className="w-2 h-2 bg-[#c65d51] rounded-full"></span>
                    )}
                  </div>
                  <p className={`font-medium truncate ${!message.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {message.subject}
                  </p>
                  <p className="text-gray-500 text-sm truncate">{message.content}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(message.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-[#e5d1bf] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold overflow-hidden">
                  {selectedMessage.sender?.avatar_url ? (
                    <img src={selectedMessage.sender.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedMessage.sender?.full_name?.charAt(0) || "U"
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#6f5c46]">{selectedMessage.sender?.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#6f5c46] mb-4">{selectedMessage.subject}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
