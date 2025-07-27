import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import AdminBar from "@/components/admin/admin-bar"
import AdminLayoutWrapper from "@/components/admin/admin-layout-wrapper"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Desa Slorok",
  description: "Website resmi Desa Slorok - Desa yang maju, mandiri, dan sejahtera",
  icons: {
    icon: "/assets/img/logo.png",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <AuthProvider>
            <AdminBar />
            <AdminLayoutWrapper>
              {children}
            </AdminLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
