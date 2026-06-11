import SwiftUI

struct CompleteView: View {
    @EnvironmentObject var session: CookSession

    var body: some View {
        VStack(spacing: 10) {
            ZStack {
                RoundedRectangle(cornerRadius: 18)
                    .fill(EC.gradient)
                    .frame(width: 56, height: 56)
                Image(systemName: "checkmark")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundColor(.white)
            }

            Text("Afiyet Olsun")
                .font(.system(size: 10, weight: .heavy))
                .foregroundColor(EC.primary)
                .textCase(.uppercase)

            Text("Pişirme Tamamlandı")
                .font(.system(size: 15, weight: .heavy))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)

            Button(action: session.acknowledge) {
                Text("Tamam")
                    .fontWeight(.bold)
                    .font(.system(size: 14))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 7)
                    .background(RoundedRectangle(cornerRadius: 16).fill(EC.gradient))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 8)
    }
}
