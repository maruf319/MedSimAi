import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "MedSimAI",
  description: "AI-powered clinical simulation platform for medical students to practice patient consultations, clinical reasoning, and diagnosis.",
};

// Applies the saved theme before the first paint (dark when nothing is saved)
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("msai-theme");document.documentElement.setAttribute("data-theme",t==="light"||t==="dark"?t:"dark")}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex h-dvh overflow-hidden bg-bg font-sans text-ink">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
