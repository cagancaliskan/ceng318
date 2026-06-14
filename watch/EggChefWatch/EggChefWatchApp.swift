import SwiftUI
import WatchKit

// ============================================================================
//  EggChef — native watchOS app (single file, SwiftUI).
//  Every screen is pinned to the EXACT watch screen size, so nothing ever scrolls
//  (watchOS makes overflowing root content crown-scrollable — pinning the height
//  removes that). Full-screen state machine, no NavigationStack chrome. Swipe from
//  the left edge to go back. Pixel-matched to watch/figma. Bordo theme + Dark Mode.
//  Standalone demo; countdown is demo-accelerated (~20s).
// ============================================================================

private let kScreen = WKInterfaceDevice.current().screenBounds.size

extension View {
    // Pin to the real watch screen AND ignore the safe area, so the frame occupies the
    // full screen exactly (no status-bar inset overflow) → nothing can scroll.
    func fitScreen() -> some View { frame(width: kScreen.width, height: kScreen.height).ignoresSafeArea() }
}

extension Color {
    init(hex: UInt) {
        self.init(.sRGB,
                  red: Double((hex >> 16) & 0xff) / 255,
                  green: Double((hex >> 8) & 0xff) / 255,
                  blue: Double(hex & 0xff) / 255,
                  opacity: 1)
    }
}

private let popInk = Color(hex: 0x333333)

// MARK: - Theme
struct Theme {
    var dark: Bool
    var screen: Color { dark ? Color(hex: 0x0f0f11) : .white }
    var ink: Color { dark ? Color(hex: 0xf0f0f0) : Color(hex: 0x333333) }
    var gray: Color { dark ? Color(hex: 0x9a9a9a) : Color(hex: 0x9a9a9a) }
    var bordo: Color { dark ? Color(hex: 0xd2554d) : Color(hex: 0x8a2030) }
    var maroon: Color { dark ? Color(hex: 0xa6303f) : Color(hex: 0x8a2433) }
    var egg: Color { dark ? Color(hex: 0x3b3b42) : Color(hex: 0xd6d6d6) }
    var line: Color { dark ? Color(hex: 0x33333b) : Color(hex: 0xe2e0e0) }
    var plate: Color { dark ? Color(hex: 0x1b1b1f) : .white }
    var profileCard: Color { dark ? Color(hex: 0x2a2a30) : Color(hex: 0xdedede) }
    var track: Color { dark ? Color(hex: 0x2d2d33) : Color(hex: 0xededed) }
    var blue: Color { Color(hex: 0x2f7fd0) }
    var teal: Color { Color(hex: 0x5f93a6) }
    var red: Color { Color(hex: 0xc43329) }
}

// MARK: - Session
final class CookSession: ObservableObject {
    @Published var count = 3
    @Published var doneness = "Rafadan"
    @Published var customMin = 3
    @Published var customSec = 52
    @Published var lowWater = false
    @Published var dark = false

    @Published var remaining: Double = 0
    @Published var total: Double = 0
    @Published var paused = false

    @Published var showWaterWarn = false
    @Published var showDone = false

    let durations: [String: Int] = ["Rafadan": 300, "Kayısı": 480, "Katı": 600]
    var theme: Theme { Theme(dark: dark) }

    func donenessTotal() -> Int { doneness == "Özel" ? customMin * 60 + customSec : (durations[doneness] ?? 300) }
    func customLabel() -> String { String(format: "%02d:%02d", customMin, customSec) }
    func startCook() { total = Double(donenessTotal()); remaining = total; paused = false }
    func cycleCount() { count = count >= 6 ? 1 : count + 1 }
}

enum Screen { case main, count, doneness, custom, water, countdown, profile }

@main
struct EggChefWatchApp: App {
    var body: some Scene { WindowGroup { RootView() } }
}

// MARK: - Root
struct RootView: View {
    @StateObject private var s = CookSession()
    @State private var showSplash = true
    @State private var stack: [Screen] = []

    private var current: Screen { stack.last ?? .main }
    private func go(_ scr: Screen) { stack.append(scr) }
    private func back() { if !s.showWaterWarn && !s.showDone, !stack.isEmpty { stack.removeLast() } }
    private func home() { stack.removeAll() }

