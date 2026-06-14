# EggChef — Apple Watch app (native SwiftUI)

A **standalone native watchOS app** that runs on the Apple Watch simulator on its
own (no iPhone needed). React Native can't run on watchOS, so this is a separate
SwiftUI implementation that mirrors the EggChef watch demo flow and bordo theme.
State is **not** synced with the phone app — it's a self-contained demo.

The whole app is now **one file**: [`EggChefWatch/EggChefWatchApp.swift`](EggChefWatch/EggChefWatchApp.swift).
The other `.swift` files in that folder are empty leftovers — ignore or delete them.

## Flow
splash → main → **egg count** (tap the dial to cycle 1→6) → **doneness** (Rafadan /
Kayısı / Katı / Özel) → **custom time** (Digital Crown wheels, only for "Özel") →
**water** → **countdown** (ring + pause) → **done**. Plus a **Profile** screen with a
working **Dark Mode** toggle.

## Create the Xcode project & run (≈2 min)

1. **Xcode → File → New → Project…**
2. **watchOS** tab → **App** → **Next**.
3. Product Name **`EggChefWatch`** · Interface **SwiftUI** · Language **Swift** ·
   leave "Include Notification Scene" off. **Next** → save it (saving inside this
   `watch/` folder keeps things together).
4. Xcode generates two files: `EggChefWatchApp.swift` and `ContentView.swift`.
   **Delete both** (right-click → Delete → Move to Trash).
5. Drag **`watch/EggChefWatch/EggChefWatchApp.swift`** (the real one) into the
   project navigator. In the dialog tick **Copy items if needed** and make sure the
   **Watch App target** is checked. (You only need this one file.)
6. Top bar → choose an Apple Watch simulator, e.g. **Apple Watch Series 10 (46mm)**.
7. Press **⌘R**. It builds and launches in the Watch simulator.

## Demoing it
- **Egg count:** tap anywhere on the dial — it cycles 1→2→…→6→1; selected eggs fill bordo.
- **Custom time:** on the doneness screen pick **Özel**, then spin the minute/second
  wheels with the **Digital Crown** (or drag).
- **Water warning:** on the Su screen, **tap the water row** to switch it to "az su
  (~5 ml)", then **Başlat** → the "Su seviyesi yetersiz!" warning shows. Tap the row
  again for full water to start normally.
- **Countdown is demo-accelerated** (~20s regardless of the chosen time) so you can
  show the whole cook live; the displayed mm:ss still counts the real time down.
- **Dark Mode:** Profil → Dark Mode toggle flips the whole app.

## Matches the Figma reference
Every in-app screen is built 1:1 against `watch/figma/`: bordo splash with the striped
ghost wordmark, main screen (icons on the right), egg dial (selected eggs are **white**
on the plate), doneness 2×2 grid with the divider cross + outline icons (Özel shows the
time), white custom-time card with the bordo "Tamam" bar, water screen with outline
icons, light countdown ring, profile (two side-by-side cards), and the white warning /
done pop-ups with the floating badge.

Two items in the Figma set are **system-level**, not part of the tap-through flow:
- **App icon** ("apple watch ekranı"): the bordo rounded square with the white chef-hat
  logo. Add it in `Assets.xcassets → AppIcon` in Xcode (I can generate the PNG if you want).
- **Notification** ("Bildirim Ekranı"): the "Yumurtalar pişti Chef!" push shown by watchOS
  when cooking finishes. It needs a notification controller — say the word and I'll add it.

## Notes
- Standard SwiftUI; **watchOS 10+** recommended (modern Xcode default). Independent
  watch app, runs without a paired iPhone build.
- Authored without a Mac/Xcode in the loop — if the compiler flags anything, paste
  the error and I'll fix it immediately.
