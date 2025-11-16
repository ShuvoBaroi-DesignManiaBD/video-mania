import { supabase } from '@/lib/supabase';

export type ContentRecord = {
  contentGenerated: boolean;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
  updatedAt?: string;
  createdAt?: string;
};

export const ContentStore = {
  async get(filename: string): Promise<ContentRecord> {
    try {
      const { data, error } = await supabase
        .from('video_content')
        .select('*')
        .eq('filename', filename)
        .maybeSingle();

      if (error) {
        // PGRST116: No rows found; but .maybeSingle avoids throwing
        return { contentGenerated: false };
      }

      if (!data) return { contentGenerated: false };

      return {
        contentGenerated: !!data.content_generated,
        title: data.title || undefined,
        description: data.description || undefined,
        meta: (data.meta as Record<string, unknown>) || {},
        updatedAt: data.updated_at,
        createdAt: data.created_at,
      };
    } catch {
      return { contentGenerated: false };
    }
  },

  async set(filename: string, record: Partial<ContentRecord>): Promise<ContentRecord> {
    const updateData: Partial<Record<string, unknown>> & { filename: string } = {
      filename,
    };
    if (record.title !== undefined) updateData.title = record.title;
    if (record.description !== undefined) updateData.description = record.description;
    if (record.contentGenerated !== undefined) updateData.content_generated = record.contentGenerated;
    if (record.meta !== undefined) updateData.meta = record.meta as Record<string, unknown>;

    const { data, error } = await supabase
      .from('video_content')
      .upsert(updateData, { onConflict: 'filename', ignoreDuplicates: false })
      .select()
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to upsert content');
    }

    return {
      contentGenerated: !!data.content_generated,
      title: data.title || undefined,
      description: data.description || undefined,
      meta: (data.meta as Record<string, unknown>) || {},
      updatedAt: data.updated_at,
      createdAt: data.created_at,
    };
  },
};