import SwiftUI

struct MenuView: View {
    @EnvironmentObject var session: CookSession

    var body: some View {
        ScrollView {
            VStack(spacing: 10) {
                // wordmark
                HStack(spacing: 0) {
                    Text("Egg").foregroundColor(.white)
                    Text("Chef").foregroundColor(EC.primary)
                }
                .font(.system(size: 18, weight: .heavy))
                .padding(.top, 2)

                // egg count
                HStack(spacing: 14) {
                    Button(action: session.decrement) {
                        Image(systemName: "minus")
                    }
                    .buttonStyle(StepperButtonStyle())

                    VStack(spacing: 0) {
                        Text("\(session.count)")
                            .font(.system(size: 30, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                        Text("ADET")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(EC.med)
                    }
                    .frame(minWidth: 46)

                    Button(action: session.increment) {
                        Image(systemName: "plus")
                    }
                    .buttonStyle(StepperButtonStyle())
                }

                // doneness picker
                HStack(spacing: 6) {
                    ForEach(Doneness.allCases) { d in
                        Button {
                            session.doneness = d
                        } label: {
                            Text(d.rawValue)
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(session.doneness == d ? .white : EC.med)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 6)
                                .background(
                                    Group {
                                        if session.doneness == d {
                                            RoundedRectangle(cornerRadius: 10).fill(EC.gradient)
                                        } else {
                                            RoundedRectangle(cornerRadius: 10).fill(EC.cardBg)
                                        }
                                    }
                                )
                        }
                        .buttonStyle(.plain)
                    }
                }

                // recommended time
                Text("Önerilen süre · \(session.recommendedLabel)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(EC.med)

                // start
                Button(action: session.start) {
                    HStack(spacing: 6) {
                        Image(systemName: "play.fill")
                        Text("Başlat").fontWeight(.bold)
                    }
                    .font(.system(size: 15))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(RoundedRectangle(cornerRadius: 20).fill(EC.gradient))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 4)
        }
    }
}

struct StepperButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .bold))
            .foregroundColor(EC.primaryDeep)
            .frame(width: 38, height: 38)
            .background(Circle().fill(Color.white.opacity(0.9)))
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}
