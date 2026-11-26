
CREATE TABLE IF NOT EXISTS years (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    year_id INT NULL REFERENCES years(id) ON DELETE SET NULL,
    points INT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    score_month CHAR(7) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'expired', 'rejected')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS modules (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year_id INT NOT NULL REFERENCES years(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (year_id, name)
);

CREATE TABLE IF NOT EXISTS lectures (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_id INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_materials (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lecture_id INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pdf_url VARCHAR(500) NOT NULL,
    file_size_bytes INT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sources (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_id INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    lecture_id INT NULL REFERENCES lectures(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    mode VARCHAR(10) NOT NULL DEFAULT 'quiz'
        CHECK (mode IN ('quiz', 'exam')),
    question_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_id INT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS options (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_letter VARCHAR(10) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS qcm_attempts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    time_taken INT NOT NULL DEFAULT 0,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS archive (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    best_score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    month CHAR(7) NOT NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, source_id, month)
);

CREATE TABLE IF NOT EXISTS favorites (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, source_id)
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preview VARCHAR(255) NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NULL,
    created_by INT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medswap_items (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INT NULL REFERENCES modules(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    item_condition VARCHAR(50) NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medswap_replies (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medswap_item_id INT NOT NULL REFERENCES medswap_items(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Migration 2: Discussion Threads, Posts, Votes , Notifications
-- =============================================================================

CREATE TABLE IF NOT EXISTS threads (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context_type VARCHAR(20) NOT NULL
        CHECK (context_type IN ('quiz', 'course', 'module', 'general')),
    context_id INT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'resolved', 'locked')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thread_posts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    thread_id INT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_post_id INT NULL REFERENCES thread_posts(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_votes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id INT NOT NULL REFERENCES thread_posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id INT NULL REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL
        CHECK (type IN ('reply', 'accepted_answer', 'mention')),
    thread_id INT NULL REFERENCES threads(id) ON DELETE CASCADE,
    post_id INT NULL REFERENCES thread_posts(id) ON DELETE CASCADE,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Migration 3: Flashcard Decks, Cards (Leitner Boxes) and Review History
-- =============================================================================

CREATE TABLE IF NOT EXISTS decks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INT NULL REFERENCES modules(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    deck_id INT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    source_question_id INT NULL REFERENCES questions(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    box SMALLINT NOT NULL DEFAULT 1
        CHECK (box BETWEEN 1 AND 5),
    next_review DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS card_reviews (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    flashcard_id INT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    knew_it BOOLEAN NOT NULL,
    previous_box SMALLINT NOT NULL CHECK (previous_box BETWEEN 1 AND 5),
    new_box SMALLINT NOT NULL CHECK (new_box BETWEEN 1 AND 5),
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Migration 004: Performance & Full-Text Search Indexes
-- =============================================================================

-- Core academic & QCM lookups
CREATE INDEX IF NOT EXISTS idx_modules_year_id ON modules (year_id);
CREATE INDEX IF NOT EXISTS idx_lectures_module_id ON lectures (module_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_lecture_id ON course_materials (lecture_id);
CREATE INDEX IF NOT EXISTS idx_sources_module_id ON sources (module_id);
CREATE INDEX IF NOT EXISTS idx_sources_lecture_id ON sources (lecture_id);
CREATE INDEX IF NOT EXISTS idx_questions_source_id ON questions (source_id);
CREATE INDEX IF NOT EXISTS idx_options_question_id ON options (question_id);
CREATE INDEX IF NOT EXISTS idx_qcm_attempts_user_source ON qcm_attempts (user_id, source_id);

-- Discussion threads & notifications
CREATE INDEX IF NOT EXISTS idx_threads_context ON threads (context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_threads_pinned_created ON threads (is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_status ON threads (status);
CREATE INDEX IF NOT EXISTS idx_threads_fulltext ON threads
    USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, '')));
CREATE INDEX IF NOT EXISTS idx_thread_posts_thread_parent ON thread_posts (thread_id, parent_post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read, created_at DESC);

-- Flashcards spaced repetition
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks (user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_due ON flashcards (deck_id, next_review);
CREATE INDEX IF NOT EXISTS idx_card_reviews_user_card ON card_reviews (user_id, flashcard_id);
