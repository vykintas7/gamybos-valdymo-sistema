-- Gamybos valdymo sistemos duomenų bazės schema
-- Sukurti Supabase duomenų bazėje

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'User',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- Materials table
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    supplier VARCHAR(255),
    current_stock DECIMAL(10,3) DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    cost_per_unit DECIMAL(10,2) DEFAULT 0,
    reorder_level DECIMAL(10,3) DEFAULT 0,
    storage_location VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Formulas table
CREATE TABLE formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    client_id UUID REFERENCES clients(id),
    category VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Formula ingredients table
CREATE TABLE formula_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formula_id UUID REFERENCES formulas(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    percentage DECIMAL(5,2) NOT NULL,
    notes TEXT
);

-- Production batches table
CREATE TABLE production_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    formula_id UUID REFERENCES formulas(id),
    client_id UUID REFERENCES clients(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'planned',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Production batch ingredients table
CREATE TABLE production_batch_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES production_batches(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity_used DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'formula', 'production', 'material', etc.
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'lt',
    date_format VARCHAR(20) DEFAULT 'yyyy-mm-dd',
    currency VARCHAR(10) DEFAULT 'EUR',
    timezone VARCHAR(50) DEFAULT 'Europe/Vilnius',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    low_stock_alerts BOOLEAN DEFAULT true,
    formula_updates BOOLEAN DEFAULT true,
    comment_notifications BOOLEAN DEFAULT true,
    system_updates BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_clients_code ON clients(code);
CREATE INDEX idx_formulas_code ON formulas(code);
CREATE INDEX idx_formulas_client_id ON formulas(client_id);
CREATE INDEX idx_production_batches_batch_number ON production_batches(batch_number);
CREATE INDEX idx_production_batches_formula_id ON production_batches(formula_id);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formulas_updated_at BEFORE UPDATE ON formulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_batches_updated_at BEFORE UPDATE ON production_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE formula_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batch_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (adjust as needed)
-- Users can read all users but only update themselves
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (auth.uid() = id);

-- All authenticated users can read and write materials, clients, formulas, etc.
CREATE POLICY "Authenticated users can access materials" ON materials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access formulas" ON formulas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access formula_ingredients" ON formula_ingredients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access production_batches" ON production_batches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access production_batch_ingredients" ON production_batch_ingredients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access comments" ON comments FOR ALL USING (auth.role() = 'authenticated');

-- Users can only see their own notifications and settings
CREATE POLICY "Users can access their notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

