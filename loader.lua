-- ============================================================
-- LOADER CON KEY SYSTEM (VERCEL API)
-- ============================================================

local HttpService = game:GetService("HttpService")
local RbxAnalyticsService = game:GetService("RbxAnalyticsService")
local CoreGui = game:GetService("CoreGui")

local api_url = "https://roblox-key-api.vercel.app/api"

local function getHWID()
    local hwid = "UNKNOWN"
    pcall(function()
        hwid = RbxAnalyticsService:GetClientId()
    end)
    return hwid
end

-- Interfaz Grafica
local gui = Instance.new("ScreenGui")
gui.Name = "KeySystemUI"
gui.ResetOnSpawn = false

local targetParent = gethui and gethui() or CoreGui
gui.Parent = targetParent

local main = Instance.new("Frame")
main.Size = UDim2.new(0, 360, 0, 220)
main.Position = UDim2.new(0.5, -180, 0.5, -110)
main.BackgroundColor3 = Color3.fromRGB(20, 20, 25)
main.BorderSizePixel = 0
main.Active = true
main.Draggable = true
main.Parent = gui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 10)
corner.Parent = main

local title = Instance.new("TextLabel")
title.Size = UDim2.new(1, 0, 0, 45)
title.BackgroundTransparency = 1
title.Text = "SISTEMA DE AUTENTICACION"
title.TextColor3 = Color3.fromRGB(255, 255, 255)
title.TextSize = 16
title.Font = Enum.Font.SourceSansBold
title.Parent = main

local sub = Instance.new("TextLabel")
sub.Size = UDim2.new(1, -40, 0, 25)
sub.Position = UDim2.new(0, 20, 0, 45)
sub.BackgroundTransparency = 1
sub.Text = "Ingresa tu clave de acceso"
sub.TextColor3 = Color3.fromRGB(150, 150, 160)
sub.TextSize = 13
sub.Font = Enum.Font.SourceSans
sub.Parent = main

local keyBox = Instance.new("TextBox")
keyBox.Size = UDim2.new(1, -40, 0, 40)
keyBox.Position = UDim2.new(0, 20, 0, 80)
keyBox.BackgroundColor3 = Color3.fromRGB(30, 30, 38)
keyBox.BorderSizePixel = 0
keyBox.Text = ""
keyBox.PlaceholderText = "Pega tu Key aqui..."
keyBox.TextColor3 = Color3.fromRGB(255, 255, 255)
keyBox.PlaceholderColor3 = Color3.fromRGB(100, 100, 110)
keyBox.TextSize = 14
keyBox.Font = Enum.Font.SourceSans
keyBox.Parent = main

local boxCorner = Instance.new("UICorner")
boxCorner.CornerRadius = UDim.new(0, 6)
boxCorner.Parent = keyBox

local goBtn = Instance.new("TextButton")
goBtn.Size = UDim2.new(1, -40, 0, 40)
goBtn.Position = UDim2.new(0, 20, 0, 135)
goBtn.BackgroundColor3 = Color3.fromRGB(70, 120, 240)
goBtn.BorderSizePixel = 0
goBtn.Text = "Entrar"
goBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
goBtn.TextSize = 15
goBtn.Font = Enum.Font.SourceSansBold
goBtn.Parent = main

local btnCorner = Instance.new("UICorner")
btnCorner.CornerRadius = UDim.new(0, 6)
btnCorner.Parent = goBtn

local checking = false
local passed = false

local function check()
    if checking or passed then return end
    local k = keyBox.Text:gsub("%s+", "")
    if k == "" then
        sub.Text = "Escribe una Key valida"
        sub.TextColor3 = Color3.fromRGB(255, 100, 100)
        return
    end

    checking = true
    goBtn.Text = "Verificando..."
    sub.Text = "Conectando al servidor..."
    sub.TextColor3 = Color3.fromRGB(150, 150, 160)

    local hwid = getHWID()
    local url = api_url .. "?key=" .. HttpService:UrlEncode(k) .. "&hwid=" .. HttpService:UrlEncode(hwid)

    local req = (syn and syn.request) or (http and http.request) or http_request or (fluxus and fluxus.request) or request
    local responseBody = nil

    if req then
        local res = req({ Url = url, Method = "GET" })
        if res then
            responseBody = res.Body or res.body
        end
    else
        local success, body = pcall(function() return game:HttpGet(url) end)
        if success then 
            responseBody = body 
        end
    end

    if responseBody then
        local ok, data = pcall(function() return HttpService:JSONDecode(responseBody) end)
        if ok and data and data.success then
            passed = true
            sub.Text = "Acceso concedido!"
            sub.TextColor3 = Color3.fromRGB(60, 255, 120)
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

            -- ============================================================
            -- EJECUCIÓN DIRECTA DEL SCRIPT ENCRIPTADO
            -- ============================================================
            if data.script and data.script ~= "" then
                local func, err = loadstring(data.script)
                if func then
                    local execSuccess, execErr = pcall(func)
                    if not execSuccess then
                        warn("[SCRIPT RUNTIME ERROR]: " .. tostring(execErr))
                    end
                else
                    warn("[LOADSTRING ERROR]: " .. tostring(err))
                end
            else
                warn("[API ERROR]: La API respondio pero el script llego vacio.")
            end
            return
        else
            local msg = "Clave invalida"
            pcall(function() if data and data.message then msg = tostring(data.message) end end)
            sub.Text = msg
            sub.TextColor3 = Color3.fromRGB(255, 80, 80)
        end
    else
        sub.Text = "Error de conexion"
        sub.TextColor3 = Color3.fromRGB(255, 80, 80)
    end

    checking = false
    goBtn.Text = "Entrar"
end

goBtn.MouseButton1Click:Connect(check)
keyBox.FocusLost:Connect(function(enter) if enter then check() end end)
