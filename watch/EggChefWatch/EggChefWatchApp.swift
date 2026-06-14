import SwiftUI

// ============================================================================
//  EggChef — native watchOS app (single file, SwiftUI).
//  Full-screen state machine (NO NavigationStack chrome) so every screen fills the
//  watch and nothing scrolls. Swipe from the left edge to go back. Pixel-matched to
//  the Figma reference screens (watch/figma). Bordo theme + Dark Mode.
//  Standalone demo; countdown is demo-accelerated (~20s).
// ============================================================================

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

// MARK: - Root: full-screen state machine + edge-swipe back
struct RootView: View {
    @StateObject private var s = CookSession()
    @State private var showSplash = true
    @State private var stack: [Screen] = []   // empty == main

    private var current: Screen { stack.last ?? .main }
    private func go(_ scr: Screen) { stack.append(scr) }
    private func back() { if !stack.isEmpty { stack.removeLast() } }
    private func home() { stack.removeAll() }

    var body: some View {
        ZStack {
            s.theme.screen.ignoresSafeArea()
            if showSplash {
                SplashView()
            } else {
                screenView
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
        case .countdown: CountdownView(s: s, onHome: { home() })
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

// MARK: - Egg shape (clean 4-curve egg: narrow rounded top, wide round bottom)
struct EggShape: Shape {
    func path(in r: CGRect) -> Path {
        let w = r.width, h = r.height, x = r.minX, y = r.minY
        var p = Path()
        p.move(to: CGPoint(x: x + w * 0.5, y: y))
        p.addCurve(to: CGPoint(x: x + w, y: y + h * 0.62),
                   control1: CGPoint(x: x + w * 0.86, y: y),
                   control2: CGPoint(x: x + w, y: y + h * 0.30))
        p.addCurve(to: CGPoint(x: x + w * 0.5, y: y + h),
                   control1: CGPoint(x: x + w, y: y + h * 0.85),
                   control2: CGPoint(x: x + w * 0.78, y: y + h))
        p.addCurve(to: CGPoint(x: x, y: y + h * 0.62),
                   control1: CGPoint(x: x + w * 0.22, y: y + h),
                   control2: CGPoint(x: x, y: y + h * 0.85))
        p.addCurve(to: CGPoint(x: x + w * 0.5, y: y),
                   control1: CGPoint(x: x, y: y + h * 0.30),
                   control2: CGPoint(x: x + w * 0.14, y: y))
        p.closeSubpath()
        return p
    }
}

struct DialEgg: View {
    var selected: Bool
    var t: Theme
    var body: some View {
        EggShape()
            .fill(selected ? Color.white : t.egg)
            .overlay(EggShape().stroke(Color.black.opacity(0.06), lineWidth: 1))
            .frame(width: 19, height: 26)
            .shadow(color: .black.opacity(0.18), radius: 3, y: 2)
    }
}

struct RafadanIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            Ellipse().stroke(c, lineWidth: 1.7).frame(width: 27, height: 21)
            Circle().stroke(c, lineWidth: 1.7).frame(width: 9, height: 9).offset(x: -2.5, y: -1)
        }.frame(width: 30, height: 26)
    }
}
struct KayisiIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            ForEach(0..<8, id: \.self) { i in
                Capsule().fill(c).frame(width: 2, height: 5).offset(y: -12).rotationEffect(.degrees(Double(i) * 45))
            }
            Circle().stroke(c, lineWidth: 1.7).frame(width: 11, height: 11)
        }.frame(width: 30, height: 26)
    }
}
struct KatiIcon: View {
    var c: Color
    var body: some View {
        ZStack {
            Circle().stroke(c, lineWidth: 1.7).frame(width: 24, height: 24)
            Circle().stroke(c, lineWidth: 1.7).frame(width: 9, height: 9)
        }.frame(width: 30, height: 26)
    }
}

