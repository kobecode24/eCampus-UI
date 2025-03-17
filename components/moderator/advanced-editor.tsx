"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedTipTapEditor } from "./enhanced-tiptap-editor"
import { Eye, Code, PenTool, Save, Copy, Download, RefreshCw } from "lucide-react"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { toast } from "@/components/ui/use-toast"

export function AdvancedEditor() {
  const [activeTab, setActiveTab] = useState("write")
  const [content, setContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  
  // Connect to documentation store
  const { selectedSection, updateSection } = useDocumentationStore()

  // Load content when selected section changes
  useEffect(() => {
    if (selectedSection?.content) {
      setContent(selectedSection.content)
    }
  }, [selectedSection])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContentChange = (html: string) => {
    setContent(html)
  }

  const handleSave = async () => {
    if (!selectedSection?.id) {
      toast({
        title: "Error",
        description: "No section selected to save",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)

    try {
      await updateSection(selectedSection.id, { content })
      setShowSaveSuccess(true)
      
      setTimeout(() => {
        setShowSaveSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to save section:", error)
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Success",
      description: "HTML copied to clipboard",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = selectedSection?.title 
      ? `${selectedSection.title.toLowerCase().replace(/\s+/g, '-')}.html` 
      : "documentation.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isMounted) {
    return (
      <div className="h-64 w-full bg-indigo-900/20 border border-indigo-500/30 rounded-md flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-300">Loading editor...</p>
        </div>
      </div>
    )
  }

  // If no section is selected, show placeholder
  if (!selectedSection) {
    return (
      <div className="h-96 w-full bg-indigo-900/20 border border-indigo-500/30 rounded-md flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-xl font-medium text-indigo-300 mb-2">No section selected</h3>
          <p className="text-indigo-200 opacity-70">
            Select a section from the sidebar to edit its content.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full pulse"></div>
          <span className="text-sm text-indigo-300">Auto-saving enabled</span>
          {selectedSection && (
            <span className="text-sm text-indigo-200 ml-4">
              Editing: <span className="font-medium">{selectedSection.title}</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyHtml}
            className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50 hover:text-white animated-button"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy HTML
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50 hover:text-white animated-button"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white animated-button ${showSaveSuccess ? "success-animation active" : ""}`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : showSaveSuccess ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="glass-panel border-indigo-500/30 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-indigo-500/30 px-4 bg-indigo-900/30">
            <TabsList className="bg-transparent border-b-0 h-12">
              <TabsTrigger
                value="write"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none h-12 px-4 text-indigo-300 data-[state=active]:text-white animated-button"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none h-12 px-4 text-indigo-300 data-[state=active]:text-white animated-button"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none h-12 px-4 text-indigo-300 data-[state=active]:text-white animated-button"
              >
                <Code className="h-4 w-4 mr-2" />
                HTML
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="write" className="m-0">
              <div className="p-0">
                <EnhancedTipTapEditor content={content} onChange={handleContentChange} />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="m-0">
              <div
                className="p-6 prose prose-invert max-w-none custom-scrollbar"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </TabsContent>

            <TabsContent value="code" className="m-0">
              <div className="p-4 bg-indigo-950/50 text-indigo-300 font-mono text-sm overflow-auto h-[500px] custom-scrollbar">
                <pre>{content}</pre>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

