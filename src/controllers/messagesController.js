import { supabaseAdmin } from '../config/supabase.js';

export async function listConversations(req, res) {
  const { user } = req;

  const { data, error } = await supabaseAdmin
    .from('conversation_members')
    .select('conversation_id')
    .eq('member_id', user.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ conversations: data.map((row) => row.conversation_id) });
}

export async function startConversation(req, res) {
  const { user } = req;
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ error: 'memberId is required.' });
  }

  const { data: conversation, error: conversationError } = await supabaseAdmin
    .from('conversations')
    .insert({})
    .select('*')
    .single();

  if (conversationError) {
    return res.status(400).json({ error: conversationError.message });
  }

  const members = [
    { conversation_id: conversation.id, member_id: user.id },
    { conversation_id: conversation.id, member_id: memberId },
  ];

  const { error: membersError } = await supabaseAdmin.from('conversation_members').insert(members);

  if (membersError) {
    return res.status(400).json({ error: membersError.message });
  }

  return res.status(201).json({ conversation });
}

export async function listMessages(req, res) {
  const { conversationId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ messages: data });
}

export async function sendMessage(req, res) {
  const { user } = req;
  const { conversationId } = req.params;
  const { body } = req.body;

  if (!body) {
    return res.status(400).json({ error: 'Message body is required.' });
  }

  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body,
    })
    .select('*')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ message: data });
}
