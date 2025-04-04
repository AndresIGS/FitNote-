import { supabase } from '@/lib/supabase';

export const agregarProgreso = async (userId, peso, masaMuscular, imc) => {
  const { data, error } = await supabase
    .from('progreso')
    .insert([{ user_id: userId, peso, masa_muscular: masaMuscular, imc }]);

  if (error) {
    console.error('Error al guardar progreso:', error);
    return null;
  } else {
    console.log('Progreso guardado:', data);
    return data;
  }
};
