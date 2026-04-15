-- Table to store rooms created by hosts
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(15) UNIQUE NOT NULL, -- e.g. 'AKD-KWB-WUG'
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read rooms (so participants can verify code exists)
CREATE POLICY "Anyone can check rooms" ON public.rooms FOR SELECT USING (true);

-- Allow authenticated users to create rooms and only their own
CREATE POLICY "Authenticated users can create rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Extra: Allow host to manage (update/delete) their own rooms
CREATE POLICY "Hosts can manage their rooms" ON public.rooms USING (auth.uid() = host_id);
