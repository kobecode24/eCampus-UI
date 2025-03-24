"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedTipTapEditor } from "./enhanced-tiptap-editor"
import { Eye, Code, PenTool, Save, Copy, Download, RefreshCw } from "lucide-react"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { toast } from "@/components/ui/use-toast"
import { EnhancedEditorStyles } from "./enhanced-editor-styles"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlock from "@tiptap/extension-code-block"
import { useTheme } from "@/contexts/theme-context"

export function AdvancedEditor() {
  const [activeTab, setActiveTab] = useState("write")
  const [content, setContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const editorKey = useRef(0) // Add a key reference to force re-render
  const { theme } = useTheme()
  
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

  // Create a read-only preview editor instance
  const previewEditor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable CodeBlock to prevent conflicts
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-indigo-950 text-indigo-300 p-4 rounded-md font-mono text-sm my-4 overflow-x-auto",
        },
      }),
    ],
    content,
    editable: false, // Read-only for preview
    immediatelyRender: false, // Fix SSR issues
  })

  // Update preview editor content when main content changes
  useEffect(() => {
    if (previewEditor && content) {
      previewEditor.commands.setContent(content)
    }
  }, [content, previewEditor])

  // Custom styles to prevent background flashes
  const customStyles = `
    <style>
      /* Make editor transition properly with theme changes */
      .enhanced-editor.preview-editor, 
      .enhanced-editor.preview-editor *,
      .preview-editor .ProseMirror,
      .preview-editor .ProseMirror *,
      .preview-editor .glass-panel,
      .preview-editor .glass-panel * {
        transition: background-color 0.2s ease, color 0.2s ease !important;
        background-color: transparent !important;
      }
      
      /* Ensure hover states don't change background */
      .preview-editor .ProseMirror:hover,
      .preview-editor .ProseMirror:focus,
      .preview-editor .ProseMirror:active,
      .preview-editor .ProseMirror *:hover,
      .preview-editor .ProseMirror *:focus,
      .preview-editor .ProseMirror *:active {
        background-color: transparent !important;
        cursor: default !important;
      }
      
      /* Set the glass panel styling for dark mode */
      .dark .preview-editor .glass-panel {
        background-color: rgba(15, 23, 42, 0.3) !important;
        backdrop-filter: blur(4px) !important;
        box-shadow: none !important;
      }
      
      /* Set the glass panel styling for light mode */
      .light .preview-editor .glass-panel {
        background-color: rgba(255, 255, 255, 0.5) !important;
        backdrop-filter: blur(4px) !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
      }
      
      /* Fix code blocks to maintain their styling */
      .dark .preview-editor pre {
        background: rgb(30 27 75) !important;
      }
      
      .light .preview-editor pre {
        background: rgb(241 245 249) !important;
      }
      
      /* Set text colors for dark and light modes */
      .dark .preview-editor .prose {
        color: #f8fafc !important;
      }
      
      .light .preview-editor .prose {
        color: #0f172a !important;
      }
      
      .preview-editor .prose {
        max-width: none !important;
      }
      
      /* Text color adjustments for dark mode */
      .dark .preview-editor h1, 
      .dark .preview-editor h2, 
      .dark .preview-editor h3, 
      .dark .preview-editor h4, 
      .dark .preview-editor h5, 
      .dark .preview-editor h6 {
        color: #f1f5f9 !important;
      }
      
      .dark .preview-editor p, 
      .dark .preview-editor li, 
      .dark .preview-editor blockquote {
        color: #e2e8f0 !important;
      }
      
      /* Selection styling that works with both modes */
      .preview-editor ::selection {
        background-color: rgba(79, 70, 229, 0.2) !important;
      }
    </style>
  `

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
          
          {/* Improved Preview tab with properly styled TipTap editor */}
          <TabsContent value="preview" className="h-full m-0 overflow-auto">
            <div className={`enhanced-editor preview-editor ${theme}`}>
              <EnhancedEditorStyles />
              <div dangerouslySetInnerHTML={{ __html: customStyles }} />
              <div className="glass-panel rounded-md overflow-hidden">
                <div className="prose prose-invert max-w-none p-6 custom-scrollbar">
                  {/* Use EditorContent for consistent rendering */}
                  {previewEditor ? (
                    <EditorContent editor={previewEditor} className="prose max-w-none" />
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      <div className="w-6 h-6 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
                      <span>Loading preview...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

