'use client'

import type { BlockNoteEditor } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useEffect, useState } from "react"

interface BlockNoteEditorProps {
	editor: BlockNoteEditor | null
	className?: string
}

export function BlockNoteTextEditor({
	editor,
	className
}: BlockNoteEditorProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted || !editor) {
		return <div className={className}>Loading editor...</div>
	}

	return (
		<BlockNoteView
			editor={editor}
			className={className}
			formattingToolbar
			filePanel
			theme="light" //TODO: program
		/>
	)
}