/*
  # Create messages table for chat application

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text, message content)
      - `user_id` (uuid, references auth.users)
      - `user_email` (text, user's email)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Authenticated users can read all messages
      - Authenticated users can insert their own messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all messages
CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own messages
CREATE POLICY "Users can create their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);