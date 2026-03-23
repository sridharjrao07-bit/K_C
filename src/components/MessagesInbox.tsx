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
  recipient: {
    full_name: string;
    avatar_url: string;
  };
}

interface MessagesInboxProps {
  initialMessages?: any[];
}

export default function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const { t, language } = useLanguage();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [loading, setLoading] = useState(!initialMessages);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const locale = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';

  const fetchMessages = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log(`Fetching ${activeTab} messages for user:`, user.id);

    let query = supabase
      .from('messages')
      .select(`
            id,
            subject,
            content,
            is_read,
            created_at,
            sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
            recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url)
        `)
      .order('created_at', { ascending: false });

    if (activeTab === 'inbox') {
      query = query.eq('recipient_id', user.id);
    } else {
      query = query.eq('sender_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching messages:", JSON.stringify(error, null, 2));
    } else {
      console.log(`Found ${data?.length} messages. First item sample:`, data?.[0]);
      setMessages(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Skip initial fetch for inbox if we already have data from server
    if (activeTab === 'inbox' && messages === initialMessages && !messages.length) {
      // Logic adjustment: only skip if we have initial messages, but we should setup realtime anyway
    } else {
      fetchMessages();
    }

    // Set up Realtime subscription
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          console.log('Realtime message update:', payload);
          // Refresh messages on any change to messages table (filtered by RLS on fetch)
          // We could optimize to check IDs but fetching is safer to get joined data
          await fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, activeTab]);

  const markAsRead = async (messageId: string) => {
    if (activeTab === 'sent') return; // Don't mark sent messages as read (you sent them)

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
    if (!message.is_read && activeTab === 'inbox') {
      markAsRead(message.id);
    }
  };

  const unreadCount = activeTab === 'inbox' ? messages.filter(m => !m.is_read).length : 0;

  // Helper to get the "other person" to display
  const getDisplayUser = (message: Message) => {
    return activeTab === 'inbox' ? message.sender : message.recipient;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-[#6f5c46] to-[#8c7358] text-white">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("messages.inbox")}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMessages()}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            title="Refresh"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {unreadCount > 0 && activeTab === 'inbox' && (
            <span className="bg-[#c65d51] text-white text-sm px-3 py-1 rounded-full font-medium">
              {unreadCount} {t("dashboard.new")}
            </span>
          )}
        </div>
        {unreadCount > 0 && activeTab === 'inbox' && (
          <span className="bg-[#c65d51] text-white text-sm px-3 py-1 rounded-full font-medium">
            {unreadCount} {t("dashboard.new")}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-6 gap-6">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'inbox' ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white'}`}
        >
          {t("messages.inbox")}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'sent' ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white'}`}
        >
          {t("messages.sent") || "Sent"}
        </button>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-[#e5d1bf]">
        {loading ? (
          <div className="animate-pulse space-y-4 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">{t("messages.noMessages")}</p>
          </div>
        ) : (
          messages.map((message) => {
            const displayUser = getDisplayUser(message);
            const isUnread = !message.is_read && activeTab === 'inbox';

            return (
              <div
                key={message.id}
                onClick={() => openMessage(message)}
                className={`p-4 cursor-pointer hover:bg-[#faf7f2] transition-colors ${isUnread ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold overflow-hidden flex-shrink-0">
                    {displayUser?.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={displayUser.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      displayUser?.full_name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isUnread ? 'text-[#6f5c46] font-bold' : 'text-gray-700'}`}>
                        {displayUser?.full_name || t("common.unknown")} {activeTab === 'sent' && <span className="text-xs text-gray-400 font-normal ml-1">({t("common.to") || "To"})</span>}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 bg-[#c65d51] rounded-full"></span>
                      )}
                    </div>
                    <p className={`font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                    <p className="text-gray-500 text-sm truncate">{message.content}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(message.created_at).toLocaleDateString(locale, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Message Detail Modal */}
      {
        selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedMessage(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-[#e5d1bf] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold overflow-hidden">
                    {getDisplayUser(selectedMessage)?.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={getDisplayUser(selectedMessage)!.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getDisplayUser(selectedMessage)?.full_name?.charAt(0) || "U"
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#6f5c46]">{getDisplayUser(selectedMessage)?.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString(locale)}
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
        )
      }
    </div >
  );
}
