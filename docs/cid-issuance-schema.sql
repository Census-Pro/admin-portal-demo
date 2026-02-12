-- CID Issuance Database Schema
-- PostgreSQL Schema for CID (Citizenship Identity Document) Issuance System

-- ============================================================================
-- Main Application Table
-- ============================================================================

CREATE TABLE cid_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Applicant Personal Information
    applicant_name VARCHAR(255) NOT NULL,
    applicant_cid VARCHAR(11), -- Nullable for NEW applications
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10),
    place_of_birth VARCHAR(255),
    
    -- Location Information
    dzongkhag_id UUID REFERENCES dzongkhags(id),
    gewog_id UUID REFERENCES gewogs(id),
    village VARCHAR(255),
    household_number VARCHAR(50),
    
    -- Contact Information
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    present_address TEXT,
    permanent_address TEXT,
    
    -- Parent Information
    father_name VARCHAR(255) NOT NULL,
    father_cid VARCHAR(11) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    mother_cid VARCHAR(11) NOT NULL,
    
    -- Application Metadata
    birth_certificate_number VARCHAR(50),
    application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('NEW', 'RENEWAL', 'REPLACEMENT', 'UPDATE')),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    remarks TEXT,
    
    -- Workflow Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Indexes for performance
    CONSTRAINT check_status CHECK (status IN (
        'SUBMITTED',
        'PENDING_VERIFICATION',
        'VERIFIED',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
    ))
);

-- Indexes for common queries
CREATE INDEX idx_cid_applications_status ON cid_applications(status);
CREATE INDEX idx_cid_applications_type ON cid_applications(application_type);
CREATE INDEX idx_cid_applications_created_at ON cid_applications(created_at);
CREATE INDEX idx_cid_applications_applicant_cid ON cid_applications(applicant_cid);
CREATE INDEX idx_cid_applications_assigned_to ON cid_applications(assigned_to);

-- ============================================================================
-- Supporting Documents Table
-- ============================================================================

CREATE TABLE cid_application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES cid_applications(id) ON DELETE CASCADE,
    
    -- Document Information
    document_type VARCHAR(100) NOT NULL, -- 'BIRTH_CERTIFICATE', 'CENSUS_CERTIFICATE', 'PHOTO', 'PARENT_CID', etc.
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_remarks TEXT,
    
    -- Audit Fields
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id)
);

CREATE INDEX idx_cid_documents_application ON cid_application_documents(application_id);
CREATE INDEX idx_cid_documents_type ON cid_application_documents(document_type);

-- ============================================================================
-- Workflow History Table
-- ============================================================================

CREATE TABLE cid_workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES cid_applications(id) ON DELETE CASCADE,
    
    -- Workflow Information
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'SUBMIT', 'FORWARD', 'VERIFY', 'APPROVE', 'REJECT', 'CANCEL'
    remarks TEXT,
    
    -- Additional Data (JSON for flexibility)
    action_data JSONB,
    
    -- Audit Fields
    performed_by UUID NOT NULL REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Office Information
    office_location_id UUID REFERENCES office_locations(id)
);

CREATE INDEX idx_cid_workflow_application ON cid_workflow_history(application_id);
CREATE INDEX idx_cid_workflow_performed_at ON cid_workflow_history(performed_at);

-- ============================================================================
-- Print Queue Table
-- ============================================================================

CREATE TABLE cid_print_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES cid_applications(id) ON DELETE CASCADE,
    
    -- CID Information
    cid_number VARCHAR(11) UNIQUE NOT NULL,
    
    -- Print Status
    print_status VARCHAR(50) NOT NULL DEFAULT 'READY_TO_PRINT' CHECK (
        print_status IN ('READY_TO_PRINT', 'PRINTING', 'PRINTED', 'COLLECTED', 'FAILED')
    ),
    
    -- Print Details
    print_batch_id VARCHAR(50),
    printer_id VARCHAR(100),
    
    -- Timestamps
    queued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    printed_at TIMESTAMP,
    printed_by UUID REFERENCES users(id),
    collected_at TIMESTAMP,
    collected_by_name VARCHAR(255), -- Name of person who collected
    collected_by_relation VARCHAR(100), -- Relationship to applicant
    
    -- Quality Check
    quality_checked BOOLEAN DEFAULT FALSE,
    quality_checked_by UUID REFERENCES users(id),
    quality_checked_at TIMESTAMP,
    quality_remarks TEXT,
    
    -- Failure Information
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0
);

CREATE INDEX idx_cid_print_status ON cid_print_queue(print_status);
CREATE INDEX idx_cid_print_batch ON cid_print_queue(print_batch_id);
CREATE INDEX idx_cid_print_queued_at ON cid_print_queue(queued_at);
CREATE UNIQUE INDEX idx_cid_number_unique ON cid_print_queue(cid_number);

