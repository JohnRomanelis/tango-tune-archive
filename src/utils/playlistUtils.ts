import { supabase } from "@/integrations/supabase/client";

export const updateTandasVisibility = async (playlistId: number, visibility: 'public' | 'private') => {
  const { data: tandas, error: fetchError } = await supabase
    .from('playlist_tanda')
    .select('tanda_id')
    .eq('playlist_id', playlistId);

  if (fetchError) throw fetchError;

  if (tandas && tandas.length > 0) {
    const tandaIds = tandas.map(t => t.tanda_id);
    const { error: updateError } = await supabase
      .from('tanda')
      .update({ visibility })
      .in('id', tandaIds);

    if (updateError) throw updateError;
  }
};