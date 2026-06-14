import SwiftUI

// ============================================================================
//  EggChef — native watchOS app (single file, SwiftUI).
//  Pixel-matched to the Figma reference screens (watch/figma):
//    splash → main → egg count → doneness → (custom time) → water → countdown → done
//    plus profile + water-warning / cooking-done popups.
//  Bordo brand theme, light by default with a working Dark Mode toggle.
//  Standalone demo; countdown is demo-accelerated (~20s).
// ============================================================================

// MARK: - Color helper
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

// MARK: - Theme (light / dark palettes)
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

// MARK: - Session / state
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

// MARK: - Navigation
enum Screen: Hashable { case count, doneness, custom, water, countdown, profile }

@main
struct EggChefWatchApp: App {
    var body: some Scene { WindowGroup { RootView() } }
}

struct RootView: View {
    @StateObject private var s = CookSession()
    @State private var showSplash = true
    @State private var path: [Screen] = []
    var body: some View {
        ZStack {
            s.theme.screen.ignoresSafeArea()
            if showSplash {
                SplashView().transition(.opacity)
            } else {
                NavigationStack(path: $path) {
                    MainView(s: s, path: $path)
                        .navigationDestination(for: Screen.self) { scr in
                            switch scr {
                            case .count:     CountView(s: s, path: $path)
                            case .doneness:  DonenessView(s: s, path: $path)
                            case .custom:    CustomView(s: s, path: $path)
                            case .water:     WaterView(s: s, path: $path)
                            case .countdown: CountdownView(s: s, path: $path)
                            case .profile:   ProfileView(s: s)
                            }
                        }
                }
            }
        }
        .preferredColorScheme(s.dark ? .dark : .light)
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                withAnimation(.easeInOut(duration: 0.4)) { showSplash = false }
            }
        }
    }
}

// MARK: - Bordo button (rounded-rect, white text, shadow)
struct Bordo: ButtonStyle {
    var t: Theme
    var radius: CGFloat = 22
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .light))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(RoundedRectangle(cornerRadius: radius).fill(t.maroon))
            .shadow(color: .black.opacity(0.18), radius: 5, y: 3)
            .opacity(configuration.isPressed ? 0.85 : 1)
    }
}

// MARK: - Shapes / icons
struct EggShape: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height, cx = r.midX
        p.move(to: CGPoint(x: cx, y: r.minY))
        p.addCurve(to: CGPoint(x: cx, y: r.maxY),
                   control1: CGPoint(x: r.maxX + w * 0.04, y: r.minY + h * 0.26),
                   control2: CGPoint(x: r.maxX, y: r.minY + h * 0.82))
        p.addCurve(to: CGPoint(x: cx, y: r.minY),
                   control1: CGPoint(x: r.minX, y: r.minY + h * 0.82),
                   control2: CGPoint(x: r.minX - w * 0.04, y: r.minY + h * 0.26))
        p.closeSubpath()
        return p
    }
}

// one egg on the dial: filled white (selected) or gray, with a soft drop shadow + smile
struct DialEgg: View {
    var selected: Bool
    var t: Theme
    var body: some View {
        EggShape()
            .fill(selected ? Color.white : t.egg)
            .overlay(EggShape().stroke(Color.black.opacity(0.06), lineWidth: 1))
            .overlay(
                Path { p in
                    p.move(to: CGPoint(x: 7, y: 24)); p.addQuadCurve(to: CGPoint(x: 14, y: 24), control: CGPoint(x: 10.5, y: 27))
                }.stroke(Color.black.opacity(0.14), lineWidth: 1.2)
            )
            .frame(width: 21, height: 29)
            .shadow(color: .black.opacity(0.18), radius: 3, y: 3)
    }
}

struct RafadanIcon: View { // fried egg (white + yolk)
    var c: Color
    var body: some View {
        ZStack {
            Ellipse().stroke(c, lineWidth: 1.7).frame(width: 27, height: 21)
            Circle().stroke(c, lineWidth: 1.7).frame(width: 9, height: 9).offset(x: -2.5, y: -1)
        }.frame(width: 30, height: 30)
    }
}
struct KayisiIcon: View { // sun / flower
    var c: Color
    var body: some View {
        ZStack {
            ForEach(0..<8, id: \.self) { i in
                Capsule().fill(c).frame(width: 2, height: 5).offset(y: -12).rotationEffect(.degrees(Double(i) * 45))
            }
            Circle().stroke(c, lineWidth: 1.7).frame(width: 11, height: 11)
        }.frame(width: 30, height: 30)
    }
}
struct KatiIcon: View { // concentric rings
    var c: Color
    var body: some View {
        ZStack {
            Circle().stroke(c, lineWidth: 1.7).frame(width: 26, height: 26)
            Circle().stroke(c, lineWidth: 1.7).frame(width: 9, height: 9)
        }.frame(width: 30, height: 30)
    }
}

