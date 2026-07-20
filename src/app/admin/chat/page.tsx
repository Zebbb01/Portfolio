'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/src/lib/supabaseClient';
import {
  MessageSquare,
  Send,
  User,
  Mail,
  Calendar,
  Key,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Camera,
  Mic,
  Square,
  Users,
  MessageCircle,
  FileSpreadsheet,
  Globe,
  Clock,
  Loader2
} from 'lucide-react';

interface ChatRoom {
  id: string;
  guest_name: string;
  guest_email: string;
  ip_address: string;
  ai_enabled: boolean;
  created_at: string;
  last_message_at: string;
}

interface Message {
  id: string;
  room_id: string;
  sender: 'guest' | 'admin';
  content?: string;
  media_url?: string;
  media_type?: 'image' | 'audio';
  created_at: string;
}

export default function AdminChatConsole() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Tabs: 'chat' | 'analytics'
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics'>('chat');

  // Rooms & Messages
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Media states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Typing states
  const [isGuestTyping, setIsGuestTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Authenticate using Supabase Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) return;

    setLoadingAuth(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user && ['geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'].includes(session.user.email || '')) {
        setIsAuthenticated(true);
      }
    };
    checkSession();

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user && ['geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'].includes(session.user.email || '')) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch all chat rooms
  const fetchRooms = async () => {
    if (!isAuthenticated) return;
    setLoadingRooms(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_chat_rooms')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      if (data) setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();

      // Realtime subscription for chat rooms addition/updates
      const roomChannel = supabase
        .channel('admin-rooms')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'portfolio_chat_rooms' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newRoom = payload.new as ChatRoom;
              setRooms((prev) => {
                if (prev.some((r) => r.id === newRoom.id)) return prev;
                return [newRoom, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedRoom = payload.new as ChatRoom;
              setRooms((prev) => {
                const filtered = prev.filter((r) => r.id !== updatedRoom.id);
                return [updatedRoom, ...filtered];
              });
              
              // Sync active room metadata changes
              setActiveRoom((prevActive) => {
                if (prevActive && prevActive.id === updatedRoom.id) {
                  return { ...prevActive, ...updatedRoom };
                }
                return prevActive;
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(roomChannel);
      };
    }
  }, [isAuthenticated]);

  // Fetch messages for active room and subscribe to realtime + broadcasts
  useEffect(() => {
    if (!activeRoom) {
      setIsGuestTyping(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_chat_messages')
          .select('*')
          .eq('room_id', activeRoom.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Subscribe to messages and typing broadcasts in this room
    const messageChannel = supabase
      .channel(`room:${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'portfolio_chat_messages',
          filter: `room_id=eq.${activeRoom.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { isTyping, sender } = payload.payload;
        if (sender === 'guest') {
          setIsGuestTyping(isTyping);
        }
      })
      .subscribe();

    channelRef.current = messageChannel;

    return () => {
      supabase.removeChannel(messageChannel);
      setIsGuestTyping(false);
    };
  }, [activeRoom]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGuestTyping]);

  // Handle typing status broadcast
  const handleTyping = () => {
    if (!channelRef.current || !activeRoom) return;

    // Broadcast that admin is typing
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true, sender: 'admin' },
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Stop typing indicator after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { isTyping: false, sender: 'admin' },
        });
      }
    }, 2000);
  };

  // Upload file helper
  const uploadChatMedia = async (file: File, folder: 'image' | 'audio') => {
    if (!activeRoom) throw new Error('No active chat room');
    const ext = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
    const filePath = `chat-media/${activeRoom.id}/${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Send admin text response
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeRoom || sending) return;

    const textToSend = replyMessage.trim();
    setReplyMessage('');
    setSending(true);

    // Stop typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { isTyping: false, sender: 'admin' },
      });
    }

    try {
      const { error: msgError } = await supabase
        .from('portfolio_chat_messages')
        .insert([
          {
            room_id: activeRoom.id,
            sender: 'admin',
            content: textToSend,
          },
        ]);

      if (msgError) throw msgError;

      const { error: roomError } = await supabase
        .from('portfolio_chat_rooms')
        .update({
          last_message_at: new Date().toISOString(),
          ai_enabled: false, // Turn off AI autopilot automatically since admin took over!
        })
        .eq('id', activeRoom.id);

      if (roomError) throw roomError;
    } catch (err: any) {
      console.error('Error sending response:', err);
      alert(err.message || 'Failed to deliver message.');
    } finally {
      setSending(false);
    }
  };

  // Handle Image Upload Selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoom) return;

    setUploadingMedia(true);
    try {
      const url = await uploadChatMedia(file, 'image');
      
      const { error: msgError } = await supabase
        .from('portfolio_chat_messages')
        .insert([
          {
            room_id: activeRoom.id,
            sender: 'admin',
            media_url: url,
            media_type: 'image',
          },
        ]);

      if (msgError) throw msgError;

      await supabase
        .from('portfolio_chat_rooms')
        .update({
          last_message_at: new Date().toISOString(),
          ai_enabled: false, // Turn off AI autopilot automatically
        })
        .eq('id', activeRoom.id);

    } catch (err: any) {
      console.error('Error sending image:', err);
      alert(err.message || 'Failed to upload image.');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Voice recording handlers
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        setUploadingMedia(true);
        try {
          const url = await uploadChatMedia(audioFile, 'audio');
          
          const { error: msgError } = await supabase
            .from('portfolio_chat_messages')
            .insert([
              {
                room_id: activeRoom!.id,
                sender: 'admin',
                media_url: url,
                media_type: 'audio',
              },
            ]);

          if (msgError) throw msgError;

          await supabase
            .from('portfolio_chat_rooms')
            .update({
              last_message_at: new Date().toISOString(),
              ai_enabled: false, // Turn off AI autopilot automatically
            })
            .eq('id', activeRoom!.id);

        } catch (err: any) {
          console.error('Error sending audio:', err);
          alert(err.message || 'Failed to send voice message.');
        } finally {
          setUploadingMedia(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      alert('Microphone permission is required to record voice notes.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setActiveRoom(null);
    setMessages([]);
  };

  // Toggle AI Autopilot status manually
  const toggleAiAutopilot = async () => {
    if (!activeRoom) return;
    const newStatus = !activeRoom.ai_enabled;
    try {
      const { error } = await supabase
        .from('portfolio_chat_rooms')
        .update({ ai_enabled: newStatus })
        .eq('id', activeRoom.id);

      if (error) throw error;

      setActiveRoom({ ...activeRoom, ai_enabled: newStatus });
      
      // Update in rooms list too
      setRooms((prev) =>
        prev.map((r) => (r.id === activeRoom.id ? { ...r, ai_enabled: newStatus } : r))
      );
    } catch (err: any) {
      console.error('Failed to toggle AI autopilot:', err);
      alert(err.message || 'Failed to toggle AI autopilot.');
    }
  };

  // ===========================================================================
  // Analytics Calculations
  // ===========================================================================
  const totalLeads = rooms.filter((r) => r.guest_email).length;
  // Unique visitors by IP address
  const uniqueIps = Array.from(new Set(rooms.map((r) => r.ip_address).filter(Boolean)));
  const totalVisitors = uniqueIps.length || totalLeads;
  const leadConversionRate = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(1) : '0.0';

  // Group leads by date for chart (last 7 days)
  const getChartData = () => {
    const dates: { [key: string]: number } = {};
    // Seed last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      dates[dateStr] = 0;
    }

    rooms.forEach((r) => {
      const dateStr = new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (dateStr in dates) {
        dates[dateStr]++;
      }
    });

    return Object.entries(dates).map(([name, count]) => ({ name, count }));
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map((d) => d.count), 1);

  // Auth Guard Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060606] flex flex-col items-center justify-center p-6 text-[#F5F0E8] font-body selection:bg-[#D4AF37]/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.02] rounded-full blur-3xl" />

          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Key className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#F5F0E8]">Admin Chat Console</h2>
            <p className="text-xs text-[#6B6355] mt-1 uppercase tracking-wider">Access Restricted</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Admin Email Address"
                  className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 px-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 transition-all text-center font-medium"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Admin Password"
                  className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 px-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 transition-all text-center font-medium"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E8D48B] text-[#060606] font-semibold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loadingAuth ? 'Signing In...' : 'Unlock Console'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-[#F5F0E8] flex flex-col font-body selection:bg-[#D4AF37]/30">
      {/* Navbar Header */}
      <header className="h-16 border-b border-[#1F1F1F] bg-[#0E0E0E] px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-heading">Workspace Portal</h1>
              <p className="text-[10px] text-[#6B6355] uppercase tracking-wider">Gerald Villaceran Console</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 bg-[#161616] p-1 rounded-xl border border-[#1F1F1F]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#D4AF37] text-[#060606] shadow'
                  : 'text-[#A09882] hover:text-[#D4AF37]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#D4AF37] text-[#060606] shadow'
                  : 'text-[#A09882] hover:text-[#D4AF37]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchRooms}
            disabled={loadingRooms}
            className="p-2 text-[#6B6355] hover:text-[#D4AF37] transition-all disabled:opacity-50 animate-pulse"
            title="Refresh Server Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRooms ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#161616] border border-[#1F1F1F] rounded-lg text-xs font-semibold text-[#A09882] hover:border-[#D4AF37]/20 hover:text-[#D4AF37] transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Panel Router */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' ? (
          /* CONVERSATIONS TAB PANEL */
          <>
            {/* Left Side: Room list */}
            <aside className="w-80 border-r border-[#1F1F1F] bg-[#0E0E0E] flex flex-col overflow-y-auto">
              <div className="p-4 border-b border-[#1F1F1F] bg-[#161616]/30">
                <p className="text-[10px] text-[#6B6355] uppercase tracking-wider font-bold">Active Conversations ({rooms.length})</p>
              </div>

              <div className="divide-y divide-[#1F1F1F]/40 flex-1 min-h-0">
                {rooms.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6B6355]">
                    No visitors have initiated a chat.
                  </div>
                ) : (
                  rooms.map((room) => {
                    const isActive = activeRoom?.id === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoom(room)}
                        className={`w-full text-left p-4 transition-all flex flex-col gap-1 ${
                          isActive ? 'bg-[#D4AF37]/5 border-l-2 border-l-[#D4AF37]' : 'hover:bg-[#161616]/30'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-xs font-bold text-[#F5F0E8]">{room.guest_name}</span>
                          <span className="text-[9px] text-[#6B6355]">
                            {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B6355] truncate w-full">{room.guest_email}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Right Side: Message pane */}
            <main className="flex-1 bg-[#060606] flex flex-col justify-between overflow-hidden">
              {activeRoom ? (
                <>
                  {/* Active Room Metadata Header */}
                  <div className="p-4 border-b border-[#1F1F1F] bg-[#0E0E0E] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#1F1F1F] flex items-center justify-center text-[#D4AF37]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold">{activeRoom.guest_name}</h3>
                          <button
                            onClick={toggleAiAutopilot}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all ${
                              activeRoom.ai_enabled
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : 'bg-[#161616] border-[#1F1F1F] text-[#6B6355]'
                            }`}
                            title="Toggle AI Autopilot"
                          >
                            AI Autopilot: {activeRoom.ai_enabled ? 'ON' : 'OFF'}
                          </button>
                        </div>
                        <p className="text-[10px] text-[#6B6355] flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5" />
                          {activeRoom.guest_email}
                        </p>
                      </div>
                    </div>

                    <div className="text-[9px] text-[#6B6355] flex flex-col gap-1 items-end">
                      <span className="flex items-center gap-1.5 bg-[#161616] border border-[#1F1F1F] px-2.5 py-1 rounded-full">
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        IP: {activeRoom.ip_address || 'unknown'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#161616] border border-[#1F1F1F] px-2.5 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        Started {new Date(activeRoom.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Message History Feed */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                    {messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[70%] flex flex-col gap-1">
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed flex flex-col gap-1.5 ${
                                isAdmin
                                  ? 'bg-[#D4AF37] text-[#060606] rounded-tr-none font-medium'
                                  : 'bg-[#161616] text-[#A09882] rounded-tl-none border border-[#1F1F1F]'
                              }`}
                            >
                              {msg.content && <p>{msg.content}</p>}

                              {msg.media_type === 'image' && msg.media_url && (
                                <div className="overflow-hidden rounded-lg border border-[#1F1F1F]/20 mt-1">
                                  <img
                                    src={msg.media_url}
                                    alt="Uploaded media"
                                    className="max-w-full max-h-[220px] object-cover cursor-pointer hover:opacity-95"
                                    onClick={() => window.open(msg.media_url, '_blank')}
                                  />
                                </div>
                              )}

                              {msg.media_type === 'audio' && msg.media_url && (
                                <div className="flex items-center mt-1">
                                  <audio
                                    src={msg.media_url}
                                    controls
                                    className={`w-48 h-8 outline-none rounded ${
                                      isAdmin ? 'brightness-110' : 'brightness-90 invert'
                                    }`}
                                  />
                                </div>
                              )}
                            </div>
                            <span className={`text-[8px] text-[#6B6355] mt-0.5 ${isAdmin ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* typing indicator */}
                    {isGuestTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#161616] border border-[#1F1F1F] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#A09882] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#A09882] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#A09882] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form Bar */}
                  <div className="p-4 border-t border-[#1F1F1F] bg-[#0E0E0E]">
                    {/* Media Upload & Record status indicators */}
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-center justify-between bg-[#161616] p-2.5 rounded-xl mb-2 text-xs border border-red-500/20"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[#A09882]">
                              Recording Audio: {Math.floor(recordingDuration / 60)}:
                              {(recordingDuration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <button
                            onClick={stopVoiceRecording}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSendReply} className="flex gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                      />

                      {/* Photo Attachment button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingMedia || isRecording}
                        className="w-12 h-12 bg-[#161616] border border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                        title="Attach Photo"
                      >
                        {uploadingMedia ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </button>

                      {/* Microphone voice button */}
                      <button
                        type="button"
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        disabled={uploadingMedia}
                        className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                            : 'bg-[#161616] border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] disabled:opacity-40'
                        }`}
                        title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
                      >
                        <Mic className="w-5 h-5" />
                      </button>

                      {/* Text Input */}
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => {
                          setReplyMessage(e.target.value);
                          handleTyping();
                        }}
                        disabled={isRecording || uploadingMedia}
                        placeholder={isRecording ? 'Recording audio message...' : `Reply to ${activeRoom.guest_name}...`}
                        className="flex-1 bg-[#161616] border border-[#1F1F1F] rounded-xl px-4 py-3 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 transition-all min-w-0"
                      />

                      {/* Submit Reply */}
                      <button
                        type="submit"
                        disabled={sending || !replyMessage.trim() || isRecording || uploadingMedia}
                        className="w-12 h-12 bg-[#D4AF37] text-[#060606] rounded-xl flex items-center justify-center transition-all hover:bg-[#E8D48B] disabled:opacity-40 flex-shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#1F1F1F] flex items-center justify-center text-[#6B6355] mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F5F0E8]">No Active Conversation</h3>
                  <p className="text-xs text-[#6B6355] mt-1 max-w-[280px]">
                    Select a conversation lead from the left pane list to begin chatting in real-time.
                  </p>
                </div>
              )}
            </main>
          </>
        ) : (
          /* ANALYTICS TAB PANEL */
          <main className="flex-1 bg-[#060606] p-8 overflow-y-auto space-y-8">
            {/* Top Cards: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1: Total Visitors */}
              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-[#6B6355] uppercase tracking-wider font-semibold">Total Unique Visitors</h4>
                  <p className="text-2xl font-bold font-heading text-[#F5F0E8] mt-1">{totalVisitors}</p>
                </div>
              </div>

              {/* Metric 2: Total Leads Captured */}
              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-[#6B6355] uppercase tracking-wider font-semibold">Leads (Emails) Captured</h4>
                  <p className="text-2xl font-bold font-heading text-[#F5F0E8] mt-1">{totalLeads}</p>
                </div>
              </div>

              {/* Metric 3: Lead Conversion Rate */}
              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-[#6B6355] uppercase tracking-wider font-semibold">Lead Conversion Rate</h4>
                  <p className="text-2xl font-bold font-heading text-[#F5F0E8] mt-1">{leadConversionRate}%</p>
                </div>
              </div>

              {/* Metric 4: Unique Client IPs */}
              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-[#6B6355] uppercase tracking-wider font-semibold">Active Devices (IPs)</h4>
                  <p className="text-2xl font-bold font-heading text-[#F5F0E8] mt-1">{uniqueIps.length}</p>
                </div>
              </div>
            </div>

            {/* SVG Visual Growth Chart */}
            <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6355] mb-6">Leads Acquired (Last 7 Days)</h3>
              
              <div className="h-64 w-full flex items-end justify-between px-6 pt-4 border-b border-[#1F1F1F] relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 bottom-1/4 border-b border-[#1F1F1F]/40" />
                <div className="absolute inset-x-0 bottom-2/4 border-b border-[#1F1F1F]/40" />
                <div className="absolute inset-x-0 bottom-3/4 border-b border-[#1F1F1F]/40" />

                {chartData.map((d) => {
                  const percent = (d.count / maxChartValue) * 100;
                  return (
                    <div key={d.name} className="flex flex-col items-center gap-3 w-1/8 h-full justify-end group z-10">
                      {/* Interactive Tooltip on hover */}
                      <span className="text-[10px] font-bold text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity bg-[#161616] border border-[#1F1F1F] px-2 py-1 rounded">
                        {d.count} Leads
                      </span>
                      {/* Bar fill */}
                      <div
                        className="w-12 bg-gradient-to-t from-[#D4AF37]/40 to-[#D4AF37] rounded-t-lg transition-all duration-700"
                        style={{ height: `${Math.max(percent, 4)}%` }}
                      />
                      <span className="text-[10px] text-[#6B6355] mt-1 font-semibold uppercase">{d.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Captured Leads Detailed List Table */}
            <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#1F1F1F] bg-[#161616]/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F0E8]">Captured Leads Details</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#1F1F1F] text-[#6B6355] uppercase tracking-wider font-semibold">
                      <th className="p-4">Visitor Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">First Contact Date</th>
                      <th className="p-4">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F]/40 text-[#A09882]">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-[#161616]/30 transition-colors">
                        <td className="p-4 font-bold text-[#F5F0E8]">{room.guest_name}</td>
                        <td className="p-4">{room.guest_email}</td>
                        <td className="p-4 font-mono">{room.ip_address || 'unknown'}</td>
                        <td className="p-4">{new Date(room.created_at).toLocaleString()}</td>
                        <td className="p-4">{new Date(room.last_message_at).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