-- ============================================================================
-- CID Card Details Table (for issued CIDs)
-- ============================================================================

CREATE TABLE cid_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES cid_applications(id),
    
    -- CID Information
    cid_number VARCHAR(11) UNIQUE NOT NULL,
    
    -- Card Details
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    card_version VARCHAR(20), -- Card design version
    
    -- Biometric Data (if applicable)
    fingerprint_hash TEXT,
    photo_url VARCHAR(500),
    signature_url VARCHAR(500),
    
    -- QR Code Data
    qr_code_data TEXT,
    qr_code_url VARCHAR(500),
    
    -- Security Features
    chip_id VARCHAR(100), -- For smart cards
    security_code VARCHAR(50),
    
    -- Status
    card_status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (
        card_status IN ('ACTIVE', 'EXPIRED', 'REVOKED', 'REPLACED', 'LOST', 'DAMAGED')
    ),
    
    -- Replacement Tracking
    replaces_cid_id UUID REFERENCES cid_cards(id),
    replaced_by_cid_id UUID REFERENCES cid_cards(id),
    replacement_reason TEXT,
    
    -- Audit Fields
    issued_by UUID REFERENCES users(id),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cid_cards_number ON cid_cards(cid_number);
CREATE INDEX idx_cid_cards_status ON cid_cards(card_status);
CREATE INDEX idx_cid_cards_expiry ON cid_cards(expiry_date);
CREATE INDEX idx_cid_cards_issue_date ON cid_cards(issue_date);

-- ============================================================================
-- Application Comments/Notes Table
-- ============================================================================

CREATE TABLE cid_application_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES cid_applications(id) ON DELETE CASCADE,
    
    -- Comment Details
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE, -- Internal notes vs. applicant-visible
    
    -- Audit Fields
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cid_comments_application ON cid_application_comments(application_id);

-- ============================================================================
-- Triggers for Updated Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cid_applications_updated_at BEFORE UPDATE ON cid_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cid_cards_updated_at BEFORE UPDATE ON cid_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Views for Common Queries
-- ============================================================================

-- View for pending applications dashboard
CREATE VIEW v_pending_applications AS
SELECT 
    ca.*,
    d.name_english as dzongkhag_name,
    g.name_english as gewog_name,
    u.username as created_by_username,
    COUNT(DISTINCT cad.id) as document_count
FROM cid_applications ca
LEFT JOIN dzongkhags d ON ca.dzongkhag_id = d.id
LEFT JOIN gewogs g ON ca.gewog_id = g.id
LEFT JOIN users u ON ca.created_by = u.id
LEFT JOIN cid_application_documents cad ON ca.id = cad.application_id
WHERE ca.status = 'SUBMITTED'
GROUP BY ca.id, d.name_english, g.name_english, u.username;

-- View for verification queue
CREATE VIEW v_verification_queue AS
SELECT 
    ca.*,
    d.name_english as dzongkhag_name,
    g.name_english as gewog_name,
    u.username as assigned_to_username
FROM cid_applications ca
LEFT JOIN dzongkhags d ON ca.dzongkhag_id = d.id
LEFT JOIN gewogs g ON ca.gewog_id = g.id
LEFT JOIN users u ON ca.assigned_to = u.id
WHERE ca.status = 'PENDING_VERIFICATION';

-- View for print queue with details
CREATE VIEW v_print_queue_details AS
SELECT 
    cpq.*,
    ca.applicant_name,
    ca.date_of_birth,
    ca.gender,
    ca.phone_number,
    d.name_english as dzongkhag_name,
    g.name_english as gewog_name
FROM cid_print_queue cpq
INNER JOIN cid_applications ca ON cpq.application_id = ca.id
LEFT JOIN dzongkhags d ON ca.dzongkhag_id = d.id
LEFT JOIN gewogs g ON ca.gewog_id = g.id;

-- ============================================================================
-- Sample Data for Testing (Optional)
-- ============================================================================

-- Note: Uncomment and modify as needed for development/testing

/*
INSERT INTO cid_applications (
    applicant_name, date_of_birth, gender, phone_number,
    father_name, father_cid, mother_name, mother_cid,
    dzongkhag_id, gewog_id, application_type, status
) VALUES (
    'Tshering Dorji', '2008-03-15', 'Male', '17123456',
    'Dorji Tshering', '10304001234', 'Pema Wangmo', '10305002345',
    (SELECT id FROM dzongkhags WHERE name_english = 'Thimphu' LIMIT 1),
    (SELECT id FROM gewogs WHERE name_english = 'Chang' LIMIT 1),
    'NEW', 'SUBMITTED'
);
*/
