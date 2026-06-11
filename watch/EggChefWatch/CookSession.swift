import Foundation
import SwiftUI
import Combine

enum Doneness: String, CaseIterable, Identifiable {
    case rafadan = "Rafadan"
    case kayisi = "Kayısı"
    case kati = "Katı"
    var id: String { rawValue }
}

enum Phase {
    case menu, cooking, done
}

// Standalone cooking session for the watch app (not synced with the phone).
final class CookSession: ObservableObject {
    @Published var count: Int = 3
    @Published var doneness: Doneness = .rafadan
    @Published var phase: Phase = .menu
    @Published var remaining: Int = 0

    private(set) var total: Int = 0
    private var timer: AnyCancellable?

    var recommendedSeconds: Int {
        switch doneness {
        case .rafadan: return 6 * 60
        case .kayisi: return 8 * 60
        case .kati: return 10 * 60
        }
    }

    var recommendedLabel: String { "\(recommendedSeconds / 60) dakika" }

    var progress: Double { total > 0 ? 1 - Double(remaining) / Double(total) : 0 }

    var timeString: String { String(format: "%02d:%02d", remaining / 60, remaining % 60) }

    var stageLabel: String {
        switch progress {
        case ..<0.34: return "Su Alınıyor"
        case ..<0.67: return "Isınıyor"
        default: return "Haşlanıyor"
        }
    }

    func increment() { if count < 6 { count += 1 } }
    func decrement() { if count > 1 { count -= 1 } }

    func start() {
        total = recommendedSeconds
        remaining = total
        phase = .cooking
        timer = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self else { return }
                if self.remaining > 0 { self.remaining -= 1 }
                if self.remaining == 0 {
                    self.cancelTimer()
                    self.phase = .done
                }
            }
    }

    func stop() {
        cancelTimer()
        phase = .menu
    }

    func acknowledge() { phase = .menu }

    private func cancelTimer() {
        timer?.cancel()
        timer = nil
    }
}