    var body: some View {
        ZStack {
            s.theme.screen.ignoresSafeArea()
            if showSplash { SplashView() } else { screenView }

            // Back button — visible on every pushed screen (Profile has its own ✕).
            if !showSplash && current != .main && current != .profile && !s.showWaterWarn && !s.showDone {
                Button(action: back) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(s.theme.gray)
                        .frame(width: 30, height: 30)
                        .background(Circle().fill(s.theme.profileCard.opacity(0.85)))
                }
                .buttonStyle(.plain)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .padding(.leading, 6).padding(.top, 2)
            }

            if s.showWaterWarn {
                WaterWarnOverlay(s: s) { s.lowWater = false; s.showWaterWarn = false }
            }
            if s.showDone {
                DoneOverlay(s: s) { s.showDone = false; home() }
            }
        }
        .preferredColorScheme(s.dark ? .dark : .light)
        .gesture(DragGesture(minimumDistance: 12).onEnded { v in
            if v.startLocation.x < 28 && v.translation.width > 40 && abs(v.translation.height) < 50 { back() }
        })
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                withAnimation(.easeInOut(duration: 0.4)) { showSplash = false }
            }
        }
    }

    @ViewBuilder private var screenView: some View {
        switch current {
        case .main:      MainView(s: s, onNew: { go(.count) }, onProfile: { go(.profile) })
        case .count:     CountView(s: s, onNext: { go(.doneness) })
        case .doneness:  DonenessView(s: s, onWater: { go(.water) }, onCustom: { go(.custom) })
        case .custom:    CustomView(s: s, onApply: { go(.water) })
        case .water:     WaterView(s: s, onStart: { go(.countdown) })
        case .countdown: CountdownView(s: s)
        case .profile:   ProfileView(s: s, onClose: { back() })
        }
    }
}

// MARK: - Bordo button
struct Bordo: ButtonStyle {
    var t: Theme
    var radius: CGFloat = 22
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .light))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(RoundedRectangle(cornerRadius: radius).fill(t.maroon))
            .shadow(color: .black.opacity(0.18), radius: 5, y: 3)
            .opacity(configuration.isPressed ? 0.85 : 1)
    }
}

// MARK: - Egg silhouette — the exact path from the approved web demo (viewBox 40×53)
struct EggShape: Shape {
    func path(in r: CGRect) -> Path {
        let sx = r.width / 40.0, sy = r.height / 53.0
        func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: r.minX + x * sx, y: r.minY + y * sy) }
        var path = Path()
        path.move(to: p(20, 3))
        path.addCurve(to: p(35, 34), control1: p(28, 3), control2: p(35, 21))
        path.addCurve(to: p(20, 50), control1: p(35, 44), control2: p(29, 50))
        path.addCurve(to: p(5, 34), control1: p(11, 50), control2: p(5, 44))
        path.addCurve(to: p(20, 3), control1: p(5, 21), control2: p(12, 3))
        path.closeSubpath()
        return path
    }
}

// One dial egg: selected = white, unselected = gray, with a soft shadow.
struct DialEgg: View {
    var selected: Bool
    var t: Theme
    var body: some View {
        EggShape()
            .fill(selected ? Color.white : t.egg)
            .overlay(EggShape().stroke(Color.black.opacity(0.08), lineWidth: 0.8))
            .frame(width: 23, height: 30)
            .shadow(color: .black.opacity(0.22), radius: 2.5, y: 2)
    }
}

struct RafadanIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            Ellipse().stroke(c, lineWidth: 1.9).frame(width: 34, height: 26)
            Circle().stroke(c, lineWidth: 1.9).frame(width: 12, height: 12).offset(x: -3, y: -1.5)
        }.frame(width: 38, height: 30)
    }
}
struct KayisiIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            ForEach(0..<8, id: \.self) { i in
                Capsule().fill(c).frame(width: 2.5, height: 6).offset(y: -14).rotationEffect(.degrees(Double(i) * 45))
            }
            Circle().stroke(c, lineWidth: 1.9).frame(width: 13, height: 13)
        }.frame(width: 38, height: 30)
    }
}
struct KatiIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            Circle().stroke(c, lineWidth: 1.9).frame(width: 30, height: 30)
            Circle().stroke(c, lineWidth: 1.9).frame(width: 12, height: 12)
        }.frame(width: 38, height: 30)
    }
}

