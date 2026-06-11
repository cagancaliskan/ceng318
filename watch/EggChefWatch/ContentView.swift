import SwiftUI

struct ContentView: View {
    @StateObject private var session = CookSession()

    var body: some View {
        ZStack {
            EC.bg.ignoresSafeArea()
            switch session.phase {
            case .menu: MenuView()
            case .cooking: CookingView()
            case .done: CompleteView()
            }
        }
        .environmentObject(session)
        .animation(.easeInOut(duration: 0.25), value: session.phase)
    }
}
