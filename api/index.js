import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // Cabeceras CORS para evitar bloqueos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    const { key, hwid } = req.query;

    if (!key || !hwid) {
        return res.status(400).json({ success: false, message: 'Falta la clave o el HWID' });
    }

    const { data: keyData, error } = await supabase
        .from('keys')
        .select('*')
        .eq('key_code', key)
        .single();

    if (error || !keyData) {
        return res.status(404).json({ success: false, message: 'Clave invalida' });
    }

    if (!keyData.is_active) {
        return res.status(403).json({ success: false, message: 'Clave desactivada' });
    }

    if (!keyData.hwid) {
        await supabase.from('keys').update({ hwid: hwid }).eq('key_code', key);
    } else if (keyData.hwid !== hwid) {
        return res.status(401).json({ success: false, message: 'La clave pertenece a otro dispositivo' });
    }

    return res.status(200).json({ success: true, message: 'Acceso concedido' });
}