// MARK: - 01 Splash
struct SplashView: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0x7a1c2e), Color(hex: 0x9c2236), Color(hex: 0x591320)],
                           startPoint: .top, endPoint: .bottom).ignoresSafeArea()
            ZStack {
                VStack(spacing: 4) {
                    ForEach(0..<14, id: \.self) { _ in Rectangle().fill(Color.white.opacity(0.55)).frame(height: 2) }
                }
                .frame(width: 300, height: 60)
                .mask(Text("EggChef").font(.system(size: 44, weight: .thin)))
                .offset(y: -12)
                Text("EggChef").font(.system(size: 44, weight: .thin)).foregroundColor(.white)
            }
            VStack {
                Spacer()
                Text("VESTEL").font(.system(size: 15, weight: .heavy)).tracking(4).foregroundColor(.white).padding(.bottom, 12)
            }
        }
    }
}

// MARK: - 02 Main
struct MainView: View {
    @ObservedObject var s: CookSession
    var onNew: () -> Void
    var onProfile: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 12) {
            Spacer(minLength: 0)
            ZStack {
                Text("EggChef").font(.system(size: 17)).foregroundColor(t.gray)
                HStack { Spacer(); Image(systemName: "xmark").font(.system(size: 15, weight: .medium)).foregroundColor(t.gray) }
            }
            Button(action: onNew) {
                HStack(spacing: 8) { Text("Yeni Pişirme"); EggShape().fill(Color.white).frame(width: 14, height: 18) }
            }.buttonStyle(Bordo(t: t, radius: 22))
            Button(action: onProfile) {
                HStack(spacing: 8) { Text("Profil ve Ayarlar"); Image(systemName: "gearshape.fill").font(.system(size: 15)) }
            }.buttonStyle(Bordo(t: t, radius: 22))
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 8)
        .fitScreen()
    }
}

// MARK: - 03 Egg count
struct CountView: View {
    @ObservedObject var s: CookSession
    var onNext: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 10) {
            Spacer(minLength: 0)
            EggDial(s: s)
            Button(action: onNext) { Text("Devam  ›") }.buttonStyle(Bordo(t: t, radius: 24)).padding(.horizontal, 16)
            Spacer(minLength: 0)
        }
        .fitScreen()
    }
}

struct EggDial: View {
    @ObservedObject var s: CookSession
    var body: some View {
        let t = s.theme
        let R: CGFloat = 44
        ZStack {
            Circle().fill(t.plate).frame(width: 130, height: 130).shadow(color: .black.opacity(0.12), radius: 9, y: 5)
            ForEach(0..<6, id: \.self) { i in
                let ang = (Double(i) * 60.0 - 60.0) * .pi / 180.0
                DialEgg(selected: i < s.count, t: t).offset(x: R * CGFloat(cos(ang)), y: R * CGFloat(sin(ang)))
            }
            VStack(spacing: -2) {
                Text("\(s.count)").font(.system(size: 40, weight: .light)).foregroundColor(t.bordo)
                Text("adet").font(.system(size: 14, weight: .light)).foregroundColor(t.gray)
            }
        }
        .frame(width: 144, height: 144)
        .contentShape(Rectangle())
        .onTapGesture { s.cycleCount() }
    }
}

// MARK: - 04 Doneness
struct DonenessView: View {
    @ObservedObject var s: CookSession
    var onWater: () -> Void
    var onCustom: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 4) {
            Spacer(minLength: 0)
            Text("Hızlı Pişirme").font(.system(size: 16, weight: .light)).foregroundColor(t.gray)
            ZStack {
                VStack(spacing: 0) {
                    HStack(spacing: 0) {
                        cell(label: "Rafadan") { AnyView(RafadanIcon(c: t.gray)) } tap: { s.doneness = "Rafadan"; onWater() }
                        cell(label: "Kayısı") { AnyView(KayisiIcon(c: t.gray)) } tap: { s.doneness = "Kayısı"; onWater() }
                    }
                    HStack(spacing: 0) {
                        cell(label: "Katı") { AnyView(KatiIcon(c: t.gray)) } tap: { s.doneness = "Katı"; onWater() }
                        cell(label: "Özel") { AnyView(Text(s.customLabel()).font(.system(size: 26, weight: .light)).foregroundColor(t.bordo)) } tap: { onCustom() }
                    }
                }
                Rectangle().fill(t.line).frame(width: 1).padding(.vertical, 10)
                Rectangle().fill(t.line).frame(height: 1).padding(.horizontal, 10)
            }
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 6)
        .fitScreen()
    }
    private func cell(label: String, @ViewBuilder icon: () -> AnyView, tap: @escaping () -> Void) -> some View {
        let t = s.theme
        return Button(action: tap) {
            VStack(spacing: 6) {
                icon().frame(height: 34)
                Text(label).font(.system(size: 14, weight: .light)).foregroundColor(t.ink)
            }.frame(maxWidth: .infinity).padding(.vertical, 10)
        }.buttonStyle(.plain)
    }
}

