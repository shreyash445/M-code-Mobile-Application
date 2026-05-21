# M-Code

> Master Morse Code — Encode, Decode, and Transmit like a telegraph operator.

![Expo](https://img.shields.io/badge/Expo-54-blueviolet?logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.76-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

| Feature | Description |
|---|---|
| **Encode / Decode** | Convert text to Morse code and back in real time |
| **Audio Playback** | Hear Morse signals with precise timing (dot / dash / gap) |
| **Signal Lamp** | Visual flashing lamp synchronised with audio output |
| **Telegraph Key** | Tap dots and dashes with a realistic telegraph interface |
| **Navigation Tree** | Visual Morse tree that highlights your current path |
| **Reference Chart** | Complete alphabet, number, and symbol reference grid |

## Screens

| Onboarding | Encode | Telegraph | Reference |
|---|---|---|---|
| <img src="assets/images/icon.png" width="120" /> | Text ↔ Morse translation with playback | Tap-to-input telegraph key with morse tree | Full character reference chart |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) |
| UI | React Native + StyleSheet |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction) (file‑based) |
| Audio | `expo-av` |
| Icons | `@expo/vector-icons` (MaterialCommunityIcons) |
| Animations | React Native `Animated` API |
| SVG | `react-native-svg` |
| Language | TypeScript (strict mode) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start

# 3. Open on your device
#    - Scan the QR code with Expo Go
#    - Press 'a' for Android emulator
#    - Press 'i' for iOS simulator
```

## Project Structure

```
app/
├── _layout.tsx              # Root layout (auth / tabs switching)
├── index.tsx                # Entry point — redirects to onboarding
├── (auth)/                  # Authentication group
│   ├── _layout.tsx
│   ├── index.tsx            # Onboarding / landing screen
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (tabs)/                  # Main app tabs
    ├── _layout.tsx           # Tab navigator
    ├── index.tsx             # Encode screen
    ├── telegraph.tsx         # Telegraph key screen
    └── explore.tsx           # Reference chart screen

components/
├── MorseTree.tsx            # SVG Morse code navigation tree
└── SignalLamp.tsx           # Animated signal lamp indicator

constants/
└── MorseData.ts             # Morse mappings, tree data, theme palette

hooks/
└── useMorsePlayer.ts        # Audio playback hook for morse sequences
```

## Recent Updates

- **Auth flow** — Onboarding, sign-in, and sign-up screens with guest mode
- **Telegraph layout fix** — Output section and tree now fit on screen without overlap
- **Reference heading fix** — Removed duplicate header from the Reference tab
- **Code cleanup** — Removed unused imports and variables across all files
- **Zero warnings** — ESLint and TypeScript both pass clean

## Roadmap

- [ ] Persistent auth state
- [ ] Morse code speed adjustment
- [ ] History / saved messages
- [ ] Haptic feedback customisation
- [ ] Dark / light theme toggle

## License

MIT
