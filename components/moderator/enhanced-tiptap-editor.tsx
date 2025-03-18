"use client"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlock from "@tiptap/extension-code-block"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  Code,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import { EnhancedEditorStyles } from "./enhanced-editor-styles"

interface EnhancedTipTapEditorProps {
  content: string
  onChange: (html: string) => void
  editable?: boolean
}

export function EnhancedTipTapEditor({ content, onChange, editable = true }: EnhancedTipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isFloatingToolbar, setIsFloatingToolbar] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [editorFocused, setEditorFocused] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
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
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onFocus: () => {
      setEditorFocused(true)
    },
    onBlur: () => {
      setEditorFocused(false)
    },
  })

  // Handle link insertion with animation
  const addLink = () => {
    if (!editor) return

    const url = window.prompt("URL")
    if (!url) return

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()

    // Show success animation
    setShowSuccessAnimation(true)
    setTimeout(() => setShowSuccessAnimation(false), 1000)
  }

  // Handle image insertion
  const addImage = () => {
    if (!editor) return

    const url = window.prompt("Image URL")
    if (!url) return

    editor.chain().focus().setImage({ src: url }).run()

    // Show success animation
    setShowSuccessAnimation(true)
    setTimeout(() => setShowSuccessAnimation(false), 1000)
  }

  // Toggle floating toolbar
  const toggleFloatingToolbar = () => {
    setIsFloatingToolbar(!isFloatingToolbar)
  }

  // Calculate toolbar position based on mouse position
  useEffect(() => {
    if (!isFloatingToolbar || !toolbarRef.current) return

    const toolbar = toolbarRef.current
    const toolbarRect = toolbar.getBoundingClientRect()
    const editorRect = editorRef.current?.getBoundingClientRect()

    if (!editorRect) return

    let x = mousePosition.x - toolbarRect.width / 2
    let y = mousePosition.y - toolbarRect.height - 20

    // Keep toolbar within editor bounds
    x = Math.max(editorRect.left, Math.min(x, editorRect.right - toolbarRect.width))
    y = Math.max(editorRect.top, Math.min(y, editorRect.bottom - toolbarRect.height))

    toolbar.style.transform = `translate(${x}px, ${y}px)`
  }, [mousePosition, isFloatingToolbar])

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

  if (!editor) {
    return null
  }

  return (
    <div className="enhanced-editor" ref={editorRef}>
      <EnhancedEditorStyles />

      {editable && (
        <>
          <div
            className={`tiptap-toolbar glass-panel p-2 rounded-t-md flex flex-wrap gap-1 mb-1 transition-all duration-300 ${
              isFloatingToolbar ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`animated-button ${editor.isActive("bold") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`animated-button ${editor.isActive("italic") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`animated-button ${editor.isActive("heading", { level: 1 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`animated-button ${editor.isActive("heading", { level: 2 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`animated-button ${editor.isActive("heading", { level: 3 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`animated-button ${editor.isActive("bulletList") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`animated-button ${editor.isActive("orderedList") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addLink}
              className={`animated-button ${editor.isActive("link") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`animated-button ${editor.isActive("codeBlock") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="animated-button text-indigo-300 hover:bg-indigo-800/50 hover:text-white"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <div className="border-r border-indigo-500/30 mx-1 h-6"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`animated-button ${editor.isActive({ textAlign: "left" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`animated-button ${editor.isActive({ textAlign: "center" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`animated-button ${editor.isActive({ textAlign: "right" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <div className="border-r border-indigo-500/30 mx-1 h-6"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="animated-button text-indigo-300 hover:bg-indigo-800/50 hover:text-white disabled:opacity-50"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="animated-button text-indigo-300 hover:bg-indigo-800/50 hover:text-white disabled:opacity-50"
            >
              <Redo className="h-4 w-4" />
            </Button>
            <div className="border-r border-indigo-500/30 mx-1 h-6"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFloatingToolbar}
              className="animated-button text-indigo-300 hover:bg-indigo-800/50 hover:text-white ml-auto"
              data-tooltip="Toggle floating toolbar"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {isFloatingToolbar && (
            <div
              ref={toolbarRef}
              className="tiptap-floating-toolbar glass-panel p-2 rounded-md flex flex-wrap gap-1 absolute z-10 transition-all duration-300 shadow-lg"
              style={{ position: "fixed", pointerEvents: "auto" }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`animated-button ${editor.isActive("bold") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`animated-button ${editor.isActive("italic") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={addLink}
                className={`animated-button ${editor.isActive("link") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFloatingToolbar}
                className="animated-button text-indigo-300 hover:bg-indigo-800/50 hover:text-white ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <div
        className={`glass-panel rounded-${editable ? "b" : ""}-md overflow-hidden ${editorFocused ? "focused" : ""}`}
      >
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[400px] focus:outline-none custom-scrollbar cursor-text"
        />
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="glass-panel text-white rounded-md shadow-lg flex p-1 gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`animated-button ${editor.isActive("bold") ? "bg-indigo-700/50" : "bg-transparent"} text-white hover:bg-indigo-800/50 h-8 w-8 p-0`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`animated-button ${editor.isActive("italic") ? "bg-indigo-700/50" : "bg-transparent"} text-white hover:bg-indigo-800/50 h-8 w-8 p-0`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`animated-button ${editor.isActive("link") ? "bg-indigo-700/50" : "bg-transparent"} text-white hover:bg-indigo-800/50 h-8 w-8 p-0`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`animated-button ${editor.isActive("code") ? "bg-indigo-700/50" : "bg-transparent"} text-white hover:bg-indigo-800/50 h-8 w-8 p-0`}
          >
            <Code className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {/* Success Animation */}
      <div
        className={`success-animation fixed inset-0 pointer-events-none z-50 flex items-center justify-center ${showSuccessAnimation ? "active" : ""}`}
      >
      </div>
    </div>
  )
}

