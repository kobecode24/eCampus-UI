"use client"

import { useState, useEffect, useRef } from "react"
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
  const editorKey = useRef(0) // Add a key reference to force re-render
  
  // Connect to documentation store
  const { selectedSection, updateSection } = useDocumentationStore()

  // Load content when selected section changes
  useEffect(() => {
    if (selectedSection?.content) {
      setContent(selectedSection.content)
      // Increment the key to force a re-mount of the editor component
      editorKey.current += 1
      
      // Log for debugging
      console.log("Section changed, new content:", selectedSection.content)
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
      setTimeout(() => setShowSaveSuccess(false), 3000)
      toast({
        title: "Success",
        description: "Content saved successfully"
      })
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "HTML content copied to clipboard"
    })
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedSection?.title || 'document'}.html`
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
    <Card className="w-full h-full glass-panel">
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <div className="flex justify-between items-center px-4 pt-2">
          <TabsList className="bg-indigo-800/30 border border-indigo-500/30">
            <TabsTrigger value="write" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <PenTool className="h-4 w-4 mr-2" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Code className="h-4 w-4 mr-2" />
              HTML
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {activeTab === "html" && (
              <>
                <button 
                  onClick={handleCopyHtml} 
                  className="p-1 text-indigo-300 hover:text-white hover:bg-indigo-700/30 rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleDownload} 
                  className="p-1 text-indigo-300 hover:text-white hover:bg-indigo-700/30 rounded"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`p-1 rounded flex items-center ${isSaving ? 'bg-indigo-600/50 text-gray-300' : 'text-indigo-300 hover:text-white hover:bg-indigo-700/30'}`}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : showSaveSuccess ? (
                <div className="text-green-500 flex items-center">
                  <Save className="h-4 w-4 mr-1" />
                  <span className="text-xs">Saved</span>
                </div>
              ) : (
                <Save className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <CardContent className="p-0 pt-4 h-[calc(100%-3rem)]">
          <TabsContent value="write" className="h-full m-0">
            {/* Wrap the editor in a div with the desired styling */}
            <div className="min-h-[400px] p-4">
              <EnhancedTipTapEditor 
                key={`editor-${editorKey.current}`}
                content={content} 
                onChange={handleContentChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="h-full m-0 overflow-auto p-6 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </TabsContent>
          
          <TabsContent value="html" className="h-full m-0">
            <pre className="p-6 overflow-auto text-xs h-full bg-gray-900 rounded-b-md">
              <code>{content}</code>
            </pre>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

