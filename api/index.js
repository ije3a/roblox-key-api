import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // Permitir conexiones desde Roblox
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
    // 1. Buscar la clave en Supabase
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

    // 2. Verificar y vincular HWID
    if (!keyData.hwid) {
      await supabase
        .from('keys')
        .update({ hwid: hwid })
        .eq('key_code', key);
    } else if (keyData.hwid !== hwid) {
      return res.status(403).json({ success: false, message: 'Key usada en otro PC' });
    }

    // 3. AQUÍ GUARDASTE TU SCRIPT PROTEGIDO
    // Este código NUNCA se enviará si la clave es falsa o no existe.
    const myMainScript = String.raw`
--!nocheck
-- ============================================================
-- m1n3l1s HUB x CRIM KALETH | GUI m1n3l1s con KEY + funciones CRIM
-- Generado: combinacion automatica | GUI = m1n3l1s (con key Vercel+HWID) | Funciones = crim kaleth
-- Uso: pega DIRECTO en tu executor (Delta/Potassium/Solara/Wave)
-- Tecla GUI: F1 (original crim) | Key: la misma de tu GUI m1n3l1s
-- ============================================================

--[[ 
    m1n3l1s UI Lib v1 | Top Tabs | Delta / Potassium / Solara / Wave
    Pegar DIRECTO en el executor. Sin loadstring, sin dependencias.
    
    Ejemplo de uso abajo del todo (descomenta para probar).
]]

-- CONFIG IMAGEN LOGO (gatito)
-- Pega tu ID aqui cuando subas la imagen a Roblox. Ejemplo: "rbxassetid://123456789"
-- Como subirla en 1 min: Roblox Creator Hub > Creations > Images > Upload > Copy ID
if getgenv == nil then getgenv = function() return _G end end
-- FIX: "" es truthy en Lua, por eso el OR no actualizaba. Forzamos el nuevo ID si esta vacio.
do
    local NEW_ID = "rbxassetid://140222654396949"
    local cur = nil
    pcall(function() cur = getgenv().m1n3l1s_LogoImage end)
    if cur == nil or cur == "" then
        pcall(function() getgenv().m1n3l1s_LogoImage = NEW_ID end)
    else
        -- Si ya tenia un ID viejo vacio o distinto, actualiza al nuevo
        if cur ~= NEW_ID then
            pcall(function() getgenv().m1n3l1s_LogoImage = NEW_ID end)
        end
    end
end

local m1n3l1sLib = {}
m1n3l1sLib.__index = m1n3l1sLib

-- Servicios
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")
local LocalPlayer = Players.LocalPlayer

-- CONFIG KEY SYSTEM (Vercel + HWID)
do
    local NEW_API = "https://roblox-key-api.vercel.app/api"
    local cur = nil
    pcall(function() cur = getgenv().m1n3l1s_KeyAPI end)
    if cur ~= NEW_API then
        pcall(function() getgenv().m1n3l1s_KeyAPI = NEW_API end)
    end
end

local TweenFast = TweenInfo.new(0.07, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

-- Parent seguro para executors
local function getParent()
    local ok, hui = pcall(function() return (gethui and gethui()) end)
    if ok and hui then return hui end
    local ok2, hidden = pcall(function() return (get_hidden_gui and get_hidden_gui()) end)
    if ok2 and hidden then return hidden end
    pcall(function() return game:GetService("CoreGui") end)
    return LocalPlayer:WaitForChild("PlayerGui")
end

-- Limpia GUI vieja si re-ejecutas
pcall(function()
    local p = getParent()
    local old = p:FindFirstChild("m1n3l1s_UI")
    if old then old:Destroy() end
end)

-- Tema (negro absoluto + medio transparente)
local Themes = {
    Dark = {
        BG = Color3.fromRGB(0,0,0),
        Top = Color3.fromRGB(0,0,0),
        Page = Color3.fromRGB(0,0,0),
        Element = Color3.fromRGB(0,0,0),
        Stroke = Color3.fromRGB(80,80,80),
        Accent = Color3.fromRGB(0,140,255),
        Text = Color3.fromRGB(255,255,255),
        Dim = Color3.fromRGB(170,170,170),
        TranspMain = 0.4,
        TranspElem = 0.3,
    },
    Rojo = {
        BG = Color3.fromRGB(18,12,12),
        Top = Color3.fromRGB(30,15,15),
        Page = Color3.fromRGB(20,14,14),
        Element = Color3.fromRGB(35,20,20),
        Stroke = Color3.fromRGB(70,30,30),
        Accent = Color3.fromRGB(255,45,60),
        Text = Color3.fromRGB(255,255,255),
        Dim = Color3.fromRGB(180,150,150),
    },
}

-- Notificaciones simples (global)
function m1n3l1sLib:Notify(titulo, texto, duracion)
    duracion = duracion or 3
    local parent = getParent()
    local gui = parent:FindFirstChild("m1n3l1s_UI_Notify")
    if not gui then
        gui = Instance.new("ScreenGui")
        gui.Name = "m1n3l1s_UI_Notify"
        gui.ResetOnSpawn = false
        gui.IgnoreGuiInset = true
        gui.DisplayOrder = 999
        gui.Parent = parent
    end
    local f = Instance.new("Frame")
    f.Size = UDim2.fromOffset(260, 70)
    f.Position = UDim2.new(1, -280, 1, -90)
    f.BackgroundColor3 = Color3.fromRGB(0,0,0)
    f.BackgroundTransparency = 0.35
    f.BorderSizePixel = 0
    f.Parent = gui
    Instance.new("UICorner", f).CornerRadius = UDim.new(0, 8)
    local s = Instance.new("UIStroke", f)
    s.Color = Color3.fromRGB(80,80,80)
    s.Thickness = 1

    local t = Instance.new("TextLabel", f)
    t.Text = tostring(titulo or "Aviso")
    t.Size = UDim2.new(1,-20,0,22)
    t.Position = UDim2.fromOffset(10,6)
    t.BackgroundTransparency = 1
    t.TextColor3 = Color3.new(1,1,1)
    t.Font = Enum.Font.GothamBold
    t.TextSize = 13
    t.TextXAlignment = Enum.TextXAlignment.Left

    local d = Instance.new("TextLabel", f)
    d.Text = tostring(texto or "")
    d.Size = UDim2.new(1,-20,0,36)
    d.Position = UDim2.fromOffset(10,28)
    d.BackgroundTransparency = 1
    d.TextColor3 = Color3.fromRGB(180,180,190)
    d.Font = Enum.Font.Gotham
    d.TextSize = 12
    d.TextXAlignment = Enum.TextXAlignment.Left
    d.TextYAlignment = Enum.TextYAlignment.Top
    d.TextWrapped = true

    task.spawn(function()
        task.wait(duracion)
        pcall(function()
            TweenService:Create(f, TweenFast, {BackgroundTransparency = 1}):Play()
            task.wait(0.1)
            f:Destroy()
        end)
    end)
end

-- Pantalla de carga FULLSCREEN gris + logo + KEY por servidor (sale cada que ejecutas)
-- Keys validadas en Vercel con HWID. La key local "wasd" ya no se usa.
function m1n3l1sLib:ShowLoading(titulo)
    titulo = titulo or "m1n3l1s HUB"
    local parent = getParent()
    pcall(function()
        local old = parent:FindFirstChild("m1n3l1s_Loading")
        if old then old:Destroy() end
    end)
    local gui = Instance.new("ScreenGui")
    gui.Name = "m1n3l1s_Loading"
    gui.ResetOnSpawn = false
    gui.IgnoreGuiInset = true
    gui.DisplayOrder = 500
    gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    gui.Parent = parent

    -- Fondo gris transparente TODA la pantalla
    local dim = Instance.new("Frame", gui)
    dim.Name = "Dim"
    dim.Size = UDim2.fromScale(1, 1)
    dim.BackgroundColor3 = Color3.fromRGB(128, 128, 128)
    dim.BackgroundTransparency = 0.4
    dim.BorderSizePixel = 0

    -- Tarjeta central negra
    local bg = Instance.new("Frame", gui)
    bg.Size = UDim2.fromOffset(300, 270)
    bg.Position = UDim2.fromScale(0.5, 0.5)
    bg.AnchorPoint = Vector2.new(0.5, 0.5)
    bg.BackgroundColor3 = Color3.fromRGB(0,0,0)
    bg.BackgroundTransparency = 0.25
    bg.BorderSizePixel = 0
    Instance.new("UICorner", bg).CornerRadius = UDim.new(0, 12)
    local st = Instance.new("UIStroke", bg)
    st.Color = Color3.fromRGB(90,90,90)
    st.Thickness = 1

    -- Logo gatito en circulo (cuando aprueben la imagen sale solo, mientras sale M)
    local logo = Instance.new("Frame", bg)
    logo.Size = UDim2.fromOffset(90, 90)
    logo.Position = UDim2.new(0.5, -45, 0, 14)
    logo.BackgroundColor3 = Color3.fromRGB(20,20,20)
    logo.BackgroundTransparency = 0.1
    logo.BorderSizePixel = 0
    logo.ClipsDescendants = true
    Instance.new("UICorner", logo).CornerRadius = UDim.new(1, 0)
    local lst = Instance.new("UIStroke", logo)
    lst.Color = Color3.new(1,1,1)
    lst.Thickness = 2
    lst.Transparency = 0.2

    local m = Instance.new("TextLabel", logo)
    m.Name = "FallbackM"
    m.Size = UDim2.fromScale(1, 1)
    m.BackgroundTransparency = 1
    m.Text = "M"
    m.TextColor3 = Color3.new(1,1,1)
    m.Font = Enum.Font.GothamBold
    m.TextSize = 44
    m.ZIndex = 1

    do
        local DEFAULT_LOGO = "rbxassetid://140222654396949"
        local imgId = DEFAULT_LOGO
        pcall(function()
            local g = getgenv and getgenv().m1n3l1s_LogoImage
            if g ~= nil and g ~= "" then imgId = g end
        end)
        pcall(function()
            local im = Instance.new("ImageLabel")
            im.Name = "LogoImg"
            im.Size = UDim2.fromScale(1, 1)
            im.BackgroundTransparency = 1
            im.BorderSizePixel = 0
            im.Image = imgId
            im.ScaleType = Enum.ScaleType.Crop
            im.ZIndex = 2
            Instance.new("UICorner", im).CornerRadius = UDim.new(1, 0)
            im.Parent = logo
        end)
    end

    local t = Instance.new("TextLabel", bg)
    t.Size = UDim2.new(1, 0, 0, 30)
    t.Position = UDim2.fromOffset(0, 108)
    t.BackgroundTransparency = 1
    t.Text = titulo
    t.TextColor3 = Color3.new(1,1,1)
    t.Font = Enum.Font.GothamBold
    t.TextSize = 20

    local sub = Instance.new("TextLabel", bg)
    sub.Size = UDim2.new(1, 0, 0, 18)
    sub.Position = UDim2.fromOffset(0, 138)
    sub.BackgroundTransparency = 1
    sub.Text = "Pon tu key para entrar"
    sub.TextColor3 = Color3.fromRGB(180,180,180)
    sub.Font = Enum.Font.Gotham
    sub.TextSize = 12

    -- Caja key
    local keyBoxFrame = Instance.new("Frame", bg)
    keyBoxFrame.Size = UDim2.new(1, -40, 0, 34)
    keyBoxFrame.Position = UDim2.new(0, 20, 0, 160)
    keyBoxFrame.BackgroundColor3 = Color3.fromRGB(20,20,20)
    keyBoxFrame.BackgroundTransparency = 0.2
    keyBoxFrame.BorderSizePixel = 0
    Instance.new("UICorner", keyBoxFrame).CornerRadius = UDim.new(0, 7)
    local ks = Instance.new("UIStroke", keyBoxFrame)
    ks.Color = Color3.fromRGB(90,90,90)
    ks.Thickness = 1

    local keyBox = Instance.new("TextBox", keyBoxFrame)
    keyBox.Size = UDim2.new(1, -20, 1, 0)
    keyBox.Position = UDim2.fromOffset(10, 0)
    keyBox.BackgroundTransparency = 1
    keyBox.PlaceholderText = "Key aqui..."
    keyBox.Text = ""
    keyBox.TextColor3 = Color3.new(1,1,1)
    keyBox.PlaceholderColor3 = Color3.fromRGB(130,130,130)
    keyBox.Font = Enum.Font.Gotham
    keyBox.TextSize = 13
    keyBox.TextXAlignment = Enum.TextXAlignment.Center
    keyBox.ClearTextOnFocus = false

    local goBtn = Instance.new("TextButton", bg)
    goBtn.Size = UDim2.new(1, -40, 0, 32)
    goBtn.Position = UDim2.new(0, 20, 0, 202)
    goBtn.BackgroundColor3 = Color3.fromRGB(0,140,255)
    goBtn.Text = "Entrar"
    goBtn.TextColor3 = Color3.new(1,1,1)
    goBtn.Font = Enum.Font.GothamBold
    goBtn.TextSize = 13
    Instance.new("UICorner", goBtn).CornerRadius = UDim.new(0, 7)

    local passed = false
    local checking = false
    local function getHWID()
        local id = ""
        pcall(function()
            if gethwid then id = gethwid()
            elseif get_hwid then id = get_hwid()
            else id = game:GetService("RbxAnalyticsService"):GetClientId() end
        end)
        return tostring(id)
    end
    local function doRequest(url)
        local fn = ((syn and syn.request) or (http and http.request) or http_request or request or (fluxus and fluxus.request))
        if fn then
            return pcall(function() return fn({Url = url, Method = "GET"}) end)
        end
        return false, nil
    end
    local function check()
        if passed or checking then return end
        local inputKey = tostring(keyBox.Text or "")
        pcall(function() inputKey = string.gsub(inputKey, "%s+", "") end)
        if inputKey == "" or inputKey == nil then
            sub.Text = "Ingresa una key"
            sub.TextColor3 = Color3.fromRGB(255,180,80)
            return
        end
        checking = true
        goBtn.Text = "..."
        sub.Text = "Verificando..."
        sub.TextColor3 = Color3.fromRGB(180,180,180)
        task.spawn(function()
            local hwid = getHWID()
            local apiBase = ""
            pcall(function() apiBase = getgenv().m1n3l1s_KeyAPI end)
            if apiBase == "" or apiBase == nil then apiBase = "https://roblox-key-api.vercel.app/api" end
            local apiURL = apiBase .. "?key=" .. tostring(inputKey) .. "&hwid=" .. hwid
            local ok, response = doRequest(apiURL)
            if ok and response and response.StatusCode == 200 then
                local good, data = pcall(function() return HttpService:JSONDecode(response.Body) end)
                if good and data and data.success then
                    passed = true
                    sub.Text = "Acceso concedido!"
                    sub.TextColor3 = Color3.fromRGB(60,255,120)
                    print("[Key System] Autenticado con exito.")
                    pcall(function()
                        game:GetService("StarterGui"):SetCore("SendNotification", {
                            Title = "Whitelist Concedida",
                            Text = "Acceso correcto. Cargando panel...",
                            Duration = 5
                        })
                    end)
                    task.wait(1)
                    pcall(function() gui:Destroy() end)
                    return
                else
                    local msg = "Clave invalida"
                    pcall(function() if data and data.message then msg = tostring(data.message) end end)
                    sub.Text = msg
                    sub.TextColor3 = Color3.fromRGB(255,80,80)
                    pcall(function()
                        game:GetService("StarterGui"):SetCore("SendNotification", {
                            Title = "Error de Key",
                            Text = msg,
                            Duration = 5
                        })
                    end)
                end
            else
                local shown = false
                pcall(function()
                    local data2 = HttpService:JSONDecode(response.Body)
                    if data2 and data2.message then
                        sub.Text = tostring(data2.message)
                        shown = true
                    end
                end)
                if not shown then
                    local code = "?"
                    pcall(function() code = tostring(response.StatusCode) end)
                    if ok and response then
                        sub.Text = "Error HTTP " .. code
                    else
                        sub.Text = "Error de conexion"
                    end
                end
                sub.TextColor3 = Color3.fromRGB(255,80,80)
                warn("[m1n3l1s] Error key API")
            end
            checking = false
            goBtn.Text = "Entrar"
        end)
    end
    goBtn.MouseButton1Click:Connect(check)
    keyBox.FocusLost:Connect(function(enter) if enter then check() end end)

    -- Espera hasta key correcta (sin %)
    repeat task.wait() until passed
end

-- Limpieza: cierra GUI y loading (libreria pura, sin hacks)
function m1n3l1sLib:Shutdown()
    pcall(function()
        local parent = getParent()
        for _, n in ipairs({"m1n3l1s_UI", "m1n3l1s_UI_Notify", "m1n3l1s_Loading"}) do
            local g = parent:FindFirstChild(n)
            if g then g:Destroy() end
        end
    end)
end

-- Crear ventana
function m1n3l1sLib:CreateWindow(opts)
    opts = opts or {}
    local name = opts.Name or "m1n3l1s HUB"
    local subtitle = opts.SubTitle or ""
    local theme = Themes[opts.Theme] or Themes.Dark
    local toggleKey = opts.ToggleKey or Enum.KeyCode.K

    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "m1n3l1s_UI"
    ScreenGui.ResetOnSpawn = false
    ScreenGui.IgnoreGuiInset = true
    ScreenGui.DisplayOrder = 100
    ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    ScreenGui.Parent = getParent()

    -- Ventana principal (negro absoluto + transparente)
    local Main = Instance.new("Frame")
    Main.Name = "Main"
    Main.Size = UDim2.fromOffset(520, 340)
    Main.Position = UDim2.fromScale(0.5, 0.5)
    Main.AnchorPoint = Vector2.new(0.5, 0.5)
    Main.BackgroundColor3 = theme.BG
    Main.BackgroundTransparency = theme.TranspMain or 0.4
    Main.BorderSizePixel = 0
    Main.ClipsDescendants = true
    Main.Parent = ScreenGui
    Instance.new("UICorner", Main).CornerRadius = UDim.new(0, 10)
    local mainStroke = Instance.new("UIStroke", Main)
    mainStroke.Color = theme.Stroke
    mainStroke.Thickness = 1
    pcall(function() mainStroke.Transparency = 0.2 end)

    -- TopBar
    local TopBar = Instance.new("Frame", Main)
    TopBar.Name = "TopBar"
    TopBar.Size = UDim2.new(1, 0, 0, 38)
    TopBar.BackgroundColor3 = theme.Top
    TopBar.BackgroundTransparency = theme.TranspMain or 0.4
    TopBar.BorderSizePixel = 0
    Instance.new("UICorner", TopBar).CornerRadius = UDim.new(0, 10)

    -- Fix esquinas de abajo del TopBar
    local fix = Instance.new("Frame", TopBar)
    fix.Size = UDim2.new(1, 0, 0, 10)
    fix.Position = UDim2.new(0, 0, 1, -10)
    fix.BackgroundColor3 = theme.Top
    fix.BackgroundTransparency = theme.TranspMain or 0.4
    fix.BorderSizePixel = 0

    local Title = Instance.new("TextLabel", TopBar)
    Title.Text = name .. (subtitle ~= "" and "  |  " .. subtitle or "")
    Title.Size = UDim2.new(1, -90, 1, 0)
    Title.Position = UDim2.fromOffset(12, 0)
    Title.BackgroundTransparency = 1
    Title.TextColor3 = theme.Text
    Title.Font = Enum.Font.GothamBold
    Title.TextSize = 13
    Title.TextXAlignment = Enum.TextXAlignment.Left
    pcall(function() Title.TextTruncate = Enum.TextTruncate.AtEnd end)

    -- Boton minimizar
    local MinBtn = Instance.new("TextButton", TopBar)
    MinBtn.Text = "-"
    MinBtn.Size = UDim2.fromOffset(28, 24)
    MinBtn.Position = UDim2.new(1, -66, 0.5, -12)
    MinBtn.BackgroundColor3 = theme.Element
    MinBtn.BackgroundTransparency = theme.TranspElem or 0.3
    MinBtn.TextColor3 = theme.Text
    MinBtn.Font = Enum.Font.GothamBold
    MinBtn.TextSize = 16
    Instance.new("UICorner", MinBtn).CornerRadius = UDim.new(0, 6)

    -- Boton cerrar
    local CloseBtn = Instance.new("TextButton", TopBar)
    CloseBtn.Text = "X"
    CloseBtn.Size = UDim2.fromOffset(28, 24)
    CloseBtn.Position = UDim2.new(1, -34, 0.5, -12)
    CloseBtn.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    CloseBtn.BackgroundTransparency = theme.TranspElem or 0.3
    CloseBtn.TextColor3 = Color3.fromRGB(255, 60, 60)
    CloseBtn.Font = Enum.Font.GothamBold
    CloseBtn.TextSize = 12
    Instance.new("UICorner", CloseBtn).CornerRadius = UDim.new(0, 6)

    -- ===== TABS ARRIBA (horizontal) =====
    local TabBar = Instance.new("ScrollingFrame", Main)
    TabBar.Name = "TabBar"
    TabBar.Size = UDim2.new(1, -20, 0, 36)
    TabBar.Position = UDim2.fromOffset(10, 44)
    TabBar.BackgroundTransparency = 1
    TabBar.ScrollBarThickness = 0
    TabBar.ScrollingDirection = Enum.ScrollingDirection.X
    TabBar.CanvasSize = UDim2.new(0,0,0,0)
    pcall(function() TabBar.AutomaticCanvasSize = Enum.AutomaticSize.X end)

    local TabLayout = Instance.new("UIListLayout", TabBar)
    TabLayout.FillDirection = Enum.FillDirection.Horizontal
    TabLayout.Padding = UDim.new(0, 6)
    TabLayout.SortOrder = Enum.SortOrder.LayoutOrder
    TabLayout.VerticalAlignment = Enum.VerticalAlignment.Center

    -- Contenedor paginas (usa escala -> se adapta solo al redimensionar)
    local PageHolder = Instance.new("Frame", Main)
    PageHolder.Name = "Pages"
    PageHolder.Size = UDim2.new(1, -20, 1, -92)
    PageHolder.Position = UDim2.fromOffset(10, 84)
    PageHolder.BackgroundColor3 = theme.Page
    PageHolder.BackgroundTransparency = theme.TranspMain or 0.4
    PageHolder.BorderSizePixel = 0
    PageHolder.ClipsDescendants = true
    Instance.new("UICorner", PageHolder).CornerRadius = UDim.new(0, 8)

    -- Limites de tamaÃ±o (sin UISizeConstraint para maxima compatibilidad)
    local MinSize = Vector2.new(340, 230)
    local MaxSize = Vector2.new(750, 550)

    -- ===== FLECHITA RESIZE ABAJO-DERECHA =====
    local ResizeHandle = Instance.new("TextButton", Main)
    ResizeHandle.Name = "Resize"
    ResizeHandle.Text = ""
    ResizeHandle.Size = UDim2.fromOffset(28, 28)
    ResizeHandle.Position = UDim2.new(1, -28, 1, -28)
    ResizeHandle.BackgroundTransparency = 1
    ResizeHandle.TextColor3 = theme.Dim
    ResizeHandle.Font = Enum.Font.GothamBold
    ResizeHandle.TextSize = 16
    ResizeHandle.AutoButtonColor = false
    ResizeHandle.ZIndex = 20

    local minimized = false
    local oldSize = Main.Size
    -- Resize drag (PC + Tactil)
    local resizing = false
    local resizeStartPos, sizeStart, windowPosStart = nil, nil, nil
    ResizeHandle.InputBegan:Connect(function(input)
        if minimized then return end
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            resizing = true
            resizeStartPos = input.Position
            sizeStart = Vector2.new(Main.Size.X.Offset, Main.Size.Y.Offset)
            windowPosStart = Main.Position
            ResizeHandle.TextColor3 = theme.Text
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    resizing = false
                    ResizeHandle.TextColor3 = theme.Dim
                end
            end)
        end
    end)
    UserInputService.InputChanged:Connect(function(input)
        if resizing and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
            local delta = input.Position - resizeStartPos
            local newW = math.clamp(sizeStart.X + delta.X, MinSize.X, MaxSize.X)
            local newH = math.clamp(sizeStart.Y + delta.Y, MinSize.Y, MaxSize.Y)
            Main.Size = UDim2.fromOffset(newW, newH)
            -- Mantiene esquina superior-izquierda fija (crece hacia abajo-derecha)
            local dW, dH = newW - sizeStart.X, newH - sizeStart.Y
            Main.Position = UDim2.new(windowPosStart.X.Scale, windowPosStart.X.Offset + dW/2, windowPosStart.Y.Scale, windowPosStart.Y.Offset + dH/2)
        end
    end)
    -- Hover feedback PC (opcional, protegido)
    pcall(function()
        ResizeHandle.MouseEnter:Connect(function() ResizeHandle.TextColor3 = theme.Text end)
        ResizeHandle.MouseLeave:Connect(function() if not resizing then ResizeHandle.TextColor3 = theme.Dim end end)
    end)
    -- Botones (UN solo evento para no doble-click, con debounce)
    local lastMin = 0
    local function doMinimize()
        if os.clock() - lastMin < 0.35 then return end
        lastMin = os.clock()
        minimized = not minimized
        if minimized then
            oldSize = Main.Size
            Main.Size = UDim2.fromOffset(Main.Size.X.Offset, 38)
            MinBtn.Text = "+"
            ResizeHandle.Visible = false
        else
            Main.Size = oldSize
            MinBtn.Text = "-"
            ResizeHandle.Visible = true
        end
    end
    MinBtn.MouseButton1Click:Connect(doMinimize)
    local function doClose()
        pcall(function() m1n3l1sLib:Shutdown() end)
        pcall(function() ScreenGui:Destroy() end)
    end
    CloseBtn.MouseButton1Click:Connect(doClose)

    -- Toggle con tecla (K por defecto)
    UserInputService.InputBegan:Connect(function(input, gpe)
        if gpe then return end
        if input.KeyCode == toggleKey then
            ScreenGui.Enabled = not ScreenGui.Enabled
        end
    end)

    -- Drag PC + Movil (TopBar y Titulo)
    do
        local dragging, dragStart, startPos = false, nil, nil
        local function onBegan(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                dragging = true
                dragStart = input.Position
                startPos = Main.Position
                input.Changed:Connect(function()
                    if input.UserInputState == Enum.UserInputState.End then dragging = false end
                end)
            end
        end
        TopBar.InputBegan:Connect(onBegan)
        Title.InputBegan:Connect(onBegan)
        UserInputService.InputChanged:Connect(function(input)
            if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                local delta = input.Position - dragStart
                Main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
            end
        end)
    end

    local Window = {}
    Window.Gui = ScreenGui
    Window.Main = Main
    Window.Theme = theme
    Window.Tabs = {}
    Window.TabBar = TabBar
    Window.PageHolder = PageHolder

    function Window:Destroy()
        -- Cierra TODO, no solo la ventana
        pcall(function() m1n3l1sLib:Shutdown() end)
        pcall(function() ScreenGui:Destroy() end)
    end

    -- Crear Tab (boton arriba + pagina)
    -- Crear Tab con icono opcional.
    -- Icono IMAGEN (recomendado, siempre se ve): CreateTab("Player", 10723404472)
    --   acepta numero de asset, "rbxassetid://..." o string numerico.
    -- Icono TEXTO (puede salir cuadro en algunos dispositivos): CreateTab("Player", "*")
    function Window:CreateTab(tabName, icon)
        local TabBtn = Instance.new("TextButton", TabBar)
        TabBtn.Name = tabName
        TabBtn.Size = UDim2.fromOffset(135, 28)
        TabBtn.BackgroundColor3 = theme.Element
        TabBtn.BackgroundTransparency = theme.TranspElem or 0.3
        TabBtn.Text = ""
        TabBtn.AutoButtonColor = false
        Instance.new("UICorner", TabBtn).CornerRadius = UDim.new(0, 7)
        local tabStroke = Instance.new("UIStroke", TabBtn)
        tabStroke.Color = theme.Stroke
        tabStroke.Thickness = 1
        tabStroke.Transparency = 0.4

        local imgId = nil
        if type(icon) == "number" then
            imgId = "rbxassetid://" .. tostring(icon)
        elseif type(icon) == "string" and icon:match("^%d+$") then
            imgId = "rbxassetid://" .. icon
        elseif type(icon) == "string" and (icon:find("rbxassetid") or icon:find("rbxthumb") or icon:find("rbxasset://")) then
            imgId = icon
        end
        if imgId then
            local ic = Instance.new("ImageLabel", TabBtn)
            ic.Name = "Icon"
            ic.Size = UDim2.fromOffset(16, 16)
            ic.Position = UDim2.new(0, 8, 0.5, -8)
            ic.BackgroundTransparency = 1
            ic.Image = imgId
            local tx = Instance.new("TextLabel", TabBtn)
            tx.Name = "Title"
            tx.Size = UDim2.new(1, -30, 1, 0)
            tx.Position = UDim2.fromOffset(28, 0)
            tx.BackgroundTransparency = 1
            tx.Text = tostring(tabName)
            tx.TextColor3 = theme.Dim
            tx.Font = Enum.Font.GothamBold
            tx.TextSize = 12
            tx.TextXAlignment = Enum.TextXAlignment.Left
            pcall(function() tx.TextTruncate = Enum.TextTruncate.AtEnd end)
        else
            local label = tostring(tabName)
            if icon ~= nil and tostring(icon) ~= "" then
                label = tostring(icon) .. "  " .. label
            end
            TabBtn.Text = label
            TabBtn.TextColor3 = theme.Dim
            TabBtn.Font = Enum.Font.GothamBold
            TabBtn.TextSize = 12
        end

        local Page = Instance.new("ScrollingFrame", PageHolder)
        Page.Name = tabName
        Page.Size = UDim2.fromScale(1, 1)
        Page.BackgroundTransparency = 1
        Page.ScrollBarThickness = 3
        Page.Visible = false
        Page.CanvasSize = UDim2.new(0,0,0,0)
        pcall(function() Page.AutomaticCanvasSize = Enum.AutomaticSize.Y end)

        local Layout = Instance.new("UIListLayout", Page)
        Layout.Padding = UDim.new(0, 6)
        Layout.SortOrder = Enum.SortOrder.LayoutOrder

        local Pad = Instance.new("UIPadding", Page)
        Pad.PaddingTop = UDim.new(0, 8)
        Pad.PaddingLeft = UDim.new(0, 8)
        Pad.PaddingRight = UDim.new(0, 8)
        Pad.PaddingBottom = UDim.new(0, 8)

        -- Seleccionar primero por defecto
        local function paintTab(btn, selected)
            pcall(function()
                btn.BackgroundColor3 = selected and theme.Accent or theme.Element
            end)
            local col = selected and Color3.new(1,1,1) or theme.Dim
            btn.TextColor3 = col
            local ttl = btn:FindFirstChild("Title")
            if ttl then ttl.TextColor3 = col end
        end
        if #self.Tabs == 0 then
            Page.Visible = true
            paintTab(TabBtn, true)
        end

        local function selectTab()
            for _, t in pairs(self.Tabs) do
                t.Page.Visible = false
                pcall(function() TweenService:Create(t.Btn, TweenFast, {BackgroundColor3 = theme.Element}):Play() end)
                local col = theme.Dim
                t.Btn.TextColor3 = col
                local ttl = t.Btn:FindFirstChild("Title")
                if ttl then ttl.TextColor3 = col end
            end
            Page.Visible = true
            pcall(function() TweenService:Create(TabBtn, TweenFast, {BackgroundColor3 = theme.Accent}):Play() end)
            TabBtn.TextColor3 = Color3.new(1,1,1)
            local myTitle = TabBtn:FindFirstChild("Title")
            if myTitle then myTitle.TextColor3 = Color3.new(1,1,1) end
        end
        TabBtn.MouseButton1Click:Connect(selectTab)

        local Tab = {}
        Tab.Page = Page
        Tab.Btn = TabBtn
        Tab.Theme = theme
        table.insert(self.Tabs, {Btn = TabBtn, Page = Page})

        -- ===== ELEMENTOS =====

        function Tab:CreateSection(text)
            local l = Instance.new("TextLabel", Page)
            l.Size = UDim2.new(1, -4, 0, 22)
            l.BackgroundTransparency = 1
            l.Text = string.upper(tostring(text))
            l.TextColor3 = theme.Dim
            l.Font = Enum.Font.GothamBold
            l.TextSize = 11
            l.TextXAlignment = Enum.TextXAlignment.Left
            return l
        end

        function Tab:CreateLabel(text)
            local l = Instance.new("TextLabel", Page)
            l.Size = UDim2.new(1, -4, 0, 26)
            l.BackgroundTransparency = 1
            l.Text = tostring(text)
            l.TextColor3 = theme.Text
            l.Font = Enum.Font.Gotham
            l.TextSize = 12
            l.TextXAlignment = Enum.TextXAlignment.Left
            l.TextWrapped = true
            return l
        end

        function Tab:CreateButton(text, callback)
            local b = Instance.new("TextButton", Page)
            b.Size = UDim2.new(1, -4, 0, 32)
            b.BackgroundColor3 = Color3.fromRGB(0,0,0)
            b.BackgroundTransparency = theme.TranspElem or 0.3
            b.Text = tostring(text)
            b.TextColor3 = Color3.new(1,1,1)
            b.Font = Enum.Font.GothamBold
            b.TextSize = 12
            b.AutoButtonColor = true
            Instance.new("UICorner", b).CornerRadius = UDim.new(0, 6)
            local bs = Instance.new("UIStroke", b)
            bs.Color = theme.Stroke
            bs.Thickness = 1
            bs.Transparency = 0.4
            b.MouseButton1Click:Connect(function()
                if callback then task.spawn(callback) end
            end)
            return b
        end

        function Tab:CreateToggle(text, default, callback)
            local b = Instance.new("TextButton", Page)
            b.Size = UDim2.new(1, -4, 0, 32)
            b.BackgroundColor3 = theme.Element
            b.BackgroundTransparency = theme.TranspElem or 0.3
            b.Text = ""
            b.AutoButtonColor = false
            Instance.new("UICorner", b).CornerRadius = UDim.new(0, 6)
            local ts = Instance.new("UIStroke", b)
            ts.Color = theme.Stroke
            ts.Thickness = 1
            ts.Transparency = 0.4

            local l = Instance.new("TextLabel", b)
            l.Text = tostring(text)
            l.Size = UDim2.new(1, -60, 1, 0)
            l.Position = UDim2.fromOffset(10, 0)
            l.BackgroundTransparency = 1
            l.TextColor3 = theme.Text
            l.Font = Enum.Font.Gotham
            l.TextSize = 12
            l.TextXAlignment = Enum.TextXAlignment.Left
            pcall(function() l.TextTruncate = Enum.TextTruncate.AtEnd end)

            local sw = Instance.new("Frame", b)
            sw.Size = UDim2.fromOffset(38, 18)
            sw.Position = UDim2.new(1, -46, 0.5, -9)
            sw.BackgroundColor3 = default and Color3.fromRGB(0, 180, 90) or Color3.fromRGB(30,30,30)
            sw.BorderSizePixel = 0
            Instance.new("UICorner", sw).CornerRadius = UDim.new(1, 0)

            local dot = Instance.new("Frame", sw)
            dot.Size = UDim2.fromOffset(14, 14)
            dot.Position = default and UDim2.new(1, -16, 0.5, -7) or UDim2.new(0, 2, 0.5, -7)
            dot.BackgroundColor3 = Color3.new(1,1,1)
            dot.BorderSizePixel = 0
            Instance.new("UICorner", dot).CornerRadius = UDim.new(1, 0)

            local on = default or false
            local function refresh()
                TweenService:Create(sw, TweenFast, {BackgroundColor3 = on and Color3.fromRGB(0,180,90) or Color3.fromRGB(60,60,70)}):Play()
                TweenService:Create(dot, TweenFast, {Position = on and UDim2.new(1,-16,0.5,-7) or UDim2.new(0,2,0.5,-7)}):Play()
            end
            b.MouseButton1Click:Connect(function()
                on = not on
                refresh()
                if callback then task.spawn(callback, on) end
            end)
            if default and callback then task.spawn(callback, true) end
            -- API estilo Rayfield: devuelve objeto con :Set(bool)
            local api = {}
            api.Instance = b
            api.Value = on
            function api:Set(v)
                on = (v == true)
                api.Value = on
                pcall(refresh)
            end
            -- Registro para "apagar todo al cerrar": guarda callback + api
            pcall(function()
                getgenv()._m1n3l1s_toggles = getgenv()._m1n3l1s_toggles or {}
                table.insert(getgenv()._m1n3l1s_toggles, {callback = callback, api = api})
            end)
            return api
        end

        function Tab:CreateSlider(text, min, max, default, callback, increment)
            min, max, default = min or 0, max or 100, default or 50
            increment = increment or 1
            local dec = 0
            pcall(function()
                local s = tostring(increment)
                local d = s:match("%.(%d+)$")
                if d then dec = #d end
            end)
            local function round(v)
                if dec == 0 then return math.floor(v + 0.5) end
                local m = 10 ^ dec
                return math.floor(v * m + 0.5) / m
            end
            default = round(default)
            local f = Instance.new("Frame", Page)
            f.Size = UDim2.new(1, -4, 0, 46)
            f.BackgroundColor3 = theme.Element
            f.BackgroundTransparency = theme.TranspElem or 0.3
            f.BorderSizePixel = 0
            Instance.new("UICorner", f).CornerRadius = UDim.new(0, 6)
            local fs = Instance.new("UIStroke", f)
            fs.Color = theme.Stroke
            fs.Thickness = 1
            fs.Transparency = 0.4

            local l = Instance.new("TextLabel", f)
            l.Size = UDim2.new(1, -20, 0, 18)
            l.Position = UDim2.fromOffset(10, 4)
            l.BackgroundTransparency = 1
            l.TextColor3 = theme.Text
            l.Font = Enum.Font.Gotham
            l.TextSize = 12
            l.TextXAlignment = Enum.TextXAlignment.Left
            l.Text = text .. ": " .. tostring(default)

            local bar = Instance.new("TextButton", f)
            bar.Text = ""
            bar.AutoButtonColor = false
            bar.Size = UDim2.new(1, -20, 0, 8)
            bar.Position = UDim2.fromOffset(10, 28)
            bar.BackgroundColor3 = Color3.fromRGB(50,50,60)
            bar.BorderSizePixel = 0
            Instance.new("UICorner", bar).CornerRadius = UDim.new(1, 0)

            local fill = Instance.new("Frame", bar)
            fill.Size = UDim2.new((default - min) / math.max(1,(max - min)), 0, 1, 0)
            fill.BackgroundColor3 = theme.Accent
            fill.BorderSizePixel = 0
            Instance.new("UICorner", fill).CornerRadius = UDim.new(1, 0)

            local val = default
            local dragging = false
            local function setFromX(x)
                local pct = math.clamp((x - bar.AbsolutePosition.X) / math.max(1, bar.AbsoluteSize.X), 0, 1)
                val = round(min + (max - min) * pct)
                if increment >= 1 then
                    val = math.floor(val / increment + 0.5) * increment
                    val = math.clamp(val, min, max)
                end
                fill.Size = UDim2.new(pct, 0, 1, 0)
                l.Text = text .. ": " .. tostring(val)
                if callback then task.spawn(callback, val) end
            end
            bar.InputBegan:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    dragging = true
                    setFromX(input.Position.X)
                end
            end)
            UserInputService.InputEnded:Connect(function(input)
                if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                    dragging = false
                end
            end)
            UserInputService.InputChanged:Connect(function(input)
                if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                    setFromX(input.Position.X)
                end
            end)
            return f
        end

        function Tab:CreateDropdown(text, options, default, callback)
            options = options or {"Opcion 1"}
            local f = Instance.new("Frame", Page)
            f.Size = UDim2.new(1, -4, 0, 32)
            f.BackgroundColor3 = theme.Element
            f.BackgroundTransparency = theme.TranspElem or 0.3
            f.BorderSizePixel = 0
            f.ClipsDescendants = true
            Instance.new("UICorner", f).CornerRadius = UDim.new(0, 6)
            local ds = Instance.new("UIStroke", f)
            ds.Color = theme.Stroke
            ds.Thickness = 1
            ds.Transparency = 0.4

            local b = Instance.new("TextButton", f)
            b.Size = UDim2.new(1, 0, 0, 32)
            b.BackgroundTransparency = 1
            b.Text = tostring(text) .. ": " .. tostring(default or options[1]) .. "  â–¼"
            b.TextColor3 = theme.Text
            b.Font = Enum.Font.GothamMedium
            b.TextSize = 12

            local open = false
            local h = 32
            b.MouseButton1Click:Connect(function()
                open = not open
                if open then
                    h = 32 + (#options * 26) + 6
                    for _, opt in ipairs(options) do
                        if not f:FindFirstChild("opt_"..opt) then
                            local ob = Instance.new("TextButton", f)
                            ob.Name = "opt_"..opt
                            ob.Size = UDim2.new(1, -12, 0, 24)
                            ob.Position = UDim2.new(0, 6, 0, 0) -- se ajusta abajo
                            ob.BackgroundColor3 = Color3.fromRGB(40,40,48)
                            ob.Text = tostring(opt)
                            ob.TextColor3 = theme.Text
                            ob.Font = Enum.Font.Gotham
                            ob.TextSize = 12
                            Instance.new("UICorner", ob).CornerRadius = UDim.new(0, 5)
                            ob.LayoutOrder = 10
                        end
                    end
                    -- reposicionar opciones
                    local y = 34
                    for _, ch in ipairs(f:GetChildren()) do
                        if ch.Name:sub(1,4) == "opt_" then
                            ch.Position = UDim2.new(0, 6, 0, y)
                            y = y + 26
                            ch.MouseButton1Click:Connect(function()
                                b.Text = tostring(text) .. ": " .. ch.Text .. "  â–¼"
                                if callback then task.spawn(callback, ch.Text) end
                            end)
                        end
                    end
                else
                    h = 32
                end
                TweenService:Create(f, TweenFast, {Size = UDim2.new(1,-4,0,h)}):Play()
            end)
            return f
        end

        function Tab:CreateTextbox(text, placeholder, callback)
            local f = Instance.new("Frame", Page)
            f.Size = UDim2.new(1, -4, 0, 32)
            f.BackgroundColor3 = theme.Element
            f.BackgroundTransparency = theme.TranspElem or 0.3
            f.BorderSizePixel = 0
            Instance.new("UICorner", f).CornerRadius = UDim.new(0, 6)
            local tbs = Instance.new("UIStroke", f)
            tbs.Color = theme.Stroke
            tbs.Thickness = 1
            tbs.Transparency = 0.4

            local box = Instance.new("TextBox", f)
            box.Size = UDim2.new(1, -20, 1, 0)
            box.Position = UDim2.fromOffset(10, 0)
            box.BackgroundTransparency = 1
            box.PlaceholderText = placeholder or text or "Escribe..."
            box.Text = ""
            box.TextColor3 = theme.Text
            box.PlaceholderColor3 = theme.Dim
            box.Font = Enum.Font.Gotham
            box.TextSize = 12
            box.TextXAlignment = Enum.TextXAlignment.Left
            box.ClearTextOnFocus = false
            box.FocusLost:Connect(function(enter)
                if enter and callback then task.spawn(callback, box.Text) end
            end)
            return f
        end

        return Tab
    end

    return Window
end

-- Guardar global para re-uso (sin return para que no corte el executor)
pcall(function() getgenv().m1n3l1sLib = m1n3l1sLib end)

-- ============================================================
-- SHIM: Obsidian API -> m1n3l1s UI Lib (con KEY)
-- La GUI de m1n3l1s con key pasa a ser la GUI del script CRIM/KALETH
-- ============================================================
local m1n3l1sLib = nil
pcall(function() m1n3l1sLib = getgenv().m1n3l1sLib end)
if not m1n3l1sLib then
    error("[m1n3l1s x CRIM] No se encontro m1n3l1sLib. Asegurate de pegar la libreria primero.")
end

-- 1) KEY SYSTEM (pantalla de carga con key, igual que tu GUI m1n3l1s)
m1n3l1sLib:ShowLoading("m1n3l1s HUB | CRIM FARM")
m1n3l1sLib:Notify("m1n3l1s HUB", "Key correcta. Cargando CRIM x KALETH...", 3)

-- Colores preset para emular ColorPicker (m1n3l1s no tiene colorpicker nativo)
local PRESET_COLORS = {
    ["Rojo"] = Color3.fromRGB(255, 0, 0),
    ["Verde"] = Color3.fromRGB(0, 255, 0),
    ["Azul"] = Color3.fromRGB(0, 170, 255),
    ["Naranja"] = Color3.new(1, 0.5, 0),
    ["Amarillo"] = Color3.fromRGB(255, 255, 0),
    ["Morado"] = Color3.fromRGB(170, 0, 255),
    ["Rosa"] = Color3.fromRGB(255, 0, 170),
    ["Blanco"] = Color3.new(1, 1, 1),
    ["Cian"] = Color3.fromRGB(0, 255, 255),
}
local PRESET_NAMES = {"Rojo","Verde","Azul","Naranja","Amarillo","Morado","Rosa","Blanco","Cian"}
local function closestPresetName(c)
    if typeof(c) ~= "Color3" then return PRESET_NAMES[1] end
    local best, bestD = PRESET_NAMES[1], 1e9
    for _, n in ipairs(PRESET_NAMES) do
        local p = PRESET_COLORS[n]
        local d = (p.R-c.R)^2 + (p.G-c.G)^2 + (p.B-c.B)^2
        if d < bestD then bestD = d; best = n end
    end
    return best
end

-- Iconos: Obsidian usa lucide names, m1n3l1s usa imagen o emoji. Mapeamos a emoji.
local ICON_MAP = {
    ["crosshair"] = 10709818534,
    ["eye"] = 10723346959,
    ["user"] = 10747373176,
    ["sword"] = 10734975486,
    ["wrench"] = 10747383470,
    ["party-popper"] = 10734918735,
    ["globe"] = 10723404337,
    ["message-square"] = 10734888228,
    ["users"] = 10747373426,
    ["landmark"] = 10723417608,
    ["zap"] = 10709752035,
    ["info"] = 10723415903,
}

local ObsidianLib = {}

function ObsidianLib:Notify(o)
    o = o or {}
    -- Soporta :Notify() con self como primer arg cuando se llama con colon
    if type(o) ~= "table" then o = {} end
    if o.Title == nil and self ~= ObsidianLib and type(self) == "table" and self.Title then
        o = self
    end
    local t = o.Title or "Aviso"
    local d = o.Description or o.Content or ""
    local tm = o.Time or o.Duration or 3
    pcall(function() m1n3l1sLib:Notify(t, d, tm) end)
end

function ObsidianLib:Unload()
    pcall(function() m1n3l1sLib:Shutdown() end)
end

function ObsidianLib:CreateWindow(opts)
    opts = opts or {}
    if opts.Title == nil and self ~= ObsidianLib and type(self) == "table" and (self.Title or self.Name) then
        opts = self
    end
    local title = opts.Title or opts.Name or "m1n3l1s HUB"
    local footer = opts.Footer or opts.SubTitle or "CRIM x KALETH"
    local tk = opts.ToggleKeybind or opts.ToggleKey or Enum.KeyCode.K
    local win = m1n3l1sLib:CreateWindow({
        Name = tostring(title),
        SubTitle = tostring(footer),
        Theme = "Dark",
        ToggleKey = tk,
    })

    function win:AddTab(tabOpts)
        tabOpts = tabOpts or {}
        if type(tabOpts) ~= "table" then tabOpts = {Name = tostring(tabOpts)} end
        local tname = tabOpts.Name or "Tab"
        local icon = tabOpts.Icon
        local iconId = ICON_MAP[tostring(icon or "")] or nil
        local tab = win:CreateTab(tname, iconId)

        function tab:Show()
            -- m1n3l1s muestra el primer tab por defecto, no se necesita nada
        end

        function tab:AddLeftGroupbox(gname)
            local gbName = tostring(gname or "Grupo")
            pcall(function() tab:CreateSection(gbName) end)
            local gb = {}
            gb._tab = tab

            local function makeColorPickerEmu(parentTab, id, o)
                o = o or {}
                local titleC = o.Title or o.Text or tostring(id or "Color")
                local defC = o.Default
                local cbC = o.Callback
                local defName = closestPresetName(defC)
                local holder = {Callback = cbC}
                pcall(function()
                    parentTab:CreateDropdown(titleC, PRESET_NAMES, defName, function(picked)
                        local col = PRESET_COLORS[picked] or PRESET_COLORS["Rojo"]
                        if holder.Callback then
                            task.spawn(function() holder.Callback(col) end)
                        end
                    end)
                end)
                local emu = {}
                emu._holder = holder
                emu.Callback = cbC
                -- si luego hacen function emu.Callback(c) debe actualizar holder
                -- usamos metatable para sincronizar
                setmetatable(emu, {
                    __newindex = function(t, k, v)
                        rawset(t, k, v)
                        if k == "Callback" then holder.Callback = v end
                    end,
                    __index = function(t, k)
                        if k == "Callback" then return holder.Callback end
                        return rawget(t, k)
                    end
                })
                return emu
            end

            function gb:AddToggle(id, o)
                -- Soporta AddToggle({Text=...}) o AddToggle("id", {...})
                if type(id) == "table" and o == nil then o = id; id = o.Text or "Toggle" end
                o = o or {}
                local txt = o.Text or tostring(id or "Toggle")
                local def = (o.Default == true)
                local tog = {}
                tog.Callback = o.Callback
                local api = nil
                -- Creamos el toggle real; el callback interno siempre lee tog.Callback actual
                -- (asi soporta `function v10.Callback(v)` asignado despues)
                api = tab:CreateToggle(txt, def, function(v)
                    local cb = rawget(tog, "Callback")
                    -- tambien soporta holder via metatable
                    if type(cb) == "function" then
                        task.spawn(function()
                            pcall(function() cb(v) end)
                        end)
                    end
                end)
                tog._api = api
                tog._tab = tab
                function tog:SetValue(v)
                    pcall(function() api:Set(v == true) end)
                    -- No disparamos Callback aqui para evitar loops en AbortAll,
                    -- igual que Obsidian (SetValue no dispara o si? lo dejamos sin disparar)
                end
                function tog:Set(v)
                    pcall(function() api:Set(v == true) end)
                end
                function tog:AddColorPicker(cid, copts)
                    return makeColorPickerEmu(tab, cid, copts)
                end
                return tog
            end

            function gb:AddSlider(id, o)
                if type(id) == "table" and o == nil then o = id; id = o.Text or "Slider" end
                o = o or {}
                local txt = o.Text or tostring(id or "Slider")
                local mn = o.Min or 0
                local mx = o.Max or 100
                local def = o.Default
                if def == nil then def = (mn + mx) / 2 end
                local rounding = o.Rounding or 1
                local inc = 1
                if rounding and rounding >= 2 then inc = 0.01 end
                local sld = {}
                sld.Callback = o.Callback
                pcall(function()
                    tab:CreateSlider(txt, mn, mx, def, function(v)
                        local cb = rawget(sld, "Callback")
                        if type(cb) == "function" then
                            task.spawn(function() pcall(function() cb(v) end) end)
                        end
                    end, inc)
                end)
                -- Si el default trae callback en tabla, NO lo disparamos aqui;
                -- el patron `function vSen.Callback` lo asignara despues.
                -- Pero si ya venia Callback en la tabla, m1n3l1s ya lo llamaria?
                -- Nuestro wrapper solo llama cuando el usuario mueve el slider,
                -- asi que disparamos el inicial una vez para respetar Default:
                if type(rawget(sld, "Callback")) == "function" then
                    task.spawn(function() pcall(function() sld.Callback(def) end) end)
                end
                function sld:SetValue(v)
                    -- m1n3l1s slider no tiene Set, lo ignoramos
                end
                return sld
            end

            function gb:AddDropdown(id, o)
                if type(id) == "table" and o == nil then o = id; id = o.Text or "Dropdown" end
                o = o or {}
                local txt = o.Text or tostring(id or "Dropdown")
                local vals = o.Values or o.Options or {"Opcion 1"}
                local def = o.Default or vals[1]
                local dd = {}
                dd.Callback = o.Callback
                dd.Value = def
                if o.SpecialType == "Player" then
                    -- Lista de jugadores + textbox manual como respaldo
                    local names = {}
                    pcall(function()
                        for _, p in ipairs(game:GetService("Players"):GetPlayers()) do
                            table.insert(names, p.Name)
                        end
                    end)
                    if #names == 0 then names = {"Ninguno"} end
                    local first = tostring(def or names[1])
                    -- Si el default no esta en la lista, lo agregamos
                    local found = false
                    for _, n in ipairs(names) do if n == first then found = true break end end
                    if not found and first ~= "Ninguno" then table.insert(names, 1, first) end
                    pcall(function()
                        tab:CreateDropdown(txt, names, names[1], function(picked)
                            dd.Value = picked
                            local cb = rawget(dd, "Callback")
                            if type(cb) == "function" then
                                task.spawn(function() pcall(function() cb(picked) end) end)
                            end
                        end)
                    end)
                    -- Textbox para escribir el nombre manualmente (cuenta 1)
                    pcall(function()
                        tab:CreateTextbox(txt .. " (manual)", "Escribe nombre...", function(t)
                            if t and t ~= "" then
                                dd.Value = t
                                local cb = rawget(dd, "Callback")
                                if type(cb) == "function" then
                                    task.spawn(function() pcall(function() cb(t) end) end)
                                end
                            end
                        end)
                    end)
                    pcall(function()
                        tab:CreateButton("Actualizar lista " .. txt, function()
                            local n2 = {}
                            pcall(function()
                                for _, p in ipairs(game:GetService("Players"):GetPlayers()) do
                                    table.insert(n2, p.Name)
                                end
                            end)
                            m1n3l1sLib:Notify("Jugadores", table.concat(n2, ", "):sub(1, 120), 4)
                        end)
                    end)
                else
                    -- Dropdown normal
                    if type(vals) ~= "table" or #vals == 0 then vals = {"Opcion 1"} end
                    -- Asegura strings
                    local sopts = {}
                    for _, v in ipairs(vals) do table.insert(sopts, tostring(v)) end
                    local sdef = tostring(def or sopts[1])
                    pcall(function()
                        tab:CreateDropdown(txt, sopts, sdef, function(picked)
                            dd.Value = picked
                            local cb = rawget(dd, "Callback")
                            if type(cb) == "function" then
                                task.spawn(function() pcall(function() cb(picked) end) end)
                            end
                        end)
                    end)
                    -- Dispara callback inicial si venia en tabla (para Skybox etc. no queremos disparo auto, solo si es necesario)
                    -- No disparamos por defecto para evitar efectos secundarios.
                end
                return dd
            end

            function gb:AddButton(o)
                o = o or {}
                if type(o) == "string" then o = {Text = o} end
                local txt = o.Text or "Boton"
                local cb = o.Callback
                pcall(function()
                    tab:CreateButton(txt, function()
                        if type(cb) == "function" then
                            task.spawn(function() pcall(cb) end)
                        end
                    end)
                end)
                -- Retorna dummy con Callback asignable por compatibilidad
                local b = {}
                b.Callback = cb
                return b
            end

            function gb:AddLabel(o)
                o = o or {}
                if type(o) == "string" then o = {Text = o} end
                local txt = o.Text or ""
                local inst = nil
                pcall(function() inst = tab:CreateLabel(txt) end)
                local wrap = {}
                wrap.Instance = inst
                wrap.Text = txt
                function wrap:SetText(t)
                    wrap.Text = tostring(t)
                    pcall(function()
                        if inst then inst.Text = tostring(t) end
                    end)
                end
                return wrap
            end

            function gb:AddColorPicker(id, o)
                return makeColorPickerEmu(tab, id, o)
            end

            return gb
        end

        return tab
    end

    return win
end


-- ============================================================
-- A PARTIR DE AQUI: LOGICA CRIM KALETH (con GUI m1n3l1s via shim)
-- ============================================================
_G.AbortEverything = false
local t1 = {
	value1 = {}
}
function t1.value1:Notify(info)
	return ObsidianLib:Notify({ Title = info.Title, Description = info.Content, Time = info.Duration })
end
local value1 = t1.value1
local uDim2 = UDim2.fromOffset(500, 400)
local v4 = ObsidianLib:CreateWindow({
	Title = "m1n3l1s Gui",
	Footer = "by ij3e",
	Size = uDim2,
	ToggleKeybind = Enum.KeyCode.F1,
	UnlockMouseWhileOpen = false
})
local t2 = {
	Aimbot = v4:AddTab({
		Name = "Aimbot",
		Icon = "crosshair"
	}),
	Visuals = v4:AddTab({
		Name = "Visuals",
		Icon = "eye"
	}),
	Player = v4:AddTab({
		Name = "Player",
		Icon = "user"
	}),
	Combat = v4:AddTab({
		Name = "Combat",
		Icon = "sword"
	}),
	Utility = v4:AddTab({
		Name = "Utility",
		Icon = "wrench"
	}),
	Funny = v4:AddTab({
		Name = "FUNNY",
		Icon = "party-popper"
	}),
	Mundo = v4:AddTab({
		Name = "Mundo",
		Icon = "globe"
	}),
	Chat = v4:AddTab({
		Name = "Chat",
		Icon = "message-square"
	}),
	AccFarm = v4:AddTab({
		Name = "AccFarm",
		Icon = "users"
	})
}
t2.Aimbot:Show()
t1.value2 = game:GetService("Players")
t1.value3 = game:GetService("UserInputService")
t1.value4 = game:GetService("RunService")
t1.value5 = t1.value2.LocalPlayer
t1.value6 = t1.value5:GetMouse()
t1.value7 = workspace.CurrentCamera
t1.value8 = game:GetService("ReplicatedStorage")
t1.value9 = t1.value2
t1.value10 = t1.value5
t1.value11 = false
t1.value12 = nil
t1.value13 = false
t1.value14 = false
t1.value15 = false
t1.value16 = {}

local UIS = t1.value3
local Player = t1.value5
local Mouse = t1.value6

local function GetCharacter()
    return Player.Character
end

local function Teleport(pos)
    local Char = GetCharacter()

    if Char then
        Char:MoveTo(pos)
    end
end

UIS.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.Keyboard and input.KeyCode == Enum.KeyCode.Z then
        Teleport(Mouse.Hit.p)
    end
end)

-- Chat ESP: muestra los mensajes en grande sobre la cabeza de quien habla
local TextChatService = game:GetService("TextChatService")
local ChatMessages = {}
local ChatESPEnabled = true

local function AddChatMessage(player, message)
    if not player or not message or message == "" then
        return
    end

    local msgs = ChatMessages[player]

    if not msgs then
        msgs = {}
        ChatMessages[player] = msgs
    end

    local Draw = Drawing.new("Text")
    Draw.Center = true
    Draw.Size = 26
    Draw.Transparency = 1
    Draw.Visible = false
    Draw.Color = Color3.fromRGB(255, 255, 255)
    Draw.Outline = true
    Draw.Text = "[" .. player.Name .. "]: " .. message

    table.insert(msgs, {
        Drawing = Draw,
        Created = tick()
    })

    while #msgs > 4 do
        local old = table.remove(msgs, 1)

        if old and old.Drawing then
            pcall(function()
                old.Drawing:Remove()
            end)
        end
    end
end

local function StartChatESP()
    game.Players.PlayerRemoving:Connect(function(player)
        local msgs = ChatMessages[player]

        if msgs then
            for _, msg in pairs(msgs) do
                pcall(function()
                    msg.Drawing:Remove()
                end)
            end

            ChatMessages[player] = nil
        end
    end)

    for _, player in pairs(game.Players:GetPlayers()) do
        player.Chatted:Connect(function(message)
            AddChatMessage(player, message)
        end)
    end

    game.Players.PlayerAdded:Connect(function(player)
        player.Chatted:Connect(function(message)
            AddChatMessage(player, message)
        end)
    end)

    if TextChatService and TextChatService.MessageReceived then
        TextChatService.MessageReceived:Connect(function(_, message)
            local ok, player = pcall(function()
                if message and message.TextSource and message.TextSource.Player then
                    return message.TextSource.Player
                end
                return nil
            end)

            if not ok then
                player = nil
            end

            if player and message and message.Text then
                AddChatMessage(player, message.Text)
            end
        end)
    end

    while not _G.AbortEverything do
        local camera = workspace.CurrentCamera

        for player, msgs in pairs(ChatMessages) do
            local Character = player.Character
            local Head = Character and Character:FindFirstChild("Head")
            local HeadPos = Head and Head.Position

            for i = #msgs, 1, -1 do
                local msg = msgs[i]

                if HeadPos and camera and ChatESPEnabled then
                    local screen, onScreen = camera:WorldToViewportPoint(HeadPos + Vector3.new(0, 3 + (i - 1) * 2.2, 0))

                    if onScreen and screen.Z > 0 then
                        msg.Drawing.Position = Vector2.new(screen.X, screen.Y)
                        msg.Drawing.Visible = true
                    else
                        msg.Drawing.Visible = false
                    end
                else
                    msg.Drawing.Visible = false
                end

                if tick() - msg.Created > 5 then
                    pcall(function()
                        msg.Drawing:Remove()
                    end)

                    table.remove(msgs, i)
                end
            end
        end

        task.wait()
    end
end

spawn(StartChatESP)

t1.value17 = {
	SilentAim = false,
	FastPickup = false,
	InstantReload = false,
	AutoPickupScraps = false,
	AutoPickupTools = false,
	AutoPickupCrates = false,
	AutoPickupMoney = false,
	ESP = false,
	ESPNames = false,
	ESPInventory = false
}
t1.value18 = {
	InfiniteStamina = false,
	GunMods = {
		NoRecoil = false
	}
}
local color3 = Color3.new(1, 1, 1)
local t3 = {
	Draw = true,
	DrawSize = 80,
	DrawColor = color3,
	TargetParts = { "Head" },
	CheckDowned = false,
	CheckWall = false,
	CheckTeam = false,
	CheckWhiteList = false
}
t1.value19 = {
	SilentAim = t3
}
t1.value20 = {
	SilentAimCircle = nil
}
local v9 = t2.Aimbot:AddLeftGroupbox("Aimbot Controls")
local ChatBox = t2.Chat:AddLeftGroupbox("Chat ESP")
local ChatESPToggle = ChatBox:AddToggle("ChatESPToggle", {
	Text = "Chat ESP",
	Tooltip = "Muestra los mensajes de chat en grande sobre la cabeza de quien habla",
	Default = true,
	Callback = function(value)
		ChatESPEnabled = value
		if not value then
			for _, msgs in pairs(ChatMessages) do
				for _, msg in pairs(msgs) do
					pcall(function()
						msg.Drawing.Visible = false
					end)
				end
			end
		end
	end
})
local v10 = v9:AddToggle("AimbotToggle", {
	Text = "Enable Aimbot",
	Tooltip = "Toggles the aimbot functionality",
	Default = false
})
local v11 = v9:AddToggle("SilentAimToggle", {
	Text = "Silent Aim",
	Tooltip = "Aims at head within FOV circle",
	Default = false
})
local v12 = v9:AddDropdown("SilentAimTargetPart", {
	Text = "Target Part",
	Tooltip = "Select target part for Silent Aim",
	Values = {
		"Head",
		"Torso",
		"Left Arm",
		"Right Arm",
		"Left Leg",
		"Right Leg"
	},
	Default = "Head",
	Multi = false
})
local v13 = v9:AddToggle("WallCheckToggle", {
	Text = "Wall Check",
	Tooltip = "Enables wall check for aimbot",
	Default = false
})
local v14 = v9:AddToggle("TeamCheckToggle", {
	Text = "Team Check",
	Tooltip = "Prevents aimbot from targeting teammates",
	Default = false
})
local v15 = v9:AddToggle("AliveCheckToggle", {
	Text = "Alive Check",
	Tooltip = "Prevents aimbot from targeting dead players",
	Default = false
})
local vSen = v9:AddSlider("Sensitivity", {
	Text = "Aimbot Sensitivity",
	Tooltip = "Adjust aim smoothness",
	Default = 50,
	Min = 1,
	Max = 100,
	Rounding = 1
})
local vFovSize = v9:AddSlider("SilentAimFovSize", {
	Text = "Silent Aim FOV Size",
	Tooltip = "Adjust the size of the silent aim FOV circle",
	Default = 80,
	Min = 10,
	Max = 500,
	Rounding = 0
})
local v16 = t2.Visuals:AddLeftGroupbox("Visual Controls")

t1.value22 = v16:AddToggle("FullBrightToggle", {
	Text = "Enable Full Bright",
	Tooltip = "Toggles full bright script",
	Default = false
})
local v18 = t2.Player:AddLeftGroupbox("Player Controls")
local v19 = v18:AddToggle("InfiniteStaminaToggle", {
	Text = "Infinite Stamina",
	Tooltip = "Enables infinite stamina",
	Default = false
})
local v20 = v18:AddToggle("RotationScript", {
	Text = "Enable Rotation",
	Tooltip = "Toggles character rotation (Press P to toggle in-game)",
	Default = false
})
local vNoFall = v18:AddToggle("NoFallDamageToggle", {
	Text = "No Fall Damage",
	Tooltip = "Elimina el dano de caida",
	Default = false,
	Callback = function(value)
		if value then
			getgenv().StartNoFallDamage()
		else
			getgenv().StopNoFallDamage()
		end
	end
})
local vSkinOpacity = v18:AddToggle("SkinOpacityToggle", {
	Text = "Skin transparente",
	Tooltip = "Hace tu skin transparente",
	Default = false,
	Callback = function(value)
		if value then
			getgenv().StartSkinOpacity()
		else
			getgenv().StopSkinOpacity()
		end
	end
})
local vSkinOpacitySlider = v18:AddSlider("SkinOpacitySlider", {
	Text = "Transparencia de skin",
	Tooltip = "Cuanto quieres que sea transparente tu skin (1 = casi opaco, 100 = invisible)",
	Default = 50,
	Min = 1,
	Max = 100,
	Rounding = 0,
	Callback = function(value)
		getgenv().SetSkinOpacity(value)
	end
})
v18:AddDropdown("SkinColorDropdown", {
	Text = "Color de skin",
	Tooltip = "Tinte para tu skin (Original = sin tinte)",
	Values = { "Original", "Blanco", "Negro", "Rojo", "Naranja", "Amarillo", "Verde", "Cian", "Azul", "Morado", "Rosa" },
	Default = "Original",
	Multi = false,
	Callback = function(value)
		if getgenv().SetSkinColor then
			getgenv().SetSkinColor(value)
		end
	end
})
local v21 = t2.Combat:AddLeftGroupbox("Combat Controls")
local v22 = v21:AddToggle("NoRecoilToggle", {
	Text = "No Recoil",
	Tooltip = "Enables no recoil for guns",
	Default = false
})
local vRageBot = v21:AddToggle("RageBotToggle", {
	Text = "Rage Bot",
	Tooltip = "Apuntado automatico agresivo a la cabeza del enemigo mas cercano",
	Default = false,
	Callback = function(value)
		if value then
			getgenv().StartRageBot()
		else
			getgenv().StopRageBot()
		end
	end
})
local vRageBotInstant = v21:AddToggle("RageBotInstantToggle", {
	Text = "Fijacion instantanea",
	Tooltip = "Apunta directo sin suavizado",
	Default = true,
	Callback = function(value)
		RageBotInstant = value
	end
})
local vRageBotShoot = v21:AddToggle("RageBotAutoShootToggle", {
	Text = "Disparo automatico",
	Tooltip = "Dispara automaticamente cuando el objetivo esta en rango",
	Default = false,
	Callback = function(value)
		RageBotAutoShoot = value
	end
})
local vRageBotTeam = v21:AddToggle("RageBotTeamToggle", {
	Text = "Ignorar equipo",
	Tooltip = "No apunta a jugadores de tu equipo",
	Default = false,
	Callback = function(value)
		RageBotCheckTeam = value
	end
})
local vRageBotRange = v21:AddSlider("RageBotRangeSlider", {
	Text = "Alcance",
	Default = 300,
	Min = 50,
	Max = 1000,
	Rounding = 1,
	Callback = function(value)
		RageBotRange = value
	end
})
local vMeleeAura = v21:AddToggle("MeleeAuraToggle", {
	Text = "Melee Aura",
	Tooltip = "Golpea solo con melee a enemigos cerca (equipa un melee)",
	Default = false,
	Callback = function(value)
		if value then getgenv().MeleeAuraStart() else getgenv().MeleeAuraStop() end
	end
})
local vMeleeAuraRange = v21:AddSlider("MeleeAuraRangeSlider", {
	Text = "Rango del aura",
	Default = 15,
	Min = 5,
	Max = 30,
	Rounding = 0,
	Callback = function(value)
		getgenv().MeleeAuraRange = value
	end
})
local vSpin = v21:AddToggle("SpinToggle", {
	Text = "Spinbot",
	Tooltip = "Gira sobre tu eje",
	Default = false,
	Callback = function(value)
		if value then getgenv().SpinStart() else getgenv().SpinStop() end
	end
})
local v23 = v16:AddToggle("ESPToggle", {
	Text = "ESP Jugadores",
	Tooltip = "Solo resalta el contorno del jugador con color segun su vida (sin relleno)",
	Default = false
})
local vEspNames = v16:AddToggle("ESPNamesToggle", {
	Text = "ESP Nombres",
	Tooltip = "Muestra el nombre + foto de la cara de su skin sobre su cabeza",
	Default = false
})
local vEspInventory = v16:AddToggle("ESPInventoryToggle", {
	Text = "ESP Inventario",
	Tooltip = "Muestra el inventario de cada jugador en imagenes bajo sus pies",
	Default = false
})
local v24 = t2.Utility:AddLeftGroupbox("Utility Controls")
local v25 = v24:AddToggle("LockpickToggle", {
	Text = "No Fail Lockpick",
	Tooltip = "Automates lockpicking to prevent failure",
	Default = false
})
local v26 = v24:AddToggle("FastPickupToggle", {
	Text = "No Pickup Cooldown",
	Tooltip = "Enables no cooldown for picking up items",
	Default = false
})
local v27 = v24:AddToggle("InstantReloadToggle", {
	Text = "Instant Reload",
	Tooltip = "Enables instant reload for guns",
	Default = false
})
local v28 = v24:AddToggle("AutoPickupScrapsToggle", {
	Text = "Auto Pickup Scraps",
	Tooltip = "Automatically picks up scraps",
	Default = false
})
local v29 = v24:AddToggle("AutoPickupToolsToggle", {
	Text = "Auto Pickup Tools",
	Tooltip = "Automatically picks up tools",
	Default = false
})
local v30 = v24:AddToggle("AutoPickupCratesToggle", {
	Text = "Auto Pickup Crates",
	Tooltip = "Automatically picks up crates",
	Default = false
})
local v31 = v24:AddToggle("AutoPickupMoneyToggle", {
	Text = "Auto Pickup Money",
	Tooltip = "Automatically picks up money",
	Default = false
})
function t1.value23(p2)
    local CharStats = t1.value8:FindFirstChild("CharStats")

    if CharStats then
        return CharStats:FindFirstChild(p2.Name)
    end
end
function vSen.Callback(pSen)
    t1.value27 = pSen
end
function vFovSize.Callback(pFov)
    t1.value19.SilentAim.DrawSize = pFov
end
function v10.Callback(p4)
    t1.value11 = p4

    if p4 then
        t1.value1:Notify({
			Title = "Aimbot Status",
			Content = "Aimbot Enabled",
			Duration = 2
		})

        local connection = t1.value4.RenderStepped:Connect(function()
            if t1.value11 then
                local n2 = 1e999
                local Character
                for v158, v159 in pairs(t1.value2:GetPlayers()) do

                    local v160 = v159 ~= t1.value5

                    if v160 then
                        v160 = v159.Character

                        if v160 then
                            v160 = v159.Character:FindFirstChild("Head")
                        end
                    end

                    if v160 then
                        local v162, t5Result = workspace.CurrentCamera:WorldToViewportPoint(v159.Character.Head.Position)
                        if t5Result then
                            local Magnitude = (Vector2.new(t1.value6.X, t1.value6.Y) - Vector2.new(v162.X, v162.Y)).Magnitude
                            local value14 = t1.value14
                            local v165 = true

                            if value14 then
                                value14 = v159.TeamColor == t1.value5.TeamColor
                            end

                            if value14 then
                                v165 = false
                            end

                            local v166 = v165

                            if v165 then
                                v166 = t1.value15

                                if v166 then
                                    v166 = v159.Character:FindFirstChild("Humanoid")

                                    if v166 then
                                        v166 = v159.Character.Humanoid.Health <= 0
                                    end
                                end
                            end

                            if v166 then
                                v165 = false
                            end

                            if v165 and t1.value13 and not _G.WallBang then
                                local v167 = (v159.Character.Head.Position - workspace.CurrentCamera.CFrame.Position).Unit * (v159.Character.Head.Position - workspace.CurrentCamera.CFrame.Position).Magnitude
                                local raycastParams = RaycastParams.new()

                                raycastParams.FilterType = Enum.RaycastFilterType.Exclude
                                raycastParams.FilterDescendantsInstances = { t1.value5.Character }
                                raycastParams.IgnoreWater = true

                                local raycastResult = workspace:Raycast(workspace.CurrentCamera.CFrame.Position, v167, raycastParams)
                                local v170 = not raycastResult

                                if not v170 then
                                    v170 = not raycastResult.Instance

                                    if not v170 then
                                        v170 = not raycastResult.Instance:FindFirstAncestor(v159.Name)
                                    end
                                end

                                if v170 then
                                    v165 = false
                                end
                            end

                            if v165 and Magnitude < n2 then
                                n2 = Magnitude
                                Character = v159.Character
                            end
                        end
                    end
                end
                if Character then
                    t1.value12 = Character
                    local vSens = (t1.value27 or 50) / 100
                    workspace.CurrentCamera.CFrame = workspace.CurrentCamera.CFrame:Lerp(CFrame.new(workspace.CurrentCamera.CFrame.Position, t1.value12.Head.Position), vSens)
                end
            end
        end)

        getgenv().AimbotConn = connection

        return
    end

    t1.value1:Notify({
		Title = "Aimbot Status",
		Content = "Aimbot Disabled",
		Duration = 2
	})

    if getgenv().AimbotConn then
        getgenv().AimbotConn:Disconnect()
    end
end
function v11.Callback(p5)
    t1.value17.SilentAim = p5

    if p5 then
        t1.value20.SilentAimCircle = Drawing.new("Circle")
        t1.value20.SilentAimCircle.Color = t1.value19.SilentAim.DrawColor
        t1.value20.SilentAimCircle.Thickness = 2
        t1.value20.SilentAimCircle.NumSides = 50
        t1.value20.SilentAimCircle.Radius = t1.value19.SilentAim.DrawSize
        t1.value20.SilentAimCircle.Filled = false
        t1.value20.SilentAimCircle.Visible = t1.value19.SilentAim.Draw
        t1.value20.SilentAimCircle.Position = Vector2.new(t1.value6.X, t1.value6.Y)
        local u71
        getgenv().SilentAimRenderConn = t1.value4.RenderStepped:Connect(function()
            u71 = nil

            local DrawSize = t1.value19.SilentAim.DrawSize

            if t1.value20.SilentAimCircle then
                t1.value20.SilentAimCircle.Radius = DrawSize
                t1.value20.SilentAimCircle.Position = t1.value3:GetMouseLocation()
                t1.value20.SilentAimCircle.Visible = t1.value19.SilentAim.Draw
            end

            local mousePos = t1.value3:GetMouseLocation()

            for _, player in pairs(t1.value9:GetPlayers()) do
                if player ~= t1.value10 and player.Character then
                    local CheckDowned = t1.value19.SilentAim.CheckDowned

                    if CheckDowned then
                        local CharStat = t1.value23(player)
                        CheckDowned = CharStat and CharStat.Downed.Value == true
                    end

                    if not CheckDowned then
                        local CheckTeam = t1.value19.SilentAim.CheckTeam

                        if CheckTeam then
                            CheckTeam = player.Team == t1.value10.Team
                        end

                        if not CheckTeam then
                            local CheckWhiteList = t1.value19.SilentAim.CheckWhiteList

                            if CheckWhiteList then
                                CheckWhiteList = table.find(t1.value16, player)
                            end

                            if not CheckWhiteList then
                                local HumanoidRootPart = player.Character:FindFirstChild("HumanoidRootPart")

                                if HumanoidRootPart then
                                    local v178, v179 = t1.value7:WorldToViewportPoint(HumanoidRootPart.Position)

                                    if v179 then
                                        local Magnitude = (mousePos - Vector2.new(v178.X, v178.Y)).Magnitude

                                        if Magnitude < DrawSize then
                                            DrawSize = Magnitude
                                            u71 = player
                                        end
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end)
        local Visualize = t1.value8.Events2.Visualize
        local ZFKLF__H = t1.value8.Events.ZFKLF__H
        getgenv().SilentAimVisualizeConn = Visualize.Event:Connect(function(_, p7, _, p9, _, p11, p12)
            if not t1.value17.SilentAim then
                return
            end

            local v188 = not p9

            if not v188 then
                v188 = not u71

                if not v188 then
                    v188 = not u71.Character

                    if not v188 then
                        v188 = not u71.Character:FindFirstChild("Humanoid")

                        if not v188 then
                            v188 = u71.Character:FindFirstChild("Humanoid").Health == 0
                        end
                    end
                end
            end

            if v188 then
                return
            end

            local v189 = not t1.value10.Character

            if not v189 then
                v189 = not t1.value10.Character:FindFirstChildOfClass("Tool")
            end

            if v189 then
                return
            end

            local v190 = t1.value19.SilentAim.TargetParts[1] or "Head"
            local v191 = u71.Character:FindFirstChild(v190)

            if not v191 then
                v191 = u71.Character:FindFirstChild("Head")
            end

            if not v191 then
                return
            end

            local Position = v191.Position
            local t6 = {}

            for _ = 1, math.clamp(#p12, 1, 100) do
                table.insert(t6, CFrame.new(p11, Position).LookVector)
            end

            task.wait(0.005)

            for k, v in pairs(t6) do
                pcall(function()
                    ZFKLF__H:FireServer("ðŸ§ˆ", p9, p7, k, v191, Position, v)
                end)
                if k % 3 == 0 then
                    task.wait(0.03)
                end
            end

            if p9:FindFirstChild("Hitmarker") then
                p9.Hitmarker:Fire(v191)
            end
        end)
        t1.value1:Notify({
			Title = "Silent Aim",
			Content = "Enabled",
			Duration = 3
		})

        return
    end

    if t1.value20.SilentAimCircle then
        t1.value20.SilentAimCircle:Remove()
        t1.value20.SilentAimCircle = nil
    end

    if getgenv().SilentAimRenderConn then
        getgenv().SilentAimRenderConn:Disconnect()
    end

    if getgenv().SilentAimVisualizeConn then
        getgenv().SilentAimVisualizeConn:Disconnect()
    end

    t1.value1:Notify({
		Title = "Silent Aim",
		Content = "Disabled",
		Duration = 3
	})
end
function v12.Callback(p13)
    t1.value19.SilentAim.TargetParts = { p13 }
end
function v13.Callback(p14)
    t1.value13 = p14

    local value1_2 = t1.value1

    if p14 then
        p14 = "Enabled"
    end

    local v77 = p14 or "Disabled"

    value1_2:Notify({
		Title = "Wall Check Status",
		Content = v77,
		Duration = 3
	})
end
function v14.Callback(p15)
    t1.value14 = p15

    local value1_3 = t1.value1

    if p15 then
        p15 = "Enabled"
    end

    local v80 = p15 or "Disabled"

    value1_3:Notify({
		Title = "Team Check Status",
		Content = v80,
		Duration = 3
	})
end
function v15.Callback(p16)
    t1.value15 = p16

    local value1_4 = t1.value1

    if p16 then
        p16 = "Enabled"
    end

    local v83 = p16 or "Disabled"

    value1_4:Notify({
		Title = "Alive Check Status",
		Content = v83,
		Duration = 3
	})
end
function t1.value22.Callback(p19)
    if p19 then
        local ok, result = pcall(function()
            return loadstring(game:HttpGet("https://pastebin.com/raw/vMEADuA2", true))()
        end)
        local value1_6 = t1.value1
        local v95 = if not ok then "Failed to Load: " .. tostring(result) else "Script Loaded Successfully"
        local Notify = value1_6.Notify
        local v97 = not ok and 5 or 3

        Notify(value1_6, {
			Title = "Full Bright Status",
			Content = v95,
			Duration = v97
		})

        if not ok then
            t1.value22:SetValue(false)

            return
        end
    else
        t1.value1:Notify({
			Title = "Full Bright",
			Content = "Script Disabled",
			Duration = 3
		})
    end
end
function v19.Callback(p20)
    t1.value18.InfiniteStamina = p20

    if p20 then
        if not getgenv().StaminaHooked then
            local S_Take = getrenv()._G.S_Take
            local targets = {}

            if S_Take then
                table.insert(targets, S_Take)

                local ok, upval = pcall(getupvalue, S_Take, 2)

                if ok and type(upval) == "function" and upval ~= S_Take then
                    table.insert(targets, upval)
                end
            end

            for _, target in pairs(targets) do
                local oldStamina = hookfunction(target, function(p21, ...)
                    if t1.value18.InfiniteStamina then
                        p21 = 0
                    end

                    if oldStamina then
                        return oldStamina(p21, ...)
                    end
                end)
            end

            getgenv().StaminaHooked = true
        end

        if not getgenv().StaminaLoopRunning then
            getgenv().StaminaLoopRunning = true

            local SprintTing

            for _, v in pairs(getgc(true)) do
                if type(v) == "function" and (debug.info(v, "n") or "") == "SprintTing" then
                    local okEnv, env = pcall(getfenv, v)

                    if okEnv and env and env.script and env.script.Name == "XIIX" then
                        SprintTing = v
                        break
                    end
                end
            end

            task.spawn(function()
                while t1.value18.InfiniteStamina do
                    task.wait()

                    local S_Take = getrenv()._G.S_Take

                    if S_Take then
                        local ok, upvals = pcall(debug.getupvalues, S_Take)

                        if ok and upvals and type(upvals[1]) == "table" then
                            local StaminaTable = upvals[1]

                            for k, v in pairs(StaminaTable) do
                                if type(v) == "number" and v >= 0 and v <= 100 then
                                    StaminaTable[k] = 100
                                end
                            end
                        end
                    end

                    if SprintTing then
                        local ok, upvals = pcall(debug.getupvalues, SprintTing)

                        if ok and upvals and type(upvals[7]) == "table" and type(upvals[7].S) == "number" then
                            upvals[7].S = 100
                        end
                    end

                    local Character = t1.value5.Character

                    if Character then
                        for _, v in pairs(Character:GetDescendants()) do
                            if v:IsA("NumberValue") and string.lower(v.Name):find("stamina") then
                                v.Value = 100
                            end
                        end
                    end

                    local pStamina = t1.value5:FindFirstChild("Stamina")

                    if pStamina and pStamina:IsA("NumberValue") then
                        pStamina.Value = 100
                    end

                    local CharStats = t1.value8:FindFirstChild("CharStats")

                    if CharStats then
                        local Stats = CharStats:FindFirstChild(t1.value5.Name)

                        if Stats then
                            local s = Stats:FindFirstChild("Stamina")

                            if s and s:IsA("NumberValue") then
                                s.Value = 100
                            end
                        end
                    end
                end

                getgenv().StaminaLoopRunning = false
            end)
        end
        t1.value1:Notify({
			Title = "Infinite Stamina",
			Content = "Enabled",
			Duration = 3
		})

        return
    end

    t1.value1:Notify({
		Title = "Infinite Stamina",
		Content = "Disabled",
		Duration = 3
	})
end
function v20.Callback(p22)
    if p22 then
        local Character = t1.value5.Character

        if not Character then
            Character = t1.value5.CharacterAdded:Wait()
        end

        local HumanoidRootPart = Character:WaitForChild("HumanoidRootPart")
        local u102 = false

        local function v103()
            u102 = not u102

            local value1_7 = t1.value1
            local v199 = not u102 and "Rotation Stopped" or "Rotation Started"

            value1_7:Notify({
				Title = "Rotation Status",
				Content = v199,
				Duration = 2
			})

            if u102 then
                while u102 do
                    HumanoidRootPart.CFrame = HumanoidRootPart.CFrame * CFrame.Angles(0, 3.490658503988659, 0)
                    task.wait(0.1)
                end
            end
        end

        local connection = t1.value3.InputBegan:Connect(function(input, gameProcessed)
            local v202 = not gameProcessed

            if v202 then
                v202 = input.KeyCode == Enum.KeyCode.P
            end

            if v202 then
                v103()
            end
        end)

        getgenv().RotationConn = connection
        t1.value1:Notify({
			Title = "Rotation Script",
			Content = "Rotation Enabled",
			Duration = 3
		})

        return
    end

    if getgenv().RotationConn then
        getgenv().RotationConn:Disconnect()
    end

    t1.value1:Notify({
		Title = "Rotation Script",
		Content = "Rotation Disabled",
		Duration = 3
	})
end
function v22.Callback(p23)
    t1.value18.GunMods.NoRecoil = p23

    if p23 then
        local connection = t1.value5.Character.ChildAdded:Connect(function(child)
            if child:IsA("Tool") then
                for _, v in pairs(getgc(true)) do
                    local v206 = type(v) == "table"

                    if v206 then
                        v206 = rawget(v, "EquipTime")
                    end

                    if v206 and t1.value18.GunMods.NoRecoil then
                        v.Recoil = 0
                        v.CameraRecoilingEnabled = false
                        v.AngleX_Min = 0
                        v.AngleX_Max = 0
                        v.AngleY_Min = 0
                        v.AngleY_Max = 0
                        v.AngleZ_Min = 0
                        v.AngleZ_Max = 0
                    end
                end
            end
        end)

        getgenv().NoRecoilConn = connection
        t1.value1:Notify({
			Title = "No Recoil",
			Content = "Enabled",
			Duration = 3
		})

        return
    end

    if getgenv().NoRecoilConn then
        getgenv().NoRecoilConn:Disconnect()
    end

    t1.value1:Notify({
		Title = "No Recoil",
		Content = "Disabled",
		Duration = 3
	})
end
local function v35()
    local ESPPlayers = {}

    if getgenv().EspLoopRunning then
        return
    end
    getgenv().EspLoopRunning = true

    local function DestroyESP(player)
        local esp = ESPPlayers[player]
        if esp then
            pcall(function()
                if esp.Highlight then
                    esp.Highlight:Destroy()
                end
                if esp.Screen then
                    esp.Screen:Destroy()
                end
            end)
            ESPPlayers[player] = nil
        end
    end

    local onRemoveConn = t1.value9.PlayerRemoving:Connect(DestroyESP)

    local function GetESP(player)
        local esp = ESPPlayers[player]
        if not esp then
            esp = {}

            esp.Screen = Instance.new("ScreenGui")
            esp.Screen.IgnoreGuiInset = true
            esp.Screen.ResetOnSpawn = false
            esp.Screen.Parent = t1.value10:FindFirstChild("PlayerGui") or t1.value10.PlayerGui

            esp.InvFrame = Instance.new("Frame")
            esp.InvFrame.BackgroundTransparency = 1
            esp.InvFrame.BorderSizePixel = 0
            esp.InvFrame.Size = UDim2.fromOffset(200, 40)
            esp.InvFrame.Position = UDim2.fromScale(0.5, 0.5)
            esp.InvFrame.AnchorPoint = Vector2.new(0.5, 1)
            esp.InvFrame.Visible = false
            esp.InvFrame.Parent = esp.Screen

            esp.NameLabel = Instance.new("TextLabel")
            esp.NameLabel.BackgroundTransparency = 1
            esp.NameLabel.BorderSizePixel = 0
            esp.NameLabel.Size = UDim2.new(0, 200, 0, 34)
            esp.NameLabel.Position = UDim2.fromScale(0.5, 0.5)
            esp.NameLabel.AnchorPoint = Vector2.new(0.5, 1)
            esp.NameLabel.Font = Enum.Font.GothamBold
            esp.NameLabel.TextScaled = true
            esp.NameLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
            esp.NameLabel.TextStrokeTransparency = 0
            esp.NameLabel.Text = ""
            esp.NameLabel.Visible = false
            esp.NameLabel.Parent = esp.Screen

            esp.FaceImage = Instance.new("ImageLabel")
            esp.FaceImage.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
            esp.FaceImage.BackgroundTransparency = 0.3
            esp.FaceImage.BorderSizePixel = 0
            esp.FaceImage.Size = UDim2.fromOffset(48, 48)
            esp.FaceImage.Position = UDim2.fromScale(0.5, 0.5)
            esp.FaceImage.AnchorPoint = Vector2.new(0.5, 1)
            esp.FaceImage.Visible = false
            esp.FaceImage.Parent = esp.Screen
            pcall(function()
                esp.FaceImage.Image = "rbxthumb://type=AvatarHeadShot&id=" .. player.UserId .. "&w=150&h=150"
            end)
            local faceCorner = Instance.new("UICorner")
            faceCorner.CornerRadius = UDim.new(1, 0)
            faceCorner.Parent = esp.FaceImage
            local faceStroke = Instance.new("UIStroke")
            faceStroke.Thickness = 2
            faceStroke.Color = Color3.fromRGB(255, 255, 255)
            faceStroke.Parent = esp.FaceImage

            ESPPlayers[player] = esp
        end
        return esp
    end

    local function EnsureHighlight(esp)
        if esp.Highlight and esp.Highlight.Parent then
            return esp.Highlight
        end
        if esp.Highlight then
            pcall(function() esp.Highlight:Destroy() end)
            esp.Highlight = nil
        end
        local hl = Instance.new("Highlight")
        hl.FillColor = Color3.fromRGB(255, 255, 255)
        hl.FillTransparency = 1
        hl.OutlineColor = Color3.fromRGB(255, 255, 255)
        hl.OutlineTransparency = 0
        hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
        esp.Highlight = hl
        return hl
    end

    local function NormalizeImage(id)
        if not id then return nil end
        id = tostring(id):match("%d+")
        if not id then return nil end
        return "rbxassetid://" .. id
    end

    local function GetItemImage(item)
        local names = {
            "TextureId", "TextureID", "textureid",
            "ItemId", "ItemID", "itemid", "ImageId", "ImageID", "imageid",
            "IconId", "IconID", "iconid", "Icon", "ItemIcon"
        }
        for _, name in ipairs(names) do
            local ok, v = pcall(function() return item:GetAttribute(name) end)
            if ok and v then
                return NormalizeImage(v)
            end
        end
        for _, name in ipairs(names) do
            local ok, v = pcall(function() return item[name] end)
            if ok and v and type(v) ~= "table" then
                return NormalizeImage(v)
            end
        end
        for _, child in ipairs(item:GetChildren()) do
            if child:IsA("Decal") or child:IsA("Texture") or child:IsA("SurfaceGui") then
                local ok, v = pcall(function() return child.TextureId or child.Image end)
                if ok and v and tostring(v) ~= "" then
                    return NormalizeImage(v)
                end
            end
        end
        return nil
    end

    local function UpdateInventory(esp, plr, Character)
        local displayName = plr.DisplayName or plr.Name
        local nameText = displayName .. "\n@" .. plr.Name
        if esp.NameLabel.Text ~= nameText then
            esp.NameLabel.Text = nameText
        end

        local headPart = Character:FindFirstChild("Head")
        local headWorld = headPart and headPart.Position + Vector3.new(0, 5, 0)

        local feetPos = nil
        local feetNames = {
            "LeftFoot", "RightFoot", "LeftFootAttachment", "RightFootAttachment",
            "LeftToeBase", "RightToeBase", "LowerTorso", "Torso", "HumanoidRootPart"
        }
        for _, name in ipairs(feetNames) do
            local part = Character:FindFirstChild(name)
            if part and part:IsA("BasePart") then
                local size = part.Size.Y or 0
                feetPos = part.Position - Vector3.new(0, size / 2, 0)
                break
            end
        end
        if not feetPos then
            local lowestPart = nil
            local lowestY = math.huge
            for _, part in pairs(Character:GetDescendants()) do
                if part:IsA("BasePart") then
                    local bottom = part.Position.Y - (part.Size.Y / 2)
                    if bottom < lowestY then
                        lowestY = bottom
                        lowestPart = part
                    end
                end
            end
            if lowestPart then
                feetPos = lowestPart.Position - Vector3.new(0, lowestPart.Size.Y / 2, 0)
            end
        end

        local worldPos = feetPos and feetPos - Vector3.new(0, 1.5, 0)
        if worldPos then
            local cam = t1.value7

            local function project(pos)
                if not pos then return nil end
                local screenPos, onScreen = cam:WorldToViewportPoint(pos)
                local inFront = screenPos.Z > 0
                local x = screenPos.X
                local y = screenPos.Y
                if onScreen and inFront and x > -20 and x < cam.ViewportSize.X + 20 and y > -20 and y < cam.ViewportSize.Y + 20 then
                    return UDim2.fromOffset(x, y)
                end
                return nil
            end

            local invPos = project(worldPos)
            local namePos = project(headWorld)

            if t1.value17.ESPInventory and invPos then
                esp.InvFrame.Visible = true
                esp.InvFrame.Position = invPos
            else
                esp.InvFrame.Visible = false
            end

            if t1.value17.ESPNames and namePos then
                esp.NameLabel.Visible = true
                esp.NameLabel.Position = namePos
                if esp.FaceImage then
                    esp.FaceImage.Visible = true
                    esp.FaceImage.Position = UDim2.fromOffset(namePos.X.Offset, namePos.Y.Offset - 38)
                end
            else
                esp.NameLabel.Visible = false
                if esp.FaceImage then
                    esp.FaceImage.Visible = false
                end
            end
        else
            esp.InvFrame.Visible = false
            esp.NameLabel.Visible = false
            if esp.FaceImage then
                esp.FaceImage.Visible = false
            end
        end

        local backpack = plr:FindFirstChild("Backpack")
        local items = {}
        local handItem = Character:FindFirstChildOfClass("Tool")
        if handItem then
            local img = GetItemImage(handItem)
            if img then
                table.insert(items, { img = img, inHand = true })
            end
        end
        if backpack then
            for _, item in ipairs(backpack:GetChildren()) do
                if item == handItem then continue end
                local img = GetItemImage(item)
                if img then
                    table.insert(items, { img = img, inHand = false })
                end
            end
        end

        local signature = ""
        for _, entry in ipairs(items) do
            signature = signature .. (entry.inHand and "H" or "I") .. entry.img .. "|"
        end
        if esp.LastInv ~= signature then
            esp.LastInv = signature

            for _, child in ipairs(esp.InvFrame:GetChildren()) do
                if child ~= esp.NameLabel then
                    child:Destroy()
                end
            end

            local cols = 8
            local iconSize = 26
            local gap = 2
            for idx, entry in ipairs(items) do
                local row = math.floor((idx - 1) / cols)
                local col = (idx - 1) % cols

                local label = Instance.new("ImageLabel")
                label.Image = entry.img
                label.BackgroundTransparency = 1
                label.BorderSizePixel = 0
                label.Size = UDim2.fromOffset(iconSize, iconSize)
                label.Position = UDim2.fromOffset(col * (iconSize + gap), row * (iconSize + gap))
                label.Parent = esp.InvFrame

                local stroke = Instance.new("UIStroke")
                stroke.Thickness = 2
                stroke.Color = entry.inHand and Color3.fromRGB(255, 60, 60) or Color3.fromRGB(60, 255, 60)
                stroke.Parent = label
            end

            local rows = math.max(1, math.ceil(#items / cols))
            esp.InvFrame.Size = UDim2.fromOffset(cols * (iconSize + gap), rows * (iconSize + gap))
        end
    end

    local function HealthColor(ratio)
        ratio = math.clamp(ratio, 0, 1)
        if ratio >= 0.5 then
            local t = (ratio - 0.5) / 0.5
            return Color3.fromRGB(
                math.floor(255 - (255 - 255) * t),
                math.floor(128 + (255 - 128) * t),
                0
            )
        else
            local t = ratio / 0.5
            return Color3.fromRGB(255, math.floor(128 * t), 0)
        end
    end

    while (t1.value17.ESP or t1.value17.ESPNames or t1.value17.ESPInventory) and not _G.AbortEverything do
        for _, player in pairs(t1.value9:GetPlayers()) do
            if player ~= t1.value10 then
                local ok = pcall(function()
                    local sameTeam = player.Team and t1.value10.Team and player.Team == t1.value10.Team
                    if not sameTeam then
                        local esp = GetESP(player)
                        local Character = player.Character

                        if Character then
                            local hl = EnsureHighlight(esp)
                            if hl.Adornee ~= Character then
                                hl.Adornee = Character
                            end
                            if hl.Parent ~= Character then
                                hl.Parent = Character
                            end
                            hl.Enabled = t1.value17.ESP

                            if t1.value17.ESP then
                                local Humanoid = Character:FindFirstChildOfClass("Humanoid")
                                if Humanoid then
                                    local ratio = Humanoid.Health / Humanoid.MaxHealth
                                    local color = HealthColor(ratio)
                                    hl.FillTransparency = 1
                                    hl.OutlineTransparency = 0
                                    hl.OutlineColor = color
                                end
                            end

                            UpdateInventory(esp, player, Character)
                        else
                            if esp.Highlight then
                                esp.Highlight.Enabled = false
                            end
                            esp.InvFrame.Visible = false
                            esp.NameLabel.Visible = false
                            if esp.FaceImage then
                                esp.FaceImage.Visible = false
                            end
                        end
                    end
                end)

                if not ok then
                    local esp = ESPPlayers[player]
                    if esp and esp.Highlight then
                        pcall(function() esp.Highlight.Enabled = false end)
                    end
                end
            end
        end
        task.wait()
    end

    for _, esp in pairs(ESPPlayers) do
        pcall(function()
            if esp.Highlight then
                esp.Highlight:Destroy()
            end
            if esp.Screen then
                esp.Screen:Destroy()
            end
        end)
    end
    if onRemoveConn then
        onRemoveConn:Disconnect()
    end
    getgenv().EspLoopRunning = nil
end
function v23.Callback(p24)
    t1.value17.ESP = p24
    if t1.value17.ESP or t1.value17.ESPNames or t1.value17.ESPInventory then
        spawn(v35)
    end
end
function vEspNames.Callback(pEspNames)
    t1.value17.ESPNames = pEspNames
    if t1.value17.ESP or t1.value17.ESPNames or t1.value17.ESPInventory then
        spawn(v35)
    end
end
local vDealerEsp = v16:AddToggle("DealerESPToggle", {
	Text = "ESP Vendedor palanca",
	Tooltip = "Marca al vendedor con stock de Crowbar",
	Default = false,
	Callback = function(value)
		if value then getgenv().DealerEspStart() else getgenv().DealerEspStop() end
	end
})
function vEspInventory.Callback(pEspInv)
    t1.value17.ESPInventory = pEspInv
    if t1.value17.ESP or t1.value17.ESPNames or t1.value17.ESPInventory then
        spawn(v35)
    end
end
function v25.Callback(p25)
    if p25 then
        local function v118(...)
            for _, v in pairs({ ... }) do
                if v.Parent then
                    local UIScale = v.Parent:FindFirstChild("UIScale")
                    if UIScale then
                        UIScale.Scale = 10
                    end
                end

                local v209 = v.AbsolutePosition.Y >= 450

                if v209 then
                    v209 = v.AbsolutePosition.Y <= 550
                end

                if v209 then
                    mouse1click()
                    task.wait(0.1)
                    mouse1release()
                end
            end
        end

        local connection = t1.value4.RenderStepped:Connect(function()
            local LockpickGUI = game.Players.LocalPlayer:WaitForChild("PlayerGui"):FindFirstChild("LockpickGUI")

            if LockpickGUI then
                local Selection = LockpickGUI.MF.LP_Frame.Frames.B1.Bar.Selection
                local Selection2 = LockpickGUI.MF.LP_Frame.Frames.B2.Bar.Selection
                local Selection3 = LockpickGUI.MF.LP_Frame.Frames.B3.Bar.Selection

                v118(Selection, Selection2, Selection3)
            end
        end)

        getgenv().LockpickConn = connection
        t1.value1:Notify({
			Title = "Lockpick Status",
			Content = "No Fail Lockpick Enabled",
			Duration = 3
		})

        return
    end

    if getgenv().LockpickConn then
        getgenv().LockpickConn:Disconnect()
    end

    t1.value1:Notify({
		Title = "Lockpick Status",
		Content = "No Fail Lockpick Disabled",
		Duration = 3
	})
end
function v26.Callback(p26)
    t1.value17.FastPickup = p26

    if p26 then
        for _, descendant in ipairs(game:GetDescendants()) do
            local v123 = descendant

            if v123:IsA("ProximityPrompt") then
                v123.HoldDuration = 0
                v123:GetPropertyChangedSignal("HoldDuration"):Connect(function()
                    if t1.value17.FastPickup then
                        v123.HoldDuration = 0
                    end
                end)
            end
        end

        local connection = game.DescendantAdded:Connect(function(descendant)
            if descendant:IsA("ProximityPrompt") then
                descendant.HoldDuration = 0
                descendant:GetPropertyChangedSignal("HoldDuration"):Connect(function()
                    if t1.value17.FastPickup then
                        descendant.HoldDuration = 0
                    end
                end)
            end
        end)

        getgenv().FastPickupConn = connection
        t1.value1:Notify({
			Title = "No Pickup Cooldown",
			Content = "Enabled",
			Duration = 3
		})

        return
    end

    if getgenv().FastPickupConn then
        getgenv().FastPickupConn:Disconnect()
    end

    t1.value1:Notify({
		Title = "No Pickup Cooldown",
		Content = "Disabled",
		Duration = 3
	})
end
function t1.value25()
    local GNX_R = t1.value8.Events:FindFirstChild("GNX_R")
    if not GNX_R then
        return
    end

    while t1.value17.InstantReload do
        local Character = t1.value10.Character

        if Character then
            local Tool = Character:FindFirstChildOfClass("Tool")
            local v128 = Tool

            if Tool then
                v128 = Tool:FindFirstChild("IsGun")
            end

            if v128 then
                local Values = Tool:FindFirstChild("Values")
                local SERVER_StoredAmmo = Values and Values:FindFirstChild("SERVER_StoredAmmo")

                if SERVER_StoredAmmo and SERVER_StoredAmmo.Value ~= 0 then
                    pcall(function()
                        GNX_R:FireServer(tick(), "KLWE89U0", Tool)
                    end)
                end
            end
        end

        task.wait(0.8)
    end
end
function v27.Callback(p27)
    t1.value17.InstantReload = p27

    if p27 then
        t1.value1:Notify({
			Title = "Instant Reload",
			Content = "Enabled",
			Duration = 3
		})
        spawn(t1.value25)

        return
    end

    t1.value1:Notify({
		Title = "Instant Reload",
		Content = "Disabled",
		Duration = 3
	})
end
function t1.value26()
    local PIC_PU = t1.value8.Events:FindFirstChild("PIC_PU")
    local SpawnedPiles = workspace.Filter:FindFirstChild("SpawnedPiles")
    local v133 = true
    local timestamp = tick()

    while t1.value17.AutoPickupScraps do
        if PIC_PU and SpawnedPiles then
            local v135 = (function()
                local n3 = 15
                local v216
                for _, child in pairs(SpawnedPiles:GetChildren()) do
                    local v219 = child

                    if child then
                        v219 = child.Name == "S1"

                        if not v219 then
                            v219 = child.Name == "S2"
                        end
                    end

                    if v219 then
                        local Character = t1.value10.Character

                        if Character then
                            Character = t1.value10.Character.HumanoidRootPart
                        end

                        if Character then
                            local Part = child:FindFirstChild("MeshPart") or (child:IsA("BasePart") and child)

                            if Part then
                                local Magnitude = (Character.Position - Part.Position).Magnitude

                                if Magnitude < n3 then
                                    v216 = child
                                    n3 = Magnitude
                                end
                            end
                        end
                    end
                end

                return v216
            end)()

            if v135 and v133 then
                local attr = v135:GetAttribute("jzu")
                if attr then
                    PIC_PU:FireServer(string.reverse(attr))
                    v133 = false
                end
            end
        end

        if not v133 and tick() - timestamp >= 4.5 then
            timestamp = tick()
            v133 = true
        end

        task.wait(0.1)
    end
end
function v28.Callback(p28)
    t1.value17.AutoPickupScraps = p28

    if p28 then
        t1.value1:Notify({
			Title = "Auto Pickup Scraps",
			Content = "Enabled",
			Duration = 3
		})
        spawn(t1.value26)

        return
    end

    t1.value1:Notify({
		Title = "Auto Pickup Scraps",
		Content = "Disabled",
		Duration = 3
	})
end
local function v36()
    local PIC_TLO = t1.value8.Events:FindFirstChild("PIC_TLO")
    local SpawnedTools = workspace.Filter:FindFirstChild("SpawnedTools")
    local v139 = true
    local timestamp = tick()

    while t1.value17.AutoPickupTools do
        if PIC_TLO and SpawnedTools then
            local v141 = (function()
                local n4 = 15
                local v223
                for _, child in pairs(SpawnedTools:GetChildren()) do
                    local v226 = child

                    if child then
                        v226 = t1.value10.Character

                        if v226 then
                            v226 = t1.value10.Character.HumanoidRootPart
                        end
                    end

                    if v226 then
                        local Handle = child:FindFirstChild("Handle")

                        if not Handle then
                            Handle = child:FindFirstChild("WeaponHandle")
                        end

                        local v228 = Handle

                        if Handle then
                            v228 = Handle:IsA("Part") or Handle:IsA("MeshPart")
                        end

                        if v228 then
                            local Magnitude = (t1.value10.Character.HumanoidRootPart.Position - Handle.Position).Magnitude

                            if Magnitude < n4 then
                                n4 = Magnitude
                                v223 = child
                            end
                        end
                    end
                end

                return v223
            end)()

            if v141 then
                local Handle = v141:FindFirstChild("Handle")

                if not Handle then
                    Handle = v141:FindFirstChild("WeaponHandle")
                end

                if Handle and v139 then
                    PIC_TLO:FireServer(Handle)
                    v139 = false
                end
            end
        end

        if not v139 and tick() - timestamp >= 1.5 then
            v139 = true
            timestamp = tick()
        end

        task.wait(0.1)
    end
end
function v29.Callback(p29)
    t1.value17.AutoPickupTools = p29

    if p29 then
        t1.value1:Notify({
			Title = "Auto Pickup Tools",
			Content = "Enabled",
			Duration = 3
		})
        spawn(v36)

        return
    end

    t1.value1:Notify({
		Title = "Auto Pickup Tools",
		Content = "Disabled",
		Duration = 3
	})
end
local function v37()
    local SpawnedCrates = workspace.Filter:FindFirstChild("SpawnedCrates")
    local PIC_CR = t1.value8.Events:FindFirstChild("PIC_CR")
    local v147 = true
    local timestamp = tick()

    while t1.value17.AutoPickupCrates do
        if SpawnedCrates and PIC_CR then
            local v149 = (function()
                local n5 = 15
                local v231
                for _, child in pairs(SpawnedCrates:GetChildren()) do
                    local Character = t1.value10.Character

                    if Character then
                        Character = Character.HumanoidRootPart
                    end

                    if Character then
                        local Target = child:FindFirstChild("Handle") or (child:IsA("BasePart") and child)

                        if Target then
                            local Magnitude = (Character.Position - Target.Position).Magnitude

                            if Magnitude < n5 then
                                n5 = Magnitude
                                v231 = child
                            end
                        end
                    end
                end

                return v231
            end)()

            if v149 and v147 then
                PIC_CR:FireServer(v149)
                v147 = false
            end
        end

        if not v147 and tick() - timestamp >= 1 then
            v147 = true
            timestamp = tick()
        end

        task.wait(0.1)
    end
end
function v30.Callback(p30)
    t1.value17.AutoPickupCrates = p30

    if p30 then
        t1.value1:Notify({
			Title = "Auto Pickup Crates",
			Content = "Enabled",
			Duration = 3
		})
        spawn(v37)

        return
    end

    t1.value1:Notify({
		Title = "Auto Pickup Crates",
		Content = "Disabled",
		Duration = 3
	})
end
local function v38()
    local CZDPZUS = t1.value8.Events:FindFirstChild("CZDPZUS")
    local SpawnedBread = workspace.Filter:FindFirstChild("SpawnedBread")
    local v147 = true
    local timestamp = tick()

    while t1.value17.AutoPickupMoney do
        if CZDPZUS and SpawnedBread then
            local v149 = (function()
                local n5 = 15
                local v231
                for _, child in pairs(SpawnedBread:GetChildren()) do
                    local v234 = child

                    if child then
                        v234 = t1.value10.Character

                        if v234 then
                            v234 = t1.value10.Character.HumanoidRootPart
                        end
                    end

                    if v234 then
                        local Magnitude = (t1.value10.Character.HumanoidRootPart.Position - child.Position).Magnitude

                        if Magnitude < n5 then
                            v231 = child
                            n5 = Magnitude
                        end
                    end
                end

                return v231
            end)()

            if v149 and v147 then
                CZDPZUS:FireServer(v149)
                v147 = false
            end
        end

        if not v147 and tick() - timestamp >= 1 then
            v147 = true
            timestamp = tick()
        end

        task.wait(0.1)
    end
end
local vNoclip = v24:AddToggle("NoclipToggle", {
	Text = "Noclip",
	Tooltip = "Atraviesa paredes",
	Default = false,
	Callback = function(value)
		if value then getgenv().PastelNoclipStart() else getgenv().PastelNoclipStop() end
	end
})
v24:AddButton({
	Text = "FPS Boost",
	Tooltip = "Quita sombras y efectos para mas FPS (una vez)",
	Callback = function()
		getgenv().PastelFpsBoost()
	end
})
function v31.Callback(p31)
    t1.value17.AutoPickupMoney = p31

    if p31 then
        t1.value1:Notify({
			Title = "Auto Pickup Money",
			Content = "Enabled",
			Duration = 3
		})
        spawn(v38)

        return
    end

    t1.value1:Notify({
		Title = "Auto Pickup Money",
		Content = "Disabled",
		Duration = 3
	})
end

-- ============================================
-- ATM FARM (tomado de "atms kaleth")
-- ============================================
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local PathfindingService = game:GetService("PathfindingService")
local LocalPlayer = Players.LocalPlayer
local VirtualInputManager = game:GetService("VirtualInputManager")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")

local Settings = {
    Enabled = false,
    IsDead = false,
    IgnoredList = {},
    ProcessedList = {},
    TempIgnored = {},
    IgnoreDuration = 60,
    DebugPrintEnabled = true,
    TargetY = 4.8,
    MoveSpeed = 10,
    WaypointSpacing = 3,
    PickupDistance = 8,
    PickupWait = 0.35,
    AllowanceEnabled = true,
    AllowanceInterval = 900,
    AllowanceRetryDelay = 60,
    DepositEnabled = true,
    DepositThreshold = 5000,
    DepositFixedAmount = 1500,
    BankSearchRadius = 500,
    RequireMoney = false,
    MoneySearchRadius = 25,
    HackNoCooldown = true,
    BetweenBoxesDelay = 0.3,
    MoneyRetryDelay = 0.5,
    MoneyRetryAttempts = 2,
    MoneyPickupWait = 0.15,
    DepositEveryNBoxes = 10
}

local StatusText = "Esperando"
local IsRising = false
local HasReachedTargetY = false
local RetryCount = 0
local LastShopMainPart = nil
local SortedTargets = {}
local AvailableSafes = {}
local AvailableRegisters = {}
local TotalSafesCount = 0
local TotalRegistersCount = 0
local AvailableSafesCount = 0
local AvailableRegistersCount = 0
local BoxesOpened = 0
local LastBoxesDeposit = tick()

local function Log(msg)
    if Settings.DebugPrintEnabled then
        print("[ATM Script]", msg)
    end
end

-- ===== PressE (presionar tecla E) =====
local function PressE()
    VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.E, false, game)
    task.wait(0.1)
    VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.E, false, game)
end

-- ===== Anti-AFK =====
local VirtualUser = game:GetService("VirtualUser")
local AntiAfkEnabled = true
local AntiAfkConnection = nil

local function EnableAntiAfk()
    if AntiAfkConnection then return end
    AntiAfkConnection = LocalPlayer.Idled:Connect(function()
        if AntiAfkEnabled then
            VirtualUser:CaptureController()
            VirtualUser:ClickButton2(Vector2.new())
            Log("Anti-AFK activado")
        end
    end)
    Log("Anti-AFK iniciado")
end

local function DisableAntiAfk()
    if AntiAfkConnection then
        AntiAfkConnection:Disconnect()
        AntiAfkConnection = nil
    end
    Log("Anti-AFK detenido")
end


-- ===== Auto recoger dinero (para juntar los $5000) =====
local AutoPickupRunning = false
local AutoPickupConnection = nil

local function StartAutoPickup()
    if AutoPickupRunning then return end
    AutoPickupRunning = true
    if AutoPickupConnection then
        AutoPickupConnection:Disconnect()
        AutoPickupConnection = nil
    end
    task.spawn(function()
        while AutoPickupRunning and not _G.AbortEverything do
            task.wait(0.1)
            if not AutoPickupRunning or Settings.IsDead then continue end
            local spawnedBreadFolder = Workspace:FindFirstChild("Filter") and Workspace.Filter:FindFirstChild("SpawnedBread")
            local pickupEvent = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("CZDPZUS")
            if not spawnedBreadFolder or not pickupEvent then continue end
            local character = LocalPlayer.Character
            local hrp = character and character:FindFirstChild("HumanoidRootPart")
            if not hrp then continue end
            local charPos = hrp.Position
            for _, breadPart in ipairs(spawnedBreadFolder:GetChildren()) do
                if (charPos - breadPart.Position).Magnitude <= Settings.PickupDistance then
                    pcall(function() pickupEvent:FireServer(breadPart) end)
                    task.wait(Settings.PickupWait)
                    break
                end
            end
        end
    end)
end

local function StopAutoPickup()
    if not AutoPickupRunning then return end
    AutoPickupRunning = false
    if AutoPickupConnection then
        AutoPickupConnection:Disconnect()
        AutoPickupConnection = nil
    end
end

Log("Auto-recolecciÃ³n de dinero activado")

-- ===== Invis R6 =====
do
    repeat task.wait() until game:IsLoaded()
    local clonerefSafe = cloneref or function(...) return ... end
    local services = setmetatable({}, { __index = function(_, k) return clonerefSafe(game:GetService(k)) end })
    local localPlayer = services.Players.LocalPlayer
    local character, humanoid, hrp

    local function updateChar()
        character = localPlayer.Character
        if character then
            hrp = character:FindFirstChild("HumanoidRootPart")
            humanoid = character:FindFirstChildOfClass("Humanoid")
        else
            hrp = nil
            humanoid = nil
        end
    end
    updateChar()

    local heartbeat = RunService.Heartbeat
    local renderStepped = RunService.RenderStepped
    local coreGui = game:GetService("CoreGui")
    local starterGui = game:GetService("StarterGui")

    local InvisPossible = true
    if character and not character:FindFirstChild("Torso") then
        pcall(function() starterGui:SetCore("SendNotification", { Title = "Invisibilidad NO FUNCIONA", Text = "Se requiere avatar R6", Duration = 5 }) end)
        InvisPossible = false
    end

    local warningGui = Instance.new("ScreenGui")
    warningGui.Name = "InvisWarningGUI"
    warningGui.Parent = coreGui
    warningGui.ResetOnSpawn = false
    warningGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

    local InvisWarningLabel = Instance.new("TextLabel", warningGui)
    InvisWarningLabel.Text = "Â¡ESTÃS VISIBLE!"
    InvisWarningLabel.Visible = false
    InvisWarningLabel.Size = UDim2.new(0, 200, 0, 30)
    InvisWarningLabel.Position = UDim2.new(0.5, -100, 0.85, 0)
    InvisWarningLabel.BackgroundTransparency = 1
    InvisWarningLabel.Font = Enum.Font.GothamSemibold
    InvisWarningLabel.TextSize = 24
    InvisWarningLabel.TextColor3 = Color3.fromRGB(255, 255, 0)
    InvisWarningLabel.TextStrokeTransparency = 0.5
    InvisWarningLabel.ZIndex = 10

    local InvisActive = false
    local InvisAnim = Instance.new("Animation")
    InvisAnim.AnimationId = "rbxassetid://215384594"
    local InvisAnimTrack = nil

    local function isGrounded()
        return humanoid and humanoid:IsDescendantOf(workspace) and humanoid.FloorMaterial ~= Enum.Material.Air
    end

    local function loadInvisAnim()
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        if humanoid then
            local success, track = pcall(function() return humanoid:LoadAnimation(InvisAnim) end)
            if success then
                InvisAnimTrack = track
                InvisAnimTrack.Priority = Enum.AnimationPriority.Action4
            else
                InvisAnimTrack = nil
            end
        else
            InvisAnimTrack = nil
        end
    end

    local function disableInvis()
        if not InvisActive then return end
        InvisActive = false
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
        end
        if humanoid then
            workspace.CurrentCamera.CameraSubject = humanoid
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency == 0.5 then
                    part.Transparency = 0
                end
            end
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = false
        end
    end

    local function enableInvis()
        if InvisActive or not InvisPossible then return end
        updateChar()
        if not character or not humanoid or not hrp then return end
        if not character:FindFirstChild("Torso") then
            pcall(function() starterGui:SetCore("SendNotification", { Title = "Invisibilidad NO FUNCIONA", Text = "Se requiere avatar R6", Duration = 5 }) end)
            return
        end
        InvisActive = true
        workspace.CurrentCamera.CameraSubject = hrp
        loadInvisAnim()
    end

    local function toggleInvis()
        if InvisActive then
            disableInvis()
        else
            enableInvis()
        end
        return InvisActive
    end

    _G.Invis_Enable = enableInvis
    _G.Invis_Disable = disableInvis
    _G.Invis_Toggle = toggleInvis
    _G.IsInvisEnabled = function() return InvisActive end

    localPlayer.CharacterAdded:Connect(function(newChar)
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        task.wait()
        updateChar()
        if not humanoid then
            task.wait(0.5)
            updateChar()
            if not humanoid then
                InvisPossible = false
                if InvisActive then disableInvis() end
                pcall(function() starterGui:SetCore("SendNotification", { Title = "Error de invisibilidad", Text = "No se pudo determinar el tipo de personaje", Duration = 5 }) end)
                return
            end
        end
        if humanoid.RigType ~= Enum.HumanoidRigType.R6 then
            InvisPossible = false
            if InvisActive then disableInvis() end
            pcall(function() starterGui:SetCore("SendNotification", { Title = "Aviso", Text = "Detectado avatar no-R6. Invisibilidad desactivada", Duration = 5 }) end)
            return
        else
            InvisPossible = true
        end
        if InvisActive then
            if hrp then workspace.CurrentCamera.CameraSubject = hrp end
            loadInvisAnim()
        end
    end)

    localPlayer.CharacterRemoving:Connect(function()
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency == 0.5 then
                    part.Transparency = 0
                end
            end
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = false
        end
    end)

    heartbeat:Connect(function(dt)
        if not InvisActive or not InvisPossible then
            if InvisWarningLabel then
                InvisWarningLabel.Visible = false
            end
            return
        end
        if not character or not humanoid or not hrp or not humanoid:IsDescendantOf(workspace) or humanoid.Health <= 0 then
            if InvisWarningLabel then InvisWarningLabel.Visible = false end
            return
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = not isGrounded()
        end

        local speed = 12
        if humanoid.MoveDirection.Magnitude > 0 then
            local move = humanoid.MoveDirection * speed * dt
            hrp.CFrame = hrp.CFrame + move
        end

        local originalCF = hrp.CFrame
        local originalCamOffset = humanoid.CameraOffset
        local _, cameraYaw = workspace.CurrentCamera.CFrame:ToOrientation()

        hrp.CFrame = CFrame.new(hrp.CFrame.Position) * CFrame.fromOrientation(0, cameraYaw, 0)
        hrp.CFrame = hrp.CFrame * CFrame.Angles(math.rad(90), 0, 0)
        humanoid.CameraOffset = Vector3.new(0, 1.44, 0)

        if InvisAnimTrack then
            local success = pcall(function()
                if not InvisAnimTrack.IsPlaying then
                    InvisAnimTrack:Play()
                end
                InvisAnimTrack:AdjustSpeed(0)
                InvisAnimTrack.TimePosition = 0.3
            end)
            if not success then
                loadInvisAnim()
            end
        elseif humanoid and humanoid.Health > 0 then
            loadInvisAnim()
        end

        renderStepped:Wait()

        if humanoid and humanoid:IsDescendantOf(workspace) then
            humanoid.CameraOffset = originalCamOffset
        end
        if hrp and hrp:IsDescendantOf(workspace) then
            hrp.CFrame = originalCF
        end
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
        end
        if hrp and hrp:IsDescendantOf(workspace) then
            local lookVec = workspace.CurrentCamera.CFrame.LookVector
            local flatLook = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
            if flatLook.Magnitude > 0.1 then
                hrp.CFrame = CFrame.new(hrp.Position, hrp.Position + flatLook)
            end
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency ~= 1 then
                    part.Transparency = 0.5
                end
            end
        end
    end)
end

-- ===== Sin pegarse con paredes =====
task.spawn(function()
    while not _G.AbortEverything do
        task.wait(0.1)
        if Settings.Enabled and LocalPlayer.Character then
            pcall(function()
                for _, part in pairs(LocalPlayer.Character:GetDescendants()) do
                    if part:IsA("BasePart") then
                        part.CanCollide = false
                    end
                end
            end)
        end
    end
end)

local function DisableDoorsCollision()
    local map = Workspace:FindFirstChild("Map")
    if map then
        local doors = map:FindFirstChild("Doors")
        if doors then
            for _, door in ipairs(doors:GetDescendants()) do
                pcall(function() if door:IsA("BasePart") then door.CanCollide = false end end)
            end
        end
        Log("ColisiÃ³n de puertas desactivada")
    end
end
DisableDoorsCollision()

-- ===== Farm: herramientas =====
local function HasTool(toolName)
    local backpack = LocalPlayer:FindFirstChild("Backpack")
    local character = LocalPlayer.Character
    return (backpack and backpack:FindFirstChild(toolName)) or (character and character:FindFirstChild(toolName))
end

local function EquipTool(toolName)
    local tool = LocalPlayer:FindFirstChild("Backpack") and LocalPlayer.Backpack:FindFirstChild(toolName)
    if tool and LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
        pcall(function() LocalPlayer.Character.Humanoid:EquipTool(tool) end)
        task.wait(0.3)
        return true
    end
    return false
end

local function FindCrowbarDealer()
    local map = Workspace:FindFirstChild("Map")
    if not map then
        Log("Mapa no encontrado")
        return nil
    end
    local shops = map:FindFirstChild("Shopz")
    if not shops then
        Log("Tiendas no encontradas")
        return nil
    end
    local character = LocalPlayer.Character
    if not character then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end
    local closestDealer = nil
    local closestDist = math.huge
    for _, shop in ipairs(shops:GetChildren()) do
        local stocks = shop:FindFirstChild("CurrentStocks")
        if stocks then
            local crowbarStock = stocks:FindFirstChild("Crowbar")
            if crowbarStock and crowbarStock.Value > 0 then
                local mainPart = shop:FindFirstChild("MainPart")
                if mainPart then
                    local dist = (hrp.Position - mainPart.Position).Magnitude
                    if dist < closestDist then
                        closestDist = dist
                        closestDealer = shop
                    end
                end
            end
        end
    end
    if closestDealer then
        Log("Vendedor con palanca encontrado, distancia: " .. math.floor(closestDist))
    else
        Log("Vendedor con palanca no encontrado")
    end
    return closestDealer
end

local MoveToTarget
local function BuyCrowbar()
    local dealer = FindCrowbarDealer()
    if not dealer then return false end
    local mainPart = dealer:FindFirstChild("MainPart")
    if not mainPart then
        Log("El vendedor no tiene MainPart")
        return false
    end
    StatusText = "Comprando palanca"
    Log("Yendo al vendedor por la palanca")

    RetryCount = 0
    LastShopMainPart = mainPart
    local moveSuccess = MoveToTarget(mainPart)

    if not moveSuccess then
        RetryCount = RetryCount + 1
        Log("Camino no encontrado, intento " .. RetryCount .. "/3")
        if RetryCount >= 3 then
            Log("Camino no encontrado 3 veces, subiendo a altura 4.8")
            local character = LocalPlayer.Character
            local hrp = character and character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                local tween = TweenService:Create(hrp, TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), { CFrame = CFrame.new(pos.X, 4.8, pos.Z) })
                tween:Play()
                tween.Completed:Wait()
                task.wait(1)
                Log("Reintentando encontrar camino al vendedor")
                RetryCount = 0
                moveSuccess = MoveToTarget(mainPart)
                if not moveSuccess then
                    Log("El camino al vendedor aÃºn no se encuentra, ignorando temporalmente")
                    StatusText = "Esperando"
                    return false
                end
            end
        else
            StatusText = "Esperando"
            return false
        end
    end

    StatusText = "Comprando herramientas"
    task.wait(0.8)
    local events = ReplicatedStorage:FindFirstChild("Events")
    if events then
        Log("Abriendo tienda")
        pcall(function() events.BYZERSPROTEC:FireServer(true, "shop", mainPart, "IllegalStore") end)
        task.wait(0.8)
        Log("Comprando palanca")
        pcall(function() events.SSHPRMTE1:InvokeServer("IllegalStore", "Melees", "Crowbar", mainPart, nil, true) end)
        task.wait(2)
        Log("Cerrando tienda")
        pcall(function() events.BYZERSPROTEC:FireServer(false) end)
    end
    task.wait(1)
    local crowbar = HasTool("Crowbar")
    if crowbar then
        Log("Palanca comprada con Ã©xito")
    else
        Log("No se pudo comprar la palanca")
    end
    StatusText = "Esperando"
    return crowbar
end

-- ===== Farm: lista de objetivos (cajas y registradoras) =====
local function CleanupTempIgnored()
    local now = tick()
    for obj, expiry in pairs(Settings.TempIgnored) do
        if now > expiry then
            Settings.TempIgnored[obj] = nil
            for i, v in ipairs(Settings.IgnoredList) do
                if v == obj then
                    table.remove(Settings.IgnoredList, i)
                    break
                end
            end
            Log("Objeto ignorado desbloqueado")
        end
    end
end

local function UpdateTargetsList()
    CleanupTempIgnored()
    local bredFolder = nil
    local map = Workspace:FindFirstChild("Map")
    if map then
        bredFolder = map:FindFirstChild("BredMakurz")
    end
    if not bredFolder then
        local filter = Workspace:FindFirstChild("Filter")
        if filter then
            bredFolder = filter:FindFirstChild("BredMakurz")
        end
    end
    if not bredFolder then
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj.Name == "BredMakurz" and obj:IsA("Folder") then
                bredFolder = obj
                break
            end
        end
    end
    if not bredFolder then
        Log("Carpeta BredMakurz no encontrada")
        return 0, 0
    end
    local character = LocalPlayer.Character
    if not character then return 0, 0 end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return 0, 0 end
    local safes = {}
    local registers = {}
    TotalSafesCount = 0
    TotalRegistersCount = 0
    SortedTargets = {}
    for _, obj in ipairs(bredFolder:GetChildren()) do
        local nameLower = obj.Name:lower()
        if nameLower:find("safe") or nameLower:find("register") then
            if nameLower:find("safe") then
                TotalSafesCount = TotalSafesCount + 1
            else
                TotalRegistersCount = TotalRegistersCount + 1
            end
            if Settings.ProcessedList[obj] then continue end
            if Settings.TempIgnored[obj] then continue end
            local values = obj:FindFirstChild("Values")
            if values then
                local broken = values:FindFirstChild("Broken")
                if broken and not broken.Value then
                    local mainPart = obj:FindFirstChild("MainPart") or obj.PrimaryPart
                    if mainPart and mainPart.Position.Y >= 4.8 then
                        local targetInfo = { obj = obj, part = mainPart, pos = mainPart.Position }
                        if nameLower:find("safe") then
                            table.insert(safes, targetInfo)
                        else
                            table.insert(registers, targetInfo)
                        end
                        table.insert(SortedTargets, targetInfo)
                    end
                end
            end
        end
    end
    AvailableSafes = safes
    AvailableRegisters = registers
    table.sort(SortedTargets, function(a, b)
        return (a.pos - hrp.Position).Magnitude < (b.pos - hrp.Position).Magnitude
    end)
    AvailableSafesCount = #safes
    AvailableRegistersCount = #registers
    return AvailableSafesCount + AvailableRegistersCount, TotalSafesCount + TotalRegistersCount
end

local function GetMoneyNearPosition(pos, radius)
    local spawnedBread = Workspace:FindFirstChild("Filter") and Workspace.Filter:FindFirstChild("SpawnedBread")
    if not spawnedBread then return {} end
    local moneyParts = {}
    for _, bread in ipairs(spawnedBread:GetChildren()) do
        pcall(function()
            if bread:IsA("Part") and bread.Transparency < 1 then
                if (bread.Position - pos).Magnitude <= radius then
                    table.insert(moneyParts, bread)
                end
            end
        end)
    end
    return moneyParts
end

local function FindMoneyNearTarget(targetObj)
    local mainPart = targetObj:FindFirstChild("MainPart") or targetObj.PrimaryPart
    if not mainPart then return {} end
    return GetMoneyNearPosition(mainPart.Position, 25)
end

local function CollectMoneyNearTarget(targetObj)
    local moneyParts = FindMoneyNearTarget(targetObj)
    if #moneyParts == 0 then return false end
    Log("Recogiendo " .. #moneyParts .. " fajos de dinero cerca del objetivo")
    StatusText = "Recogiendo dinero"
    for _, money in ipairs(moneyParts) do
        if not Settings.Enabled then break end
        pcall(function()
            if money and money.Parent and money.Transparency < 1 then
                MoveToTarget(money)
                local pickupEvent = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("CZDPZUS")
                if pickupEvent then
                    pcall(function() pickupEvent:FireServer(money) end)
                end
                task.wait(Settings.MoneyPickupWait)
            end
        end)
    end
    StatusText = "Esperando"
    return #FindMoneyNearTarget(targetObj) > 0
end

-- ===== Farm: abrir caja fuerte / registradora =====
local function HackSafe(safeObj)
    if not HasTool("Crowbar") then
        Log("No hay palanca para abrir la caja fuerte, intentando comprar...")
        local bought = BuyCrowbar()
        if not bought then
            Log("No se pudo comprar la palanca, saltando la caja fuerte")
            return false
        end
    end
    if not LocalPlayer.Character:FindFirstChild("Crowbar") then
        Log("La palanca estÃ¡ en la mochila, equipando...")
        EquipTool("Crowbar")
        task.wait(0.3)
    end
    if not HasTool("Crowbar") then
        Log("La palanca no apareciÃ³, saltando")
        return false
    end
    local tool = HasTool("Crowbar")
    task.wait(0.2)
    local events = ReplicatedStorage:FindFirstChild("Events")
    if not events then
        Log("Carpeta Events no encontrada")
        return false
    end
    local remote1 = events:FindFirstChild("XMHH.2")
    local remote2 = events:FindFirstChild("XMHH2.2")
    local mainPart = safeObj:FindFirstChild("MainPart") or safeObj.PrimaryPart
    if not remote1 or not remote2 then
        Log("Remote events de robo no encontrados")
        return false
    end
    if not mainPart then
        Log("La caja fuerte no tiene parte principal")
        return false
    end
    Log("Comenzando a abrir la caja fuerte con palanca")
    StatusText = "Abriendo caja fuerte"
    local startTime = tick()
    local hits = 0
    local wasOpened = false
    local loopWait = Settings.HackNoCooldown and 0.3 or 0.5
    while Settings.Enabled and safeObj and safeObj.Parent do
        local values = safeObj:FindFirstChild("Values")
        if not values then break end
        local broken = values:FindFirstChild("Broken")
        if broken and broken.Value then
            Log("La caja fuerte ya estÃ¡ abierta")
            wasOpened = true
            break
        end
        if tick() - startTime > 25 then
            Log("Tiempo de apertura agotado")
            break
        end
        task.wait(loopWait)
        local currentTool = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Crowbar")
        if not currentTool then
            currentTool = LocalPlayer.Backpack and LocalPlayer.Backpack:FindFirstChild("Crowbar")
            if currentTool then EquipTool("Crowbar") end
        end
        if not currentTool then break end
        local arm = LocalPlayer.Character:FindFirstChild("Right Arm") or LocalPlayer.Character:FindFirstChild("RightHand")
        if not arm then break end
        local success, result = pcall(function() return remote1:InvokeServer("ðŸž", tick(), currentTool, "DZDRRRKI", safeObj, "Register") end)
        if success and result then
            pcall(function() remote2:FireServer("ðŸž", tick(), currentTool, "2389ZFX34", result, false, arm, mainPart, safeObj, mainPart.Position, mainPart.Position) end)
            hits = hits + 1
            task.wait(0.15)
        else
            task.wait(0.5)
        end
    end
    task.wait(0.3)
    Log("Apertura terminada, golpes: " .. hits)
    StatusText = "Esperando"
    return wasOpened or hits > 0
end

-- ===== Subir a 4.8 (evita atascarse) =====
local function RiseToTargetY()
    if HasReachedTargetY then return end
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if hrp and humanoid and humanoid.Health > 0 and hrp.Position.Y < 4.7 and not IsRising then
        Log("Personaje por debajo de 4.7, subiendo por puntos hasta 4.8...")
        StatusText = "Subiendo a 4.8"
        IsRising = true

        local startPos = hrp.Position
        local targetY = 4.8
        local startY = startPos.Y
        local deltaY = targetY - startY
        if deltaY <= 0 then
            IsRising = false
            StatusText = "Esperando"
            return
        end

        local steps = math.max(3, math.floor(deltaY * 2))
        local waypoints = {}
        for i = 1, steps do
            local alpha = i / steps
            local y = startY + deltaY * alpha
            table.insert(waypoints, Vector3.new(startPos.X, y, startPos.Z))
        end

        for _, wp in ipairs(waypoints) do
            if not Settings.Enabled then break end
            local currentRot = hrp.CFrame - hrp.CFrame.Position
            local targetCF = CFrame.new(wp) * currentRot
            local dist = (wp - hrp.Position).Magnitude
            local duration = math.min(0.5, dist / 10)

            local tween = TweenService:Create(hrp, TweenInfo.new(duration, Enum.EasingStyle.Linear), { CFrame = targetCF })
            tween:Play()
            tween.Completed:Wait()
        end

        hrp.CFrame = CFrame.new(startPos.X, targetY, startPos.Z) * (hrp.CFrame - hrp.CFrame.Position)
        hrp.AssemblyLinearVelocity = Vector3.zero
        hrp.AssemblyAngularVelocity = Vector3.zero

        Log("AlcanzÃ³ 4.8, congelando por 3 segundos...")
        task.wait(3)
        Log("CongelaciÃ³n terminada, continuando")

        IsRising = false
        HasReachedTargetY = true
        StatusText = "Esperando"
    end
end

-- ===== Respawn automÃ¡tico =====
local IsRespawning = false
local RespawnConnection = nil

local function StopRespawnHandler()
    if IsRespawning then
        IsRespawning = false
        if RespawnConnection then
            RespawnConnection:Disconnect()
            RespawnConnection = nil
        end
    end
end

local function StartRespawnHandler()
    if IsRespawning then return end
    IsRespawning = true
    Log("Muerte detectada - presionando E para revivir")
    StatusText = "Muerto"
    RespawnConnection = RunService.Heartbeat:Connect(function()
        if not IsRespawning then
            if RespawnConnection then
                RespawnConnection:Disconnect()
                RespawnConnection = nil
            end
            return
        end
        local character = LocalPlayer.Character
        local humanoid = character and character:FindFirstChild("Humanoid")
        if character and humanoid and humanoid.Health > 0 then
            StopRespawnHandler()
            StatusText = "Esperando"
            return
        end
        pcall(PressE)
    end)
end

local function OnCharacterAdded(newChar)
    StopRespawnHandler()
    task.wait(3)
    IsRising = false
    HasReachedTargetY = false
    if Settings.Enabled then
        Settings.IsDead = false
        RiseToTargetY()
        Log("Personaje revivido, continuando")
        StatusText = "Esperando"
    end
    local humanoid = newChar:WaitForChild("Humanoid", 5)
    if humanoid then
        humanoid.Died:Connect(StartRespawnHandler)
    end
end

LocalPlayer.CharacterAdded:Connect(OnCharacterAdded)
if LocalPlayer.Character then
    OnCharacterAdded(LocalPlayer.Character)
end

-- ===== Pathfinding =====
local PathVisualsFolder = Instance.new("Folder")
PathVisualsFolder.Name = "PathVisuals"
PathVisualsFolder.Parent = Workspace

local function ClearPathVisuals()
    for _, child in ipairs(PathVisualsFolder:GetChildren()) do
        pcall(function() child:Destroy() end)
    end
end

local function VisualizePath(waypoints, startPos)
    ClearPathVisuals()
    if not waypoints or #waypoints == 0 then return end
    for i, wp in ipairs(waypoints) do
        local part = Instance.new("Part")
        part.Name = "Waypoint" .. i
        part.Size = Vector3.new(2, 2, 2)
        part.Position = wp.Position
        part.Anchored = true
        part.CanCollide = false
        part.Material = Enum.Material.Neon
        part.Color = Color3.fromHSV(i / #waypoints, 1, 1)
        part.Transparency = 0.3
        part.Parent = PathVisualsFolder
    end
    local prevPos = startPos
    for i, wp in ipairs(waypoints) do
        local nextPos = wp.Position
        local dist = (nextPos - prevPos).Magnitude
        if dist > 0.5 then
            local line = Instance.new("Part")
            line.Name = "PathLine" .. i
            line.Anchored = true
            line.CanCollide = false
            line.Material = Enum.Material.Neon
            line.Color = Color3.new(0, 1, 0)
            line.Transparency = 0.5
            line.Size = Vector3.new(0.5, 0.5, dist)
            line.CFrame = CFrame.lookAt(prevPos + (nextPos - prevPos) / 2, nextPos)
            line.Parent = PathVisualsFolder
        end
        prevPos = nextPos
    end
end

local function ComputePath(startPos, endPos)
    local pathParamsList = {
        { Radius = 1, Height = 4, Spacing = 2 },
        { Radius = 1.2, Height = 4.5, Spacing = 2.5 },
        { Radius = 1.5, Height = 5, Spacing = 3 },
        { Radius = 2, Height = 5.5, Spacing = 4 },
        { Radius = 2.5, Height = 6, Spacing = 5 },
        { Radius = 3, Height = 6.5, Spacing = 5 },
        { Radius = 3.5, Height = 7, Spacing = 6 },
        { Radius = 4, Height = 7.5, Spacing = 6 },
        { Radius = 1, Height = 8, Spacing = 3 },
        { Radius = 5, Height = 5, Spacing = 5 },
        { Radius = 1.8, Height = 4.2, Spacing = 2.2 },
        { Radius = 2.2, Height = 5.8, Spacing = 4.5 },
        { Radius = 2.8, Height = 6.2, Spacing = 5.5 },
        { Radius = 3.2, Height = 6.8, Spacing = 5.8 },
        { Radius = 3.8, Height = 7.2, Spacing = 6.2 }
    }
    for _, params in ipairs(pathParamsList) do
        local pathParams = {
            AgentRadius = params.Radius,
            AgentHeight = params.Height,
            AgentCanJump = true,
            AgentCanClimb = true,
            WaypointSpacing = params.Spacing,
            CostCalibration = true
        }
        local path = PathfindingService:CreatePath(pathParams)
        local success, _ = pcall(function() path:ComputeAsync(startPos, endPos) end)
        if success and path.Status == Enum.PathStatus.Success then
            local rawWaypoints = path:GetWaypoints()
            if not rawWaypoints or #rawWaypoints < 2 then return rawWaypoints end
            local refinedWaypoints = {}
            local spacing = Settings.WaypointSpacing
            table.insert(refinedWaypoints, rawWaypoints[1])
            for i = 2, #rawWaypoints do
                local prev = rawWaypoints[i - 1].Position
                local curr = rawWaypoints[i].Position
                local dist = (curr - prev).Magnitude
                if dist <= spacing then
                    table.insert(refinedWaypoints, rawWaypoints[i])
                else
                    local steps = math.ceil(dist / spacing)
                    for j = 1, steps do
                        local alpha = j / steps
                        local pos = prev:Lerp(curr, alpha)
                        local action = (j == steps and rawWaypoints[i].Action) or Enum.PathWaypointAction.Walk
                        table.insert(refinedWaypoints, { Position = pos, Action = action })
                    end
                end
            end
            return refinedWaypoints
        end
        task.wait(0.05)
    end
    return nil
end

local function GetPositionInFrontOfTarget(targetPart, fromPos)
    if not targetPart then return nil end
    local success, cf = pcall(function() return targetPart.CFrame end)
    if not success then return nil end
    local lookVec = cf.LookVector
    lookVec = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
    if lookVec.Magnitude < 0.1 then
        lookVec = (fromPos - cf.Position).Unit
        lookVec = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
        if lookVec.Magnitude < 0.1 then lookVec = Vector3.new(1, 0, 0) end
    end
    return cf.Position + lookVec * 4
end

local function GetFootPosition()
    local character = LocalPlayer.Character
    if not character then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end
    return hrp.Position - Vector3.new(0, 2.5, 0)
end

-- ===== Movimiento lento y sin atascarse =====
function MoveToTarget(targetPart)
    RiseToTargetY()
    local character = LocalPlayer.Character
    if not character then
        Log("No hay personaje")
        return false
    end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    local humanoid = character:FindFirstChild("Humanoid")
    if not hrp or not humanoid then
        Log("No hay HRP o Humanoid")
        return false
    end
    if not targetPart or not targetPart:IsA("BasePart") then
        Log("Objetivo invÃ¡lido")
        return false
    end
    StatusText = "Camino al objetivo"
    local startPos = GetFootPosition() or hrp.Position
    local targetFrontPos = GetPositionInFrontOfTarget(targetPart, startPos)
    if not targetFrontPos then
        Log("No se pudo calcular la posiciÃ³n frente al objeto")
        StatusText = "Esperando"
        return false
    end
    targetFrontPos = Vector3.new(targetFrontPos.X, startPos.Y, targetFrontPos.Z)
    local endPos = targetFrontPos
    Log("Buscando camino al objetivo, distancia " .. math.floor((endPos - startPos).Magnitude))
    local path = ComputePath(startPos, endPos)
    if not path then
        Log("No se encontrÃ³ camino, ignorando objetivo temporalmente")
        StatusText = "Esperando"
        return false
    end
    Log("Camino encontrado, puntos: " .. #path)
    VisualizePath(path, startPos)
    for _, waypoint in ipairs(path) do
        if not Settings.Enabled then
            ClearPathVisuals()
            StatusText = "Esperando"
            return false
        end
        local footPos = GetFootPosition()
        if not footPos then continue end
        local targetPos = waypoint.Position
        local targetHRP = targetPos + Vector3.new(0, 2.5, 0)
        local currentRot = hrp.CFrame - hrp.CFrame.Position
        local targetCF = CFrame.new(targetHRP) * currentRot
        local dist = (targetHRP - hrp.Position).Magnitude
        if dist > 0.2 then
            local tween = TweenService:Create(hrp, TweenInfo.new(dist / Settings.MoveSpeed, Enum.EasingStyle.Linear), { CFrame = targetCF })
            tween:Play()
            tween.Completed:Wait()
        end
        if waypoint.Action == Enum.PathWaypointAction.Jump then
            humanoid.Jump = true
            task.wait(0.1)
        end
    end
    ClearPathVisuals()
    local finalPos = endPos
    local finalHRP = finalPos + Vector3.new(0, 2.5, 0)
    hrp.CFrame = CFrame.new(finalHRP) * CFrame.Angles(0, math.rad(90), 0)
    hrp.AssemblyLinearVelocity = Vector3.zero
    hrp.AssemblyAngularVelocity = Vector3.zero
    Log("Objetivo alcanzado")
    StatusText = "Esperando"
    return true
end

-- ===== DetecciÃ³n de ATMs =====
local ATMCache = { List = {}, LastSearch = 0 }
local AllowanceState = { LastAttempt = 0, LastClaim = -tick() }

local KNOWN_ATM_POSITIONS = {
    Vector3.new(-4151.65966796875, 3.499967336654663, -169.83917236328125)
}

local ATM_NAME_KEYS = { "atm", "cajero", "cashmachine", "cash machine", "bankmachine", "bank machine", "moneymachine", "money machine", "teller", "atm1", "atm2", "atm3", "atm4", "atmterminal" }
local BANK_NAME_KEYS = { "bank", "banco", "vault", "boveda", "mbank" }
local CASH_NAME_KEYS = { "cash", "money", "efectivo", "dinero", "wallet", "balance" }

local function FindObjectWithName(keys, excludeKeys)
    local results = {}
    local seen = {}
    pcall(function()
        for _, obj in ipairs(Workspace:GetDescendants()) do
            local nameLower = tostring(obj.Name):lower()
            local match = false
            for _, key in ipairs(keys) do
                if nameLower:find(key) then match = true break end
            end
            if not match then
                local parentName = obj.Parent and tostring(obj.Parent.Name):lower() or ""
                for _, key in ipairs(keys) do
                    if parentName:find(key) then match = true break end
                end
            end
            if match and excludeKeys then
                for _, ex in ipairs(excludeKeys) do
                    if nameLower:find(ex) or (obj.Parent and tostring(obj.Parent.Name):lower():find(ex)) then match = false break end
                end
            end
            if not match then continue end
            local part = obj:IsA("BasePart") and obj or (obj:FindFirstChild("MainPart") or obj.PrimaryPart or obj:FindFirstChildOfClass("BasePart"))
            if part and part.Parent and not seen[part] then
                seen[part] = true
                table.insert(results, { obj = obj, part = part })
            end
        end
    end)
    return results
end

local function FindRemoteInReplicatedStorage(keys)
    local matches = {}
    pcall(function()
        for _, obj in ipairs(ReplicatedStorage:GetDescendants()) do
            if obj:IsA("RemoteEvent") or obj:IsA("RemoteFunction") then
                local rn = tostring(obj.Name):lower()
                for _, key in ipairs(keys) do
                    if rn:find(key) then
                        table.insert(matches, obj)
                        break
                    end
                end
            end
        end
    end)
    return matches
end

local function FindByPromptKeyword(keys)
    local results = {}
    local seen = {}
    pcall(function()
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj:IsA("ProximityPrompt") then
                local action = (obj.ActionText or ""):lower()
                local keyName = tostring(obj.KeyboardKeyCode or ""):lower()
                local match = false
                for _, key in ipairs(keys) do
                    if action:find(key) or keyName:find(key) then
                        match = true
                        break
                    end
                end
                if match then
                    local holder = obj.Parent
                    local part = holder and (holder:IsA("BasePart") and holder or (holder:FindFirstChild("MainPart") or holder.PrimaryPart or holder:FindFirstChildOfClass("BasePart")))
                    if part and not seen[part] then
                        seen[part] = true
                        table.insert(results, { obj = holder.Parent or holder, part = part, prompt = obj })
                    end
                end
            end
        end
    end)
    return results
end

local function TriggerProximityPrompts(center, radius)
    local triggered = false
    pcall(function()
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj:IsA("ProximityPrompt") and obj.Parent and obj.Parent:IsA("BasePart") then
                local part = obj.Parent
                local dist = (part.Position - center).Magnitude
                if dist <= (radius or 12) then
                    pcall(function() obj:InputHoldBegin() end)
                    task.wait(0.15)
                    pcall(function() obj:InputHoldEnd() end)
                    triggered = true
                end
            end
        end
    end)
    return triggered
end

local function TeleportNear(targetPart, distance)
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    if not hrp or not targetPart or not targetPart.Parent then return false end
    local ok, cf = pcall(function() return targetPart.CFrame end)
    if not ok then return false end
    local lookVec = Vector3.new(cf.LookVector.X, 0, cf.LookVector.Z)
    if lookVec.Magnitude < 0.1 then lookVec = Vector3.new(1, 0, 0) end
    lookVec = lookVec.Unit
    local target = cf.Position + lookVec * (distance or 2)
    target = Vector3.new(target.X, cf.Position.Y + 2.5, target.Z)
    local success = pcall(function()
        local tween = TweenService:Create(hrp, TweenInfo.new(1.2, Enum.EasingStyle.Linear), { CFrame = CFrame.new(target) })
        tween:Play()
        tween.Completed:Wait()
        hrp.AssemblyLinearVelocity = Vector3.zero
    end)
    return success and (hrp.Position - cf.Position).Magnitude < (distance or 2) + 4
end

local TryClickButtonByText

local function TryDepositAll(cashAmount)
    local playerGui = LocalPlayer:FindFirstChildOfClass("PlayerGui")
    if not playerGui then return false end
    local clickedAny = false
    pcall(function()
        for _, gui in ipairs(playerGui:GetDescendants()) do
            if gui:IsA("TextBox") and gui.Visible then
                local t = (gui.Text or ""):lower()
                if t == "" or t == "0" or t == "8" or t:find("amount") or t:find("cantidad") or t:find("deposit") or t:find("monto") or t:find("importe") then
                    pcall(function() gui.Text = tostring(cashAmount or "") end)
                    clickedAny = true
                end
            end
        end
    end)
    if TryClickButtonByText({ "deposit all", "depositar todo", "max", "all", "todo", "mÃ¡ximo" }) then
        clickedAny = true
        task.wait(0.6)
    end
    if TryClickButtonByText({ "deposit", "depositar", "ingresar", "guardar", "save", "add", "confirm", "confirmar", "enter", "ok" }) then
        clickedAny = true
        task.wait(0.6)
    end
    return clickedAny
end

TryClickButtonByText = function(keys)
    local playerGui = LocalPlayer:FindFirstChildOfClass("PlayerGui")
    if not playerGui then return false end
    for _, gui in ipairs(playerGui:GetDescendants()) do
        if gui:IsA("TextButton") or gui:IsA("ImageButton") then
            local txt = (gui.Text or ""):lower()
            for _, key in ipairs(keys) do
                if txt:find(key) then
                    pcall(function() gui.MouseButton1Click:Fire() end)
                    task.wait(0.2)
                    pcall(function()
                        local absPos = gui.AbsolutePosition
                        local absSize = gui.AbsoluteSize
                        local x = absPos.X + absSize.X / 2
                        local y = absPos.Y + absSize.Y / 2
                        VirtualInputManager:SendMouseButtonEvent(x, y, 0, true, game, 0)
                        task.wait(0.1)
                        VirtualInputManager:SendMouseButtonEvent(x, y, 0, false, game, 0)
                    end)
                    return true
                end
            end
        end
    end
    return false
end

local function FindATMzObjects()
    local results = {}
    local seen = {}
    pcall(function()
        local atmz = nil
        local map = Workspace:FindFirstChild("Map")
        if map then atmz = map:FindFirstChild("ATMz") end
        if not atmz then
            for _, obj in ipairs(Workspace:GetDescendants()) do
                if obj.Name == "ATMz" and obj:IsA("Folder") then
                    atmz = obj
                    break
                end
            end
        end
        if not atmz then return end
        for _, atmObj in ipairs(atmz:GetChildren()) do
            if not atmObj:IsA("Model") then continue end
            local atmPart = atmObj:FindFirstChild("MainPart")
            if not atmPart then
                local partsFolder = atmObj:FindFirstChild("Parts")
                local mainFolder = partsFolder and partsFolder:FindFirstChild("Main")
                atmPart = mainFolder and mainFolder:FindFirstChild("atm")
            end
            if not atmPart and atmObj.PrimaryPart then
                atmPart = atmObj.PrimaryPart
            end
            if atmPart and atmPart:IsA("BasePart") and atmPart.Parent and not seen[atmPart] then
                seen[atmPart] = true
                table.insert(results, { obj = atmObj, part = atmPart })
            end
        end
        if #results > 0 then
            Log("Cajeros encontrados en carpeta ATMz: " .. #results)
        end
    end)
    return results
end

local function FindATMObjects()
    local now = tick()
    local refreshDelay = (#ATMCache.List == 0) and 5 or 15
    if now - ATMCache.LastSearch < refreshDelay then return ATMCache.List end
    ATMCache.LastSearch = now
    local atms = FindATMzObjects()
    if #atms == 0 then
        atms = FindObjectWithName(ATM_NAME_KEYS, { "atmos" })
    end
    if #atms == 0 then
        atms = FindByPromptKeyword({ "allowance", "atm", "cajero", "claim", "reclam" })
        if #atms > 0 then Log("Cajeros encontrados por ProximityPrompt") end
    end
    if #atms == 0 and #KNOWN_ATM_POSITIONS > 0 then
        local best = nil
        local bestDist = math.huge
        pcall(function()
            for _, obj in ipairs(Workspace:GetDescendants()) do
                if obj:IsA("BasePart") and obj.Parent and obj.Size.Magnitude > 0.5 then
                    local dist = (obj.Position - KNOWN_ATM_POSITIONS[1]).Magnitude
                    if dist < bestDist then
                        bestDist = dist
                        best = obj
                    end
                end
            end
        end)
        if best and bestDist < 8 then
            atms = { { obj = best, part = best } }
            Log("Cajero encontrado por posiciÃ³n conocida: " .. best:GetFullName() .. " (dist " .. math.floor(bestDist) .. ")")
        else
            Log("No se encontrÃ³ part cerca de la posiciÃ³n conocida del ATM (dist " .. math.floor(bestDist) .. ")")
        end
    end
    ATMCache.List = atms
    if #atms == 0 then
        Log("Cajeros automÃ¡ticos no encontrados (buscando: atm, cajero, teller, etc.)")
    end
    return atms
end

local function IsAllowanceReady(atmObj)
    if not atmObj then return true end
    for _, name in ipairs({ "Allowance", "Available", "Ready", "AllowanceReady", "Claimable", "NextClaim", "Time" }) do
        local v = atmObj:FindFirstChild(name)
        if v then
            local ok, val = pcall(function() return v.Value end)
            if ok then
                if type(val) == "boolean" then return val end
                if type(val) == "number" then
                    if val <= 100000 and val >= 0 then return val > 0 end
                    return true
                end
                return val ~= false
            end
        end
        local values = atmObj:FindFirstChild("Values")
        if values then
            local v2 = values:FindFirstChild(name)
            if v2 then
                local ok2, val2 = pcall(function() return v2.Value end)
                if ok2 then
                    if type(val2) == "boolean" then return val2 end
                    if type(val2) == "number" then
                        if val2 <= 100000 and val2 >= 0 then return val2 > 0 end
                        return true
                    end
                    return val2 ~= false
                end
            end
        end
    end
    for _, attr in ipairs({ "Allowance", "Available", "Ready", "Claimable" }) do
        local attrVal = atmObj:GetAttribute(attr)
        if attrVal ~= nil then
            if type(attrVal) == "boolean" then return attrVal end
            return attrVal ~= false
        end
    end
    return true
end

local function TryClickAllowanceButton()
    return TryClickButtonByText({ "allowance", "claim", "reclam", "subsid", "cobrar", "recibir", "tomar", "collect", "get allowance", "take" })
end

local function ClaimAllowance(atmObj, atmPart)
    local claimRemote = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("CLMZALOW")
    if claimRemote then
        local mainPart = atmObj and atmObj:FindFirstChild("MainPart") or atmPart
        if mainPart then
            local ok = pcall(function() claimRemote:InvokeServer(mainPart, nil) end)
            if ok then
                Log("Allowance reclamado con remote CLMZALOW")
                return true
            end
            Log("CLMZALOW fallÃ³, intentando otras vÃ­as")
        end
    end
    local remotes = FindRemoteInReplicatedStorage({ "allowance", "atm", "claim", "reclam", "subsid" })
    for _, remote in ipairs(remotes) do
        local ok = pcall(function()
            if remote:IsA("RemoteFunction") then
                remote:InvokeServer(atmObj or atmPart)
            else
                remote:FireServer(atmObj or atmPart)
            end
        end)
        if ok then
            Log("Remote de allowance usado: " .. remote.Name)
            return true
        end
    end
    local hrp = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    local promptTriggered = hrp and TriggerProximityPrompts(hrp.Position, 14)
    if promptTriggered then
        Log("Prompt de allowance activado")
        task.wait(0.8)
    end
    PressE()
    task.wait(1.2)
    local clicked = false
    for attempt = 1, 3 do
        if TryClickAllowanceButton() then
            clicked = true
            break
        end
        task.wait(1.0)
    end
    task.wait(0.8)
    PressE()
    if clicked then Log("BotÃ³n de allowance clickeado") end
    return clicked or promptTriggered
end

local function IsAllowanceExplicitlyReady(atmObj)
    if not atmObj then return false end
    for _, name in ipairs({ "Allowance", "Available", "Ready", "Claimable" }) do
        local v = atmObj:FindFirstChild(name)
        if v then
            local ok, val = pcall(function() return v.Value end)
            if ok and val == true then return true end
        end
        local values = atmObj:FindFirstChild("Values")
        if values then
            local v2 = values:FindFirstChild(name)
            if v2 then
                local ok2, val2 = pcall(function() return v2.Value end)
                if ok2 and val2 == true then return true end
            end
        end
    end
    for _, attr in ipairs({ "Allowance", "Available", "Ready", "Claimable" }) do
        if atmObj:GetAttribute(attr) == true then return true end
    end
    return false
end

local function IsAllowanceDue()
    if not Settings.AllowanceEnabled then return false end
    local now = tick()
    if now - AllowanceState.LastAttempt < Settings.AllowanceRetryDelay then return false end
    local atms = FindATMObjects()
    for _, atm in ipairs(atms) do
        if atm.obj and IsAllowanceExplicitlyReady(atm.obj) then
            Log("Allowance listo en el cajero: " .. atm.obj.Name)
            return true
        end
    end
    if now - AllowanceState.LastClaim < Settings.AllowanceInterval then return false end
    return true
end

local BankCache = { List = {}, LastSearch = 0 }

local function FindBank()
    local now = tick()
    if now - BankCache.LastSearch < 20 and #BankCache.List > 0 then return BankCache.List end
    BankCache.LastSearch = now
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    local playerPos = hrp and hrp.Position or Vector3.zero
    local banks = FindObjectWithName(BANK_NAME_KEYS)
    if #banks == 0 then
        banks = FindByPromptKeyword({ "deposit", "depositar", "bank", "banco", "withdraw", "retirar", "vault" })
        if #banks > 0 then Log("Banco encontrado por ProximityPrompt") end
    end
    for i, b in ipairs(banks) do
        local dist = (b.part.Position - playerPos).Magnitude
        banks[i] = { obj = b.obj, part = b.part, dist = dist }
    end
    table.sort(banks, function(a, b) return a.dist < b.dist end)
    BankCache.List = banks
    if #banks == 0 then
        Log("Banco no encontrado (buscando: bank, banco, vault, boveda)")
    end
    return banks
end

local function TryClaimAllowance()
    if not IsAllowanceDue() then return false end
    local atms = FindATMObjects()
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    if not hrp then return false end
    local candidates = atms
    if #candidates == 0 then
        Log("No se encontraron cajeros, probando con bancos...")
        candidates = FindBank()
    end
    if #candidates == 0 then
        Log("No se encontrÃ³ ningÃºn cajero ni banco para el allowance")
        return false
    end
    local closest = nil
    local minDist = math.huge
    for _, atm in ipairs(candidates) do
        if atm.part and atm.part.Parent and IsAllowanceReady(atm.obj) then
            local dist = (atm.part.Position - hrp.Position).Magnitude
            if dist < minDist then
                minDist = dist
                closest = atm
            end
        end
    end
    if not closest then
        Log("No hay cajero/banco con allowance disponible")
        return false
    end
    AllowanceState.LastAttempt = tick()
    Log("Yendo al cajero para reclamar el allowance, distancia " .. math.floor(minDist))
    StatusText = "Camino al ATM"
    local moveSuccess = MoveToTarget(closest.part)
    if not moveSuccess then
        moveSuccess = TeleportNear(closest.part, 2)
    end
    if not moveSuccess then
        Log("No se pudo llegar al cajero")
        StatusText = "Esperando"
        return false
    end
    StatusText = "Reclamando allowance"
    local claimed = ClaimAllowance(closest.obj, closest.part)
    if claimed then
        AllowanceState.LastClaim = tick()
        Log("Allowance reclamado")
    else
        Log("No se pudo reclamar el allowance (tal vez aÃºn no estÃ© listo)")
    end
    StatusText = "Esperando"
    return claimed
end

local CashLogThrottle = 0

local function GetPlayerCash()
    local best = nil
    local bestName = nil
    local fallback = nil
    local fallbackName = nil
    pcall(function()
        for _, container in ipairs(LocalPlayer:GetChildren()) do
            if container:IsA("Folder") or container:IsA("Model") or container:IsA("Configuration") then
                for _, stat in ipairs(container:GetChildren()) do
                    if stat:IsA("IntValue") or stat:IsA("NumberValue") or stat:IsA("DoubleConstrainedValue") or stat:IsA("IntConstrainedValue") then
                        local n = tostring(stat.Name):lower()
                        if not fallback and (stat:IsA("IntValue") or stat:IsA("IntConstrainedValue")) then
                            fallback = stat.Value
                            fallbackName = stat.Name
                        end
                        for _, key in ipairs(CASH_NAME_KEYS) do
                            if n:find(key) then
                                best = stat.Value
                                bestName = stat.Name
                                break
                            end
                        end
                    end
                end
            end
        end
        for _, attrName in ipairs({ "Cash", "Money", "CashMoney", "Balance", "Wallet", "CashOnHand" }) do
            local v = LocalPlayer:GetAttribute(attrName)
            if v ~= nil then
                best = v
                bestName = attrName
                break
            end
        end
    end)
    local now = tick()
    if now - CashLogThrottle > 30 then
        CashLogThrottle = now
        if best ~= nil then
            Log("Efectivo en mano (" .. tostring(bestName) .. "): $" .. tostring(best))
        elseif fallback ~= nil then
            Log("Efectivo en mano (primer valor: " .. tostring(fallbackName) .. "): $" .. tostring(fallback))
        else
            Log("No se pudo leer el efectivo del jugador")
        end
    end
    if best ~= nil then return best end
    return fallback
end

local function DepositCash()
    local atms = FindATMObjects()
    local banks = FindBank()
    local target = nil
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    local playerPos = hrp and hrp.Position or Vector3.zero
    local closest = nil
    local minDist = math.huge
    for _, atm in ipairs(atms) do
        if atm.part and atm.part.Parent then
            local dist = (atm.part.Position - playerPos).Magnitude
            if dist < minDist then
                minDist = dist
                closest = atm
            end
        end
    end
    target = closest
    if not target then
        Log("No hay cajeros detectados por nombre, probando posiciÃ³n conocida...")
        if #KNOWN_ATM_POSITIONS > 0 then
            local best = nil
            local bestDist = math.huge
            pcall(function()
                for _, obj in ipairs(Workspace:GetDescendants()) do
                    if obj:IsA("BasePart") and obj.Parent and obj.Size.Magnitude > 0.5 then
                        local dist = (obj.Position - KNOWN_ATM_POSITIONS[1]).Magnitude
                        if dist < bestDist then
                            bestDist = dist
                            best = obj
                        end
                    end
                end
            end)
            if best and bestDist < 8 then
                target = { obj = best, part = best, dist = bestDist }
                Log("Cajero por posiciÃ³n conocida: " .. best:GetFullName())
            end
        end
    end
    if not target and #banks > 0 then
        Log("Sin cajeros, usando banco como respaldo")
        target = banks[1]
    end
    if not target then
        Log("No se encontrÃ³ banco ni cajero para depositar")
        return false
    end
    Log("Yendo a depositar: " .. tostring(target.obj.Name) .. ", distancia " .. math.floor((target.dist or (target.part and (target.part.Position - playerPos).Magnitude) or 0)))
    StatusText = "Camino al cajero"
    local moveSuccess = MoveToTarget(target.part)
    if not moveSuccess then
        moveSuccess = TeleportNear(target.part, 2)
    end
    if not moveSuccess then
        Log("No se pudo llegar al cajero")
        StatusText = "Esperando"
        return false
    end
    StatusText = "Depositando dinero"
    task.wait(0.8)
    local deposited = false
    local openRemote = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("BYZERSPROTEC")
    local mainPart = target.obj and target.obj:FindFirstChild("MainPart") or target.part
    if openRemote then
        pcall(function() openRemote:FireServer(true, "ATM", mainPart) end)
        Log("Cajero abierto con BYZERSPROTEC")
        task.wait(1.0)
    end
    local atmRemote = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("ATM")
    if atmRemote then
        local amount = Settings.DepositFixedAmount
        if amount and amount > 0 then
            local ok, result = pcall(function()
                if atmRemote:IsA("RemoteFunction") then
                    return atmRemote:InvokeServer("DP", amount, mainPart)
                else
                    atmRemote:FireServer("DP", amount, mainPart)
                    return true
                end
            end)
            if ok then
                deposited = true
                Log("DepÃ³sito remoto ATM: $" .. tostring(amount) .. (result ~= nil and (" -> " .. tostring(result)) or ""))
                pcall(function() if openRemote then openRemote:FireServer(false) end end)
                Log("Dinero depositado en el cajero")
                StatusText = "Esperando"
                return true
            else
                Log("Remote ATM fallÃ³: " .. tostring(result))
            end
        else
            Log("Monto de depÃ³sito fijo no configurado")
        end
        task.wait(1.0)
    end
    local promptTriggered = hrp and TriggerProximityPrompts(hrp.Position, 14)
    if promptTriggered then
        Log("Prompt de depÃ³sito activado")
        task.wait(0.8)
    end
    PressE()
    task.wait(1.2)
    local clicked = TryDepositAll(Settings.DepositFixedAmount)
    if clicked then
        deposited = true
        Log("MenÃº del cajero usado para depositar")
    end
    task.wait(1.2)
    PressE()
    task.wait(0.5)
    pcall(function() if openRemote then openRemote:FireServer(false) end end)
    Log("Dinero depositado en el cajero")
    StatusText = "Esperando"
    return deposited or clicked or promptTriggered
end

local function ShouldDepositCash()
    if not Settings.DepositEnabled then return false end
    local cash = GetPlayerCash()
    if not cash then return false end
    return cash > 0
end

-- ===== Ciclo principal: allowance > palanca > farm > depÃ³sito cada 10 =====
local function MainATMloop()
    Log("Ciclo iniciado: allowance primero, luego palanca, farm y depÃ³sito cada 10")
    RiseToTargetY()
    while not _G.AbortEverything do
        task.wait(1)
        if not Settings.Enabled then
            task.wait(1)
            continue
        end
        Log("=== Ciclo ===")
        local character = LocalPlayer.Character
        local humanoid = character and character:FindFirstChildOfClass("Humanoid")
        Settings.IsDead = (not humanoid) or (humanoid.Health <= 0)
        if Settings.IsDead then
            Log("Personaje muerto, esperando")
            task.wait(3)
            continue
        end
        RiseToTargetY()
        -- 1) PRIORIDAD MÃXIMA: reclama allowance apenas estÃ© disponible
        if IsAllowanceDue() then
            Log("Allowance disponible, yendo a reclamarlo")
            local claimed = TryClaimAllowance()
            if claimed then
                Log("Allowance reclamado")
                task.wait(2)
                continue
            end
            Log("No se pudo reclamar el allowance ahora, sigo con el resto")
        end
        -- 2) Comprar la palanca primero si no la tiene
        if not HasTool("Crowbar") then
            Log("No hay palanca, comprando primero")
            local bought = BuyCrowbar()
            if not bought then
                Log("No se pudo comprar la palanca, reintentando en 5 seg")
                task.wait(5)
                continue
            end
        end
        -- 3) Depositar $1500 cada 10 cajas/registradoras abiertas
        if (BoxesOpened >= Settings.DepositEveryNBoxes) or (getgenv().ATMCashTargetEnabled and (GetPlayerCash() or 0) >= (getgenv().ATMCashTarget or 10000)) then
            Log("Depositando: cajas " .. BoxesOpened .. " efectivo $" .. tostring(GetPlayerCash()))
            local deposited = DepositCash()
            if deposited then
                Log("DepÃ³sito completado, reiniciando contador")
                BoxesOpened = 0
                LastBoxesDeposit = tick()
                task.wait(2)
                continue
            end
            Log("No se pudo depositar, reintentando en 3 seg")
            task.wait(3)
            continue
        end
        -- 4) Farmear la caja/registradora mÃ¡s cercana
        local available, total = UpdateTargetsList()
        if available == 0 then
            Log("No hay cajas/registradoras disponibles, esperando 5 seg")
            task.wait(5)
            continue
        end
        local nextTarget = SortedTargets[1]
        if not nextTarget then
            Log("Sin objetivos disponibles, esperando 5 seg")
            task.wait(5)
            continue
        end
        local mainPart = nextTarget.part
        Log("Yendo a: " .. tostring(nextTarget.obj.Name) .. ", distancia " .. math.floor((mainPart.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude))
        local moveSuccess = MoveToTarget(mainPart)
        if moveSuccess then
            if not LocalPlayer.Character:FindFirstChild("Crowbar") then
                EquipTool("Crowbar")
            end
            Log("Abriendo: " .. tostring(nextTarget.obj.Name))
            local hackSuccess = HackSafe(nextTarget.obj)
            if hackSuccess then
                BoxesOpened = BoxesOpened + 1
                Log("Caja abierta, contador: " .. BoxesOpened .. "/" .. Settings.DepositEveryNBoxes)
                CollectMoneyNearTarget(nextTarget.obj)
                Settings.ProcessedList[nextTarget.obj] = true
            else
                Log("No se pudo abrir, ignorando temporalmente")
                Settings.TempIgnored[nextTarget.obj] = tick() + Settings.IgnoreDuration
                table.insert(Settings.IgnoredList, nextTarget.obj)
            end
        else
            Log("No se pudo llegar al objetivo, ignorando temporalmente")
            Settings.TempIgnored[nextTarget.obj] = tick() + Settings.IgnoreDuration
            table.insert(Settings.IgnoredList, nextTarget.obj)
        end
        task.wait(Settings.BetweenBoxesDelay)
    end
end

-- ===== Pestana nueva: atm =====
local ATM_Tab = v4:AddTab({
    Name = "ATM",
    Icon = "landmark"
})

local ATM_Box = ATM_Tab:AddLeftGroupbox("ATM")
local ATMFarmToggleObj = ATM_Box:AddToggle("ATMFarmToggle", {
    Text = "Iniciar Farm",
    Tooltip = "Farm cajas/registradoras, deposita y reclama allowance",
    Default = false,
    Callback = function(value)
        Settings.Enabled = value
        if value then
            RiseToTargetY()
            Log("Farm ACTIVADO")
            value1:Notify({ Title = "Auto Farm", Content = "Iniciado", Duration = 2 })
        else
            ClearPathVisuals()
            StatusText = "Esperando"
            Log("Farm DESACTIVADO")
            value1:Notify({ Title = "Auto Farm", Content = "Detenido", Duration = 2 })
        end
    end
})

ATM_Box:AddToggle("ATMInvisToggle", {
    Text = "Invis R6",
    Tooltip = "Hace invisible al personaje y evita pegarse con paredes",
    Default = false,
    Callback = function(value)
        if value then
            _G.Invis_Enable()
            Log("Invisibilidad ACTIVADA")
        else
            _G.Invis_Disable()
            Log("Invisibilidad DESACTIVADA")
        end
    end
})

ATM_Box:AddToggle("ATMAutoDineroToggle", {
    Text = "Auto Dinero",
    Tooltip = "Recoge el dinero que caiga cerca",
    Default = false,
    Callback = function(value)
        if value then
            Log("Auto-recolecciÃ³n de dinero ACTIVADO")
        else
            StopAutoPickup()
            Log("Auto-recolecciÃ³n de dinero DESACTIVADO")
        end
    end
})

ATM_Box:AddToggle("ATMAntiAfkToggle", {
    Text = "Anti-AFK",
    Tooltip = "Evita ser expulsado por inactividad",
    Default = true,
    Callback = function(value)
        AntiAfkEnabled = value
        if value then
            EnableAntiAfk()
            Log("Anti-AFK ACTIVADO")
        else
            DisableAntiAfk()
            Log("Anti-AFK DESACTIVADO")
        end
    end
})

EnableAntiAfk()

ATM_Box:AddSlider("ATMSpeedSlider", {
    Text = "Velocidad (lento)",
    Tooltip = "Camina despacito para no atascarse",
    Default = 10,
    Min = 5,
    Max = 25,
    Rounding = 1,
    Callback = function(value)
        Settings.MoveSpeed = value
        Log("Velocidad " .. value)
    end
})
ATM_Box:AddToggle("ATMCashTargetToggle", {
    Text = "Auto Deposit por monto",
    Tooltip = "Deposita cuando tu efectivo llegue al monto",
    Default = true,
    Callback = function(value)
        getgenv().ATMCashTargetEnabled = value
    end
})
ATM_Box:AddSlider("ATMCashTargetSlider", {
    Text = "Monto para depositar",
    Tooltip = "Cuando tengas esto encima ve al ATM",
    Default = 10000,
    Min = 1000,
    Max = 50000,
    Rounding = 0,
    Callback = function(value)
        getgenv().ATMCashTarget = value
    end
})

task.spawn(MainATMloop);

(function()
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local PathfindingService = game:GetService("PathfindingService")
local LocalPlayer = Players.LocalPlayer
local VirtualInputManager = game:GetService("VirtualInputManager")
local UserInputService = game:GetService("UserInputService")
local TeleportService = game:GetService("TeleportService")
local HttpService = game:GetService("HttpService")

local StopFly, StopRagdollLoop, StopViewmodel, StopAutoMelee, StopTpLoop
local StopSkybox, StopWeaponColor, StopCrateEsp, StopAllPileEsp, StopDropsEsp
local StopNoFallDamage, StopRageBot, StopSkinOpacity
local UnhookWallBang, RagdollInputConn, AbortAll
local Settings

do

Settings = {
    Enabled = false,
    IsDead = false,
    IgnoredList = {},
    ProcessedList = {},
    TempIgnored = {},
    IgnoreDuration = 60,
    DebugPrintEnabled = true,
    TargetY = 4.8,
    MoveSpeed = 22,
    SomeFlag = true,
    WaypointSpacing = 3,
    SomeOtherParam = 3,
    PickupDistance = 8,
    MaxSomething = 999999
}

local PickupLock = {Lock = {Busy = false}}
local LastTick = tick()
local CurrentTargetPart = nil
local IsMovingToTarget = false
local SomeFlag2 = false
local SomeNil = nil
local StatusText = "Esperando"
local AvailableSafesCount = 0
local AvailableRegistersCount = 0
local Unused1 = 0
local Unused2 = 0
local TotalSafesCount = 0
local TotalRegistersCount = 0
local AvailableSafes = {}
local AvailableRegisters = {}
local TotalAvailableTargets = 0
local SuggestionText = ""
local SomeNil2 = nil
local BrokenStatusMap = {}
local RetryCount = 0
local LastShopMainPart = nil
local IsRising = false
local SortedTargets = {}
local HasReachedTargetY = false

local function Log(msg)
    if Settings.DebugPrintEnabled then
        print("[AutoFarm]", msg)
    end
end

local VirtualUser = game:GetService("VirtualUser")
local AntiAfkEnabled = true
local AntiAfkConnection = nil

local function EnableAntiAfk()
    if AntiAfkConnection then return end
    AntiAfkConnection = LocalPlayer.Idled:Connect(function()
        if AntiAfkEnabled then
            VirtualUser:CaptureController()
            VirtualUser:ClickButton2(Vector2.new())
            Log("Anti-AFK activado")
        end
    end)
    Log("Anti-AFK iniciado")
end

local function DisableAntiAfk()
    if AntiAfkConnection then
        AntiAfkConnection:Disconnect()
        AntiAfkConnection = nil
    end
    Log("Anti-AFK detenido")
end
getgenv().DisableAntiAfk = DisableAntiAfk


local AutoPickupRunning = false
local AutoPickupConnection = nil

local function StartAutoPickup()
    if AutoPickupRunning then return end
    AutoPickupRunning = true
    if AutoPickupConnection then
        AutoPickupConnection:Disconnect()
        AutoPickupConnection = nil
    end
    task.spawn(function()
        while AutoPickupRunning and not _G.AbortEverything do
            task.wait(0.1)
            if not AutoPickupRunning or Settings.IsDead then continue end
            local spawnedBreadFolder = Workspace:FindFirstChild("Filter") and Workspace.Filter:FindFirstChild("SpawnedBread")
            local pickupEvent = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("CZDPZUS")
            if not spawnedBreadFolder or not pickupEvent then continue end
            local character = LocalPlayer.Character
            local hrp = character and character:FindFirstChild("HumanoidRootPart")
            if not hrp then continue end
            if PickupLock.Lock.Busy then continue end
            local charPos = hrp.Position
            for _, breadPart in ipairs(spawnedBreadFolder:GetChildren()) do
                if (charPos - breadPart.Position).Magnitude <= Settings.PickupDistance then
                    if not PickupLock.Lock.Busy then
                        PickupLock.Lock.Busy = true
                        pcall(function() pickupEvent:FireServer(breadPart) end)
                        task.wait(1.1)
                        PickupLock.Lock.Busy = false
                        break
                    end
                end
            end
        end
    end)
end

local function StopAutoPickup()
    if not AutoPickupRunning then return end
    AutoPickupRunning = false
    if AutoPickupConnection then
        AutoPickupConnection:Disconnect()
        AutoPickupConnection = nil
    end
    if PickupLock and PickupLock.Lock then
        PickupLock.Lock.Busy = false
    end
end
getgenv().StopAutoPickup = StopAutoPickup

Log("Auto-recogida de dinero activada")

do
    repeat task.wait() until game:IsLoaded()
    local clonerefSafe = cloneref or function(...) return ... end
    local services = setmetatable({}, { __index = function(_, k) return clonerefSafe(game:GetService(k)) end })
    local localPlayer = services.Players.LocalPlayer
    local character, humanoid, hrp

    local function updateChar()
        character = localPlayer.Character
        if character then
            hrp = character:FindFirstChild("HumanoidRootPart")
            humanoid = character:FindFirstChildOfClass("Humanoid")
        else
            hrp = nil
            humanoid = nil
        end
    end
    updateChar()

    local heartbeat = RunService.Heartbeat
    local renderStepped = RunService.RenderStepped
    local coreGui = game:GetService("CoreGui")
    local starterGui = game:GetService("StarterGui")

    local InvisPossible = true
    if character and not character:FindFirstChild("Torso") then
        pcall(function() starterGui:SetCore("SendNotification", { Title = "Invisibilidad NO FUNCIONA", Text = "Se requiere avatar R6", Duration = 5 }) end)
        InvisPossible = false
    end

    local warningGui = Instance.new("ScreenGui")
    warningGui.Name = "InvisWarningGUI"
    warningGui.Parent = coreGui
    warningGui.ResetOnSpawn = false
    warningGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

    local InvisWarningLabel = Instance.new("TextLabel", warningGui)
    InvisWarningLabel.Text = "ERES VISIBLE"
    InvisWarningLabel.Visible = false
    InvisWarningLabel.Size = UDim2.new(0, 200, 0, 30)
    InvisWarningLabel.Position = UDim2.new(0.5, -100, 0.85, 0)
    InvisWarningLabel.BackgroundTransparency = 1
    InvisWarningLabel.Font = Enum.Font.GothamSemibold
    InvisWarningLabel.TextSize = 24
    InvisWarningLabel.TextColor3 = Color3.fromRGB(255, 255, 0)
    InvisWarningLabel.TextStrokeTransparency = 0.5
    InvisWarningLabel.ZIndex = 10

    local InvisActive = false
    local InvisAnim = Instance.new("Animation")
    InvisAnim.AnimationId = "rbxassetid://215384594"
    local InvisAnimTrack = nil

    local function isGrounded()
        return humanoid and humanoid:IsDescendantOf(workspace) and humanoid.FloorMaterial ~= Enum.Material.Air
    end

    local function loadInvisAnim()
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        if humanoid then
            local success, track = pcall(function() return humanoid:LoadAnimation(InvisAnim) end)
            if success then
                InvisAnimTrack = track
                InvisAnimTrack.Priority = Enum.AnimationPriority.Action4
            else
                InvisAnimTrack = nil
            end
        else
            InvisAnimTrack = nil
        end
    end

    local function disableInvis()
        if not InvisActive then return end
        InvisActive = false
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
        end
        if humanoid then
            workspace.CurrentCamera.CameraSubject = humanoid
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency == 0.5 then
                    part.Transparency = 0
                end
            end
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = false
        end
    end

    local function enableInvis()
        if InvisActive or not InvisPossible then return end
        updateChar()
        if not character or not humanoid or not hrp then return end
        if not character:FindFirstChild("Torso") then
            pcall(function() starterGui:SetCore("SendNotification", { Title = "Invisibilidad NO FUNCIONA", Text = "Se requiere avatar R6", Duration = 5 }) end)
            return
        end
        InvisActive = true
        workspace.CurrentCamera.CameraSubject = hrp
        loadInvisAnim()
    end

    local function toggleInvis()
        if InvisActive then
            disableInvis()
        else
            enableInvis()
        end
        return InvisActive
    end

    _G.Invis_Enable = enableInvis
    _G.Invis_Disable = disableInvis
    _G.Invis_Toggle = toggleInvis
    _G.IsInvisEnabled = function() return InvisActive end

    localPlayer.CharacterAdded:Connect(function(newChar)
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        task.wait()
        updateChar()
        if not humanoid then
            task.wait(0.5)
            updateChar()
            if not humanoid then
                InvisPossible = false
                if InvisActive then disableInvis() end
                pcall(function() starterGui:SetCore("SendNotification", { Title = "Error de invisibilidad", Text = "No se pudo determinar el tipo de personaje", Duration = 5 }) end)
                return
            end
        end
        if humanoid.RigType ~= Enum.HumanoidRigType.R6 then
            InvisPossible = false
            if InvisActive then disableInvis() end
            pcall(function() starterGui:SetCore("SendNotification", { Title = "Advertencia", Text = "Detectado avatar no-R6. Invisibilidad desactivada", Duration = 5 }) end)
            return
        else
            InvisPossible = true
        end
        if InvisActive then
            if hrp then workspace.CurrentCamera.CameraSubject = hrp end
            loadInvisAnim()
        end
    end)

    localPlayer.CharacterRemoving:Connect(function()
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
            InvisAnimTrack = nil
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency == 0.5 then
                    part.Transparency = 0
                end
            end
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = false
        end
    end)

    heartbeat:Connect(function(dt)
        if not InvisActive or not InvisPossible then
            if InvisWarningLabel then
                InvisWarningLabel.Visible = false
            end
            return
        end
        if not character or not humanoid or not hrp or not humanoid:IsDescendantOf(workspace) or humanoid.Health <= 0 then
            if InvisWarningLabel then InvisWarningLabel.Visible = false end
            return
        end
        if InvisWarningLabel then
            InvisWarningLabel.Visible = not isGrounded()
        end

        local speed = 12
        if humanoid.MoveDirection.Magnitude > 0 then
            local move = humanoid.MoveDirection * speed * dt
            hrp.CFrame = hrp.CFrame + move
        end

        local originalCF = hrp.CFrame
        local originalCamOffset = humanoid.CameraOffset
        local _, cameraYaw = workspace.CurrentCamera.CFrame:ToOrientation()

        hrp.CFrame = CFrame.new(hrp.CFrame.Position) * CFrame.fromOrientation(0, cameraYaw, 0)
        hrp.CFrame = hrp.CFrame * CFrame.Angles(math.rad(90), 0, 0)
        humanoid.CameraOffset = Vector3.new(0, 1.44, 0)

        if InvisAnimTrack then
            local success = pcall(function()
                if not InvisAnimTrack.IsPlaying then
                    InvisAnimTrack:Play()
                end
                InvisAnimTrack:AdjustSpeed(0)
                InvisAnimTrack.TimePosition = 0.3
            end)
            if not success then
                loadInvisAnim()
            end
        elseif humanoid and humanoid.Health > 0 then
            loadInvisAnim()
        end

        renderStepped:Wait()

        if humanoid and humanoid:IsDescendantOf(workspace) then
            humanoid.CameraOffset = originalCamOffset
        end
        if hrp and hrp:IsDescendantOf(workspace) then
            hrp.CFrame = originalCF
        end
        if InvisAnimTrack then
            pcall(function() InvisAnimTrack:Stop() end)
        end
        if hrp and hrp:IsDescendantOf(workspace) then
            local lookVec = workspace.CurrentCamera.CFrame.LookVector
            local flatLook = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
            if flatLook.Magnitude > 0.1 then
                hrp.CFrame = CFrame.new(hrp.Position, hrp.Position + flatLook)
            end
        end
        if character then
            for _, part in pairs(character:GetDescendants()) do
                if part:IsA("BasePart") and part.Transparency ~= 1 then
                    part.Transparency = 0.5
                end
            end
        end
    end)
end

task.spawn(function()
    while not _G.AbortEverything do
        task.wait(0.1)
        if Settings.Enabled and LocalPlayer.Character then
            pcall(function()
                for _, part in pairs(LocalPlayer.Character:GetDescendants()) do
                    if part:IsA("BasePart") then
                        part.CanCollide = false
                    end
                end
            end)
        end
    end
end)

local function DisableDoorsCollision()
    local map = Workspace:FindFirstChild("Map")
    if map then
        local doors = map:FindFirstChild("Doors")
        if doors then
            for _, door in ipairs(doors:GetDescendants()) do
                pcall(function() if door:IsA("BasePart") then door.CanCollide = false end end)
            end
        end
        Log("Colision de puertas desactivada")
    end
end
DisableDoorsCollision()

local function RiseToTargetY()
    if HasReachedTargetY then return end
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if hrp and humanoid and humanoid.Health > 0 and hrp.Position.Y < 4.7 and not IsRising then
        Log("Personaje por debajo de 4.7, subiendo por puntos hasta 4.8...")
        StatusText = "Subiendo a 4.8"
        IsRising = true

        local startPos = hrp.Position
        local targetY = 4.8
        local startY = startPos.Y
        local deltaY = targetY - startY
        if deltaY <= 0 then
            IsRising = false
            StatusText = "Esperando"
            return
        end

        local steps = math.max(3, math.floor(deltaY * 2))
        local waypoints = {}
        for i = 1, steps do
            local alpha = i / steps
            local y = startY + deltaY * alpha
            table.insert(waypoints, Vector3.new(startPos.X, y, startPos.Z))
        end

        for _, wp in ipairs(waypoints) do
            if not Settings.Enabled then break end
            local currentRot = hrp.CFrame - hrp.CFrame.Position
            local targetCF = CFrame.new(wp) * currentRot
            local dist = (wp - hrp.Position).Magnitude
            local duration = math.min(0.5, dist / 10)

            local tween = TweenService:Create(hrp, TweenInfo.new(duration, Enum.EasingStyle.Linear), { CFrame = targetCF })
            tween:Play()
            tween.Completed:Wait()
        end

        hrp.CFrame = CFrame.new(startPos.X, targetY, startPos.Z) * (hrp.CFrame - hrp.CFrame.Position)
        hrp.AssemblyLinearVelocity = Vector3.zero
        hrp.AssemblyAngularVelocity = Vector3.zero

        Log("Alcanzado 4.8, pausando 3 segundos...")
        task.wait(3)
        Log("Pausa completada, continuo")

        IsRising = false
        HasReachedTargetY = true
        StatusText = "Esperando"
    end
end

local PathVisualsFolder = Instance.new("Folder")
PathVisualsFolder.Name = "PathVisuals"
PathVisualsFolder.Parent = Workspace

local function ClearPathVisuals()
    for _, child in ipairs(PathVisualsFolder:GetChildren()) do
        pcall(function() child:Destroy() end)
    end
end

local function VisualizePath(waypoints, startPos)
    ClearPathVisuals()
    if not waypoints or #waypoints == 0 then return end
    for i, wp in ipairs(waypoints) do
        local part = Instance.new("Part")
        part.Name = "Waypoint" .. i
        part.Size = Vector3.new(2, 2, 2)
        part.Position = wp.Position
        part.Anchored = true
        part.CanCollide = false
        part.Material = Enum.Material.Neon
        part.Color = Color3.fromHSV(i / #waypoints, 1, 1)
        part.Transparency = 0.3
        part.Parent = PathVisualsFolder
    end
    local prevPos = startPos
    for i, wp in ipairs(waypoints) do
        local nextPos = wp.Position
        local dist = (nextPos - prevPos).Magnitude
        if dist > 0.5 then
            local line = Instance.new("Part")
            line.Name = "PathLine" .. i
            line.Anchored = true
            line.CanCollide = false
            line.Material = Enum.Material.Neon
            line.Color = Color3.new(0, 1, 0)
            line.Transparency = 0.5
            line.Size = Vector3.new(0.5, 0.5, dist)
            line.CFrame = CFrame.lookAt(prevPos + (nextPos - prevPos) / 2, nextPos)
            line.Parent = PathVisualsFolder
        end
        prevPos = nextPos
    end
end

local function ComputePath(startPos, endPos)
    local pathParamsList = {
        { Radius = 1, Height = 4, Spacing = 2 },
        { Radius = 1.2, Height = 4.5, Spacing = 2.5 },
        { Radius = 1.5, Height = 5, Spacing = 3 },
        { Radius = 2, Height = 5.5, Spacing = 4 },
        { Radius = 2.5, Height = 6, Spacing = 5 },
        { Radius = 3, Height = 6.5, Spacing = 5 },
        { Radius = 3.5, Height = 7, Spacing = 6 },
        { Radius = 4, Height = 7.5, Spacing = 6 },
        { Radius = 1, Height = 8, Spacing = 3 },
        { Radius = 5, Height = 5, Spacing = 5 },
        { Radius = 1.8, Height = 4.2, Spacing = 2.2 },
        { Radius = 2.2, Height = 5.8, Spacing = 4.5 },
        { Radius = 2.8, Height = 6.2, Spacing = 5.5 },
        { Radius = 3.2, Height = 6.8, Spacing = 5.8 },
        { Radius = 3.8, Height = 7.2, Spacing = 6.2 }
    }
    for _, params in ipairs(pathParamsList) do
        local pathParams = {
            AgentRadius = params.Radius,
            AgentHeight = params.Height,
            AgentCanJump = true,
            AgentCanClimb = true,
            WaypointSpacing = params.Spacing,
            CostCalibration = true
        }
        local path = PathfindingService:CreatePath(pathParams)
        local success, _ = pcall(function() path:ComputeAsync(startPos, endPos) end)
        if success and path.Status == Enum.PathStatus.Success then
            local rawWaypoints = path:GetWaypoints()
            if not rawWaypoints or #rawWaypoints < 2 then return rawWaypoints end
            local refinedWaypoints = {}
            local spacing = Settings.WaypointSpacing
            table.insert(refinedWaypoints, rawWaypoints[1])
            for i = 2, #rawWaypoints do
                local prev = rawWaypoints[i - 1].Position
                local curr = rawWaypoints[i].Position
                local dist = (curr - prev).Magnitude
                if dist <= spacing then
                    table.insert(refinedWaypoints, rawWaypoints[i])
                else
                    local steps = math.ceil(dist / spacing)
                    for j = 1, steps do
                        local alpha = j / steps
                        local pos = prev:Lerp(curr, alpha)
                        local action = (j == steps and rawWaypoints[i].Action) or Enum.PathWaypointAction.Walk
                        table.insert(refinedWaypoints, { Position = pos, Action = action })
                    end
                end
            end
            return refinedWaypoints
        end
        task.wait(0.05)
    end
    return nil
end

local function GetPositionInFrontOfTarget(targetPart, fromPos)
    if not targetPart then return nil end
    local success, cf = pcall(function() return targetPart.CFrame end)
    if not success then return nil end
    local lookVec = cf.LookVector
    lookVec = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
    if lookVec.Magnitude < 0.1 then
        lookVec = (fromPos - cf.Position).Unit
        lookVec = Vector3.new(lookVec.X, 0, lookVec.Z).Unit
        if lookVec.Magnitude < 0.1 then lookVec = Vector3.new(1, 0, 0) end
    end
    return cf.Position + lookVec * 4
end

local function GetFootPosition()
    local character = LocalPlayer.Character
    if not character then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end
    return hrp.Position - Vector3.new(0, 2.5, 0)
end

local function MoveToTarget(targetPart)
    RiseToTargetY()
    local character = LocalPlayer.Character
    if not character then
        Log("No hay personaje")
        return false
    end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    local humanoid = character:FindFirstChild("Humanoid")
    if not hrp or not humanoid then
        Log("No hay HRP o Humanoid")
        return false
    end
    if not targetPart or not targetPart:IsA("BasePart") then
        Log("Objetivo invalido")
        return false
    end
    CurrentTargetPart = targetPart
    IsMovingToTarget = true
    SomeFlag2 = false
    StatusText = "Camino al objetivo"
    local startPos = hrp.Position
    local targetFrontPos = GetPositionInFrontOfTarget(targetPart, startPos)
    if not targetFrontPos then
        Log("No se pudo calcular la posicion frente al objeto")
        IsMovingToTarget = false
        StatusText = "Esperando"
        return false
    end
    local endPos = targetFrontPos
    Log("Buscando camino al objetivo, distancia " .. math.floor((endPos - startPos).Magnitude))
    local path = ComputePath(startPos, endPos)
    if not path then
        Log("Camino no encontrado, ignorando objetivo temporalmente")
        IsMovingToTarget = false
        StatusText = "Esperando"
        return false
    end
    Log("Camino encontrado, puntos: " .. #path)
    VisualizePath(path, startPos)
    for _, waypoint in ipairs(path) do
        if not Settings.Enabled then
            ClearPathVisuals()
            IsMovingToTarget = false
            StatusText = "Esperando"
            return false
        end
        local footPos = GetFootPosition()
        if not footPos then continue end
        local targetPos = waypoint.Position
        local targetHRP = targetPos + Vector3.new(0, 2.5, 0)
        local currentRot = hrp.CFrame - hrp.CFrame.Position
        local targetCF = CFrame.new(targetHRP) * currentRot
        local dist = (targetHRP - hrp.Position).Magnitude
        if dist > 0.2 then
            local tween = TweenService:Create(hrp, TweenInfo.new(dist / Settings.MoveSpeed, Enum.EasingStyle.Linear), { CFrame = targetCF })
            tween:Play()
            tween.Completed:Wait()
            LastTick = tick()
        end
        if waypoint.Action == Enum.PathWaypointAction.Jump then
            humanoid.Jump = true
            task.wait(0.1)
        end
    end
    ClearPathVisuals()
    local finalPos = endPos
    local finalHRP = finalPos + Vector3.new(0, 2.5, 0)
    hrp.CFrame = CFrame.new(finalHRP) * CFrame.Angles(0, math.rad(90), 0)
    hrp.AssemblyLinearVelocity = Vector3.zero
    hrp.AssemblyAngularVelocity = Vector3.zero
    Log("Objetivo alcanzado")
    IsMovingToTarget = false
    StatusText = "Esperando"
    return true
end

local function HasTool(toolName)
    local backpack = LocalPlayer:FindFirstChild("Backpack")
    local character = LocalPlayer.Character
    return (backpack and backpack:FindFirstChild(toolName)) or (character and character:FindFirstChild(toolName))
end

local function EquipTool(toolName)
    local tool = LocalPlayer:FindFirstChild("Backpack") and LocalPlayer.Backpack:FindFirstChild(toolName)
    if tool and LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
        pcall(function() LocalPlayer.Character.Humanoid:EquipTool(tool) end)
        task.wait(1)
        return true
    end
    return false
end

local function FindCrowbarDealer()
    local map = Workspace:FindFirstChild("Map")
    if not map then
        Log("Mapa no encontrado")
        return nil
    end
    local shops = map:FindFirstChild("Shopz")
    if not shops then
        Log("Tiendas no encontradas")
        return nil
    end
    local character = LocalPlayer.Character
    if not character then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end
    local closestDealer = nil
    local closestDist = math.huge
    for _, shop in ipairs(shops:GetChildren()) do
        local stocks = shop:FindFirstChild("CurrentStocks")
        if stocks then
            local crowbarStock = stocks:FindFirstChild("Crowbar")
            if crowbarStock and crowbarStock.Value > 0 then
                local mainPart = shop:FindFirstChild("MainPart")
                if mainPart then
                    local dist = (hrp.Position - mainPart.Position).Magnitude
                    if dist < closestDist then
                        closestDist = dist
                        closestDealer = shop
                    end
                end
            end
        end
    end
    if closestDealer then
        Log("Diler con palanca encontrado, distancia: " .. math.floor(closestDist))
    else
        Log("Diler con palanca no encontrado")
    end
    return closestDealer
end

local function BuyCrowbar()
    local dealer = FindCrowbarDealer()
    if not dealer then return false end
    local mainPart = dealer:FindFirstChild("MainPart")
    if not mainPart then
        Log("El diler no tiene MainPart")
        return false
    end
    StatusText = "Camino al diler"
    Log("Yendo al diler por la palanca")

    RetryCount = 0
    LastShopMainPart = mainPart
    local moveSuccess = MoveToTarget(mainPart)

    if not moveSuccess then
        RetryCount = RetryCount + 1
        Log("Camino no encontrado, intento " .. RetryCount .. "/3")

        if RetryCount >= 3 then
            Log("Camino no encontrado 3 veces, subiendo a 4.8")
            local character = LocalPlayer.Character
            local hrp = character and character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos = hrp.Position
                local tween = TweenService:Create(hrp, TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), { CFrame = CFrame.new(pos.X, 4.8, pos.Z) })
                tween:Play()
                tween.Completed:Wait()
                task.wait(1)
                Log("Reintentando encontrar camino al diler")
                RetryCount = 0
                moveSuccess = MoveToTarget(mainPart)
                if not moveSuccess then
                    Log("Camino al diler aun no encontrado, ignorando temporalmente")
                    StatusText = "Esperando"
                    return false
                end
            end
        else
            StatusText = "Esperando"
            return false
        end
    end

    StatusText = "Comprando palanca"
    task.wait(1.5)
    local events = ReplicatedStorage:FindFirstChild("Events")
    if events then
        Log("Abriendo tienda")
        pcall(function() events.BYZERSPROTEC:FireServer(true, "shop", mainPart, "IllegalStore") end)
        task.wait(1)
        Log("Comprando palanca")
        pcall(function() events.SSHPRMTE1:InvokeServer("IllegalStore", "Melees", "Crowbar", mainPart, nil, true) end)
        task.wait(20)
        Log("Cerrando tienda")
        pcall(function() events.BYZERSPROTEC:FireServer(false) end)
    end
    task.wait(2)
    local crowbar = HasTool("Crowbar")
    if crowbar then
        Log("Palanca comprada con exito")
    else
        Log("No se pudo comprar la palanca")
    end
    LastTick = tick()
    StatusText = "Esperando"
    return crowbar
end

local function CleanupTempIgnored()
    local now = tick()
    for obj, expiry in pairs(Settings.TempIgnored) do
        if now > expiry then
            Settings.TempIgnored[obj] = nil
            for i, v in ipairs(Settings.IgnoredList) do
                if v == obj then
                    table.remove(Settings.IgnoredList, i)
                    break
                end
            end
            Log("Objeto ignorado desbloqueado")
        end
    end
end

local function UpdateTargetsList()
    CleanupTempIgnored()
    local bredFolder = nil
    local map = Workspace:FindFirstChild("Map")
    if map then
        bredFolder = map:FindFirstChild("BredMakurz")
    end
    if not bredFolder then
        local filter = Workspace:FindFirstChild("Filter")
        if filter then
            bredFolder = filter:FindFirstChild("BredMakurz")
        end
    end
    if not bredFolder then
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj.Name == "BredMakurz" and obj:IsA("Folder") then
                bredFolder = obj
                break
            end
        end
    end
    if not bredFolder then
        Log("Carpeta BredMakurz no encontrada")
        return 0, 0
    end
    local character = LocalPlayer.Character
    if not character then return 0, 0 end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return 0, 0 end
    local safes = {}
    local registers = {}
    TotalSafesCount = 0
    TotalRegistersCount = 0
    SortedTargets = {}
    for _, obj in ipairs(bredFolder:GetChildren()) do
        local nameLower = obj.Name:lower()
        if nameLower:find("safe") or nameLower:find("register") then
            if nameLower:find("safe") then
                TotalSafesCount = TotalSafesCount + 1
            else
                TotalRegistersCount = TotalRegistersCount + 1
            end
            if Settings.ProcessedList[obj] then continue end
            if Settings.TempIgnored[obj] then continue end
            local values = obj:FindFirstChild("Values")
            if values then
                local broken = values:FindFirstChild("Broken")
                if broken and not broken.Value then
                    local mainPart = obj:FindFirstChild("MainPart") or obj.PrimaryPart
                    if mainPart and mainPart.Position.Y >= 4.8 then
                        local targetInfo = { obj = obj, part = mainPart, pos = mainPart.Position }
                        if nameLower:find("safe") then
                            table.insert(safes, targetInfo)
                        else
                            table.insert(registers, targetInfo)
                        end
                        table.insert(SortedTargets, targetInfo)
                    end
                end
            end
        end
    end
    AvailableSafes = safes
    AvailableRegisters = registers
    table.sort(SortedTargets, function(a, b)
        return (a.pos - hrp.Position).Magnitude < (b.pos - hrp.Position).Magnitude
    end)
    AvailableSafesCount = #safes
    AvailableRegistersCount = #registers
    return AvailableSafesCount + AvailableRegistersCount, TotalSafesCount + TotalRegistersCount
end

local function AnalyzeTargetsCount()
    local available, total = UpdateTargetsList()
    TotalAvailableTargets = available
    Log("Total disponible: " .. available .. "/" .. total .. " objetivos")
    if available < 20 then
        SuggestionText = "Pocos objetivos (" .. available .. "), muchos competidores. Cambia de servidor."
        Log("âš ï¸ " .. SuggestionText)
        pcall(function()
            game:GetService("StarterGui"):SetCore("SendNotification", {
                Title = "Recomendacion",
                Text = SuggestionText,
                Duration = 10
            })
        end)
    else
        SuggestionText = "Suficientes objetivos (" .. available .. "), puedes farmear."
    end
end
AnalyzeTargetsCount()

local function FindMoneyNearTarget(targetObj)
    local mainPart = targetObj:FindFirstChild("MainPart") or targetObj.PrimaryPart
    if not mainPart then return {} end
    local spawnedBread = Workspace:FindFirstChild("Filter") and Workspace.Filter:FindFirstChild("SpawnedBread")
    if not spawnedBread then return {} end
    local moneyParts = {}
    for _, bread in ipairs(spawnedBread:GetChildren()) do
        pcall(function()
            if bread:IsA("Part") and bread.Transparency < 1 then
                if (bread.Position - mainPart.Position).Magnitude <= 25 then
                    table.insert(moneyParts, bread)
                end
            end
        end)
    end
    return moneyParts
end

local function CollectMoneyNearTarget(targetObj)
    local moneyParts = FindMoneyNearTarget(targetObj)
    if #moneyParts == 0 then return false end
    Log("Recogiendo " .. #moneyParts .. " paquetes de dinero cerca de la caja fuerte")
    StatusText = "Recogiendo dinero"
    for _, money in ipairs(moneyParts) do
        if not Settings.Enabled then break end
        pcall(function()
            if money and money.Parent and money.Transparency < 1 then
                MoveToTarget(money)
                local pickupEvent = ReplicatedStorage:FindFirstChild("Events") and ReplicatedStorage.Events:FindFirstChild("CZDPZUS")
                if pickupEvent then
                    pcall(function() pickupEvent:FireServer(money) end)
                end
                task.wait(0.3)
            end
        end)
    end
    StatusText = "Esperando"
    return #FindMoneyNearTarget(targetObj) > 0
end

local function HackSafe(safeObj)
    if not HasTool("Crowbar") then
        Log("No hay palanca para abrir la caja fuerte, intentando comprar...")
        local bought = BuyCrowbar()
        if not bought then
            Log("No se pudo comprar la palanca, saltando caja fuerte")
            return false
        end
    end
    if not LocalPlayer.Character:FindFirstChild("Crowbar") then
        Log("Palanca en la mochila, equipando...")
        EquipTool("Crowbar")
        task.wait(1)
    end
    if not HasTool("Crowbar") then
        Log("La palanca no aparecio, saltando")
        return false
    end
    task.wait(1.5)
    local events = ReplicatedStorage:FindFirstChild("Events")
    if not events then
        Log("Carpeta Events no encontrada")
        return false
    end
    local remote1 = events:FindFirstChild("XMHH.2")
    local remote2 = events:FindFirstChild("XMHH2.2")
    local mainPart = safeObj:FindFirstChild("MainPart") or safeObj.PrimaryPart
    if not remote1 or not remote2 then
        Log("Remote events de hackeo no encontrados")
        return false
    end
    if not mainPart then
        Log("La caja fuerte no tiene parte principal")
        return false
    end
    Log("Comenzando hackeo de la caja fuerte")
    StatusText = "Hackeando caja fuerte"
    local startTime = tick()
    local hits = 0
    while Settings.Enabled and safeObj and safeObj.Parent do
        local values = safeObj:FindFirstChild("Values")
        if not values then break end
        local broken = values:FindFirstChild("Broken")
        if broken and broken.Value then
            Log("Caja fuerte ya hackeada")
            break
        end
        if tick() - startTime > 25 then
            Log("Tiempo de hackeo agotado")
            break
        end
        task.wait(0.4)
        local crowbar = LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Crowbar")
        if not crowbar then
            crowbar = LocalPlayer.Backpack and LocalPlayer.Backpack:FindFirstChild("Crowbar")
            if crowbar then EquipTool("Crowbar") end
        end
        if not crowbar then break end
        local arm = LocalPlayer.Character:FindFirstChild("Right Arm") or LocalPlayer.Character:FindFirstChild("RightHand")
        if not arm then break end
        local success, result = pcall(function() return remote1:InvokeServer("ðŸž", tick(), crowbar, "DZDRRRKI", safeObj, "Register") end)
        if success and result then
            pcall(function() remote2:FireServer("ðŸž", tick(), crowbar, "2389ZFX34", result, false, arm, mainPart, safeObj, mainPart.Position, mainPart.Position) end)
            hits = hits + 1
        end
        if hits % 4 == 0 then task.wait(0.8) end
        LastTick = tick()
    end
    task.wait(2)
    Log("Hackeo completado, golpes: " .. hits)
    StatusText = "Esperando"
    return true
end

local IsRespawning = false
local RespawnConnection = nil

local function PressE()
    VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.E, false, game)
    task.wait(0.1)
    VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.E, false, game)
end

local function StopRespawnHandler()
    if IsRespawning then
        IsRespawning = false
        if RespawnConnection then
            RespawnConnection:Disconnect()
            RespawnConnection = nil
        end
    end
end

local function StartRespawnHandler()
    if IsRespawning then return end
    IsRespawning = true
    Log("Muerte detectada - presionando E para revivir")
    StatusText = "Muerto"
    RespawnConnection = RunService.Heartbeat:Connect(function()
        if not IsRespawning then
            if RespawnConnection then
                RespawnConnection:Disconnect()
                RespawnConnection = nil
            end
            return
        end
        local character = LocalPlayer.Character
        local humanoid = character and character:FindFirstChild("Humanoid")
        if character and humanoid and humanoid.Health > 0 then
            StopRespawnHandler()
            StatusText = "Esperando"
            return
        end
        pcall(PressE)
    end)
end

local function OnCharacterAdded(newChar)
    StopRespawnHandler()
    task.wait(3)
    IsRising = false
    HasReachedTargetY = false
    if Settings.Enabled then
        Settings.IsDead = false
        LastTick = tick()
        RiseToTargetY()
        Log("Personaje revivido, continuo")
        StatusText = "Esperando"
    end
    local humanoid = newChar:WaitForChild("Humanoid", 5)
    if humanoid then
        humanoid.Died:Connect(StartRespawnHandler)
    end
end

LocalPlayer.CharacterAdded:Connect(OnCharacterAdded)
if LocalPlayer.Character then
    OnCharacterAdded(LocalPlayer.Character)
end

local EspEnabled = false
local EspHeartbeatConnection = nil
local EspElements = {}
local EspTextSize = 20

local function FormatName(rawName)
    rawName = string.gsub(rawName, "([a-z])([A-Z])", "%1 %2")
    rawName = string.gsub(rawName, "_", " ")
    if rawName:lower():find("safe") then
        return "CAJA " .. rawName
    elseif rawName:lower():find("register") then
        return "REG " .. rawName
    end
    return rawName
end

local function CreateHighlight(part, color)
    local highlight = Instance.new("Highlight")
    highlight.Name = "ESP_Highlight"
    highlight.Adornee = part
    highlight.FillColor = color
    highlight.FillTransparency = 0.5
    highlight.OutlineColor = Color3.new(1, 1, 1)
    highlight.OutlineTransparency = 0
    highlight.Parent = part
    return highlight
end

local EspCachedBredFolder = nil
local function GetBredMakurzFolder()
    if EspCachedBredFolder and EspCachedBredFolder.Parent then
        return EspCachedBredFolder
    end
    local found = Workspace:FindFirstChild("Map") and Workspace.Map:FindFirstChild("BredMakurz")
        or Workspace:FindFirstChild("Filter") and Workspace.Filter:FindFirstChild("BredMakurz")
    if not found then
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj.Name == "BredMakurz" and obj:IsA("Folder") then
                found = obj
                break
            end
        end
    end
    EspCachedBredFolder = found
    return found
end

local function UpdateESP()
    if not EspEnabled then return end
    local bredFolder = GetBredMakurzFolder()
    if not bredFolder then return end
    local character = LocalPlayer.Character
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    for _, obj in ipairs(bredFolder:GetChildren()) do
        local nameLower = obj.Name:lower()
        if nameLower:find("safe") or nameLower:find("register") then
            local mainPart = obj.PrimaryPart or obj:FindFirstChildOfClass("BasePart")
            if not mainPart then continue end
            if mainPart.Position.Y < 4.8 then continue end
            local values = obj:FindFirstChild("Values")
            local brokenVal = values and values:FindFirstChild("Broken")
            local isBroken = brokenVal and brokenVal.Value
            local color = isBroken and Color3.new(1, 0, 0) or Color3.new(0, 1, 0)
            local esp = EspElements[obj]
            if not esp then
                local billboard = Instance.new("BillboardGui")
                billboard.Name = "ESP_Billboard"
                billboard.Adornee = mainPart
                billboard.Size = UDim2.new(0, 200, 0, 50)
                billboard.StudsOffset = Vector3.new(0, 4, 0)
                billboard.AlwaysOnTop = true
                billboard.MaxDistance = 1000
                billboard.Parent = obj
                local label = Instance.new("TextLabel")
                label.Size = UDim2.new(1, 0, 1, 0)
                label.BackgroundTransparency = 1
                label.Font = Enum.Font.SourceSansBold
                label.TextScaled = false
                label.Text = FormatName(obj.Name)
                label.TextColor3 = color
                label.TextStrokeTransparency = 0
                label.TextStrokeColor3 = Color3.new(0, 0, 0)
                label.TextSize = EspTextSize
                label.Parent = billboard
                local highlight = CreateHighlight(obj, color)
                EspElements[obj] = {
                    billboard = billboard,
                    highlight = highlight,
                    label = label
                }
                if brokenVal then
                    brokenVal:GetPropertyChangedSignal("Value"):Connect(function()
                        if not EspEnabled or not EspElements[obj] then return end
                        local e = EspElements[obj]
                        if brokenVal.Value then
                            e.label.TextColor3 = Color3.new(1, 0, 0)
                            if e.highlight then
                                e.highlight.FillColor = Color3.new(1, 0, 0)
                            end
                        else
                            e.label.TextColor3 = Color3.new(0, 1, 0)
                            if e.highlight then
                                e.highlight.FillColor = Color3.new(0, 1, 0)
                            end
                        end
                    end)
                end
            else
                if brokenVal then
                    esp.label.TextColor3 = isBroken and Color3.new(1, 0, 0) or Color3.new(0, 1, 0)
                    if esp.highlight then
                        esp.highlight.FillColor = isBroken and Color3.new(1, 0, 0) or Color3.new(0, 1, 0)
                    end
                end
                if esp.label then
                    esp.label.TextSize = EspTextSize
                end
            end
        end
    end
    for obj, data in pairs(EspElements) do
        if not obj or not obj.Parent then
            pcall(function()
                if data.billboard then data.billboard:Destroy() end
                if data.highlight then data.highlight:Destroy() end
            end)
            EspElements[obj] = nil
        end
    end
end

local function EnableESP()
    if EspEnabled then return end
    EspEnabled = true
    task.spawn(function()
        while EspEnabled and not _G.AbortEverything do
            task.wait(0.25)
            UpdateESP()
        end
        EspHeartbeatConnection = nil
    end)
    Log("ESP de cajas fuertes/registradoras ACTIVADO")
end

local function DisableESP()
    if not EspEnabled then return end
    EspEnabled = false
    if EspHeartbeatConnection then
        EspHeartbeatConnection:Disconnect()
        EspHeartbeatConnection = nil
    end
    for obj, data in pairs(EspElements) do
        pcall(function()
            if data.billboard then data.billboard:Destroy() end
            if data.highlight then data.highlight:Destroy() end
        end)
    end
    EspElements = {}
    Log("ESP de cajas fuertes/registradoras DESACTIVADO")
end

local function SetupBrokenTracking()
    Log("Iniciando analisis de objetivos...")
    BrokenStatusMap = {}
    local bredFolder = nil
    local map = Workspace:FindFirstChild("Map")
    if map then
        bredFolder = map:FindFirstChild("BredMakurz")
    end
    if not bredFolder then
        local filter = Workspace:FindFirstChild("Filter")
        if filter then
            bredFolder = filter:FindFirstChild("BredMakurz")
        end
    end
    if not bredFolder then
        for _, obj in ipairs(Workspace:GetDescendants()) do
            if obj.Name == "BredMakurz" and obj:IsA("Folder") then
                bredFolder = obj
                break
            end
        end
    end
    if bredFolder then
        for _, obj in ipairs(bredFolder:GetChildren()) do
            local values = obj:FindFirstChild("Values")
            if values then
                local broken = values:FindFirstChild("Broken")
                if broken then
                    BrokenStatusMap[obj] = broken.Value
                    broken:GetPropertyChangedSignal("Value"):Connect(function()
                        if Settings.Enabled then
                            BrokenStatusMap[obj] = broken.Value
                            UpdateTargetsList()
                            AnalyzeTargetsCount()
                            Log("Estado del objetivo cambiado: " .. obj.Name .. " ahora " .. tostring(broken.Value))
                        end
                    end)
                end
            end
        end
        Log("Analisis de objetivos completado, rastreando " .. #BrokenStatusMap .. " objetos")
    end
end
SetupBrokenTracking()

local function MainFarmLoop()
    Log("Ciclo de autofarm iniciado")
    RiseToTargetY()
    while not _G.AbortEverything do
        task.wait(1)
        if not Settings.Enabled then
            task.wait(1)
            continue
        end
        Log("=== Ciclo de farm ===")
        local character = LocalPlayer.Character
        local humanoid = character and character:FindFirstChildOfClass("Humanoid")
        Settings.IsDead = (not humanoid) or (humanoid.Health <= 0)
        if Settings.IsDead then
            Log("Personaje muerto, esperando")
            task.wait(3)
            continue
        end
        RiseToTargetY()
        if not HasTool("Crowbar") then
            Log("No hay palanca, intentando comprar")
            local bought = BuyCrowbar()
            if not bought then
                Log("No se pudo comprar la palanca, esperando 5 seg")
                task.wait(5)
                continue
            end
        else
            Log("La palanca ya esta")
        end
        local available, total = UpdateTargetsList()
        TotalAvailableTargets = available
        if available < 5 then
            Log("Quedan pocos objetivos (" .. available .. "), recomiendo cambiar de servidor")
        end
        if available == 0 then
            Log("No hay objetivos disponibles, esperando 5 seg")
            task.wait(5)
            continue
        end
        local nextTarget = nil
        local minDist = math.huge
        for _, targetInfo in ipairs(SortedTargets) do
            if not Settings.TempIgnored[targetInfo.obj] then
                local dist = (targetInfo.pos - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude
                if dist < minDist then
                    minDist = dist
                    nextTarget = targetInfo.obj
                end
            end
        end
        if not nextTarget then
            Log("No hay objetivos disponibles, esperando 5 seg")
            task.wait(5)
            continue
        end
        local mainPart = nextTarget:FindFirstChild("MainPart") or nextTarget.PrimaryPart
        if not mainPart then
            Log("El objetivo no tiene MainPart, saltando")
            Settings.ProcessedList[nextTarget] = true
            continue
        end
        Log("Moviendose al objetivo: " .. nextTarget.Name .. ", distancia " .. math.floor((mainPart.Position - LocalPlayer.Character.HumanoidRootPart.Position).Magnitude))
        local moveSuccess = MoveToTarget(mainPart)
        if moveSuccess then
            if not LocalPlayer.Character:FindFirstChild("Crowbar") then
                EquipTool("Crowbar")
            end
            Log("Abriendo caja fuerte")
            local hackSuccess = HackSafe(nextTarget)
            if hackSuccess then
                Log("Caja fuerte abierta, recogiendo dinero")
                local stillMoney = CollectMoneyNearTarget(nextTarget)
                local attempts = 5
                while stillMoney and attempts > 0 do
                    task.wait(2)
                    stillMoney = CollectMoneyNearTarget(nextTarget)
                    attempts = attempts - 1
                end
                Settings.ProcessedList[nextTarget] = true
                Log("Caja fuerte completamente procesada")
            else
                Log("No se pudo abrir la caja fuerte, ignorando temporalmente")
                Settings.TempIgnored[nextTarget] = tick() + Settings.IgnoreDuration
                table.insert(Settings.IgnoredList, nextTarget)
            end
        else
            Log("No se pudo alcanzar el objetivo, ignorando temporalmente")
            Settings.TempIgnored[nextTarget] = tick() + Settings.IgnoreDuration
            table.insert(Settings.IgnoredList, nextTarget)
        end
        task.wait(2)
    end
end

local Tabs = {
    Farm = v4:AddTab({ Name = "Farm", Icon = "zap" }),
    Info = v4:AddTab({ Name = "Info", Icon = "info" })
}

local FarmBox = Tabs.Farm:AddLeftGroupbox("AutoFarm")
local VisBox = t2.Visuals:AddLeftGroupbox("Visuales Farm")

FarmBox:AddToggle("AutoFarmToggle", {
    Text = "Start Farm",
    Default = false,
    Callback = function(value)
        Settings.Enabled = value
        if value then
            Settings.IgnoredList = {}
            Settings.ProcessedList = {}
            Settings.TempIgnored = {}
            UpdateTargetsList()
            AnalyzeTargetsCount()
            RiseToTargetY()
            Log("Autofarm ACTIVADO")
            ObsidianLib:Notify({ Title = "AutoFarm", Description = "Iniciado", Time = 2 })
        else
            ClearPathVisuals()
            SomeFlag2 = false
            StatusText = "Esperando"
            Log("Autofarm DESACTIVADO")
            ObsidianLib:Notify({ Title = "AutoFarm", Description = "Detenido", Time = 2 })
        end
    end
})

FarmBox:AddToggle("AutoPickupMoneyToggle", {
    Text = "Auto Money",
    Default = false,
    Callback = function(value)
        if value then
            Log("Auto-recogida de dinero ACTIVADA")
        else
            StopAutoPickup()
            Log("Auto-recogida de dinero DESACTIVADA")
        end
    end
})

FarmBox:AddToggle("InvisibilityToggle", {
    Text = "Invis (R6)",
    Default = false,
    Callback = function(value)
        if value then
            _G.Invis_Enable()
            Log("Invisibilidad ACTIVADA")
        else
            _G.Invis_Disable()
            Log("Invisibilidad DESACTIVADA")
        end
    end
})

FarmBox:AddToggle("AntiAfkToggle", {
    Text = "Anti-AFK",
    Default = true,
    Callback = function(value)
        AntiAfkEnabled = value
        if value then
            EnableAntiAfk()
            Log("Anti-AFK ACTIVADO")
        else
            DisableAntiAfk()
            Log("Anti-AFK DESACTIVADO")
        end
    end
})

EnableAntiAfk()

FarmBox:AddSlider("SpeedSlider", {
    Text = "Speed",
    Default = 22,
    Min = 10,
    Max = 45,
    Rounding = 1,
    Callback = function(value)
        Settings.MoveSpeed = value
        Log("Velocidad " .. value)
    end
})

VisBox:AddToggle("SafeESPToggle", {
    Text = "Safe/Register ESP",
    Default = false,
    Callback = function(value)
        if value then
            EnableESP()
        else
            DisableESP()
        end
    end
})

VisBox:AddSlider("TextSizeSlider", {
    Text = "Text Size",
    Default = 20,
    Min = 10,
    Max = 40,
    Rounding = 0,
    Callback = function(value)
        EspTextSize = value
        for _, data in pairs(EspElements) do
            if data.label then
                data.label.TextSize = EspTextSize
            end
        end
    end
})

local InfoBox = Tabs.Info:AddLeftGroupbox("Info")
local statusLabel = InfoBox:AddLabel({ Text = "Estado: Cargando...", DoesWrap = true })
local safesLabel = InfoBox:AddLabel({ Text = "Cajas: 0/0", DoesWrap = true })
local registersLabel = InfoBox:AddLabel({ Text = "Registradoras: 0/0", DoesWrap = true })
local remainingLabel = InfoBox:AddLabel({ Text = "Restantes: 0/0", DoesWrap = true })
local suggestionLabel = InfoBox:AddLabel({ Text = "Consejo: Cargando...", DoesWrap = true })

InfoBox:AddButton({
    Text = "ABORTAR",
    Callback = function()
        AbortAll()
    end
})

task.spawn(function()
    while not _G.AbortEverything do
        if Settings.Enabled then
            statusLabel:SetText("Estado: " .. StatusText)
            safesLabel:SetText("Cajas: " .. AvailableSafesCount .. "/" .. TotalSafesCount)
            registersLabel:SetText("Registradoras: " .. AvailableRegistersCount .. "/" .. TotalRegistersCount)
            remainingLabel:SetText("Restantes: " .. (AvailableSafesCount + AvailableRegistersCount) .. "/" .. (TotalSafesCount + TotalRegistersCount))
            suggestionLabel:SetText("Consejo: " .. SuggestionText)
        else
            statusLabel:SetText("Estado: Esperando")
            safesLabel:SetText("Cajas: 0/0")
            registersLabel:SetText("Registradoras: 0/0")
            remainingLabel:SetText("Restantes: 0/0")
            suggestionLabel:SetText("Consejo: Inicia el farm")
        end
        task.wait(0.5)
    end
end)

task.spawn(MainFarmLoop)

end

local OriginalRayIgnore = nil
local RayCastModuleRef = nil
local WallBangHooked = false

local function FindRayCastModules()
    local results = {}
    local tried = {}
    local function Try(instance)
        if not instance or not instance:IsA("ModuleScript") or tried[instance] then return end
        tried[instance] = true
        local okReq, mod = pcall(require, instance)
        if okReq and type(mod) == "table" then
            local okProp, fn = pcall(function()
                return mod.RayIgnoreNonCollideWithIgnoreList
            end)
            if okProp and type(fn) == "function" then
                table.insert(results, mod)
            end
        end
    end
    if getscriptbytecode and getscripts then
        local _okS, _allScr = pcall(getscripts)
        if _okS and type(_allScr) == "table" then
        for _, scr in ipairs(_allScr) do
            if scr:IsA("ModuleScript") and not tried[scr] then
                local okBc, bc = pcall(getscriptbytecode, scr)
                if okBc and type(bc) == "string" and bc:find("RayIgnoreNonCollideWithIgnoreList") then
                    Try(scr)
                end
            end
        end
        end
    end
    if #results > 0 then
        return results
    end
    local seen = {}
    if getgc then
        for _, obj in ipairs(getgc(true)) do
            if type(obj) == "table" and not seen[obj] then
                seen[obj] = true
                local okProp, fn = pcall(function()
                    return obj.RayIgnoreNonCollideWithIgnoreList
                end)
                if okProp and type(fn) == "function" then
                    table.insert(results, obj)
                end
            end
        end
    end
    if #results > 0 then
        return results
    end
    local function FindIn(container)
        if not container then return end
        for _, child in ipairs(container:GetChildren()) do
            if child.Name:lower():find("packages") then
                continue
            end
            if child:IsA("ModuleScript") then
                local lowerName = child.Name:lower()
                if lowerName:find("ray") or lowerName:find("cast") or lowerName:find("bullet") or lowerName:find("emitter") then
                    Try(child)
                end
            end
            FindIn(child)
        end
    end
    Try(game:GetService("ReplicatedStorage"):FindFirstChild("RayCast"))
    Try(game:GetService("ReplicatedStorage"):FindFirstChild("Module") and game:GetService("ReplicatedStorage").Module:FindFirstChild("RayCast"))
    FindIn(game:GetService("ReplicatedStorage"))
    return results
end

local function HookWallBang()
    if WallBangHooked then return true end
    local modules = FindRayCastModules()
    if #modules == 0 then return false end
    print("[WallBang] Modulos encontrados: " .. #modules)
    OriginalRayIgnore = {}
    RayCastModuleRef = {}
    for _, mod in ipairs(modules) do
        local original = mod.RayIgnoreNonCollideWithIgnoreList
        OriginalRayIgnore[mod] = original
        table.insert(RayCastModuleRef, mod)
        mod.RayIgnoreNonCollideWithIgnoreList = function(...)
            local packed = table.pack(pcall(original, ...))
            if not packed[1] then
                return
            end
            local args = {}
            for i = 2, packed.n do
                table.insert(args, packed[i])
            end
            if _G.WallBang then
                local hitPart = args[1]
                local hitIsPlayer = false
                if hitPart then
                    local model = hitPart:IsA("BasePart") and hitPart:FindFirstAncestorOfClass("Model")
                    if model and game.Players:GetPlayerFromCharacter(model) then
                        hitIsPlayer = true
                    end
                end
                if hitPart and not hitIsPlayer then
                    local lp = game.Players.LocalPlayer
                    local nearest, nearestDist = nil, math.huge
                    for _, v in ipairs(game.Players:GetPlayers()) do
                        if v ~= lp and v.Team ~= lp.Team and v.Character and v.Character:FindFirstChild("HumanoidRootPart") then
                            local dist = (v.Character.HumanoidRootPart.Position - lp.Character.HumanoidRootPart.Position).Magnitude
                            if dist < nearestDist then
                                nearest, nearestDist = v, dist
                            end
                        end
                    end
                    if nearest and nearest.Character and nearest.Character:FindFirstChild("HumanoidRootPart") then
                        args[1] = nearest.Character.HumanoidRootPart
                        args[2] = nearest.Character.HumanoidRootPart.Position
                    end
                end
            end
            return unpack(args)
        end
    end
    WallBangHooked = true
    return true
end

function UnhookWallBang()
    if not WallBangHooked then return end
    if RayCastModuleRef and OriginalRayIgnore then
        for _, mod in ipairs(RayCastModuleRef) do
            if OriginalRayIgnore[mod] then
                mod.RayIgnoreNonCollideWithIgnoreList = OriginalRayIgnore[mod]
            end
        end
    end
    OriginalRayIgnore = nil
    RayCastModuleRef = nil
    WallBangHooked = false
end

local FlySpeed = 90
local flyBodyParts = {}
local flyConn = nil

local function RemoveFlyBody()
    for _, part in ipairs(flyBodyParts) do
        pcall(function()
            local bv = part:FindFirstChildOfClass("BodyVelocity")
            if bv then bv:Destroy() end
        end)
        pcall(function()
            local bp = part:FindFirstChildOfClass("BodyPosition")
            if bp then bp:Destroy() end
        end)
    end
    flyBodyParts = {}
end

function StopFly()
    if flyConn then
        flyConn:Disconnect()
        flyConn = nil
    end
    RemoveFlyBody()
end

local RagdollActive = false
local RagdollConn = nil
RagdollInputConn = nil

function StopRagdollLoop()
    RagdollActive = false
    if RagdollConn then
        RagdollConn:Disconnect()
        RagdollConn = nil
    end
end

local ViewmodelActive = false
local ViewmodelConn = nil
local ViewmodelOffset = Vector3.new(0, 0, 0)
local ViewmodelSavedJoints = {}
local VIEWMODEL_ARM_PARTS = { "Right Arm", "Left Arm", "RightUpperArm", "LeftUpperArm" }

local function FindViewmodelMotor(part)
    local motor = part:FindFirstChildOfClass("Motor6D")
    if motor then return motor end
    local parent = part.Parent
    if parent then
        for _, child in ipairs(parent:GetChildren()) do
            if child:IsA("Motor6D") and child.Part1 == part then
                return child
            end
        end
    end
    return nil
end

local function ApplyViewmodel()
    local char = t1.value10.Character
    if not char then return end
    local seen = {}
    for _, partName in ipairs(VIEWMODEL_ARM_PARTS) do
        local part = char:FindFirstChild(partName)
        if part then
            local motor = FindViewmodelMotor(part)
            if motor and not seen[motor] then
                seen[motor] = true
                if not ViewmodelSavedJoints[motor] then
                    ViewmodelSavedJoints[motor] = motor.C0
                end
                pcall(function()
                    motor.C0 = ViewmodelSavedJoints[motor] * CFrame.new(ViewmodelOffset)
                end)
            end
        end
    end
    for motor in pairs(ViewmodelSavedJoints) do
        if not seen[motor] then
            ViewmodelSavedJoints[motor] = nil
        end
    end
end

local function StartViewmodel()
    StopViewmodel()
    ViewmodelActive = true
    ViewmodelConn = t1.value4.RenderStepped:Connect(ApplyViewmodel)
end

function StopViewmodel()
    ViewmodelActive = false
    if ViewmodelConn then
        ViewmodelConn:Disconnect()
        ViewmodelConn = nil
    end
    for motor, originalC0 in pairs(ViewmodelSavedJoints) do
        pcall(function()
            if motor and motor.Parent then
                motor.C0 = originalC0
            end
        end)
    end
    ViewmodelSavedJoints = {}
end

local XpAutoMeleeActive = false
local XpAutoMeleeConn = nil
local XpTpActive = false
local XpTpConn = nil
local XpTpTarget = nil

function StopAutoMelee()
    XpAutoMeleeActive = false
    if XpAutoMeleeConn then
        task.cancel(XpAutoMeleeConn)
        XpAutoMeleeConn = nil
    end
end

local function StartAutoMelee()
    StopAutoMelee()
    XpAutoMeleeActive = true
    XpAutoMeleeConn = task.spawn(function()
        while _G.AbortEverything == false and XpAutoMeleeActive do
            pcall(function()
                if t1.value3.MouseBehavior == Enum.MouseBehavior.Default then
                    return
                end
                VirtualInputManager:SendMouseButtonEvent(0, 0, 0, true, game, 0)
                task.wait(0.05)
                VirtualInputManager:SendMouseButtonEvent(0, 0, 0, false, game, 0)
            end)
            task.wait(0.08)
        end
    end)
end

local function TeleportInFrontOf(targetPlayer)
    if typeof(targetPlayer) ~= "Instance" or not targetPlayer.Parent then
        if typeof(targetPlayer) == "string" then
            targetPlayer = t1.value2:FindFirstChild(targetPlayer)
        else
            return
        end
    end
    local targetChar = targetPlayer.Character
    local targetHrp = targetChar and targetChar:FindFirstChild("HumanoidRootPart")
    if not targetHrp then return end
    local char = t1.value10.Character
    local hrp = char and char:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    pcall(function()
        local cf = targetHrp.CFrame
        local look = Vector3.new(cf.LookVector.X, 0, cf.LookVector.Z)
        if look.Magnitude < 0.1 then look = Vector3.new(1, 0, 0) end
        look = look.Unit
        local pos = cf.Position + look * 2
        pos = Vector3.new(pos.X, cf.Position.Y + 2.5, pos.Z)
        hrp.CFrame = CFrame.new(pos)
        hrp.AssemblyLinearVelocity = Vector3.zero
    end)
end

function StopTpLoop()
    XpTpActive = false
    if XpTpConn then
        task.cancel(XpTpConn)
        XpTpConn = nil
    end
end

local function StartTpLoop()
    StopTpLoop()
    XpTpActive = true
    XpTpConn = task.spawn(function()
        while _G.AbortEverything == false and XpTpActive do
            if XpTpTarget then
                pcall(TeleportInFrontOf, XpTpTarget)
            end
            task.wait(0.4)
        end
    end)
end

local SkyboxInstance = nil
local SkyboxOriginalValues = nil

local SKYBOX_PRESETS = {
    ["Noche"] = {
        SkyboxBk = "rbxassetid://12064107",
        SkyboxDn = "rbxassetid://12064152",
        SkyboxFt = "rbxassetid://12064121",
        SkyboxLf = "rbxassetid://12063984",
        SkyboxRt = "rbxassetid://12064115",
        SkyboxUp = "rbxassetid://12064131"
    },
    ["Espacio"] = {
        SkyboxBk = "rbxassetid://149397692",
        SkyboxDn = "rbxassetid://149397686",
        SkyboxFt = "rbxassetid://149397697",
        SkyboxLf = "rbxassetid://149397684",
        SkyboxRt = "rbxassetid://149397688",
        SkyboxUp = "rbxassetid://149397702"
    },
    ["Cielo Azul"] = {
        SkyboxBk = "rbxassetid://92464172",
        SkyboxDn = "rbxassetid://92464250",
        SkyboxFt = "rbxassetid://92464217",
        SkyboxLf = "rbxassetid://92464234",
        SkyboxRt = "rbxassetid://92464189",
        SkyboxUp = "rbxassetid://92464157"
    },
    ["Cielo Oscuro"] = {
        SkyboxBk = "rbxassetid://570555736",
        SkyboxDn = "rbxassetid://570555964",
        SkyboxFt = "rbxassetid://570555800",
        SkyboxLf = "rbxassetid://570555840",
        SkyboxRt = "rbxassetid://570555882",
        SkyboxUp = "rbxassetid://570555929"
    },
    ["Nubes"] = {
        SkyboxBk = "rbxassetid://570557514",
        SkyboxDn = "rbxassetid://570557775",
        SkyboxFt = "rbxassetid://570557559",
        SkyboxLf = "rbxassetid://570557620",
        SkyboxRt = "rbxassetid://570557672",
        SkyboxUp = "rbxassetid://570557727"
    },
    ["Montanas"] = {
        SkyboxBk = "rbxassetid://2128458653",
        SkyboxDn = "rbxassetid://2128462480",
        SkyboxFt = "rbxassetid://2128458653",
        SkyboxLf = "rbxassetid://2128462027",
        SkyboxRt = "rbxassetid://2128462027",
        SkyboxUp = "rbxassetid://2128462236"
    },
    ["Vaporwave"] = {
        SkyboxBk = "rbxassetid://1417494030",
        SkyboxDn = "rbxassetid://1417494146",
        SkyboxFt = "rbxassetid://1417494253",
        SkyboxLf = "rbxassetid://1417494402",
        SkyboxRt = "rbxassetid://1417494499",
        SkyboxUp = "rbxassetid://1417494643"
    },
    ["Nebulosa"] = {
        SkyboxBk = "rbxassetid://159454299",
        SkyboxDn = "rbxassetid://159454296",
        SkyboxFt = "rbxassetid://159454293",
        SkyboxLf = "rbxassetid://159454286",
        SkyboxRt = "rbxassetid://159454300",
        SkyboxUp = "rbxassetid://159454288"
    },
    ["Atardecer"] = {
        SkyboxBk = "rbxassetid://264908339",
        SkyboxDn = "rbxassetid://264907909",
        SkyboxFt = "rbxassetid://264909420",
        SkyboxLf = "rbxassetid://264909758",
        SkyboxRt = "rbxassetid://264908886",
        SkyboxUp = "rbxassetid://264907379"
    },
    ["Lago"] = {
        SkyboxBk = "rbxassetid://6823523318",
        SkyboxDn = "rbxassetid://6823525702",
        SkyboxFt = "rbxassetid://6823482923",
        SkyboxLf = "rbxassetid://6823530023",
        SkyboxRt = "rbxassetid://6823531746",
        SkyboxUp = "rbxassetid://6823528533"
    },
    ["Alien Rojo"] = {
        SkyboxBk = "rbxassetid://7123385217",
        SkyboxDn = "rbxassetid://7123387679",
        SkyboxFt = "rbxassetid://7123390433",
        SkyboxLf = "rbxassetid://7123394786",
        SkyboxRt = "rbxassetid://7123402505",
        SkyboxUp = "rbxassetid://7123412196"
    },
    ["Black Mesa"] = {
        SkyboxBk = "rbxassetid://9569742122",
        SkyboxDn = "rbxassetid://9569613307",
        SkyboxFt = "rbxassetid://9569611418",
        SkyboxLf = "rbxassetid://9569608166",
        SkyboxRt = "rbxassetid://9569601267",
        SkyboxUp = "rbxassetid://9569598752"
    },
    ["Sin cielo"] = {
        SkyboxBk = "rbxassetid://2675785344",
        SkyboxDn = "rbxassetid://2675785344",
        SkyboxFt = "rbxassetid://2675785344",
        SkyboxLf = "rbxassetid://2675785344",
        SkyboxRt = "rbxassetid://2675785344",
        SkyboxUp = "rbxassetid://2675785344"
    }
}

local function SaveSkyboxOriginals()
    if SkyboxOriginalValues then return end
    local sky = game:GetService("Lighting"):FindFirstChild("Sky")
    if sky then
        SkyboxOriginalValues = {
            SkyboxBk = sky.SkyboxBk,
            SkyboxDn = sky.SkyboxDn,
            SkyboxFt = sky.SkyboxFt,
            SkyboxLf = sky.SkyboxLf,
            SkyboxRt = sky.SkyboxRt,
            SkyboxUp = sky.SkyboxUp
        }
    end
end

local function ApplySkyboxPreset(presetName)
    if not SkyboxInstance or not SkyboxInstance.Parent then
        SkyboxInstance = Instance.new("Sky")
        SkyboxInstance.Parent = game:GetService("Lighting")
    end
    SaveSkyboxOriginals()
    local preset = SKYBOX_PRESETS[presetName]
    if preset then
        for prop, id in pairs(preset) do
            SkyboxInstance[prop] = id
        end
    end
end

function StopSkybox()
    if SkyboxInstance then
        pcall(function() SkyboxInstance:Destroy() end)
        SkyboxInstance = nil
    end
    local sky = game:GetService("Lighting"):FindFirstChild("Sky")
    if SkyboxOriginalValues and sky then
        pcall(function()
            for prop, id in pairs(SkyboxOriginalValues) do
                sky[prop] = id
            end
        end)
    end
end

local WeaponColorActive = false
local WeaponColorConn = nil
local WeaponColorValue = Color3.new(1, 1, 1)
local SavedWeaponColors = {}

local function GetEquippedTool(character)
    if not character then return nil end
    return character:FindFirstChildOfClass("Tool")
end

local function ColorWeaponParts(tool)
    if not tool then return end
    for _, part in ipairs(tool:GetDescendants()) do
        if part:IsA("BasePart") and not part.Transparency then
            if SavedWeaponColors[part] == nil then
                SavedWeaponColors[part] = part.Color
            end
            part.Color = WeaponColorValue
        end
    end
    local handle = tool:FindFirstChild("Handle")
    if handle then
        if SavedWeaponColors[handle] == nil then
            SavedWeaponColors[handle] = handle.Color
        end
        handle.Color = WeaponColorValue
    end
end

local function ApplyWeaponColors()
    for _, plr in ipairs(t1.value2:GetPlayers()) do
        local char = plr.Character
        if char then
            ColorWeaponParts(GetEquippedTool(char))
        end
    end
    pcall(function()
        local camera = t1.value7
        local vm = camera and camera:FindFirstChild("ViewModel")
        if vm then
            ColorWeaponParts(vm)
        end
    end)
    pcall(function()
        local char = t1.value10.Character
        local vm = char and char:FindFirstChild("ViewModel")
        if vm then
            ColorWeaponParts(vm)
        end
    end)
end

local function StartWeaponColor()
    StopWeaponColor()
    WeaponColorActive = true
    ApplyWeaponColors()
    WeaponColorConn = task.spawn(function()
        while _G.AbortEverything == false and WeaponColorActive do
            task.wait(0.2)
            pcall(ApplyWeaponColors)
        end
    end)
end

function StopWeaponColor()
    WeaponColorActive = false
    if WeaponColorConn then
        task.cancel(WeaponColorConn)
        WeaponColorConn = nil
    end
    for part, originalColor in pairs(SavedWeaponColors) do
        pcall(function()
            if part and part.Parent then
                part.Color = originalColor
            end
        end)
    end
    SavedWeaponColors = {}
end

local CrateEspActive = false
local CrateEspConn = nil
local CrateEspHighlights = {}
local CrateEspColor = Color3.fromRGB(255, 0, 0)
local CrateEspMaxDistance = 300

local function GetSpawnedCratesFolder()
    local filter = workspace:FindFirstChild("Filter")
    return filter and filter:FindFirstChild("SpawnedCrates")
end

local function RefreshCrateEsp()
    if not CrateEspActive then return end
    local folder = GetSpawnedCratesFolder()
    if not folder then return end
    local char = t1.value10.Character
    local hrp = char and (char:FindFirstChild("HumanoidRootPart") or char:FindFirstChild("Torso"))
    local seen = {}
    for _, crate in ipairs(folder:GetChildren()) do
        if crate:IsA("Model") then
            local part = crate.PrimaryPart or crate:FindFirstChild("Handle") or crate:FindFirstChildOfClass("BasePart")
            if part then
                local dist = hrp and (hrp.Position - part.Position).Magnitude or 0
                if dist <= CrateEspMaxDistance then
                    seen[crate] = true
                    local hl = CrateEspHighlights[crate]
                    if not hl or not hl.Parent then
                        if hl then pcall(function() hl:Destroy() end) end
                        hl = Instance.new("Highlight")
                        hl.Name = "CrateESP_Highlight"
                        hl.Adornee = part
                        hl.FillColor = CrateEspColor
                        hl.FillTransparency = 0.3
                        hl.OutlineColor = CrateEspColor
                        hl.OutlineTransparency = 0
                        hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
                        hl.Parent = part
                        CrateEspHighlights[crate] = hl
                    else
                        hl.FillColor = CrateEspColor
                        hl.OutlineColor = CrateEspColor
                    end
                end
            end
        end
    end
    for crate, hl in pairs(CrateEspHighlights) do
        if not seen[crate] then
            pcall(function() hl:Destroy() end)
            CrateEspHighlights[crate] = nil
        end
    end
end

local function SetCrateEspColor(color)
    CrateEspColor = color
    for _, hl in pairs(CrateEspHighlights) do
        pcall(function()
            hl.FillColor = color
            hl.OutlineColor = color
        end)
    end
end

local function SetCrateEspMaxDistance(dist)
    CrateEspMaxDistance = dist
    pcall(RefreshCrateEsp)
end

local function StartCrateEsp()
    StopCrateEsp()
    CrateEspActive = true
    RefreshCrateEsp()
    CrateEspConn = task.spawn(function()
        while _G.AbortEverything == false and CrateEspActive do
            task.wait(0.3)
            pcall(RefreshCrateEsp)
        end
    end)
end

function StopCrateEsp()
    CrateEspActive = false
    if CrateEspConn then
        task.cancel(CrateEspConn)
        CrateEspConn = nil
    end
    for crate, hl in pairs(CrateEspHighlights) do
        pcall(function() hl:Destroy() end)
    end
    CrateEspHighlights = {}
end

getgenv().SetCrateEspColor = SetCrateEspColor
getgenv().SetCrateEspMaxDistance = SetCrateEspMaxDistance

local DropsEspActive = false
local DropsEspConn = nil
local DropsEspMarks = {}
local DropsEspColor = Color3.fromRGB(0, 170, 255)
local DropsEspMaxDistance = 500

local function GetSpawnedToolsFolder()
    local filter = workspace:FindFirstChild("Filter")
    return filter and filter:FindFirstChild("SpawnedTools")
end

local function GetDroppedItemPart(item)
    local part = item:FindFirstChild("CanMesh")
    if part and part:IsA("BasePart") then return part end
    part = item:FindFirstChild("Handle")
    if part and part:IsA("BasePart") then return part end
    part = item:FindFirstChild("WeaponHandle")
    if part and part:IsA("BasePart") then return part end
    return item:FindFirstChildOfClass("BasePart")
end

local function RefreshDropsEsp()
    if not DropsEspActive then return end
    local folder = GetSpawnedToolsFolder()
    if not folder then return end
    local char = t1.value10.Character
    local hrp = char and (char:FindFirstChild("HumanoidRootPart") or char:FindFirstChild("Torso"))
    local seen = {}
    for _, item in ipairs(folder:GetChildren()) do
        local part = GetDroppedItemPart(item)
        if part then
            local dist = hrp and (hrp.Position - part.Position).Magnitude or 0
            if dist <= DropsEspMaxDistance then
                seen[item] = true
                local hl = DropsEspMarks[item] and DropsEspMarks[item].Highlight
                if not hl or not hl.Parent then
                    if hl then pcall(function() hl:Destroy() end) end
                    hl = Instance.new("Highlight")
                    hl.Name = "DropsESP_Highlight"
                    hl.Adornee = part
                    hl.FillColor = DropsEspColor
                    hl.FillTransparency = 0.55
                    hl.OutlineColor = DropsEspColor
                    hl.OutlineTransparency = 0
                    hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
                    hl.Parent = part
                else
                    hl.FillColor = DropsEspColor
                    hl.OutlineColor = DropsEspColor
                end
                local tag = DropsEspMarks[item] and DropsEspMarks[item].Tag
                if not tag or not tag.Parent then
                    if tag then pcall(function() tag:Destroy() end) end
                    tag = Instance.new("BillboardGui")
                    tag.Name = "DropsESP_Tag"
                    tag.Adornee = part
                    tag.Size = UDim2.fromOffset(200, 18)
                    tag.StudsOffset = Vector3.new(0, 2, 0)
                    tag.AlwaysOnTop = true
                    tag.MaxDistance = 1000
                    local lbl = Instance.new("TextLabel")
                    lbl.Size = UDim2.fromScale(1, 1)
                    lbl.BackgroundTransparency = 1
                    lbl.Font = Enum.Font.GothamBold
                    lbl.TextSize = 13
                    lbl.TextColor3 = Color3.new(1, 1, 1)
                    lbl.TextStrokeTransparency = 0.35
                    lbl.TextScaled = false
                    lbl.TextTruncate = Enum.TextTruncate.AtEnd
                    lbl.Text = item.Name
                    lbl.Parent = tag
                    tag.Parent = part
                end
                DropsEspMarks[item] = { Highlight = hl, Tag = tag }
            end
        end
    end
    for item, marks in pairs(DropsEspMarks) do
        if not seen[item] then
            pcall(function() marks.Highlight:Destroy() end)
            pcall(function() marks.Tag:Destroy() end)
            DropsEspMarks[item] = nil
        end
    end
end

local function SetDropsEspColor(color)
    DropsEspColor = color
    for _, marks in pairs(DropsEspMarks) do
        pcall(function()
            marks.Highlight.FillColor = color
            marks.Highlight.OutlineColor = color
        end)
    end
end

local function SetDropsEspMaxDistance(dist)
    DropsEspMaxDistance = dist
    pcall(RefreshDropsEsp)
end

local function StartDropsEsp()
    StopDropsEsp()
    DropsEspActive = true
    RefreshDropsEsp()
    DropsEspConn = task.spawn(function()
        while _G.AbortEverything == false and DropsEspActive do
            task.wait(0.3)
            pcall(RefreshDropsEsp)
        end
    end)
end

function StopDropsEsp()
    DropsEspActive = false
    if DropsEspConn then
        task.cancel(DropsEspConn)
        DropsEspConn = nil
    end
    for _, marks in pairs(DropsEspMarks) do
        pcall(function() marks.Highlight:Destroy() end)
        pcall(function() marks.Tag:Destroy() end)
    end
    DropsEspMarks = {}
end

getgenv().SetDropsEspColor = SetDropsEspColor
getgenv().SetDropsEspMaxDistance = SetDropsEspMaxDistance

local PileEspStates = {
    Green = { Active = false, Highlights = {}, Color = Color3.fromRGB(0, 255, 0), MaxDistance = 300 },
    Red = { Active = false, Highlights = {}, Color = Color3.fromRGB(255, 0, 0), MaxDistance = 300 }
}
local PileEspConn = nil

local function GetSpawnedPilesFolder()
    local filter = workspace:FindFirstChild("Filter")
    return filter and filter:FindFirstChild("SpawnedPiles")
end

local function ClassifyPile(part)
    local ok, c = pcall(function() return part.Color end)
    if not ok or typeof(c) ~= "Color3" then return "Green" end
    if c.G >= c.R and c.G >= c.B then
        return "Green"
    end
    return "Red"
end

local function PileEspAnyActive()
    return PileEspStates.Green.Active or PileEspStates.Red.Active
end

local function RefreshPileEsp()
    if not PileEspAnyActive() then return end
    local folder = GetSpawnedPilesFolder()
    if not folder then return end
    local char = t1.value10.Character
    local hrp = char and (char:FindFirstChild("HumanoidRootPart") or char:FindFirstChild("Torso"))
    local kept = { Green = {}, Red = {} }
    for _, pile in ipairs(folder:GetChildren()) do
        local part = pile:FindFirstChild("MeshPart") or pile.PrimaryPart or pile:FindFirstChildOfClass("MeshPart") or pile:FindFirstChildOfClass("BasePart")
        if part then
            local cat = ClassifyPile(part)
            local state = PileEspStates[cat]
            if state.Active then
                local dist = hrp and (hrp.Position - part.Position).Magnitude or 0
                if dist <= state.MaxDistance then
                    kept[cat][pile] = true
                    local hl = state.Highlights[pile]
                    if not hl or not hl.Parent then
                        if hl then pcall(function() hl:Destroy() end) end
                        hl = Instance.new("Highlight")
                        hl.Name = "PileESP_Highlight_" .. cat
                        hl.Adornee = part
                        hl.FillColor = state.Color
                        hl.FillTransparency = 0.3
                        hl.OutlineColor = state.Color
                        hl.OutlineTransparency = 0
                        hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
                        hl.Parent = part
                        state.Highlights[pile] = hl
                    else
                        hl.FillColor = state.Color
                        hl.OutlineColor = state.Color
                    end
                end
            end
        end
    end
    for cat, state in pairs(PileEspStates) do
        for pile, hl in pairs(state.Highlights) do
            if not kept[cat][pile] then
                pcall(function() hl:Destroy() end)
                state.Highlights[pile] = nil
            end
        end
    end
end

local function SetPileEspColor(cat, color)
    local state = PileEspStates[cat]
    if not state then return end
    state.Color = color
    for _, hl in pairs(state.Highlights) do
        pcall(function()
            hl.FillColor = color
            hl.OutlineColor = color
        end)
    end
end

local function SetPileEspMaxDistance(cat, dist)
    local state = PileEspStates[cat]
    if not state then return end
    state.MaxDistance = dist
    pcall(RefreshPileEsp)
end

local function StartPileEsp(cat)
    local state = PileEspStates[cat]
    if not state or state.Active then return end
    state.Active = true
    pcall(RefreshPileEsp)
    if not PileEspConn then
        PileEspConn = task.spawn(function()
            while _G.AbortEverything == false and PileEspAnyActive() do
                task.wait(0.3)
                pcall(RefreshPileEsp)
            end
            PileEspConn = nil
        end)
    end
end

local function StopPileEsp(cat)
    local state = PileEspStates[cat]
    if not state then return end
    state.Active = false
    for pile, hl in pairs(state.Highlights) do
        pcall(function() hl:Destroy() end)
    end
    state.Highlights = {}
end

function StopAllPileEsp()
    StopPileEsp("Green")
    StopPileEsp("Red")
    if PileEspConn then
        task.cancel(PileEspConn)
        PileEspConn = nil
    end
end

getgenv().SetPileEspColor = SetPileEspColor
getgenv().SetPileEspMaxDistance = SetPileEspMaxDistance
getgenv().StopAllPileEsp = StopAllPileEsp

do

local NoFallDamageActive = false
local NoFallDamageConn = nil

local function StartNoFallDamage()
    if NoFallDamageActive then return end
    NoFallDamageActive = true
    NoFallDamageConn = t1.value4.Heartbeat:Connect(function()
        if not NoFallDamageActive then return end
        local char = t1.value10.Character
        if not char then return end
        local hrp = char:FindFirstChild("HumanoidRootPart") or char:FindFirstChild("Torso")
        if not hrp then return end
        pcall(function()
            local vel = hrp.AssemblyLinearVelocity
            if vel.Y < -18 then
                local params = RaycastParams.new()
                params.FilterType = Enum.RaycastFilterType.Exclude
                params.FilterDescendantsInstances = { char }
                params.IgnoreWater = true
                local result = workspace:Raycast(hrp.Position, Vector3.new(0, -1, 0) * 3, params)
                if result and result.Distance <= 2.2 then
                    hrp.AssemblyLinearVelocity = Vector3.new(vel.X, -18, vel.Z)
                end
            end
        end)
    end)
end

function StopNoFallDamage()
    NoFallDamageActive = false
    if NoFallDamageConn then
        NoFallDamageConn:Disconnect()
        NoFallDamageConn = nil
    end
end

getgenv().StartNoFallDamage = StartNoFallDamage
getgenv().StopNoFallDamage = StopNoFallDamage

local RageBotActive = false
local RageBotConn = nil
local RageBotTarget = nil
RageBotCheckTeam = RageBotCheckTeam or false
local RageBotCheckWhitelist = false
RageBotAutoShoot = RageBotAutoShoot or false
RageBotInstant = RageBotInstant == nil and true or RageBotInstant
RageBotRange = RageBotRange or 300

local function RageBotIsValidTarget(player)
    if player == t1.value10 then return false end
    local char = player.Character
    if not char then return false end
    local humanoid = char:FindFirstChildOfClass("Humanoid")
    if not humanoid or humanoid.Health <= 0 then return false end
    if RageBotCheckTeam then
        if player.Team == t1.value10.Team then return false end
    end
    if RageBotCheckWhitelist then
        if table.find(t1.value16 or {}, player) then return false end
    end
    return true
end

local function RageBotPickTarget()
    local best = nil
    local bestDist = math.huge
    local cam = workspace.CurrentCamera
    local origin = cam.CFrame.Position
    for _, player in pairs(t1.value2:GetPlayers()) do
        if RageBotIsValidTarget(player) then
            local head = player.Character:FindFirstChild("Head")
            if head then
                local dist = (head.Position - origin).Magnitude
                if dist < bestDist then
                    bestDist = dist
                    best = player
                end
            end
        end
    end
    return best, bestDist
end

local function StartRageBot()
    StopRageBot()
    RageBotActive = true
    RageBotConn = t1.value4.RenderStepped:Connect(function()
        if not RageBotActive or _G.AbortEverything then return end
        local target, dist = RageBotPickTarget()
        if not target then
            RageBotTarget = nil
            return
        end
        RageBotTarget = target
        local head = target.Character:FindFirstChild("Head")
        if not head then return end
        local cam = workspace.CurrentCamera
        local sens = (t1.value27 or 50) / 100
        if RageBotInstant then
            cam.CFrame = CFrame.new(cam.CFrame.Position, head.Position)
        else
            cam.CFrame = cam.CFrame:Lerp(CFrame.new(cam.CFrame.Position, head.Position), sens)
        end
        if RageBotAutoShoot then
            local hrp = t1.value10.Character and t1.value10.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local dist = (head.Position - hrp.Position).Magnitude
                if dist <= (RageBotRange or 300) then
                    local tool = t1.value10.Character:FindFirstChildOfClass("Tool")
                    if tool then
                        local mouse = t1.value6
                        if mouse then
                            mouse1click()
                        end
                    end
                end
            end
        end
    end)
end

function StopRageBot()
    RageBotActive = false
    RageBotTarget = nil
    if RageBotConn then
        RageBotConn:Disconnect()
        RageBotConn = nil
    end
end

getgenv().StartRageBot = StartRageBot
getgenv().StopRageBot = StopRageBot

local SkinOpacityActive = false
local SkinOpacityConn = nil
local SkinEnforceConn = nil
local SkinOpacityValue = 50
local SkinColorValue = nil
local SkinSavedColors = {}

local SKIN_PALETTE = {
	["Original"] = nil,
	["Blanco"] = Color3.fromRGB(255, 255, 255),
	["Negro"] = Color3.fromRGB(20, 20, 20),
	["Rojo"] = Color3.fromRGB(255, 0, 0),
	["Naranja"] = Color3.fromRGB(255, 140, 0),
	["Amarillo"] = Color3.fromRGB(255, 255, 0),
	["Verde"] = Color3.fromRGB(0, 255, 0),
	["Cian"] = Color3.fromRGB(0, 255, 255),
	["Azul"] = Color3.fromRGB(0, 140, 255),
	["Morado"] = Color3.fromRGB(170, 0, 255),
	["Rosa"] = Color3.fromRGB(255, 0, 170)
}

local function SkinGetParts()
	local char = t1.value10.Character
	if not char then return nil end
	local parts = {}
	for _, part in pairs(char:GetDescendants()) do
		if part:IsA("BasePart") and part.Name ~= "HumanoidRootPart" then
			if not part:FindFirstAncestorOfClass("Tool") then
				parts[#parts + 1] = part
			end
		end
	end
	return parts
end

local function SkinApply()
	local parts = SkinGetParts()
	if not parts then return end
	local transparency = math.clamp((tonumber(SkinOpacityValue) or 50) / 100, 0, 1)
	for _, part in ipairs(parts) do
		pcall(function()
			if SkinSavedColors[part] == nil then
				SkinSavedColors[part] = part.Color
			end
			if math.abs((part.Transparency or 0) - transparency) > 0.001 then
				part.Transparency = transparency
			end
			if SkinColorValue ~= nil and part.Color ~= SkinColorValue then
				part.Color = SkinColorValue
			end
		end)
	end
end

local function SkinRestore()
	for part, col in pairs(SkinSavedColors) do
		pcall(function()
			if part and part.Parent then
				part.Color = col
				part.Transparency = 0
			end
		end)
	end
	SkinSavedColors = {}
end

local function StartSkinOpacity()
	StopSkinOpacity()
	SkinOpacityActive = true
	SkinApply()
	SkinEnforceConn = task.spawn(function()
		while SkinOpacityActive and _G.AbortEverything == false do
			task.wait(0.15)
			if SkinOpacityActive then
				pcall(SkinApply)
			end
		end
	end)
	SkinOpacityConn = t1.value10.CharacterAdded:Connect(function()
		task.wait(0.5)
		if SkinOpacityActive then
			pcall(SkinApply)
		end
	end)
end

function StopSkinOpacity()
	SkinOpacityActive = false
	if SkinEnforceConn then
		task.cancel(SkinEnforceConn)
		SkinEnforceConn = nil
	end
	if SkinOpacityConn then
		SkinOpacityConn:Disconnect()
		SkinOpacityConn = nil
	end
	SkinRestore()
end

getgenv().StartSkinOpacity = StartSkinOpacity
getgenv().StopSkinOpacity = StopSkinOpacity
getgenv().SetSkinOpacity = function(value)
	SkinOpacityValue = value
	if SkinOpacityActive then
		SkinApply()
	end
end
getgenv().SetSkinColor = function(value)
	if type(value) == "string" then
		value = SKIN_PALETTE[value]
	end
	if typeof(value) ~= "Color3" then
		value = nil
	end
	SkinColorValue = value
	if SkinOpacityActive then
		SkinApply()
	end
end
getgenv().SKIN_PALETTE = SKIN_PALETTE
-- ============================================================
-- PORT PASTEL.WTF (ideas del dump aaa.txt): Melee Aura,
-- Noclip, ATM por monto, Dealer ESP, FPS Boost, Spin
-- ============================================================
local PastelNoclipActive = false
local PastelNoclipConn = nil
local MeleeAuraActive = false
local MeleeAuraConn = nil
local SpinActive = false
local SpinConn = nil
local DealerEspActive = false
local DealerEspConn = nil
local DealerEspMarks = {}

local function PastelStopNoclip()
	PastelNoclipActive = false
	if PastelNoclipConn then
		PastelNoclipConn:Disconnect()
		PastelNoclipConn = nil
	end
end

local function PastelStartNoclip()
	PastelStopNoclip()
	PastelNoclipActive = true
	PastelNoclipConn = t1.value4.Heartbeat:Connect(function()
		if not PastelNoclipActive then return end
		local char = t1.value10.Character
		if char then
			for _, part in pairs(char:GetDescendants()) do
				if part:IsA("BasePart") then
					part.CanCollide = false
				end
			end
		end
	end)
end

local function MeleeAuraPickTarget(maxDist)
	local best, bestDist = nil, maxDist or 15
	local char = t1.value10.Character
	local hrp = char and char:FindFirstChild("HumanoidRootPart")
	if not hrp then return nil end
	for _, plr in pairs(t1.value2:GetPlayers()) do
		if plr ~= t1.value10 and plr.Character then
			local hum = plr.Character:FindFirstChildOfClass("Humanoid")
			local eroot = plr.Character:FindFirstChild("HumanoidRootPart")
			if hum and hum.Health > 0 and eroot then
				if not (RageBotCheckTeam and plr.Team == t1.value10.Team) then
					local d = (eroot.Position - hrp.Position).Magnitude
					if d < bestDist then
						bestDist = d
						best = plr
					end
				end
			end
		end
	end
	return best
end

local function MeleeAuraStop()
	MeleeAuraActive = false
	if MeleeAuraConn then
		task.cancel(MeleeAuraConn)
		MeleeAuraConn = nil
	end
end

local function MeleeAuraStart()
	MeleeAuraStop()
	MeleeAuraActive = true
	MeleeAuraConn = task.spawn(function()
		while MeleeAuraActive and _G.AbortEverything == false do
			task.wait(0.12)
			if MeleeAuraActive then
				pcall(function()
					local rng = tonumber(getgenv().MeleeAuraRange) or 15
					local target = MeleeAuraPickTarget(rng)
					if target then
						local char = t1.value10.Character
						local tool = char and char:FindFirstChildOfClass("Tool")
						if tool and not tool:FindFirstChild("IsGun") then
							tool:Activate()
						end
					end
				end)
			end
		end
	end)
end

local function SpinStop()
	SpinActive = false
	if SpinConn then
		SpinConn:Disconnect()
		SpinConn = nil
	end
end

local function SpinStart()
	SpinStop()
	SpinActive = true
	SpinConn = t1.value4.RenderStepped:Connect(function()
		if not SpinActive then return end
		local char = t1.value10.Character
		local hrp = char and char:FindFirstChild("HumanoidRootPart")
		if hrp then
			hrp.CFrame = hrp.CFrame * CFrame.Angles(0, math.rad(20), 0)
		end
	end)
end

local function DealerEspStop()
	DealerEspActive = false
	if DealerEspConn then
		task.cancel(DealerEspConn)
		DealerEspConn = nil
	end
	for shop, mk in pairs(DealerEspMarks) do
		pcall(function() mk.HL:Destroy() end)
		pcall(function() mk.Tag:Destroy() end)
	end
	DealerEspMarks = {}
end

local function DealerEspRefresh()
	if not DealerEspActive then return end
	local map = workspace:FindFirstChild("Map")
	local shops = map and map:FindFirstChild("Shopz")
	if not shops then return end
	local seen = {}
	for _, shop in ipairs(shops:GetChildren()) do
		local stocks = shop:FindFirstChild("CurrentStocks")
		local crow = stocks and stocks:FindFirstChild("Crowbar")
		local mainPart = shop:FindFirstChild("MainPart")
		if crow and crow.Value > 0 and mainPart then
			seen[shop] = true
			local mk = DealerEspMarks[shop]
			if not mk or not mk.HL or not mk.HL.Parent then
				if mk then
					pcall(function() mk.HL:Destroy() end)
					pcall(function() mk.Tag:Destroy() end)
				end
				local hl = Instance.new("Highlight")
				hl.Name = "DealerESP_HL"
				hl.Adornee = (shop:IsA("Model") and shop or mainPart)
				hl.FillColor = Color3.fromRGB(255, 170, 0)
				hl.FillTransparency = 0.6
				hl.OutlineColor = Color3.fromRGB(255, 170, 0)
				hl.OutlineTransparency = 0
				hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
				hl.Parent = mainPart
				local tag = Instance.new("BillboardGui")
				tag.Name = "DealerESP_Tag"
				tag.Adornee = mainPart
				tag.Size = UDim2.fromOffset(220, 20)
				tag.StudsOffset = Vector3.new(0, 4, 0)
				tag.AlwaysOnTop = true
				local lbl = Instance.new("TextLabel")
				lbl.Size = UDim2.fromScale(1, 1)
				lbl.BackgroundTransparency = 1
				lbl.Font = Enum.Font.GothamBold
				lbl.TextSize = 14
				lbl.TextColor3 = Color3.new(1, 1, 1)
				lbl.TextStrokeTransparency = 0.3
				lbl.Text = "PALANCA"
				lbl.Parent = tag
				tag.Parent = mainPart
				DealerEspMarks[shop] = { HL = hl, Tag = tag, Lbl = lbl }
				mk = DealerEspMarks[shop]
			end
			pcall(function()
				mk.Lbl.Text = "PALANCA x" .. tostring(crow.Value)
			end)
		end
	end
	for shop, mk in pairs(DealerEspMarks) do
		if not seen[shop] then
			pcall(function() mk.HL:Destroy() end)
			pcall(function() mk.Tag:Destroy() end)
			DealerEspMarks[shop] = nil
		end
	end
end

local function DealerEspStart()
	DealerEspStop()
	DealerEspActive = true
	DealerEspRefresh()
	DealerEspConn = task.spawn(function()
		while DealerEspActive and _G.AbortEverything == false do
			task.wait(1)
			pcall(DealerEspRefresh)
		end
	end)
end

getgenv().PastelNoclipStart = PastelStartNoclip
getgenv().PastelNoclipStop = PastelStopNoclip
getgenv().MeleeAuraStart = MeleeAuraStart
getgenv().MeleeAuraStop = MeleeAuraStop
getgenv().MeleeAuraRange = 15
getgenv().SpinStart = SpinStart
getgenv().SpinStop = SpinStop
getgenv().DealerEspStart = DealerEspStart
getgenv().DealerEspStop = DealerEspStop
getgenv().ATMCashTargetEnabled = true
getgenv().ATMCashTarget = 10000
getgenv().PastelFpsBoost = function()
	pcall(function()
		local L = game:GetService("Lighting")
		L.GlobalShadows = false
		for _, o in pairs(game:GetDescendants()) do
			pcall(function()
				if o:IsA("ParticleEmitter") or o:IsA("Trail") then
					o.Enabled = false
				elseif o:IsA("Decal") or o:IsA("Texture") then
					o.Transparency = 1
				elseif o:IsA("BasePart") then
					o.Material = Enum.Material.Plastic
					o.Reflectance = 0
				end
			end)
		end
	end)
end
getgenv().PastelStopAll = function()
	pcall(PastelStopNoclip)
	pcall(MeleeAuraStop)
	pcall(SpinStop)
	pcall(DealerEspStop)
end
end

function AbortAll()
    _G.AbortEverything = true
    pcall(function() Settings.Enabled = false end)
    pcall(function() if ATMFarmToggleObj then ATMFarmToggleObj:SetValue(false) end end)
    pcall(function() t1.value17.SilentAim = false end)
    pcall(function() t1.value17.ESP = false end)
    pcall(function() t1.value17.ESPNames = false end)
    pcall(function() t1.value17.ESPInventory = false end)
    pcall(function()
        if getgenv().SilentAimRenderConn then
            getgenv().SilentAimRenderConn:Disconnect()
            getgenv().SilentAimRenderConn = nil
        end
    end)
    pcall(function()
        if getgenv().SilentAimVisualizeConn then
            getgenv().SilentAimVisualizeConn:Disconnect()
            getgenv().SilentAimVisualizeConn = nil
        end
    end)
    pcall(function()
        if t1.value20.SilentAimCircle then
            t1.value20.SilentAimCircle:Remove()
            t1.value20.SilentAimCircle = nil
        end
    end)
    pcall(function() getgenv().DisableAntiAfk() end)
    pcall(function() getgenv().StopAutoPickup() end)
    pcall(UnhookWallBang)
    pcall(StopFly)
    pcall(StopRagdollLoop)
    pcall(StopViewmodel)
    pcall(StopAutoMelee)
    pcall(StopSkybox)
    pcall(StopWeaponColor)
    pcall(StopCrateEsp)
    pcall(StopDropsEsp)
    pcall(StopAllPileEsp)
    pcall(StopNoFallDamage)
    pcall(StopRageBot)
    pcall(StopSkinOpacity)
    pcall(function() if getgenv().PastelStopAll then getgenv().PastelStopAll() end end)
    pcall(StopTpLoop)
    if RagdollInputConn then
        pcall(function() RagdollInputConn:Disconnect() RagdollInputConn = nil end)
    end
    pcall(function() ObsidianLib:Unload() end)
end

do

local FunnyBox = t2.Funny:AddLeftGroupbox("Emotes")
FunnyBox:AddLabel({ Text = "Envia emotes por el chat con un click", DoesWrap = true })

local function SendChatCommand(cmd)
    local sent = false
    pcall(function()
        local TextChatService2 = game:GetService("TextChatService")
        local channels = TextChatService2 and TextChatService2:FindFirstChild("TextChannels")
        local general = channels and channels:FindFirstChild("RBXGeneral")
        if general and general.SendAsync then
            general:SendAsync(cmd)
            sent = true
            return
        end
        -- (SendTextMessage no existe en TextChatService, se usa RBXGeneral:SendAsync de arriba)
    end)
    if not sent then
        pcall(function()
            local defaultChat = game:GetService("ReplicatedStorage"):FindFirstChild("DefaultChatSystemChatEvents")
            if defaultChat and defaultChat:FindFirstChild("SayMessageRequest") then
                defaultChat.SayMessageRequest:FireServer(cmd, "All")
            end
        end)
    end
end

FunnyBox:AddButton({
    Text = "Sit",
    Callback = function()
        SendChatCommand("/e sit")
    end
})

FunnyBox:AddButton({
    Text = "Dance 4",
    Callback = function()
        SendChatCommand("/e dance4")
    end
})

FunnyBox:AddButton({
    Text = "Dance 5",
    Callback = function()
        SendChatCommand("/e dance5")
    end
})

FunnyBox:AddButton({
    Text = "Dance 6",
    Callback = function()
        SendChatCommand("/e dance6")
    end
})

FunnyBox:AddButton({
    Text = "Cara Fiesta",
    Callback = function()
        pcall(function()
            local playersService = game:GetService("Players")
            local localPlr = playersService.LocalPlayer
            local char = localPlr.Character
            local humanoid = char and char:FindFirstChildOfClass("Humanoid")
            if humanoid then
                humanoid.Health = humanoid.MaxHealth
            end
            SendChatCommand("/e dance4")
            task.spawn(function()
                task.wait(1.2)
                SendChatCommand("/e dance6")
                task.wait(1.2)
                SendChatCommand("/e dance5")
            end)
        end)
    end
})
end

local ViewmodelBox = t2.Funny:AddLeftGroupbox("Viewmodel")
ViewmodelBox:AddLabel({ Text = "Mueve los brazos junto con el arma en primera persona", DoesWrap = true })

ViewmodelBox:AddToggle("ViewmodelToggle", {
    Text = "Activar viewmodel",
    Default = false,
    Callback = function(value)
        if value then
            StartViewmodel()
        else
            StopViewmodel()
        end
    end
})

ViewmodelBox:AddSlider("VmxSlider", {
    Text = "Izquierda / Derecha",
    Default = 0,
    Min = -2,
    Max = 2,
    Rounding = 2,
    Callback = function(value)
        ViewmodelOffset = Vector3.new(value, ViewmodelOffset.Y, ViewmodelOffset.Z)
    end
})

ViewmodelBox:AddSlider("VmySlider", {
    Text = "Arriba / Abajo",
    Default = 0,
    Min = -2,
    Max = 2,
    Rounding = 2,
    Callback = function(value)
        ViewmodelOffset = Vector3.new(ViewmodelOffset.X, value, ViewmodelOffset.Z)
    end
})

ViewmodelBox:AddSlider("VmzSlider", {
    Text = "Adelante / Atras",
    Default = 0,
    Min = -2,
    Max = 2,
    Rounding = 2,
    Callback = function(value)
        ViewmodelOffset = Vector3.new(ViewmodelOffset.X, ViewmodelOffset.Y, value)
    end
})

local FlyBox = t2.Player:AddLeftGroupbox("Fly")

local function DoRagdoll()
    local char = t1.value10.Character
    if not char then return end
    local root = char:FindFirstChild("HumanoidRootPart")
    if not root then return end
    game:GetService("ReplicatedStorage").Events.__RZDONL:FireServer("__---r", root.Position, root.CFrame, nil)
end

local function StartTorsoFly()
    StopFly()
    local char = t1.value10.Character
    if not char then return end
    local torso = char:FindFirstChild("Torso") or char:FindFirstChild("UpperTorso")
    if not torso then return end
    table.insert(flyBodyParts, torso)
    local mouse = t1.value6
    local RS = t1.value4
    flyConn = RS.RenderStepped:Connect(function()
        local torso = char:FindFirstChild("Torso") or char:FindFirstChild("UpperTorso")
        if not torso then return end
        local target = mouse and mouse.Hit and mouse.Hit.Position or torso.Position
        local direction = (target - torso.Position)
        if direction.Magnitude > 0.001 then
            direction = direction.Unit
        end
        pcall(function()
            torso.AssemblyLinearVelocity = direction * FlySpeed
        end)
    end)
end

local function ToggleRagdoll()
    if RagdollActive then
        StopRagdollLoop()
        StopFly()
        DoRagdoll()
    else
        RagdollActive = true
        DoRagdoll()
        task.spawn(function()
            task.wait(0.3)
            pcall(StartTorsoFly)
        end)
    end
end

FlyBox:AddLabel({ Text = "Pulsa T: ragdoll + el torso vuela hacia tu mouse", DoesWrap = true })

FlyBox:AddSlider("FlySpeedSlider", {
    Text = "Velocidad de vuelo",
    Default = 30,
    Min = 5,
    Max = 120,
    Rounding = 1,
    Suffix = "",
    Callback = function(value)
        FlySpeed = value
    end
})

FlyBox:AddButton({
    Text = "Ragdoll Fly (T)",
    Tooltip = "Se hace ragdoll y el torso vuela con fuerza hacia donde apunta el mouse (pulsa T para alternar)",
    Callback = function()
        ToggleRagdoll()
    end
})

RagdollInputConn = t1.value3.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.T then
        ToggleRagdoll()
    end
end)

local XpFarmLabel = t2.AccFarm:AddLeftGroupbox("AccFarm")
XpFarmLabel:AddLabel({ Text = "Usa el script en las 2 cuentas" })

local XpUser1Box = t2.AccFarm:AddLeftGroupbox("Usuario 1")
XpUser1Box:AddLabel({ Text = "Cuenta que gana XP (golpea con melee)" })
XpUser1Box:AddToggle("XpAutoMeleeToggle", {
    Text = "Auto Melee (yo golpeo)",
    Tooltip = "Cuenta 1: golpea con el arma melee automaticamente con mouse1click",
    Default = false,
    Callback = function(value)
        if value then
            StartAutoMelee()
        else
            StopAutoMelee()
        end
    end
})

local XpUser2Box = t2.AccFarm:AddLeftGroupbox("Usuario 2")
XpUser2Box:AddLabel({ Text = "Cuenta que se pone frente a la 1" })
local XpTargetDropdown = XpUser2Box:AddDropdown("XpTargetDropdown", {
    Text = "Cuenta a la que me pongo frente",
    SpecialType = "Player",
    Tooltip = "En la cuenta 2, elige el nombre de la cuenta 1 (la que golpea)",
    Callback = function(value)
        XpTpTarget = value
    end
})
XpUser2Box:AddToggle("XpTpTogle", {
    Text = "TP frente a la cuenta elegida",
    Tooltip = "Cuenta 2: se pone frente a la cuenta 1 cada 0.4s para que el melee le pegue",
    Default = false,
    Callback = function(value)
        if value then
            StartTpLoop()
        else
            StopTpLoop()
        end
    end
})

v21:AddToggle("WallBangToggle", {
    Text = "Wall Bang",
    Tooltip = "Permite disparar a traves de las paredes (hookea el raycast del arma)",
    Default = false,
    Callback = function(value)
        _G.WallBang = value
        if value then
            local ok = pcall(HookWallBang)
            if not ok or not WallBangHooked then
                pcall(function()
                    t1.value1:Notify({
                        Title = "Wall Bang",
                        Content = "No se pudo hookear el RayCast",
                        Duration = 3
                    })
                end)
                return
            end
            pcall(function()
                t1.value1:Notify({
                    Title = "Wall Bang",
                    Content = "Activado",
                    Duration = 3
                })
            end)
        else
            UnhookWallBang()
            pcall(function()
                t1.value1:Notify({
                    Title = "Wall Bang",
                    Content = "Desactivado",
                    Duration = 3
                })
            end)
        end
    end
})

local MundoBox = t2.Mundo:AddLeftGroupbox("Skybox")
MundoBox:AddLabel({ Text = "Cambia el cielo del mapa al instante", DoesWrap = true })

local SkyboxNames = {}
for name in pairs(SKYBOX_PRESETS) do
    table.insert(SkyboxNames, name)
end
table.sort(SkyboxNames)

MundoBox:AddDropdown("SkyboxDropdown", {
    Text = "Selecciona un skybox",
    Values = SkyboxNames,
    Callback = function(value)
        if value then
            ApplySkyboxPreset(value)
        end
    end
})

MundoBox:AddButton({
    Text = "Restaurar cielo original",
    Tooltip = "Vuelve al skybox que tenia el mapa antes de tocar nada",
    Callback = function()
        StopSkybox()
    end
})

local ArmasBox = t2.Mundo:AddLeftGroupbox("Color de Armas")
ArmasBox:AddLabel({ Text = "Cambia el color de las armas de todos los jugadores (de fuego y cuerpo a cuerpo)", DoesWrap = true })

ArmasBox:AddToggle("WeaponColorToggle", {
    Text = "Cambiar color de armas",
    Tooltip = "Colorea el arma que cada jugador tiene en la mano para distinguirlas",
    Default = false,
    Callback = function(value)
        if value then
            StartWeaponColor()
        else
            StopWeaponColor()
        end
    end
})

ArmasBox:AddColorPicker("WeaponColorPicker", {
    Title = "Color del arma",
    Default = Color3.new(1, 0.5, 0),
    Callback = function(color)
        WeaponColorValue = color
        if WeaponColorActive then
            ApplyWeaponColors()
        end
    end
})

local DropsBox = t2.Mundo:AddLeftGroupbox("Items tirados")
DropsBox:AddLabel({ Text = "Muestra las armas y items tirados en el piso con brillo y su nombre", DoesWrap = true })

local DropsEspToggle = DropsBox:AddToggle("DropsEspToggle", {
    Text = "Ver items tirados",
    Tooltip = "Marca los items de SpawnedTools con un brillo y una etiqueta con su nombre",
    Default = false,
    Callback = function(value)
        if value then
            StartDropsEsp()
        else
            StopDropsEsp()
        end
    end
})

DropsEspToggle:AddColorPicker("DropsEspColorPicker", {
    Title = "Color de los items",
    Default = Color3.fromRGB(0, 170, 255),
    Callback = function(color)
        SetDropsEspColor(color)
    end
})

DropsBox:AddSlider("DropsEspDistanceSlider", {
    Text = "Distancia maxima",
    Default = 500,
    Min = 50,
    Max = 2000,
    Rounding = 0,
    Callback = function(value)
        SetDropsEspMaxDistance(value)
    end
})

local CratesBox = t2.Mundo:AddLeftGroupbox("Crates del piso")
CratesBox:AddLabel({ Text = "Resalta en rojo las crates de botin que estan en el suelo", DoesWrap = true })

local CrateEspToggle = CratesBox:AddToggle("CrateEspToggle", {
    Text = "Ver crates en rojo",
    Tooltip = "Marca las crates caidas del suelo con un brillo rojo para localizarlas",
    Default = false,
    Callback = function(value)
        if value then
            StartCrateEsp()
        else
            StopCrateEsp()
        end
    end
})

CrateEspToggle:AddColorPicker("CrateEspColorPicker", {
    Title = "Color de las crates",
    Default = Color3.fromRGB(255, 0, 0),
    Callback = function(color)
        SetCrateEspColor(color)
    end
})

CratesBox:AddSlider("CrateEspDistanceSlider", {
    Text = "Distancia maxima",
    Default = 300,
    Min = 50,
    Max = 1500,
    Suffix = " studs",
    Callback = function(value)
        SetCrateEspMaxDistance(value)
    end
})

local PilesBox = t2.Mundo:AddLeftGroupbox("Crates verdes y rojas")
PilesBox:AddLabel({ Text = "Resalta las pilas de crates del modo standard (se detectan por su color)", DoesWrap = true })

local PileGreenToggle = PilesBox:AddToggle("PileGreenToggle", {
    Text = "Ver crates verdes",
    Tooltip = "Marca con brillo las crates verdes de SpawnedPiles",
    Default = false,
    Callback = function(value)
        if value then
            StartPileEsp("Green")
        else
            StopPileEsp("Green")
        end
    end
})

PileGreenToggle:AddColorPicker("PileGreenColorPicker", {
    Title = "Color del brillo",
    Default = Color3.fromRGB(0, 255, 0),
    Callback = function(color)
        SetPileEspColor("Green", color)
    end
})

PilesBox:AddSlider("PileGreenDistanceSlider", {
    Text = "Distancia maxima (verdes)",
    Default = 300,
    Min = 50,
    Max = 1500,
    Suffix = " studs",
    Callback = function(value)
        SetPileEspMaxDistance("Green", value)
    end
})

local PileRedToggle = PilesBox:AddToggle("PileRedToggle", {
    Text = "Ver crates rojas",
    Tooltip = "Marca con brillo las crates rojas de SpawnedPiles",
    Default = false,
    Callback = function(value)
        if value then
            StartPileEsp("Red")
        else
            StopPileEsp("Red")
        end
    end
})

PileRedToggle:AddColorPicker("PileRedColorPicker", {
    Title = "Color del brillo",
    Default = Color3.fromRGB(255, 0, 0),
    Callback = function(color)
        SetPileEspColor("Red", color)
    end
})

PilesBox:AddSlider("PileRedDistanceSlider", {
    Text = "Distancia maxima (rojas)",
    Default = 300,
    Min = 50,
    Max = 1500,
    Suffix = " studs",
    Callback = function(value)
        SetPileEspMaxDistance("Red", value)
    end
})
ObsidianLib:Notify({ Title = "AutoFarm", Description = "Cargado", Time = 2 })

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.UserInputType == Enum.UserInputType.Keyboard and input.KeyCode == Enum.KeyCode.F8 then
        AbortAll()
    end
end)

end)()




    `;

    // 4. Enviar el script a Roblox
    return res.status(200).json({
      success: true,
      message: 'Acceso concedido',
      script: myMainScript
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}
