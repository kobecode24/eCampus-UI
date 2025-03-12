"use client"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlock from "@tiptap/extension-code-block"
import { useState, useEffect } from "react"
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
} from "lucide-react"

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  editable?: boolean
}

export function TipTapEditor({ content, onChange, editable = true }: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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
  })

  // Handle link insertion
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
  }

  // Handle image insertion
  const addImage = () => {
    if (!editor) return

    const url = window.prompt("Image URL")
    if (!url) return

    editor.chain().focus().setImage({ src: url }).run()
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

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-editor">
      {editable && (
        <div className="tiptap-toolbar bg-indigo-900/30 border border-indigo-500/30 p-2 rounded-t-md flex flex-wrap gap-1 mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive("bold") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive("italic") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${editor.isActive("heading", { level: 1 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${editor.isActive("heading", { level: 2 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${editor.isActive("heading", { level: 3 }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${editor.isActive("bulletList") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${editor.isActive("orderedList") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`${editor.isActive("link") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${editor.isActive("codeBlock") ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="text-indigo-300 hover:bg-indigo-800/50 hover:text-white"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="border-r border-indigo-500/30 mx-1 h-6"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`${editor.isActive({ textAlign: "left" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`${editor.isActive({ textAlign: "center" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`${editor.isActive({ textAlign: "right" }) ? "bg-indigo-700/50" : "bg-transparent"} text-indigo-300 hover:bg-indigo-800/50 hover:text-white`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <div className="border-r border-indigo-500/30 mx-1 h-6"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="text-indigo-300 hover:bg-indigo-800/50 hover:text-white disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="text-indigo-300 hover:bg-indigo-800/50 hover:text-white disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className={`bg-white rounded-${editable ? "b" : ""}-md overflow-hidden`}>
        <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[400px] focus:outline-none" />
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-indigo-900 text-white rounded-md shadow-lg flex p-1 gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive("bold") ? "bg-indigo-700" : "bg-transparent"} text-white hover:bg-indigo-800 h-8 w-8 p-0`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive("italic") ? "bg-indigo-700" : "bg-transparent"} text-white hover:bg-indigo-800 h-8 w-8 p-0`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`${editor.isActive("link") ? "bg-indigo-700" : "bg-transparent"} text-white hover:bg-indigo-800 h-8 w-8 p-0`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`${editor.isActive("code") ? "bg-indigo-700" : "bg-transparent"} text-white hover:bg-indigo-800 h-8 w-8 p-0`}
          >
            <Code className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          min-height: 400px;
          outline: none;
        }
        
        .tiptap-editor .ProseMirror p {
          margin-bottom: 1em;
        }
        
        .tiptap-editor .ProseMirror h1 {
          font-size: 1.75em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }
        
        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }
        
        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }
        
        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .tiptap-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        
        .tiptap-editor .ProseMirror blockquote {
          border-left: 3px solid #cbd5e1;
          padding-left: 1em;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }
        
        .tiptap-editor .ProseMirror pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 0.75em 1em;
          border-radius: 0.375em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .tiptap-editor .ProseMirror code {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
        }
      `}</style>
    </div>
  )
}

