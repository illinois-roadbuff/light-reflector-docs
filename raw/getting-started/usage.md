# Setting Up the Client

<steps level="2">

## Setting up

To use Light Reflector, require it in your script. Then change any configuration variables and start the system.

```luau [vehicle-handler.client.luau]
-- Variables
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LightReflector = require(ReplicatedStorage.lightreflector)
local Cars = workspace.Cars

LightReflector.Configure({
    SignConfig = {
        SignsFolders = {workspace.Signs}
    }
    -- Change any config here
})

LightReflector.Start()
```

## Determine Intensity

Make a function to determine what intensity a vehicle should get.

```luau [vehicle-handler.client.luau]
local function determineIntensity(car:Instance)
  local finalIntensity = 1
-- logic to see if high beams are enabled or not (thus increase the intensity)
  if car.DriveSeat.Values.HighBeam.Value == true then
    finalIntensity = 1.5
  end
  
  return finalIntensity
end
```

## Determine Regular Light Value

Make a function to determine whether the lights in the vehicle are enabled or not. The function SHOULD return a `ValueBase` such as a `BoolValue`, `NumberValue`, etc.

```luau [vehicle-handler.client.luau]
local function CheckForRegLightValue(car:Model)
    local Body = car.Body
    local Headlight = Body:FindFirstChild("Headlight")

    if Headlight then
        return Headlight.on -- Smeers light handler compatiblity
    end

    -- split since some A-Chassis cars apparently may not have a Vehicle seat once initialized, erroring the entire function
    local DriveSeat = car:FindFirstChildOfClass("VehicleSeat")

    assert(DriveSeat, `:: LightReflectorHandler :: Failed to find VehicleSeat in {car.Name}; halting execution. Please investigate!`)

    local LightValues = DriveSeat:FindFirstChild("LightValues")
    local Lights = if DriveSeat:FindFirstChild("Values") then DriveSeat.Values:FindFirstChild("Lights") else nil

    if LightValues and LightValues:FindFirstChild("LB") then
        return LightValues.LB -- Aura Deios compatibility
    elseif Lights and Lights:FindFirstChild("LightStage") then
        return Lights.LightStage -- Saragati Lagrande EXC compatibility
    else
        warn(`:: LightReflectorHandler :: Failed to find headlight values for car {car.Name}, resorting to boolean "true"`)
        return true
    end
end
```

```lua [vehicle-handler.client.luau]
local function CheckForRegLightValue(car:Model)
    local Body = car.Body
    local Headlight = Body:FindFirstChild("Headlight")

    if Headlight then
        return Headlight.on -- Smeers light handler compatiblity
    end

    -- split since some A-Chassis cars apparently may not have a Vehicle seat once initialized, erroring the entire function
    local DriveSeat = car:FindFirstChildOfClass("VehicleSeat")

    assert(DriveSeat, `:: LightReflectorHandler :: Failed to find VehicleSeat in {car.Name}; halting execution. Please investigate!`)

    local LightValues = DriveSeat:FindFirstChild("LightValues")
    local Lights = if DriveSeat:FindFirstChild("Values") then DriveSeat.Values:FindFirstChild("Lights") else nil

    if LightValues and LightValues:FindFirstChild("LB") then
        return LightValues.LB -- Aura Deios compatibility
    elseif Lights and Lights:FindFirstChild("LightStage") then
        return Lights.LightStage -- Saragati Lagrande EXC compatibility
    else
        warn(`:: LightReflectorHandler :: Failed to find headlight values for car {car.Name}, resorting to boolean "true"`)
        return true
    end
end
```

## Setup Connections

Set up connections that trigger whether a car is spawned or despawned, and use `RegisterVehicle` and `UnregisterVehicle` for the appropriate case.

```luau [vehicle-handler.client.luau]
workspace.Cars.ChildAdded:Connect(function(car)
    task.wait() -- a-chassis init reasons
    if car:IsA("Model") and (car:FindFirstChildOfClass("VehicleSeat") or car:WaitForChild("DriveSeat",5)) then
        print("Indexed Vehicle")
        LightReflector.RegisterVehicle(car, CheckForRegLightValue(car), determineIntensity)
    end
end)

workspace.Cars.ChildRemoved:Connect(function(car)
    if car:IsA("Model") and (car:FindFirstChildOfClass("VehicleSeat") or car:WaitForChild("DriveSeat",5)) then
        LightReflector.UnregisterVehicle(car)
    end
end)
```

</steps>

# Setting Up Tags & Attributes (Server)

<steps level="2">

## Reflector Tags

To set up reflector tags, add a `Reflector` tag to the specified `BasePart` through the explorer or by script.

```luau [tag-reflector.server.luau]
local CollectionService = game:GetService("CollectionService")
local LightReflector = ReplicatedStorage.lightreflector
local config = require(LightReflector.shared.config)

CollectionService:AddTag(part, config.ReflectorConfig.TagName)
```

Optional: You can also select a face that is reflective. It must be a valid `Enum.NormalId` value such as `Top`, `Right`, etc.

```luau [tag-reflector.server.luau]
local CollectionService = game:GetService("CollectionService")
local LightReflector = ReplicatedStorage.lightreflector
local config = require(LightReflector.shared.config)

part:SetAttribute("LRFace", "Right") -- config.ReflectorConfig.hybridFaceAttributeName
```

## Hybrid Attributes

To set up a reflector as a hybrid, set a `LRHybrid` boolean attribute. There are also many other hybrid attributes to choose from, which is specified in the accompanying code block below.

```luau [tag-reflector.server.luau]
local CollectionService = game:GetService("CollectionService")
local LightReflector = ReplicatedStorage.lightreflector
local config = require(LightReflector.shared.config)

part:SetAttribute("LRHybrid", true) -- config.ReflectorConfig.hybridAttributeName 

-- OPTIONAL ATTRIBUTES TO OVERRIDE DEFAULT CONFIG
part:SetAttribute("HybridMinDistance", 50) -- config.ReflectorConfig.hybridMinDistanceAttribute
part:SetAttribute("HybridMaxDistance",1600 -- config.ReflectorConfig.hybridMaxDistanceAttribute
part:SetAttribute("CanHybridKeepColors", true) -- config.ReflectorConfig.hybridKeepColorsAttribute
part:SetAttribute("HybridTransparencyMultiplier", 2) -- defaultHybridTransparencyMultiplier
part:SetAttribute("HybridCanKeepTextures", true) -- config.ReflectorConfig.canHybridKeepTexturesAttribute
```

## Sign Tags

To set up sign tags, add a `ReflectiveSign` tag to the specified `BasePart` that has a `Decal` through the explorer or by script.

```luau [tag-reflector.server.luau]
local CollectionService = game:GetService("CollectionService")
local LightReflector = ReplicatedStorage.lightreflector
local config = require(LightReflector.shared.config)

CollectionService:AddTag(part, config.SignConfig.TagName)
```

The main `Decal` represents the reflective face, so setting up `Face` attributes is not neccesary.

</steps>

This is only a basic example of what you can achieve with [Nuxt UI](https://ui.nuxt.com), you can tweak it to match your needs. The template uses several Nuxt modules underneath like [`@nuxt/content`](https://content.nuxt.com) for the content and [`nuxt-og-image`](https://nuxtseo.com/og-image/getting-started/installation) for social previews.

<tip target="_blank" to="https://ui.nuxt.com/getting-started/installation">

Learn more on how to take the most out of Nuxt UI!

</tip>
