import SwiftUI

// EggChef palette (same hues as the React Native app, adapted for a dark watch face).
enum EC {
    static let primary = Color(red: 118 / 255, green: 145 / 255, blue: 155 / 255) // #76919B
    static let primaryDeep = Color(red: 93 / 255, green: 118 / 255, blue: 129 / 255) // #5d7681
    static let dark = Color(red: 43 / 255, green: 47 / 255, blue: 49 / 255) // #2b2f31
    static let med = Color(red: 155 / 255, green: 155 / 255, blue: 155 / 255) // #9B9B9B
    static let bg = Color(red: 18 / 255, green: 22 / 255, blue: 24 / 255) // dark watch background
    static let cardBg = Color.white.opacity(0.10)

    static let gradient = LinearGradient(
        colors: [primary, primaryDeep],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
