# EggChef — Apple Watch app (SwiftUI)

A **standalone native watchOS app**. React Native cannot run on watchOS, so this
is a separate SwiftUI implementation that reuses the EggChef palette and flow
(egg count → doneness → Başlat → live countdown ring → Tamamlandı). It runs on the
Apple Watch simulator on its own — no iPhone required. State is **not** synced with
the React Native phone app; it's a self-contained demo.

## Files (`watch/EggChefWatch/`)

| File | Role |
| --- | --- |
| `EggChefWatchApp.swift` | `@main` app entry |
| `ContentView.swift` | Switches between menu / cooking / done |
| `CookSession.swift` | Observable state + the live countdown timer |
| `Theme.swift` | EggChef colors + gradient |
| `MenuView.swift` | Egg count, doneness, Başlat |
| `CookingView.swift` | Countdown ring + stage + Durdur |
| `CompleteView.swift` | Checkmark + Tamam |

## Create the Xcode project & run

1. **Xcode → File → New → Project…**
2. Pick the **watchOS** tab → **App** → **Next**.
3. Product Name: **`EggChefWatch`** · Interface: **SwiftUI** · Language: **Swift**.
   Leave "Include Notification Scene" unchecked. **Next**, then save it (saving it
   inside this `watch/` folder keeps everything together).
4. Xcode generates `EggChefWatchApp.swift` and `ContentView.swift`. **Delete those
   two** (Move to Trash), then drag **all seven `.swift` files** from
   `watch/EggChefWatch/` into the project navigator. In the dialog: tick **Copy
   items if needed** and make sure the **Watch App target** is checked.
5. In the destination selector (top bar) choose an Apple Watch simulator, e.g.
   **Apple Watch Series 10 (46mm)**.
6. Press **⌘R**. The app builds and launches in the Watch simulator.

## Notes

- Built with standard SwiftUI; **watchOS 10+** recommended (modern Xcode default).
- Independent watch app (watchOS 9+), so it runs without a paired iPhone build.
- I authored this without a Mac/Xcode in the loop, so if the compiler flags
  anything, paste the error and I'll fix it.
