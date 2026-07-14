-- SQL Script to create the invite_codes table in Supabase

CREATE TABLE invite_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Claimed', 'Revoked'
    category VARCHAR(50) DEFAULT 'Standard', -- 'VIP', 'Partner', 'Standard'
    claimed_by_email VARCHAR(255),
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add a comment to the table
COMMENT ON TABLE invite_codes IS 'Stores single-use invite codes for the Go To Goal Summit';

-- Optional: Create an index for faster lookups by code
CREATE INDEX idx_invite_codes_code ON invite_codes(code);


-- SQL Script to create the applications table in Supabase

CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    
    -- Social fields
    social_platform VARCHAR(50) DEFAULT 'LinkedIn',
    social_handle VARCHAR(255),
    
    -- Professional/Student fields
    category VARCHAR(50) NOT NULL,
    current_role VARCHAR(150),
    company VARCHAR(150),
    university VARCHAR(150),
    field_of_study VARCHAR(150),
    
    -- Long-form questions
    q1_passion TEXT,
    q2_differently TEXT,
    q3_future_goals TEXT,
    q4_intentions TEXT,
    q5_changed_belief TEXT,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'Under Review', -- 'Under Review', 'Accepted', 'Rejected'
    rsvp_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in-person', 'virtual', 'declined'
    invite_code_issued VARCHAR(50),
    sync_errors TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create an index for filtering by status or email
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_email ON applications(email);

-- Enable Row Level Security (RLS) on sensitive tables to block direct client API queries
-- Enabling RLS without explicit public policies will deny all direct client-side (anon) requests.
-- All database reads and writes in the application are securely performed on the server side via Server Actions,
-- which bypasses RLS using the administrative service role. This ensures maximum protection.
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