// MARK: - 05 Custom time
struct CustomView: View {
    @ObservedObject var s: CookSession
    var onApply: () -> Void
    var body: some View {
        let t = s.theme
        VStack {
            Spacer(minLength: 0)
            VStack(spacing: 0) {
                HStack(spacing: 2) {
                    Picker("", selection: $s.customMin) { ForEach(0..<31, id: \.self) { Text(String(format: "%02d", $0)).tag($0) } }.labelsHidden().frame(width: 56)
                    Text(":").font(.system(size: 24, weight: .light)).foregroundColor(popInk)
                    Picker("", selection: $s.customSec) { ForEach(0..<60, id: \.self) { Text(String(format: "%02d", $0)).tag($0) } }.labelsHidden().frame(width: 56)
                }
                .frame(height: 82).padding(.top, 4).background(Color.white)
                Button(action: { s.doneness = "Özel"; onApply() }) {
                    Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white)
                        .frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
                }.buttonStyle(.plain)
            }
            .environment(\.colorScheme, .light)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 14)
        .fitScreen()
    }
}

// MARK: - 06 Water (tap water row to toggle full/low)
struct WaterView: View {
    @ObservedObject var s: CookSession
    var onStart: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 8) {
            Spacer(minLength: 0)
            Button { s.lowWater.toggle() } label: {
                HStack(spacing: 10) {
                    Image(systemName: "drop").font(.system(size: 23)).foregroundColor(t.blue)
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Haznedeki Su\nMiktarı").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                        HStack(spacing: 5) {
                            Text(s.lowWater ? "~5 ml" : "~65 ml").font(.system(size: 15)).foregroundColor(s.lowWater ? t.red : t.teal)
                            if s.lowWater { Image(systemName: "exclamationmark.circle").font(.system(size: 12)).foregroundColor(t.red) }
                        }
                    }
                    Spacer()
                }
            }.buttonStyle(.plain)
            Rectangle().fill(t.line).frame(height: 1)
            HStack(spacing: 10) {
                Image(systemName: "clock").font(.system(size: 22)).foregroundColor(t.gray)
                VStack(alignment: .leading, spacing: 1) {
                    Text("Tahmini Pişirme\nSüresi").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                    Text("\(max(1, s.donenessTotal() / 60)) dakika").font(.system(size: 15)).foregroundColor(t.teal)
                }
                Spacer()
            }
            Button { start() } label: { Text("Başlat") }.buttonStyle(Bordo(t: t, radius: 26))
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 12)
        .fitScreen()
    }
    private func start() { if s.lowWater { s.showWaterWarn = true } else { s.startCook(); onStart() } }
}

// MARK: - 07 Countdown
struct CountdownView: View {
    @ObservedObject var s: CookSession
    private let demoSeconds = 20.0
    private let tick = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
    var body: some View {
        let t = s.theme
        let progress = s.total > 0 ? min(1.0, max(0.0, 1 - s.remaining / s.total)) : 0
        VStack {
            Spacer(minLength: 0)
            ZStack {
                Circle().stroke(t.track, lineWidth: 9)
                Circle().trim(from: 0, to: CGFloat(progress)).stroke(t.bordo, style: StrokeStyle(lineWidth: 9, lineCap: .round)).rotationEffect(.degrees(90))
                VStack(spacing: 0) {
                    Text(fmt(s.remaining)).font(.system(size: 38, weight: .thin)).foregroundColor(t.bordo).monospacedDigit()
                    Text("kaldı").font(.system(size: 13, weight: .light)).foregroundColor(t.bordo)
                }
                VStack {
                    Spacer()
                    Button { s.paused.toggle() } label: { Image(systemName: s.paused ? "play.fill" : "pause.fill").font(.system(size: 12)).foregroundColor(t.gray) }.buttonStyle(.plain).padding(.bottom, 4)
                }.frame(height: 138)
            }
            .frame(width: 140, height: 140)
            Spacer(minLength: 0)
        }
        .fitScreen()
        .onReceive(tick) { _ in step() }
        .onAppear { if s.showDone { s.showDone = false } }
    }
    private func step() {
        guard !s.paused, !s.showDone, s.remaining > 0 else { return }
        s.remaining -= s.total / demoSeconds * 0.1
        if s.remaining <= 0 { s.remaining = 0; s.showDone = true }
    }
    private func fmt(_ x: Double) -> String { let r = Int(ceil(x)); return String(format: "%02d:%02d", r / 60, r % 60) }
}

