# Introduction

> Welcome to the Light Reflector documentation.

Light Reflector is a `luau` vehicle-based light reflector system that reflects `Decal` and `BasePart` reflectors at long distances on roads.

![Diagram](https://codeberg.org/project-roadwork/light-reflector/raw/branch/main/assets/images/light_reflector_systems.png)

## Issues

1. **Broken Wally and Pesde packages, with mismatched versioning**
  - The Pesde package has version issues as well due to my custom pre-release tag `infdev`
2. **Rojo may not work correctly?**
3. **Possible BasePart memory leak on games with Instance Streaming**
4. **Many :GetAttribute calls popping up in the Microprofiler**
5. **No external documentation**
6. **Some signs and reflectors may not work at all in very rare occasions**

## Global features

1. Adaptive waiting on performance-critical functions
2. Distance fall-off
3. Angle-based brightness
4. Multi-vehicle support
5. Non-tweened fading/transitions for gradual brightness
6. Option to use `Tags` with `CollectionService`

## Sign/Gantry System Features

1. Utilizes `SurfaceGuis` and `ImageLabel` for reflectivity
2. Uses `.ImageTransparency`, `.Brightness`, and `.LightInfluence`
3. SurfaceGui pooling to increase performance
4. Automatic sign `:Dot` support

  - This determines if the vehicle is facing the sign or not to determine reflectiveness
5. Automatic part rotation for `Top` faces

  - Part rotation is needed since the orientation of images in `Decals` and `SurfaceGuis` are NOT the same
  - This may break the visuals of actual non-square parts due to rotations
6. Best for large reflective highway signs on gantries

## Reflector System Features

1. Utilizes `BaseParts` for reflectivity
2. Uses `.Color` and `.Material`
3. Wedge `:Dot` support, with face (`Enum.NormalId`) selection on non-wedges

  - This determines if the vehicle is facing the part or not to determine reflectiveness
4. Best for pavement reflectors on the road

### Hybrid System Features

1. Works alongside the Reflector System with no separate loop needed
2. Uses `.Color`, `.Material`, AND `.Transparency` with similar equations to the Sign/Gantry System
3. Face (`Enum.NormalId`) selection
4. Best for reflective traffic light shields, non-decal signs, etc.
