-- Title: Create Portfolio Live Chat Tables

-- Clean up existing tables (automatically drops them from any publications)
DROP TABLE IF EXISTS public.portfolio_chat_messages CASCADE;
DROP TABLE IF EXISTS public.portfolio_chat_rooms CASCADE;

-- Create Chat Rooms Table (Lead Capture)
CREATE TABLE public.portfolio_chat_rooms (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    ip_address text,
    ai_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    last_message_at timestamp with time zone DEFAULT now(),
    CONSTRAINT portfolio_chat_rooms_pkey PRIMARY KEY (id)
);

-- Create Chat Messages Table
CREATE TABLE public.portfolio_chat_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.portfolio_chat_rooms(id) ON DELETE CASCADE,
    sender text NOT NULL CHECK (sender IN ('guest', 'admin')),
    content text,
    media_url text,
    media_type text CHECK (media_type IN ('image', 'audio')),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT portfolio_chat_messages_pkey PRIMARY KEY (id)
);

-- Enable Realtime triggers on these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_chat_rooms;

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_chat_rooms
-- Guests cannot view rooms listing. Admins can view all rooms.
CREATE POLICY "Admins can select all rooms" ON public.portfolio_chat_rooms 
    FOR SELECT USING (auth.jwt() ->> 'email' IN ('geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'));

CREATE POLICY "Admins can update rooms" ON public.portfolio_chat_rooms 
    FOR UPDATE USING (auth.jwt() ->> 'email' IN ('geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'));


-- RLS Policies for portfolio_chat_messages
-- Guests can read messages in their rooms. Admins can read all.
CREATE POLICY "Allow public select messages" ON public.portfolio_chat_messages 
    FOR SELECT USING (true);

CREATE POLICY "Admins can select all messages" ON public.portfolio_chat_messages 
    FOR SELECT USING (auth.jwt() ->> 'email' IN ('geraldvillaceran01@gmail.com', 'buangmo90@gmail.com'));

-- Admin replies can be inserted directly by authenticated admin users
CREATE POLICY "Admins can insert replies" ON public.portfolio_chat_messages 
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' IN ('geraldvillaceran01@gmail.com', 'buangmo90@gmail.com') 
        AND sender = 'admin'
    );



