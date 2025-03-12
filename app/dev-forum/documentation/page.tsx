import { EnhancedDocumentationLayout } from "@/components/documentation/enhanced-documentation-layout"
import { ThemeProvider } from "@/contexts/theme-context"

export const metadata = {
  title: "Documentation | DevDiscussionForum",
  description: "Browse and search our comprehensive documentation",
}

export default function DocumentationPage() {
  return (
    <ThemeProvider>
      <EnhancedDocumentationLayout />
    </ThemeProvider>
  )
}

