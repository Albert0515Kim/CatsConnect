import { supabaseAdmin } from '../config/supabase.js';

export async function listFriendRequests(req, res) {
  const { user } = req;

  const { data, error } = await supabaseAdmin
    .from('friend_requests')
    .select('*')
    .or(`recipient_id.eq.${user.id},requester_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ requests: data });
}

export async function listFriends(req, res) {
  const { user } = req;

  const { data, error } = await supabaseAdmin
    .from('friendships')
    .select('friend_id')
    .eq('user_id', user.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ friends: data.map((row) => row.friend_id) });
}

export async function sendFriendRequest(req, res) {
  const { user } = req;
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(400).json({ error: 'recipientId is required.' });
  }

  const { data, error } = await supabaseAdmin
    .from('friend_requests')
    .insert({ requester_id: user.id, recipient_id: recipientId, status: 'pending' })
    .select('*')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ request: data });
}

export async function acceptFriendRequest(req, res) {
  const { user } = req;
  const { requestId } = req.params;

  const { data: request, error: requestError } = await supabaseAdmin
    .from('friend_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId)
    .eq('recipient_id', user.id)
    .select('*')
    .single();

  if (requestError) {
    return res.status(400).json({ error: requestError.message });
  }

  const friendshipRows = [
    { user_id: request.requester_id, friend_id: request.recipient_id },
    { user_id: request.recipient_id, friend_id: request.requester_id },
  ];

  const { error: friendshipError } = await supabaseAdmin.from('friendships').upsert(friendshipRows);

  if (friendshipError) {
    return res.status(400).json({ error: friendshipError.message });
  }

  return res.status(200).json({ request });
}

export async function declineFriendRequest(req, res) {
  const { user } = req;
  const { requestId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('friend_requests')
    .update({ status: 'declined' })
    .eq('id', requestId)
    .eq('recipient_id', user.id)
    .select('*')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ request: data });
}

export async function removeFriend(req, res) {
  const { user } = req;
  const { friendId } = req.params;

  if (!friendId) {
    return res.status(400).json({ error: 'friendId is required.' });
  }

  const { error } = await supabaseAdmin
    .from('friendships')
    .delete()
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`,
    );

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}

export async function cancelFriendRequest(req, res) {
  const { user } = req;
  const { recipientId } = req.params;

  if (!recipientId) {
    return res.status(400).json({ error: 'recipientId is required.' });
  }

  const { error } = await supabaseAdmin
    .from('friend_requests')
    .delete()
    .eq('requester_id', user.id)
    .eq('recipient_id', recipientId)
    .eq('status', 'pending');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
