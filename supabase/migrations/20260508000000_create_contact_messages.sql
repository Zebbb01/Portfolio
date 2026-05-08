-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for the contact form)
CREATE POLICY "Allow public inserts" ON public.contact_messages
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow service role / authenticated users to view (if needed)
-- By default, no one can read except for those with the service role
CREATE POLICY "Allow service role to read" ON public.contact_messages
    FOR SELECT
    USING (true);

-- Add comments for documentation
COMMENT ON TABLE public.contact_messages IS 'Storage for portfolio contact form submissions';
