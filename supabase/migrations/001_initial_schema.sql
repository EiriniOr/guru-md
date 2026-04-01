-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text,
  year_of_study int,
  country text not null default 'SE',
  created_at timestamptz not null default now()
);

-- Learning paths (seeded, read-only for users)
create table learning_paths (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null default '📚',
  specialty text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Modules
create table modules (
  id uuid primary key default uuid_generate_v4(),
  path_id uuid not null references learning_paths(id) on delete cascade,
  title text not null,
  description text not null,
  content_md text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- User progress
create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  path_id uuid not null references learning_paths(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  completed_at timestamptz,
  unique(user_id, module_id)
);

-- Chat sessions
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  module_id uuid references modules(id) on delete set null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

-- Chat messages
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

-- Quiz attempts
create table quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  questions jsonb not null,
  answers jsonb not null default '[]',
  score int not null default 0,
  total int not null default 0,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Activity log
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  event_type text not null check (event_type in ('module_viewed','quiz_completed','path_started','message_sent')),
  entity_id uuid,
  entity_type text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table quiz_attempts enable row level security;
alter table activity_log enable row level security;

-- Profiles
create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

-- User progress
create policy "users manage own progress" on user_progress for all using (auth.uid() = user_id);

-- Chat sessions
create policy "users manage own sessions" on chat_sessions for all using (auth.uid() = user_id);

-- Chat messages (via session ownership)
create policy "users manage own messages" on chat_messages for all
  using (exists (select 1 from chat_sessions where chat_sessions.id = chat_messages.session_id and chat_sessions.user_id = auth.uid()));

-- Quiz attempts
create policy "users manage own attempts" on quiz_attempts for all using (auth.uid() = user_id);

-- Activity log
create policy "users manage own activity" on activity_log for all using (auth.uid() = user_id);

-- Learning paths & modules: public read
create policy "public read paths" on learning_paths for select using (true);
create policy "public read modules" on modules for select using (true);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
