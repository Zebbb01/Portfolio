'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Mail, Loader2, Camera, Mic, Square, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabaseClient';
import { toast } from 'sonner';

interface Message {
  id: string;
  room_id: string;
  sender: 'guest' | 'admin';
  content?: string;
  media_url?: string;
  media_type?: 'image' | 'audio';
  created_at: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Media states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Typing and AI states
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Load room session from localStorage on mount
  useEffect(() => {
    const savedRoomId = localStorage.getItem('portfolio_chat_room_id');
    const savedName = localStorage.getItem('portfolio_chat_guest_name');
    const savedEmail = localStorage.getItem('portfolio_chat_guest_email');

    if (savedRoomId) setRoomId(savedRoomId);
    if (savedName) setGuestName(savedName);
    if (savedEmail) setGuestEmail(savedEmail);
  }, []);

  // Fetch messages and subscribe to realtime updates once room is loaded
  useEffect(() => {
    if (!roomId) return;

    // Fetch historical messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_chat_messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) {
          setMessages(data);
          // If admin has sent any message other than the welcome message, disable local AI autopilot tracking
          const hasAdminReplied = data.some(
            (m) => m.sender === 'admin' && !m.content?.includes('Thanks for reaching out')
          );
          if (hasAdminReplied) {
            setAiEnabled(false);
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Subscribe to realtime channel for messages and typing broadcasts
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'portfolio_chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Disable local AI autopilot if admin replies
          if (newMsg.sender === 'admin' && !newMsg.content?.includes('Thanks for reaching out')) {
            setAiEnabled(false);
          }
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { isTyping, sender } = payload.payload;
        if (sender === 'admin') {
          setIsAdminTyping(isTyping);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isAdminTyping]);

  // Handle typing status broadcast
  const handleTyping = () => {
    if (!channelRef.current || !roomId) return;

    // Broadcast that guest is typing
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true, sender: 'guest' },
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { isTyping: false, sender: 'guest' },
        });
      }
    }, 2000);
  };

  // Upload file helper
  const uploadChatMedia = async (file: File, folder: 'image' | 'audio') => {
    if (!roomId) throw new Error('No active room ID');
    const ext = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
    const filePath = `chat-media/${roomId}/${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Start chat session (Lead Capture)
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, guestEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to start chat session.');
        return;
      }

      if (data.success && data.roomId) {
        const id = data.roomId;
        setRoomId(id);
        localStorage.setItem('portfolio_chat_room_id', id);
        localStorage.setItem('portfolio_chat_guest_name', guestName.trim());
        localStorage.setItem('portfolio_chat_guest_email', guestEmail.trim());
      }
    } catch (err: any) {
      console.error('Error starting chat:', err);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Send text message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || sending) return;

    const textToSend = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Stop typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { isTyping: false, sender: 'guest' },
      });
    }

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, sender: 'guest', content: textToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error sending message:', data.error);
        toast.error(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  // Handle Image Upload Selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;

    setUploadingMedia(true);
    try {
      const url = await uploadChatMedia(file, 'image');
      
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          sender: 'guest',
          mediaUrl: url,
          mediaType: 'image',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to deliver image.');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast.error(err.message || 'Failed to upload image.');
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
          
          const res = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId,
              sender: 'guest',
              mediaUrl: url,
              mediaType: 'audio',
            }),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to deliver voice note.');
          }
        } catch (err: any) {
          console.error('Error uploading audio:', err);
          toast.error(err.message || 'Failed to send voice message.');
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
      toast.error('Microphone permission is required to send voice notes.');
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

  // Reset session
  const handleResetSession = () => {
    setShowResetConfirm(true);
  };

  const confirmResetSession = () => {
    localStorage.removeItem('portfolio_chat_room_id');
    localStorage.removeItem('portfolio_chat_guest_name');
    localStorage.removeItem('portfolio_chat_guest_email');
    setRoomId(null);
    setMessages([]);
    setGuestName('');
    setGuestEmail('');
    setShowResetConfirm(false);
    toast.success('Conversation reset successfully.');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] font-body">
      {/* Floating Chat Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#060606] flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all duration-300 relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-label="Live chat"
            /* A fixed 360px panel overflowed the left edge of a 360-375px phone. */
            className="fixed sm:absolute inset-x-5 bottom-24 sm:inset-x-auto sm:bottom-18 sm:right-0 w-auto sm:w-[380px] h-[min(520px,70vh)] rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Custom Inline Reset Confirm Dialog */}
            <AnimatePresence>
              {showResetConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0E0E0E]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center gap-4"
                >
                  <AlertCircle className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                  <div>
                    <h5 className="text-xs font-bold text-[#F5F0E8] uppercase tracking-wider">Start New Chat?</h5>
                    <p className="text-[10px] text-[#6B6355] mt-1.5 leading-relaxed px-4">
                      This will clear your current conversation history.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full max-w-[200px]">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 bg-[#161616] border border-[#1F1F1F] rounded-lg text-[10px] font-bold uppercase text-[#A09882] hover:text-[#D4AF37] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmResetSession}
                      className="flex-1 py-2 bg-[#D4AF37] text-[#060606] rounded-lg text-[10px] font-bold uppercase hover:bg-[#E8D48B] transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Header */}
            <div className="p-4 border-b border-[#1F1F1F] bg-[#161616] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="text-xs font-semibold text-[#F5F0E8] tracking-wide">Gerald Villaceran</h4>
                  <p className="text-[10px] text-[#6B6355] uppercase tracking-wider">Live Chat Support</p>
                </div>
              </div>
              {roomId && (
                <button
                  onClick={handleResetSession}
                  className="text-[9px] text-[#6B6355] hover:text-[#D4AF37] uppercase tracking-wider transition-colors"
                >
                  New Chat
                </button>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
              {!roomId ? (
                /* Lead Capture Form */
                <form onSubmit={handleStartChat} className="h-full flex flex-col justify-center space-y-4">
                  <div className="text-center mb-2">
                    <h5 className="text-sm font-semibold text-[#F5F0E8] mb-1">Let's Connect</h5>
                    <p className="text-xs text-[#A09882] px-4">
                      Leave your details below to start a real-time conversation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6355]" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 pl-10 pr-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6355]" />
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full bg-[#161616] border border-[#1F1F1F] rounded-xl py-3 pl-10 pr-4 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E8D48B] text-[#060606] font-semibold text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Start Conversation'
                    )}
                  </button>
                </form>
              ) : (
                /* Chat Messages List */
                <div className="h-full flex flex-col justify-between min-h-0 flex-1">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
                    {messages.map((msg) => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed flex flex-col gap-1.5 ${
                              isAdmin
                                ? 'bg-[#161616] text-[#A09882] rounded-tl-none border border-[#1F1F1F]'
                                : 'bg-[#D4AF37] text-[#060606] rounded-tr-none font-medium'
                            }`}
                          >
                            {msg.content && <p>{msg.content}</p>}

                            {msg.media_type === 'image' && msg.media_url && (
                              <div className="overflow-hidden rounded-lg mt-0.5 border border-[#1F1F1F]/15">
                                <img
                                  src={msg.media_url}
                                  alt="Chat media"
                                  className="max-w-full max-h-[160px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                  onClick={() => window.open(msg.media_url, '_blank')}
                                />
                              </div>
                            )}

                            {msg.media_type === 'audio' && msg.media_url && (
                              <div className="flex items-center mt-0.5">
                                <audio
                                  src={msg.media_url}
                                  controls
                                  className={`w-44 h-8 outline-none rounded ${
                                    isAdmin ? 'brightness-90 invert' : 'brightness-110'
                                  }`}
                                />
                              </div>
                            )}
                            <span className={`text-[8px] opacity-60 self-end mt-0.5`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* typing indicator */}
                    {(isAdminTyping || (aiEnabled && messages.length > 0 && messages[messages.length - 1].sender === 'guest')) && (
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

                  {/* Input form */}
                  <div className="pt-3 border-t border-[#1F1F1F] mt-3">
                    {/* Media Upload & Record indicators */}
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-center justify-between bg-[#161616] p-2.5 rounded-xl mb-2 text-xs border border-[#D4AF37]/20"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[#A09882] font-semibold">
                              Recording: {Math.floor(recordingDuration / 60)}:
                              {(recordingDuration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <button
                            onClick={stopVoiceRecording}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            title="Stop & Send"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSendMessage} className="flex gap-1.5 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      
                      {/* Attach Image button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingMedia || isRecording}
                        className="w-10 h-10 bg-[#161616] border border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                        title="Upload Image"
                      >
                        {uploadingMedia ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </button>

                      {/* Voice Note Button */}
                      <button
                        type="button"
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        disabled={uploadingMedia}
                        className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                            : 'bg-[#161616] border-[#1F1F1F] hover:border-[#D4AF37]/30 text-[#A09882] hover:text-[#D4AF37] disabled:opacity-40'
                        }`}
                        title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      {/* Text Input */}
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        disabled={isRecording || uploadingMedia}
                        placeholder={isRecording ? 'Recording voice message...' : 'Type a message...'}
                        className="flex-1 bg-[#161616] border border-[#1F1F1F] rounded-xl px-3 py-3 text-xs text-[#F5F0E8] placeholder-[#6B6355] focus:outline-none focus:border-[#D4AF37]/50 transition-all min-w-0"
                      />

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim() || isRecording || uploadingMedia}
                        className="w-10 h-10 bg-[#D4AF37] text-[#060606] rounded-xl flex items-center justify-center transition-all hover:bg-[#E8D48B] disabled:opacity-40 flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
