"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EnhancedTipTapEditor } from "./enhanced-tiptap-editor"
import { Eye, Code, PenTool, Save, Copy, Download, RefreshCw } from "lucide-react"

export function AdvancedEditor() {
  const [activeTab, setActiveTab] = useState("write")
  const [content, setContent] = useState(`
<h1>Documentation Guidelines</h1>

<p>Welcome to our documentation guidelines. This document outlines the best practices for creating and maintaining documentation within our platform.</p>

<h2>Core Principles</h2>

<p>When creating documentation, keep these core principles in mind:</p>

<ul>
  <li>Be clear and concise</li>
  <li>Use consistent terminology</li>
  <li>Provide examples where appropriate</li>
  <li>Consider the user's perspective</li>
</ul>

<h2>Formatting Standards</h2>

<p>Use the following formatting standards to ensure consistency across all documentation:</p>

<h3>Code Examples</h3>

<pre><code>// Example code block
function exampleFunction() {
  console.log("This is an example");
  return true;
}</code></pre>

<h3>Notes and Warnings</h3>

<blockquote>
  <p><strong>Note:</strong> This is an important note that users should be aware of.</p>
</blockquote>

<h2>Review Process</h2>

<p>All documentation should go through the following review process:</p>

<ol>
  <li>Initial draft creation</li>
  <li>Peer review</li>
  <li>Technical accuracy verification</li>
  <li>Editorial review</li>
  <li>Final approval</li>
</ol>

<p>For more information, please refer to the <a href="#">Documentation Style Guide</a>.</p>
  `)
  const [htmlContent, setHtmlContent] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleContentChange = (html: string) => {
    setContent(html)
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setShowSaveSuccess(true)

      setTimeout(() => {
        setShowSaveSuccess(false)
      }, 2000)
    }, 1000)
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(content)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "documentation.html"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full pulse"></div>
          <span className="text-sm text-indigo-300">Auto-saving enabled</span>
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

