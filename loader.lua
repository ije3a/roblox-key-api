-- ============================================================
-- m1n3l1s KEY SYSTEM (standalone Loader)
-- Pega este archivo en tu ejecutor.
-- Se encarga de validar la Key en Vercel e inyectar el script principal.
-- ============================================================

if getgenv == nil then getgenv = function() return _G end end

-- API de keys
do
    local NEW_API = "https://roblox-key-api.vercel.app/api"
    local cur = nil
    pcall(function() cur = getgenv().m1n3l1s_KeyAPI end)
    if cur ~= NEW_API then
        pcall(function() getgenv().m1n3l1s_KeyAPI = NEW_API end)
    end
end

-- Logo
do
    local NEW_ID = "rbxassetid://140222654396949"
    local cur = nil
    pcall(function() cur = getgenv().m1n3l1s_LogoImage end)
    if cur == nil or cur == "" or cur ~= NEW_ID then
        pcall(function() getgenv().m1n3l1s_LogoImage = NEW_ID end)
    end
end

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local LocalPlayer = Players.LocalPlayer

-- Parent seguro para executors
local function getParent()
    local ok, hui = pcall(function() return (gethui and gethui()) end)
    if ok and hui then return hui end
    local ok2, hidden = pcall(function() return (get_hidden_gui and get_hidden_gui()) end)
    if ok2 and hidden then return hidden end
    pcall(function() return game:GetService("CoreGui") end)
    return LocalPlayer:WaitForChild("PlayerGui")
end

-- Limpia key vieja si re-ejecutas
pcall(function()
    local p = getParent()
    local old = p:FindFirstChild("m1n3l1s_Loading")
    if old then old:Destroy() end
end)

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
    -- Fallback si no existe la funcion de request personalizada
    local success, body = pcall(function() return game:HttpGet(url) end)
    if success then
        return true, {StatusCode = 200, Body = body}
    end
    return false, nil
end

function m1n3l1s_KeySystem(titulo)
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

    -- Fondo gris transparente
    local dim = Instance.new("Frame", gui)
    dim.Name = "Dim"
    dim.Size = UDim2.fromScale(1, 1)
    dim.BackgroundColor3 = Color3.fromRGB(128, 128, 128)
    dim.BackgroundTransparency = 0.4
    dim.BorderSizePixel = 0

    -- Tarjeta central
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

    -- Logo en circulo
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
            if ok and response and (response.StatusCode == 200 or response.StatusCode == nil) then
                local good, data = pcall(function() return HttpService:JSONDecode(response.Body) end)
                if good and data and data.success then
                    passed = true
                    sub.Text = "Acceso concedido!"
                    sub.TextColor3 = Color3.fromRGB(60,255,120)
                    print("[Key System] Autenticado con exito.")
                    pcall(function()
                        game:GetService("StarterGui"):SetCore("SendNotification", {
                            Title = "Whitelist Concedida",
                            Text = "Acceso correcto. Cargando...",
                            Duration = 5
                        })
                    end)
                    task.wait(0.5)
                    pcall(function() gui:Destroy() end)
                    
                    -- EJECUTA TU SCRIPT PRINCIPAL DESDE VERCEL
                    if data.script then
                        loadstring(data.script)()
                    end
                    return
                else
                    local msg = "Clave invalida"
                    pcall(function() if data and data.message then msg = tostring(data.message) end end)
                    sub.Text = msg
                    sub.TextColor3 = Color3.fromRGB(255,80,80)
                end
            else
                sub.Text = "Error de conexion"
                sub.TextColor3 = Color3.fromRGB(255,80,80)
            end
            checking = false
            goBtn.Text = "Entrar"
        end)
    end
    goBtn.MouseButton1Click:Connect(check)
    keyBox.FocusLost:Connect(function(enter) if enter then check() end end)
end

-- Inicia tu sistema de Key
m1n3l1s_KeySystem("m1n3l1s HUB | CRIM FARM")