// MARK: - 08 Profile
struct ProfileView: View {
    @ObservedObject var s: CookSession
    var onClose: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 8) {
            Spacer(minLength: 0)
            HStack { Spacer(); Button(action: onClose) { Image(systemName: "xmark").font(.system(size: 17, weight: .medium)).foregroundColor(t.gray) }.buttonStyle(.plain) }
            HStack(spacing: 10) {
                Circle().fill(t.profileCard).frame(width: 46, height: 46).overlay(Text("Foto").font(.system(size: 11, weight: .light)).foregroundColor(t.gray))
                VStack(alignment: .leading, spacing: 2) {
                    Text("Ahmet").font(.system(size: 18)).foregroundColor(t.ink)
                    Text("ahm******@gmail.com").font(.system(size: 10, weight: .light)).foregroundColor(t.gray)
                }
                Spacer()
            }
            HStack(spacing: 8) {
                VStack(alignment: .leading, spacing: 5) {
                    Text("Dil Seçimi").font(.system(size: 11, weight: .light)).foregroundColor(t.gray)
                    Text("🇹🇷 Türkçe").font(.system(size: 12)).foregroundColor(t.ink)
                }.frame(maxWidth: .infinity, alignment: .leading).padding(9).background(RoundedRectangle(cornerRadius: 13).fill(t.profileCard))
                VStack(alignment: .leading, spacing: 5) {
                    Text("Dark Mode").font(.system(size: 11, weight: .light)).foregroundColor(t.gray)
                    Toggle("", isOn: $s.dark).labelsHidden().tint(t.bordo).scaleEffect(0.75).frame(height: 16)
                }.frame(maxWidth: .infinity, alignment: .leading).padding(9).background(RoundedRectangle(cornerRadius: 13).fill(t.profileCard))
            }
            Text("EggChef/A98S77AFG").font(.system(size: 11, weight: .light)).foregroundColor(t.gray)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 8)
        .fitScreen()
    }
}

// MARK: - Popups (rendered at root → always full-screen + centered)
struct WaterWarnOverlay: View {
    @ObservedObject var s: CookSession
    var onOK: () -> Void
    var body: some View {
        let t = s.theme
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea()
            ZStack(alignment: .top) {
                VStack(spacing: 0) {
                    Text("Su seviyesi yetersiz!\nLütfen su haznesine\nsu ekleyiniz.")
                        .font(.system(size: 13, weight: .light)).foregroundColor(popInk).multilineTextAlignment(.center)
                        .padding(.top, 28).padding(.bottom, 12).padding(.horizontal, 12).frame(maxWidth: .infinity).background(Color.white)
                    Button(action: onOK) {
                        Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white).frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 44, height: 44)
                    .overlay(Circle().stroke(t.bordo.opacity(0.3), lineWidth: 2))
                    .overlay(Text("!").font(.system(size: 22, weight: .bold)).foregroundColor(t.bordo)).offset(y: -22)
            }
            .padding(.horizontal, 18)
        }
    }
}

struct DoneOverlay: View {
    @ObservedObject var s: CookSession
    var onOK: () -> Void
    var body: some View {
        let t = s.theme
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea()
            ZStack(alignment: .top) {
                VStack(spacing: 0) {
                    Text("Pişirme bitti!").font(.system(size: 16, weight: .regular)).foregroundColor(popInk)
                        .padding(.top, 30).padding(.bottom, 20).padding(.horizontal, 12).frame(maxWidth: .infinity).background(Color.white)
                    Button(action: onOK) {
                        Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white).frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 44, height: 44)
                    .overlay(Image(systemName: "checkmark").font(.system(size: 21, weight: .bold)).foregroundColor(t.bordo))
                    .shadow(color: .black.opacity(0.12), radius: 3, y: 2).offset(y: -22)
            }
            .padding(.horizontal, 18)
        }
    }
}