// MARK: - 01 Splash (clean white wordmark + striped echo above it + VESTEL)
struct SplashView: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0x7a1c2e), Color(hex: 0x9c2236), Color(hex: 0x591320)],
                           startPoint: .top, endPoint: .bottom).ignoresSafeArea()
            ZStack {
                VStack(spacing: 4) {
                    ForEach(0..<14, id: \.self) { _ in Rectangle().fill(Color.white.opacity(0.55)).frame(height: 2) }
                }
                .frame(width: 300, height: 64)
                .mask(Text("EggChef").font(.system(size: 46, weight: .thin)))
                .offset(y: -13)
                Text("EggChef").font(.system(size: 46, weight: .thin)).foregroundColor(.white)
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
            ZStack {
                Text("EggChef").font(.system(size: 17)).foregroundColor(t.gray)
                HStack { Spacer(); Image(systemName: "xmark").font(.system(size: 15, weight: .medium)).foregroundColor(t.gray) }
            }
            .padding(.horizontal, 2)
            Button(action: onNew) {
                HStack(spacing: 8) { Text("Yeni Pişirme"); EggShape().fill(Color.white).frame(width: 15, height: 20) }
            }.buttonStyle(Bordo(t: t, radius: 22))
            Button(action: onProfile) {
                HStack(spacing: 8) { Text("Profil ve Ayarlar"); Image(systemName: "gearshape.fill").font(.system(size: 15)) }
            }.buttonStyle(Bordo(t: t, radius: 22))
        }
        .padding(.horizontal, 6)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - 03 Egg count (tap dial to cycle; selected eggs WHITE)
struct CountView: View {
    @ObservedObject var s: CookSession
    var onNext: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 6) {
            Spacer(minLength: 0)
            EggDial(s: s)
            Button(action: onNext) { Text("Devam  ›") }.buttonStyle(Bordo(t: t, radius: 24)).padding(.horizontal, 14)
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct EggDial: View {
    @ObservedObject var s: CookSession
    var body: some View {
        let t = s.theme
        let R: CGFloat = 37
        ZStack {
            Circle().fill(t.plate).frame(width: 108, height: 108).shadow(color: .black.opacity(0.12), radius: 8, y: 4)
            ForEach(0..<6, id: \.self) { i in
                let ang = (Double(i) * 60.0 - 60.0) * .pi / 180.0
                DialEgg(selected: i < s.count, t: t).offset(x: R * CGFloat(cos(ang)), y: R * CGFloat(sin(ang)))
            }
            VStack(spacing: -2) {
                Text("\(s.count)").font(.system(size: 30, weight: .light)).foregroundColor(t.bordo)
                Text("adet").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
            }
        }
        .frame(width: 118, height: 118)
        .contentShape(Rectangle())
        .onTapGesture { s.cycleCount() }
    }
}

// MARK: - 04 Doneness (2×2 grid + divider cross)
struct DonenessView: View {
    @ObservedObject var s: CookSession
    var onWater: () -> Void
    var onCustom: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 4) {
            Text("Hızlı Pişirme").font(.system(size: 15, weight: .light)).foregroundColor(t.gray)
            ZStack {
                VStack(spacing: 0) {
                    HStack(spacing: 0) {
                        cell(label: "Rafadan") { AnyView(RafadanIcon(c: t.gray)) } tap: { s.doneness = "Rafadan"; onWater() }
                        cell(label: "Kayısı") { AnyView(KayisiIcon(c: t.gray)) } tap: { s.doneness = "Kayısı"; onWater() }
                    }
                    HStack(spacing: 0) {
                        cell(label: "Katı") { AnyView(KatiIcon(c: t.gray)) } tap: { s.doneness = "Katı"; onWater() }
                        cell(label: "Özel") { AnyView(Text(s.customLabel()).font(.system(size: 20, weight: .light)).foregroundColor(t.bordo)) } tap: { onCustom() }
                    }
                }
                Rectangle().fill(t.line).frame(width: 1).padding(.vertical, 12)
                Rectangle().fill(t.line).frame(height: 1).padding(.horizontal, 12)
            }
        }
        .padding(.horizontal, 6)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    private func cell(label: String, @ViewBuilder icon: () -> AnyView, tap: @escaping () -> Void) -> some View {
        let t = s.theme
        return Button(action: tap) {
            VStack(spacing: 4) {
                icon().frame(height: 26)
                Text(label).font(.system(size: 12, weight: .light)).foregroundColor(t.ink)
            }.frame(maxWidth: .infinity).padding(.vertical, 6)
        }.buttonStyle(.plain)
    }
}

