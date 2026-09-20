const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  // Configuración de cabeceras para Roblox
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { key, hwid } = req.query;

  if (!key) {
    return res.status(400).json({ success: false, message: 'Falta la key' });
  }

  try {
    // 1. Validar la clave en Supabase
    const { data: keyData, error } = await supabase
      .from('keys')
      .select('*')
      .eq('key_code', key)
      .single();

    if (error || !keyData) {
      return res.status(401).json({ success: false, message: 'Clave invalida' });
    }

    if (!keyData.is_active) {
      return res.status(403).json({ success: false, message: 'Clave desactivada' });
    }

    // 2. Verificar o vincular el HWID del dispositivo
    if (!keyData.hwid) {
      await supabase
        .from('keys')
        .update({ hwid: hwid })
        .eq('key_code', key);
    } else if (keyData.hwid !== hwid) {
      return res.status(403).json({ success: false, message: 'Key usada en otro PC' });
    }

    // 3. Leer el script directamente desde el archivo script.lua
    const filePath = path.join(process.cwd(), 'script.lua');
    const myMainScript = fs.readFileSync(filePath, 'utf8');

    // 4. Enviar el script a Roblox
    return res.status(200).json({
      success: true,
      message: 'Acceso concedido',
      script: myMainScript
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
