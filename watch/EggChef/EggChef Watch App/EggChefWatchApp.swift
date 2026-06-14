import SwiftUI

// ============================================================================
//  EggChef — native watchOS app (single file, SwiftUI).
//  Mirrors the EggChef Apple Watch demo flow:
//    splash → main → egg count → doneness → (custom time) → water → countdown → done
//    plus a profile screen and water-warning / cooking-done overlays.
//  Bordo brand theme, light by default with a working Dark Mode toggle.
//  Standalone demo (not synced with the phone app). Countdown is demo-accelerated
//  (~20s) so any duration can be shown live in the simulator.
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

// MARK: - Theme (light / dark palettes — same bordo brand as the phone app)
struct Theme {
    var dark: Bool
    var screen: Color { dark ? Color(hex: 0x0f0f11) : .white }
    var ink: Color { dark ? Color(hex: 0xf0f0f0) : Color(hex: 0x2a2a2a) }
    var gray: Color { dark ? Color(hex: 0x9a9a9a) : Color(hex: 0x8a8a8a) }
    var bordo: Color { dark ? Color(hex: 0xd2554d) : Color(hex: 0x5a1520) }
    var bordoMid: Color { dark ? Color(hex: 0xf1a8b8) : Color(hex: 0x8a2032) }
    var maroon: Color { Color(hex: 0x8a2433) }
    var egg: Color { dark ? Color(hex: 0x3b3b42) : Color(hex: 0xd6d6d6) }
    var line: Color { dark ? Color(hex: 0x33333b) : Color(hex: 0xe8e8e8) }
    var card: Color { dark ? Color(hex: 0x1c1c20) : Color(hex: 0xf6f4f4) }
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

    // active cook
    @Published var remaining: Double = 0
    @Published var total: Double = 0
    @Published var paused = false

    let durations: [String: Int] = ["Rafadan": 300, "Kayısı": 480, "Katı": 600]
    var theme: Theme { Theme(dark: dark) }

    func donenessTotal() -> Int {
        doneness == "Özel" ? customMin * 60 + customSec : (durations[doneness] ?? 300)
    }
    func startCook() {
        total = Double(donenessTotal())
        remaining = total
        paused = false
    }
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

// MARK: - Shared button
struct PillButton: ButtonStyle {
    var bg: Color
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .light))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 9)
            .background(configuration.isPressed ? bg.opacity(0.85) : bg)
            .clipShape(Capsule())
    }
}

// MARK: - 01 Splash
struct SplashView: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: 0x6c1626), Color(hex: 0x9c2236), Color(hex: 0x591320)],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()
            VStack(spacing: 8) {
                Text("EggChef").font(.system(size: 30, weight: .light)).foregroundColor(.white)
                Text("VESTEL").font(.system(size: 12, weight: .heavy)).tracking(3).foregroundColor(.white.opacity(0.85))
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
                Text("EggChef")
                    .font(.system(size: 18, weight: .regular))
                    .foregroundColor(t.bordoMid)
                    .frame(maxWidth: .infinity, alignment: .leading)
                Button { path.append(.count) } label: {
                    Label("Yeni Pişirme", systemImage: "oval.portrait.fill")
                }.buttonStyle(PillButton(bg: t.maroon))
                Button { path.append(.profile) } label: {
                    Label("Profil ve Ayarlar", systemImage: "gearshape.fill")
                }.buttonStyle(PillButton(bg: t.maroon))
            }
            .padding(.horizontal, 6)
            .padding(.top, 2)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("")
    }
}

