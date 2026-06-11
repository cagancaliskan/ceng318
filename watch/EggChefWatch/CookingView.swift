import SwiftUI

struct CookingView: View {
    @EnvironmentObject var session: CookSession

    var body: some View {
        VStack(spacing: 8) {
            Text(session.stageLabel)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(EC.primary)

            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.12), lineWidth: 8)
                EC.gradient
                    .mask(
                        Circle()
                            .trim(from: 0, to: session.progress)
                            .stroke(style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.linear(duration: 0.25), value: session.progress)
                VStack(spacing: 0) {
                    Text("KALAN")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(EC.med)
                    Text(session.timeString)
                        .font(.system(size: 30, weight: .heavy, design: .rounded))
                        .foregroundColor(.white)
                        .monospacedDigit()
                }
            }
            .frame(width: 110, height: 110)
            .padding(.vertical, 2)

            Button(action: session.stop) {
                HStack(spacing: 6) {
                    Image(systemName: "stop.fill")
                    Text("Durdur").fontWeight(.bold)
                }
                .font(.system(size: 14))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 7)
                .background(RoundedRectangle(cornerRadius: 18).fill(EC.gradient))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 6)
    }
}