// MARK: - 01 Splash (striped ghost wordmark + VESTEL)
struct SplashView: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0x7a1c2e), Color(hex: 0x9c2236), Color(hex: 0x591320)],
                           startPoint: .top, endPoint: .bottom).ignoresSafeArea()
            ZStack {
                VStack(spacing: 3) {
                    ForEach(0..<18, id: \.self) { _ in Rectangle().fill(Color.white.opacity(0.5)).frame(height: 1.5) }
                }
                .frame(width: 270, height: 92)
                .mask(Text("EggChef").font(.system(size: 52, weight: .thin)))
                .offset(y: -10)
                Text("EggChef").font(.system(size: 40, weight: .thin)).foregroundColor(.white)
            }
            VStack {
                Spacer()
                Text("VESTEL").font(.system(size: 15, weight: .heavy)).tracking(4).foregroundColor(.white).padding(.bottom, 16)
            }
        }
    }
}

// MARK: - 02 Main
struct MainView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 12) {
                ZStack {
                    Text("EggChef").font(.system(size: 17)).foregroundColor(t.gray)
                    HStack { Spacer(); Image(systemName: "xmark").font(.system(size: 16, weight: .medium)).foregroundColor(t.gray) }
                }
                .padding(.horizontal, 4).padding(.top, 2)

                Button { path.append(.count) } label: {
                    HStack(spacing: 8) {
                        Text("Yeni Pişirme")
                        EggShape().fill(Color.white).frame(width: 16, height: 21)
                    }
                }.buttonStyle(Bordo(t: t, radius: 22))

                Button { path.append(.profile) } label: {
                    HStack(spacing: 8) {
                        Text("Profil ve Ayarlar")
                        Image(systemName: "gearshape.fill").font(.system(size: 16))
                    }
                }.buttonStyle(Bordo(t: t, radius: 22))
            }
            .padding(.horizontal, 6)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("")
    }
}

// MARK: - 03 Egg count (tap dial to cycle 1→6; selected eggs fill WHITE per Figma)
struct CountView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 8) {
                EggDial(s: s)
                Button { path.append(.doneness) } label: { Text("Devam  ›") }
                    .buttonStyle(Bordo(t: t, radius: 24)).padding(.horizontal, 8)
            }
            .padding(.top, 2)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Adet")
    }
}

struct EggDial: View {
    @ObservedObject var s: CookSession
    var body: some View {
        let t = s.theme
        let R: CGFloat = 50
        ZStack {
            Circle().fill(t.plate).frame(width: 156, height: 156)
                .shadow(color: .black.opacity(0.12), radius: 10, y: 5)
            ForEach(0..<6, id: \.self) { i in
                let ang = (Double(i) * 60.0 - 60.0) * .pi / 180.0
                DialEgg(selected: i < s.count, t: t)
                    .offset(x: R * CGFloat(cos(ang)), y: R * CGFloat(sin(ang)))
            }
            VStack(spacing: -2) {
                Text("\(s.count)").font(.system(size: 40, weight: .light)).foregroundColor(t.bordo)
                Text("adet").font(.system(size: 14, weight: .light)).foregroundColor(t.gray)
            }
        }
        .frame(width: 170, height: 170)
        .contentShape(Rectangle())
        .onTapGesture { s.cycleCount() }
    }
}