// MARK: - 05 Custom time (white card + crown wheels + bordo Tamam bar)
struct CustomView: View {
    @ObservedObject var s: CookSession
    var onApply: () -> Void
    var body: some View {
        let t = s.theme
        VStack(spacing: 0) {
            HStack(spacing: 2) {
                Picker("", selection: $s.customMin) { ForEach(0..<31, id: \.self) { Text(String(format: "%02d", $0)).tag($0) } }.labelsHidden().frame(width: 56)
                Text(":").font(.system(size: 24, weight: .light)).foregroundColor(popInk)
                Picker("", selection: $s.customSec) { ForEach(0..<60, id: \.self) { Text(String(format: "%02d", $0)).tag($0) } }.labelsHidden().frame(width: 56)
            }
            .frame(height: 84).padding(.top, 4).background(Color.white)
            Button(action: onApply) {
                Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white)
                    .frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
            }.buttonStyle(.plain)
        }
        .environment(\.colorScheme, .light)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
        .padding(.horizontal, 14)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - 06 Water (outline icons; tap water row to toggle full/low)
struct WaterView: View {
    @ObservedObject var s: CookSession
    var onStart: () -> Void
    @State private var showWarn = false
    var body: some View {
        let t = s.theme
        VStack(spacing: 8) {
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
        }
        .padding(.horizontal, 12)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .overlay { if showWarn { WaterWarnOverlay(s: s, show: $showWarn) } }
    }
    private func start() { if s.lowWater { showWarn = true } else { s.startCook(); onStart() } }
}

// MARK: - 07 Countdown
struct CountdownView: View {
    @ObservedObject var s: CookSession
    var onHome: () -> Void
    @State private var showDone = false
    private let demoSeconds = 20.0
    private let tick = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
    var body: some View {
        let t = s.theme
        let progress = s.total > 0 ? min(1.0, max(0.0, 1 - s.remaining / s.total)) : 0
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
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onReceive(tick) { _ in step() }
        .overlay { if showDone { DoneOverlay(s: s, onDismiss: onHome) } }
    }
    private func step() {
        guard !s.paused, !showDone, s.remaining > 0 else { return }
        s.remaining -= s.total / demoSeconds * 0.1
        if s.remaining <= 0 { s.remaining = 0; showDone = true }
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
        }
        .padding(.horizontal, 8)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Popups (white card + floating badge + bordo Tamam bar)
struct WaterWarnOverlay: View {
    @ObservedObject var s: CookSession
    @Binding var show: Bool
    var body: some View {
        let t = s.theme
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea()
            ZStack(alignment: .top) {
                VStack(spacing: 0) {
                    Text("Su seviyesi yetersiz!\nLütfen su haznesine\nsu ekleyiniz.")
                        .font(.system(size: 13, weight: .light)).foregroundColor(popInk).multilineTextAlignment(.center)
                        .padding(.top, 28).padding(.bottom, 12).padding(.horizontal, 12).frame(maxWidth: .infinity).background(Color.white)
                    Button { s.lowWater = false; show = false } label: {
                        Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white).frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 44, height: 44)
                    .overlay(Circle().stroke(t.bordo.opacity(0.3), lineWidth: 2))
                    .overlay(Text("!").font(.system(size: 22, weight: .bold)).foregroundColor(t.bordo)).offset(y: -22)
            }
            .padding(.horizontal, 16)
        }
    }
}

struct DoneOverlay: View {
    @ObservedObject var s: CookSession
    var onDismiss: () -> Void
    var body: some View {
        let t = s.theme
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea()
            ZStack(alignment: .top) {
                VStack(spacing: 0) {
                    Text("Pişirme bitti!").font(.system(size: 16, weight: .regular)).foregroundColor(popInk)
                        .padding(.top, 30).padding(.bottom, 20).padding(.horizontal, 12).frame(maxWidth: .infinity).background(Color.white)
                    Button(action: onDismiss) {
                        Text("Tamam").font(.system(size: 15, weight: .light)).foregroundColor(.white).frame(maxWidth: .infinity).padding(.vertical, 10).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 44, height: 44)
                    .overlay(Image(systemName: "checkmark").font(.system(size: 21, weight: .bold)).foregroundColor(t.bordo))
                    .shadow(color: .black.opacity(0.12), radius: 3, y: 2).offset(y: -22)
            }
            .padding(.horizontal, 16)
        }
    }
}
