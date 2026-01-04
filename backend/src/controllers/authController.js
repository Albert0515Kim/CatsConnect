import { supabase, supabaseAdmin } from '../config/supabase.js';

export async function signup(req, res) {
  const { email, password, firstName, lastName, username, major1, major2, gradYear } = req.body;

  if (!email || !password || !firstName || !lastName || !username) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      username,
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const profilePayload = {
    id: data.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
    username,
    major1: major1 || null,
    major2: major2 || null,
    grad_year: gradYear || null,
  };

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(profilePayload);

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  return res.status(201).json({ user: data.user });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({
    user: data.user,
    session: data.session,
  });
}

export async function me(req, res) {
  const { user } = req;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  return res.status(200).json({ user, profile: data });
}