// MARK: - 04 Doneness (2×2 grid, divider cross, outline icons, Özel shows time)
struct DonenessView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 10) {
                Text("Hızlı Pişirme").font(.system(size: 17, weight: .light)).foregroundColor(t.gray)
                ZStack {
                    VStack(spacing: 0) {
                        HStack(spacing: 0) {
                            cell(label: "Rafadan") { AnyView(RafadanIcon(c: t.gray)) } tap: { s.doneness = "Rafadan"; path.append(.water) }
                            cell(label: "Kayısı") { AnyView(KayisiIcon(c: t.gray)) } tap: { s.doneness = "Kayısı"; path.append(.water) }
                        }
                        HStack(spacing: 0) {
                            cell(label: "Katı") { AnyView(KatiIcon(c: t.gray)) } tap: { s.doneness = "Katı"; path.append(.water) }
                            cell(label: "Özel") { AnyView(Text(s.customLabel()).font(.system(size: 22, weight: .light)).foregroundColor(t.bordo)) } tap: { path.append(.custom) }
                        }
                    }
                    Rectangle().fill(t.line).frame(width: 1).padding(.vertical, 16)
                    Rectangle().fill(t.line).frame(height: 1).padding(.horizontal, 14)
                }
            }
            .padding(.horizontal, 6).padding(.top, 2)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Kıvam")
    }
    private func cell(label: String, @ViewBuilder icon: () -> AnyView, tap: @escaping () -> Void) -> some View {
        let t = s.theme
        return Button(action: tap) {
            VStack(spacing: 6) {
                icon().frame(height: 30)
                Text(label).font(.system(size: 13, weight: .light)).foregroundColor(t.ink)
            }
            .frame(maxWidth: .infinity).padding(.vertical, 12)
        }.buttonStyle(.plain)
    }
}

// MARK: - 05 Custom time (white card + crown wheels + bordo Tamam bar)
struct CustomView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        VStack(spacing: 0) {
            HStack(spacing: 2) {
                Picker("", selection: $s.customMin) {
                    ForEach(0..<31, id: \.self) { Text(String(format: "%02d", $0)).tag($0) }
                }.labelsHidden().frame(width: 58)
                Text(":").font(.system(size: 26, weight: .light)).foregroundColor(popInk)
                Picker("", selection: $s.customSec) {
                    ForEach(0..<60, id: \.self) { Text(String(format: "%02d", $0)).tag($0) }
                }.labelsHidden().frame(width: 58)
            }
            .frame(height: 96).padding(.top, 6)
            .background(Color.white)

            Button { s.doneness = "Özel"; path.append(.water) } label: {
                Text("Tamam").font(.system(size: 16, weight: .light)).foregroundColor(.white)
                    .frame(maxWidth: .infinity).padding(.vertical, 11).background(t.maroon)
            }.buttonStyle(.plain)
        }
        .environment(\.colorScheme, .light) // keep the white card's wheel text dark even in Dark Mode
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
        .padding(.horizontal, 14).padding(.vertical, 8)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Özel")
    }
}

// MARK: - 06 Water (outline icons, divider, tap the water row to toggle full/low)
struct WaterView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    @State private var showWarn = false
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 12) {
                Button { s.lowWater.toggle() } label: {
                    HStack(spacing: 12) {
                        Image(systemName: "drop").font(.system(size: 26)).foregroundColor(t.blue)
                        VStack(alignment: .leading, spacing: 1) {
                            Text("Haznedeki Su\nMiktarı").font(.system(size: 14, weight: .light)).foregroundColor(t.gray)
                            HStack(spacing: 5) {
                                Text(s.lowWater ? "~5 ml" : "~65 ml").font(.system(size: 17)).foregroundColor(s.lowWater ? t.red : t.teal)
                                if s.lowWater { Image(systemName: "exclamationmark.circle").font(.system(size: 14)).foregroundColor(t.red) }
                            }
                        }
                        Spacer()
                    }
                }.buttonStyle(.plain)

                Rectangle().fill(t.line).frame(height: 1)

                HStack(spacing: 12) {
                    Image(systemName: "clock").font(.system(size: 25)).foregroundColor(t.gray)
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Tahmini Pişirme\nSüresi").font(.system(size: 14, weight: .light)).foregroundColor(t.gray)
                        Text("\(max(1, s.donenessTotal() / 60)) dakika").font(.system(size: 17)).foregroundColor(t.teal)
                    }
                    Spacer()
                }

                Button { start() } label: { Text("Başlat") }.buttonStyle(Bordo(t: t, radius: 26)).padding(.top, 2)
            }
            .padding(.horizontal, 10).padding(.top, 2)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Su")
        .overlay { if showWarn { WaterWarnOverlay(s: s, show: $showWarn) } }
    }
    private func start() {
        if s.lowWater { showWarn = true } else { s.startCook(); path.append(.countdown) }
    }
}

