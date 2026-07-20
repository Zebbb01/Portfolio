'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/src/lib/supabaseClient';
import { toast } from 'sonner';
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
  Loader2,
  Search,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  Clipboard,
  ExternalLink,
  ChevronLeft,
  Filter
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

  // Tabs: 'chat' | 'analytics' | 'leads'
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics' | 'leads'>('chat');

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

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'ai' | 'human'>('all');
  const [showLeadDetails, setShowLeadDetails] = useState(true);

  // Lead Notes state (persisted in localStorage)
  const [leadNotes, setLeadNotes] = useState('');

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
        toast.error(error.message);
      } else {
        toast.success('Successfully unlocked console.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication.');
      toast.error(err.message || 'Authentication failed.');
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
      if (data) {
        setRooms(data);
        toast.success('Synced lead data successfully.');
      }
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      toast.error('Failed to sync workspace: ' + err.message);
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
                toast.info(`New lead incoming: ${newRoom.guest_name}`);
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
      setLeadNotes('');
      return;
    }

    // Load lead notes from localStorage
    const savedNotes = localStorage.getItem(`lead_notes_${activeRoom.id}`) || '';
    setLeadNotes(savedNotes);

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_chat_messages')
          .select('*')
          .eq('room_id', activeRoom.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setMessages(data);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        toast.error('Failed to load message thread: ' + err.message);
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
          ai_enabled: false, // Turn off AI autopilot automatically
        })
        .eq('id', activeRoom.id);

      if (roomError) throw roomError;
    } catch (err: any) {
      console.error('Error sending response:', err);
      toast.error('Failed to deliver message: ' + err.message);
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
          ai_enabled: false,
        })
        .eq('id', activeRoom.id);

      toast.success('Image sent successfully.');
    } catch (err: any) {
      console.error('Error sending image:', err);
      toast.error('Failed to upload image: ' + err.message);
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
              ai_enabled: false,
            })
            .eq('id', activeRoom!.id);

          toast.success('Voice message sent successfully.');
        } catch (err: any) {
          console.error('Error sending audio:', err);
          toast.error('Failed to send voice note: ' + err.message);
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
      toast.error('Microphone permission is required to record voice notes.');
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
    toast.success('Logged out successfully.');
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
      setRooms((prev) =>
        prev.map((r) => (r.id === activeRoom.id ? { ...r, ai_enabled: newStatus } : r))
      );
      toast.success(`AI Autopilot turned ${newStatus ? 'ON' : 'OFF'}.`);
    } catch (err: any) {
      console.error('Failed to toggle AI autopilot:', err);
      toast.error('Failed to toggle autopilot: ' + err.message);
    }
  };

  // Save Lead Notes locally
  const handleSaveNotes = (val: string) => {
    if (!activeRoom) return;
    setLeadNotes(val);
    localStorage.setItem(`lead_notes_${activeRoom.id}`, val);
  };

  // Copy details helper
  const handleCopyClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard.`);
  };

  // ===========================================================================
  // Filtered Rooms
  // ===========================================================================
  const filteredRooms = rooms.filter((r) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      r.guest_name.toLowerCase().includes(query) ||
      r.guest_email.toLowerCase().includes(query) ||
      (r.ip_address && r.ip_address.includes(query));

    if (!matchesSearch) return false;

    if (filterMode === 'ai') return r.ai_enabled;
    if (filterMode === 'human') return !r.ai_enabled;
    return true;
  });

  // Analytics Metrics
  const totalLeads = rooms.filter((r) => r.guest_email).length;
  const uniqueIps = Array.from(new Set(rooms.map((r) => r.ip_address).filter(Boolean)));
  const totalVisitors = uniqueIps.length || totalLeads;
  const leadConversionRate = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(1) : '0.0';

  const getChartData = () => {
    const dates: { [key: string]: number } = {};
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
            <h2 className="text-xl font-bold font-heading text-[#F5F0E8]">Admin Workspace</h2>
            <p className="text-xs text-[#6B6355] mt-1 uppercase tracking-wider">Access Restricted</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Admin Email"
                className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 px-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 text-center font-medium"
              />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Admin Password"
                className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 px-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 text-center font-medium"
              />
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
    <div className="min-h-screen bg-[#060606] text-[#F5F0E8] flex font-body selection:bg-[#D4AF37]/30 overflow-hidden h-screen">
      
      {/* COLUMN 1: LEFTMOST THIN NAVIGATION RAIL */}
      <aside className="w-16 border-r border-[#1F1F1F] bg-[#0E0E0E] flex flex-col items-center py-6 justify-between flex-shrink-0">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo mark */}
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
            <span className="font-bold font-heading text-xs text-[#D4AF37]">GV</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 w-full px-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#D4AF37] text-[#060606]'
                  : 'text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#161616]'
              }`}
              title="Conversations Workspace"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#D4AF37] text-[#060606]'
                  : 'text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#161616]'
              }`}
              title="Analytics Overview"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#D4AF37] text-[#060606]'
                  : 'text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#161616]'
              }`}
              title="Leads Database"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          <button
            onClick={fetchRooms}
            disabled={loadingRooms}
            className="w-10 h-10 text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#161616] rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRooms ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 text-[#6B6355] hover:text-red-400 hover:bg-[#161616] rounded-xl flex items-center justify-center transition-all"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* TABS CONTAINER ROUTER */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        
        {activeTab === 'chat' && (
          /* ===================================================================
             CONVERSATIONS INBOX TAB (3-COLUMN LAYOUT)
             =================================================================== */
          <>
            {/* COLUMN 2: CONVERSATIONS THREAD LIST (MIDDLE PANE) */}
            <aside className="w-72 border-r border-[#1F1F1F] bg-[#0E0E0E] flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-[#1F1F1F] bg-[#161616]/30 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F0E8]">Lead Inbox</h2>
                  <span className="text-[10px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                    {filteredRooms.length}
                  </span>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6355]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads..."
                    className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-2 pl-9 pr-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-1 bg-[#060606] p-0.5 rounded-lg border border-[#1F1F1F]">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase tracking-wide transition-all ${
                      filterMode === 'all' ? 'bg-[#161616] text-[#D4AF37]' : 'text-[#6B6355]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterMode('ai')}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase tracking-wide transition-all ${
                      filterMode === 'ai' ? 'bg-[#161616] text-[#D4AF37]' : 'text-[#6B6355]'
                    }`}
                  >
                    AI Bot
                  </button>
                  <button
                    onClick={() => setFilterMode('human')}
                    className={`flex-1 py-1 rounded text-[9px] font-bold uppercase tracking-wide transition-all ${
                      filterMode === 'human' ? 'bg-[#161616] text-[#D4AF37]' : 'text-[#6B6355]'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="divide-y divide-[#1F1F1F]/40 flex-1 overflow-y-auto min-h-0">
                {filteredRooms.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6B6355]">
                    No matching leads found.
                  </div>
                ) : (
                  filteredRooms.map((room) => {
                    const isActive = activeRoom?.id === room.id;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoom(room)}
                        className={`w-full text-left p-4 transition-all flex flex-col gap-1 border-l-2 ${
                          isActive
                            ? 'bg-[#D4AF37]/5 border-l-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/[0.02] to-transparent'
                            : 'border-l-transparent hover:bg-[#161616]/30'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-xs font-bold text-[#F5F0E8] truncate max-w-[150px]">
                            {room.guest_name}
                          </span>
                          <span className="text-[8px] text-[#6B6355] font-mono">
                            {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] text-[#6B6355] truncate max-w-[160px]">{room.guest_email}</span>
                          {room.ai_enabled && (
                            <span className="text-[7px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded">
                              BOT
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* COLUMN 3: CHAT WORKSPACE (RIGHT SECTION) */}
            <main className="flex-1 bg-[#060606] flex overflow-hidden min-w-0">
              
              {activeRoom ? (
                <>
                  {/* Central Message History Pane */}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden border-r border-[#1F1F1F]/40 h-full min-w-0">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-[#1F1F1F] bg-[#0E0E0E] flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#161616] border border-[#1F1F1F] flex items-center justify-center text-[#D4AF37]">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-[#F5F0E8]">{activeRoom.guest_name}</h3>
                            <button
                              onClick={toggleAiAutopilot}
                              className={`px-2 py-0.5 rounded-full text-[8px] font-bold border transition-all ${
                                activeRoom.ai_enabled
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                  : 'bg-[#161616] border-[#1F1F1F] text-[#6B6355]'
                              }`}
                              title="AI agent generates quick replies when you are away"
                            >
                              Autopilot: {activeRoom.ai_enabled ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <p className="text-[10px] text-[#6B6355] truncate max-w-[200px]">{activeRoom.guest_email}</p>
                        </div>
                      </div>

                      {/* Toggle CRM Details Sidepanel */}
                      <button
                        onClick={() => setShowLeadDetails(!showLeadDetails)}
                        className={`p-2 rounded-lg border transition-all ${
                          showLeadDetails
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                            : 'bg-[#161616] border-[#1F1F1F] text-[#6B6355] hover:text-[#D4AF37]'
                        }`}
                        title="Toggle Lead Profile"
                      >
                        {showLeadDetails ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-[#060606]">
                      {messages.map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-[75%] flex flex-col gap-1">
                              <div
                                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed flex flex-col gap-1.5 ${
                                  isAdmin
                                    ? 'bg-[#D4AF37] text-[#060606] rounded-tr-none font-medium'
                                    : 'bg-[#161616] text-[#A09882] rounded-tl-none border border-[#1F1F1F]'
                                }`}
                              >
                                {msg.content && <p>{msg.content}</p>}

                                {msg.media_type === 'image' && msg.media_url && (
                                  <div className="overflow-hidden rounded-xl border border-[#1F1F1F]/20 mt-1 max-w-xs">
                                    <img
                                      src={msg.media_url}
                                      alt="Attachment preview"
                                      className="max-w-full max-h-[220px] object-cover cursor-zoom-in hover:opacity-95"
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

                      {/* Live typing status dots */}
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

                    {/* Chat Textbar Input */}
                    <div className="p-4 border-t border-[#1F1F1F] bg-[#0E0E0E] flex-shrink-0">
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
                              <span className="text-[#6B6355] font-mono">
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
                        
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingMedia || isRecording}
                          className="w-10 h-10 bg-[#161616] border border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#6B6355] hover:text-[#D4AF37] rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                          title="Attach Photo"
                        >
                          {uploadingMedia ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                          disabled={uploadingMedia}
                          className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all ${
                            isRecording
                              ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                              : 'bg-[#161616] border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#6B6355] hover:text-[#D4AF37] disabled:opacity-40'
                          }`}
                          title="Record Voice Note"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => {
                            setReplyMessage(e.target.value);
                            handleTyping();
                          }}
                          disabled={isRecording || uploadingMedia}
                          placeholder={isRecording ? 'Voice active...' : `Reply to ${activeRoom.guest_name}...`}
                          className="flex-1 bg-[#161616] border border-[#1F1F1F] rounded-xl px-4 py-3 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/30 transition-all min-w-0"
                        />

                        <button
                          type="submit"
                          disabled={sending || !replyMessage.trim() || isRecording || uploadingMedia}
                          className="w-10 h-10 bg-[#D4AF37] text-[#060606] rounded-xl flex items-center justify-center transition-all hover:bg-[#E8D48B] disabled:opacity-40 flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Collapsible Right Sidebar: CRM Visitor Lead Detail Cards */}
                  <AnimatePresence>
                    {showLeadDetails && (
                      <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-l border-[#1F1F1F] bg-[#0E0E0E] flex flex-col overflow-y-auto flex-shrink-0 h-full w-70"
                      >
                        <div className="p-4 border-b border-[#1F1F1F] bg-[#161616]/20">
                          <p className="text-[10px] text-[#6B6355] uppercase tracking-wider font-bold">Lead Profile Card</p>
                        </div>

                        {/* Profile Info */}
                        <div className="p-4 space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Name</h4>
                            <div className="flex items-center justify-between bg-[#161616] p-2.5 rounded-lg border border-[#1F1F1F]">
                              <span className="text-xs text-[#F5F0E8] truncate max-w-[190px]">{activeRoom.guest_name}</span>
                              <button onClick={() => handleCopyClipboard(activeRoom.guest_name, 'Name')} className="text-[#6B6355] hover:text-[#D4AF37]">
                                <Clipboard className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Email Lead</h4>
                            <div className="flex items-center justify-between bg-[#161616] p-2.5 rounded-lg border border-[#1F1F1F]">
                              <span className="text-xs text-[#F5F0E8] truncate max-w-[190px]">{activeRoom.guest_email}</span>
                              <button onClick={() => handleCopyClipboard(activeRoom.guest_email, 'Email')} className="text-[#6B6355] hover:text-[#D4AF37]">
                                <Clipboard className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Network Address</h4>
                            <div className="flex items-center gap-2 bg-[#161616] p-2.5 rounded-lg border border-[#1F1F1F] text-xs font-mono text-[#A09882]">
                              <Globe className="w-3.5 h-3.5 text-emerald-500" />
                              {activeRoom.ip_address || 'unknown'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Acquisition Time</h4>
                            <div className="flex items-center gap-2 bg-[#161616] p-2.5 rounded-lg border border-[#1F1F1F] text-[10px] text-[#A09882]">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(activeRoom.created_at).toLocaleDateString()} at {new Date(activeRoom.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>

                          {/* Notes Textbox (Persisted locally) */}
                          <div className="space-y-1 pt-2 border-t border-[#1F1F1F]">
                            <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Lead Activity Notes</h4>
                            <textarea
                              value={leadNotes}
                              onChange={(e) => handleSaveNotes(e.target.value)}
                              placeholder="Write custom notes about this deal/lead here..."
                              className="w-full h-32 bg-[#161616] border border-[#1F1F1F] rounded-lg p-2.5 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/30 resize-none"
                            />
                            <p className="text-[8px] text-[#6B6355] text-right italic">Notes save automatically.</p>
                          </div>

                          {/* CRM Actions */}
                          <div className="pt-2 border-t border-[#1F1F1F] flex flex-col gap-2">
                            <a
                              href={`mailto:${activeRoom.guest_email}`}
                              className="w-full py-2 bg-[#161616] border border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] text-center text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Email Direct
                            </a>
                            <button
                              onClick={() => {
                                const csvContent = `Name,Email,IP,Created_At\n"${activeRoom.guest_name}","${activeRoom.guest_email}","${activeRoom.ip_address}","${activeRoom.created_at}"`;
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.setAttribute('href', url);
                                a.setAttribute('download', `lead_${activeRoom.guest_name.replace(/\s+/g, '_')}.csv`);
                                a.click();
                                toast.success('Lead exported successfully.');
                              }}
                              className="w-full py-2 bg-[#161616] border border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Export Lead CSV
                            </button>
                          </div>
                        </div>
                      </motion.aside>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#060606]">
                  <div className="w-14 h-14 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] flex items-center justify-center text-[#6B6355] mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-semibold text-[#F5F0E8] uppercase tracking-wide">No Conversation Selected</h3>
                  <p className="text-[10px] text-[#6B6355] mt-1.5 max-w-[280px]">
                    Select a conversation thread lead from the middle list pane to begin chatting in real-time or managing profile details.
                  </p>
                </div>
              )}
            </main>
          </>
        )}

        {activeTab === 'analytics' && (
          /* ===================================================================
             ANALYTICS TAB PANEL
             =================================================================== */
          <main className="flex-1 bg-[#060606] p-8 overflow-y-auto space-y-8 h-full">
            <div className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">Lead Analytics Dashboard</h2>
                <p className="text-[10px] text-[#6B6355] uppercase mt-0.5">Real-time Traffic and Conversions</p>
              </div>
              <button
                onClick={fetchRooms}
                disabled={loadingRooms}
                className="px-3.5 py-1.5 bg-[#161616] border border-[#1F1F1F] rounded-lg text-xs text-[#A09882] hover:text-[#D4AF37] flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRooms ? 'animate-spin' : ''}`} />
                Sync
              </button>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Unique Visitors</h4>
                  <p className="text-xl font-bold font-heading text-[#F5F0E8] mt-0.5">{totalVisitors}</p>
                </div>
              </div>

              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Captured Leads</h4>
                  <p className="text-xl font-bold font-heading text-[#F5F0E8] mt-0.5">{totalLeads}</p>
                </div>
              </div>

              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Conversion Rate</h4>
                  <p className="text-xl font-bold font-heading text-[#F5F0E8] mt-0.5">{leadConversionRate}%</p>
                </div>
              </div>

              <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[9px] text-[#6B6355] uppercase font-bold tracking-wider">Unique IP Blocks</h4>
                  <p className="text-xl font-bold font-heading text-[#F5F0E8] mt-0.5">{uniqueIps.length}</p>
                </div>
              </div>
            </div>

            {/* Custom SVG Sparkline Graph */}
            <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6B6355] mb-5">Lead Acquisition Chart (Last 7 Days)</h3>
              <div className="h-48 w-full flex items-end justify-between px-4 pb-2 border-b border-[#1F1F1F]/60 relative">
                <div className="absolute inset-x-0 bottom-1/3 border-b border-[#1F1F1F]/20" />
                <div className="absolute inset-x-0 bottom-2/3 border-b border-[#1F1F1F]/20" />
                {chartData.map((d) => {
                  const percent = (d.count / maxChartValue) * 100;
                  return (
                    <div key={d.name} className="flex flex-col items-center gap-2 w-16 h-full justify-end group z-10">
                      <span className="text-[9px] font-bold text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all bg-[#161616] border border-[#1F1F1F] px-1.5 py-0.5 rounded">
                        {d.count}
                      </span>
                      <div
                        className="w-8 bg-[#D4AF37]/20 border-t border-[#D4AF37] hover:bg-[#D4AF37]/30 transition-all rounded-t-sm"
                        style={{ height: `${Math.max(percent, 4)}%` }}
                      />
                      <span className="text-[8px] text-[#6B6355] font-bold mt-1 uppercase">{d.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {activeTab === 'leads' && (
          /* ===================================================================
             LEADS DATABASE LOG TAB
             =================================================================== */
          <main className="flex-1 bg-[#060606] p-8 overflow-y-auto space-y-6 h-full">
            <div className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F0E8]">Captured Leads Database</h2>
                <p className="text-[10px] text-[#6B6355] uppercase mt-0.5">Historical visitor contacts log</p>
              </div>
              <button
                onClick={() => {
                  const headers = 'Name,Email,IP Address,Created At,Last Active\n';
                  const rows = rooms
                    .map((r) => `"${r.guest_name}","${r.guest_email}","${r.ip_address}","${r.created_at}","${r.last_message_at}"`)
                    .join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('href', url);
                  a.setAttribute('download', `leads_database_${Date.now()}.csv`);
                  a.click();
                  toast.success('Leads database exported successfully.');
                }}
                className="px-3.5 py-1.5 bg-[#161616] border border-[#1F1F1F] rounded-lg text-xs text-[#A09882] hover:text-[#D4AF37] flex items-center gap-1.5 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export CSV Database
              </button>
            </div>

            <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1F1F1F] bg-[#161616]/30 text-[#6B6355] uppercase tracking-wider font-semibold">
                    <th className="p-4">Visitor Lead Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">IP Location</th>
                    <th className="p-4">Conversion Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]/40 text-[#A09882]">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-[#161616]/20 transition-colors">
                      <td className="p-4 font-bold text-[#F5F0E8]">{room.guest_name}</td>
                      <td className="p-4">{room.guest_email}</td>
                      <td className="p-4 font-mono">{room.ip_address || 'unknown'}</td>
                      <td className="p-4">{new Date(room.created_at).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                          room.ai_enabled
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                          {room.ai_enabled ? 'AI RUNNING' : 'HUMAN HANDLED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        )}

      </div>
    </div>
  );
}
