import path from 'path';
import { supabaseAdmin } from '../config/supabase.js';

export async function listProfiles(req, res) {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ profiles: data });
}

export async function getProfile(req, res) {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  return res.status(200).json({ profile: data });
}

export async function updateProfile(req, res) {
  const { user } = req;
  const updates = req.body;

  const payload = {
    ...updates,
    id: user.id,
  };

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(payload)
    .select('*')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ profile: data });
}

export async function uploadProfileImage(req, res) {
  const { user } = req;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const avatarBucket = process.env.SUPABASE_AVATAR_BUCKET || 'avatars';
  const fileExt = path.extname(file.originalname) || '.jpg';
  const filePath = `${user.id}/${Date.now()}${fileExt}`;

   // Ensure bucket exists (idempotent)
   const { error: bucketError } = await supabaseAdmin.storage.createBucket(avatarBucket, {
     public: true,
   });
   if (bucketError && !bucketError.message?.includes('already exists')) {
     return res.status(400).json({ error: bucketError.message });
   }

  const { error: uploadError } = await supabaseAdmin.storage
    .from(avatarBucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype || 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    return res.status(400).json({ error: uploadError.message });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(avatarBucket)
    .getPublicUrl(filePath);
  const imageUrl = publicUrlData?.publicUrl;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ image_url: imageUrl })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ profile: data, imageUrl });
}