// MARK: - 07 Countdown (light ring, bordo time, pause)
struct CountdownView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    @State private var showDone = false
    private let demoSeconds = 20.0
    private let tick = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
    var body: some View {
        let t = s.theme
        let progress = s.total > 0 ? min(1.0, max(0.0, 1 - s.remaining / s.total)) : 0
        ZStack {
            Circle().stroke(t.track, lineWidth: 9)
            Circle().trim(from: 0, to: CGFloat(progress))
                .stroke(t.bordo, style: StrokeStyle(lineWidth: 9, lineCap: .round))
                .rotationEffect(.degrees(90))
            VStack(spacing: 0) {
                Text(fmt(s.remaining)).font(.system(size: 44, weight: .thin)).foregroundColor(t.bordo).monospacedDigit()
                Text("kaldı").font(.system(size: 15, weight: .light)).foregroundColor(t.bordo)
            }
            VStack {
                Spacer()
                Button { s.paused.toggle() } label: {
                    Image(systemName: s.paused ? "play.fill" : "pause.fill").font(.system(size: 13)).foregroundColor(t.gray)
                }.buttonStyle(.plain).padding(.bottom, 8)
            }
        }
        .frame(width: 168, height: 168)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("")
        .navigationBarBackButtonHidden(true)
        .onReceive(tick) { _ in step() }
        .overlay { if showDone { DoneOverlay(s: s) { path.removeAll() } } }
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
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 12) {
                HStack { Spacer(); Button { dismiss() } label: { Image(systemName: "xmark").font(.system(size: 18, weight: .medium)).foregroundColor(t.gray) }.buttonStyle(.plain) }

                HStack(spacing: 12) {
                    Circle().fill(t.profileCard).frame(width: 56, height: 56)
                        .overlay(Text("Foto").font(.system(size: 12, weight: .light)).foregroundColor(t.gray))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Ahmet").font(.system(size: 20)).foregroundColor(t.ink)
                        Text("ahm******@gmail.com").font(.system(size: 11, weight: .light)).foregroundColor(t.gray)
                    }
                    Spacer()
                }

                HStack(spacing: 10) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Dil Seçimi").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                        Text("🇹🇷 Türkçe (TR)").font(.system(size: 13)).foregroundColor(t.ink)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading).padding(10)
                    .background(RoundedRectangle(cornerRadius: 14).fill(t.profileCard))

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Dark Mode").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                        Toggle("", isOn: $s.dark).labelsHidden().tint(t.bordo).scaleEffect(0.8).frame(height: 18)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading).padding(10)
                    .background(RoundedRectangle(cornerRadius: 14).fill(t.profileCard))
                }

                Text("EggChef/A98S77AFG").font(.system(size: 12, weight: .light)).foregroundColor(t.gray).padding(.top, 2)
            }
            .padding(.horizontal, 8).padding(.top, 2)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Profil").navigationBarBackButtonHidden(true)
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
                        .font(.system(size: 14, weight: .light)).foregroundColor(popInk)
                        .multilineTextAlignment(.center)
                        .padding(.top, 30).padding(.bottom, 14).padding(.horizontal, 12)
                        .frame(maxWidth: .infinity).background(Color.white)
                    Button { s.lowWater = false; show = false } label: {
                        Text("Tamam").font(.system(size: 16, weight: .light)).foregroundColor(.white)
                            .frame(maxWidth: .infinity).padding(.vertical, 11).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 46, height: 46)
                    .overlay(Circle().stroke(t.bordo.opacity(0.3), lineWidth: 2))
                    .overlay(Text("!").font(.system(size: 24, weight: .bold)).foregroundColor(t.bordo))
                    .offset(y: -23)
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
                    Text("Pişirme bitti!")
                        .font(.system(size: 17, weight: .regular)).foregroundColor(popInk)
                        .padding(.top, 34).padding(.bottom, 22).padding(.horizontal, 12)
                        .frame(maxWidth: .infinity).background(Color.white)
                    Button { onDismiss() } label: {
                        Text("Tamam").font(.system(size: 16, weight: .light)).foregroundColor(.white)
                            .frame(maxWidth: .infinity).padding(.vertical, 11).background(t.maroon)
                    }.buttonStyle(.plain)
                }
                .clipShape(RoundedRectangle(cornerRadius: 18))
                Circle().fill(Color.white).frame(width: 46, height: 46)
                    .overlay(Image(systemName: "checkmark").font(.system(size: 22, weight: .bold)).foregroundColor(t.bordo))
                    .shadow(color: .black.opacity(0.12), radius: 3, y: 2)
                    .offset(y: -23)
            }
            .padding(.horizontal, 16)
        }
    }
}