// MARK: - 03 Egg count (tap the dial to cycle 1→6→1; selected eggs fill bordo)
struct CountView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 6) {
                EggDial(s: s)
                Button { path.append(.doneness) } label: { Text("Devam") }
                    .buttonStyle(PillButton(bg: t.maroon))
                    .padding(.horizontal, 6)
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
        let R: CGFloat = 52
        ZStack {
            ForEach(0..<6, id: \.self) { i in
                let ang = (Double(i) * 60.0 - 60.0) * .pi / 180.0
                Ellipse()
                    .fill(i < s.count ? t.bordo : t.egg)
                    .frame(width: 20, height: 28)
                    .opacity(i < s.count ? 1 : 0.55)
                    .offset(x: R * CGFloat(cos(ang)), y: R * CGFloat(sin(ang)))
            }
            VStack(spacing: -2) {
                Text("\(s.count)").font(.system(size: 38, weight: .light)).foregroundColor(t.bordo)
                Text("adet").font(.system(size: 13, weight: .light)).foregroundColor(t.gray)
            }
        }
        .frame(width: 150, height: 150)
        .contentShape(Rectangle())
        .onTapGesture { s.cycleCount() }
    }
}

// MARK: - 04 Doneness
struct DonenessView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    private let names = ["Rafadan", "Kayısı", "Katı", "Özel"]
    private func icon(_ n: String) -> String {
        switch n {
        case "Rafadan": return "drop.fill"
        case "Kayısı": return "circle.lefthalf.filled"
        case "Katı": return "circle.fill"
        default: return "clock"
        }
    }
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 8) {
                Text("Hızlı Pişirme").font(.system(size: 14, weight: .light)).foregroundColor(t.gray)
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)], spacing: 8) {
                    ForEach(names, id: \.self) { n in
                        Button { pick(n) } label: {
                            VStack(spacing: 5) {
                                Image(systemName: icon(n)).font(.system(size: 18)).foregroundColor(t.bordoMid)
                                Text(n).font(.system(size: 12, weight: .light)).foregroundColor(t.ink)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(RoundedRectangle(cornerRadius: 12).fill(t.card))
                        }.buttonStyle(.plain)
                    }
                }
            }
            .padding(.horizontal, 6)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Kıvam")
    }
    private func pick(_ d: String) {
        if d == "Özel" { path.append(.custom) }
        else { s.doneness = d; path.append(.water) }
    }
}

// MARK: - 05 Custom time (native crown-driven wheels)
struct CustomView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    var body: some View {
        let t = s.theme
        VStack(spacing: 8) {
            HStack(spacing: 4) {
                Picker("", selection: $s.customMin) {
                    ForEach(0..<31, id: \.self) { Text(String(format: "%02d", $0)).tag($0) }
                }.labelsHidden().frame(width: 56)
                Text(":").font(.system(size: 24, weight: .light)).foregroundColor(t.bordo)
                Picker("", selection: $s.customSec) {
                    ForEach(0..<60, id: \.self) { Text(String(format: "%02d", $0)).tag($0) }
                }.labelsHidden().frame(width: 56)
            }
            .frame(height: 92)
            Button { s.doneness = "Özel"; path.append(.water) } label: { Text("Tamam") }
                .buttonStyle(PillButton(bg: t.maroon))
                .padding(.horizontal, 6)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Özel")
    }
}

// MARK: - 06 Water (tap the water row to toggle full/low — lets you demo the warning)
struct WaterView: View {
    @ObservedObject var s: CookSession
    @Binding var path: [Screen]
    @State private var showWarn = false
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 10) {
                Button { s.lowWater.toggle() } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "drop.fill").foregroundColor(s.lowWater ? t.red : t.blue)
                        VStack(alignment: .leading, spacing: 1) {
                            Text("Haznedeki Su").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                            Text(s.lowWater ? "~5 ml" : "~65 ml").font(.system(size: 16)).foregroundColor(s.lowWater ? t.red : t.teal)
                        }
                        Spacer()
                    }
                    .padding(10)
                    .background(RoundedRectangle(cornerRadius: 12).fill(t.card))
                }.buttonStyle(.plain)

                HStack(spacing: 10) {
                    Image(systemName: "clock").foregroundColor(t.gray)
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Tahmini Süre").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
                        Text("\(max(1, s.donenessTotal() / 60)) dakika").font(.system(size: 16)).foregroundColor(t.teal)
                    }
                    Spacer()
                }
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(t.card))

                Button { start() } label: { Text("Başlat") }
                    .buttonStyle(PillButton(bg: t.maroon))
            }
            .padding(.horizontal, 6)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Su")
        .overlay { if showWarn { WaterWarnOverlay(s: s, show: $showWarn) } }
    }
    private func start() {
        if s.lowWater { showWarn = true }
        else { s.startCook(); path.append(.countdown) }
    }
}

// MARK: - 07 Countdown
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
            Circle().stroke(t.egg.opacity(0.5), lineWidth: 9)
            Circle()
                .trim(from: 0, to: CGFloat(progress))
                .stroke(t.bordo, style: StrokeStyle(lineWidth: 9, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 0) {
                Text(fmt(s.remaining)).font(.system(size: 34, weight: .thin)).foregroundColor(t.bordo).monospacedDigit()
                Text("kaldı").font(.system(size: 12, weight: .light)).foregroundColor(t.gray)
            }
            VStack {
                Spacer()
                Button { s.paused.toggle() } label: {
                    Image(systemName: s.paused ? "play.fill" : "pause.fill").font(.system(size: 12)).foregroundColor(t.gray)
                }.buttonStyle(.plain).padding(.bottom, 4)
            }
        }
        .frame(width: 150, height: 150)
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
    private func fmt(_ x: Double) -> String {
        let r = Int(ceil(x)); return String(format: "%02d:%02d", r / 60, r % 60)
    }
}

// MARK: - 08 Profile
struct ProfileView: View {
    @ObservedObject var s: CookSession
    var body: some View {
        let t = s.theme
        ScrollView {
            VStack(spacing: 10) {
                Circle().fill(t.egg).frame(width: 50, height: 50)
                    .overlay(Text("Foto").font(.system(size: 11, weight: .light)).foregroundColor(t.gray))
                Text("Ahmet").font(.system(size: 17)).foregroundColor(t.ink)

                HStack {
                    Text("Dil").font(.system(size: 13, weight: .light)).foregroundColor(t.gray)
                    Spacer()
                    Text("🇹🇷 Türkçe").font(.system(size: 13)).foregroundColor(t.ink)
                }
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 12).fill(t.card))

                Toggle(isOn: $s.dark) {
                    Text("Dark Mode").font(.system(size: 13)).foregroundColor(t.ink)
                }
                .tint(t.bordo)
                .padding(.horizontal, 10).padding(.vertical, 6)
                .background(RoundedRectangle(cornerRadius: 12).fill(t.card))

                Text("EggChef/A98S77AFG").font(.system(size: 11, weight: .light)).foregroundColor(t.gray)
            }
            .padding(.horizontal, 6)
        }
        .background(t.screen.ignoresSafeArea())
        .navigationTitle("Profil")
    }
}

// MARK: - Overlays
struct WaterWarnOverlay: View {
    @ObservedObject var s: CookSession
    @Binding var show: Bool
    var body: some View {
        let t = s.theme
        ZStack {
            Color.black.opacity(0.5).ignoresSafeArea()
            VStack(spacing: 8) {
                Image(systemName: "exclamationmark.triangle.fill").font(.system(size: 26)).foregroundColor(t.red)
                Text("Su seviyesi yetersiz!").font(.system(size: 14)).foregroundColor(t.ink).multilineTextAlignment(.center)
                Text("Lütfen su haznesine su ekleyin.").font(.system(size: 12, weight: .light)).foregroundColor(t.gray).multilineTextAlignment(.center)
                Button { s.lowWater = false; show = false } label: { Text("Tamam") }.buttonStyle(PillButton(bg: t.maroon))
            }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: 18).fill(t.card))
            .padding(.horizontal, 10)
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
            VStack(spacing: 8) {
                ZStack {
                    Circle().fill(t.bordo).frame(width: 50, height: 50)
                    Image(systemName: "checkmark").font(.system(size: 24, weight: .bold)).foregroundColor(.white)
                }
                Text("Pişirme bitti!").font(.system(size: 15)).foregroundColor(t.ink)
                Button { onDismiss() } label: { Text("Tamam") }.buttonStyle(PillButton(bg: t.maroon))
            }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: 18).fill(t.card))
            .padding(.horizontal, 10)
        }
    }
}
