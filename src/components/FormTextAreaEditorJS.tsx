import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import EditorJS from '@editorjs/editorjs'
import Paragraph from '@editorjs/paragraph'
import Header from '@editorjs/header'

export const FormTextAreaEditorJS = <T extends Record<string, unknown>>({
  form,
  label,
  name,
  placeholder,
  ...props
}: {
  form: UseFormReturn<T>
  label: ReactNode
  name: Path<T>
  placeholder: string
}) => {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const { setValue, watch } = form

  // Инициализация EditorJS
  useEffect(() => {
    if (!editorRef.current && holderRef.current) {
      const editor = new EditorJS({
        holder: holderRef.current,
        placeholder,
        tools: {
          header: Header,
          paragraph: Paragraph
        },
        data: watch(name),
        async onChange() {
          const data = await editor.save()
          setValue(name, data as any)
        }
      })

      editorRef.current = editor
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [name])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* Скрытый Textarea для react-hook-form */}
            <textarea
              {...field}
              className="hidden"
              value={JSON.stringify(field.value) || ''}
              onChange={() => {}}
            />
            {/* Контейнер для EditorJS со стилями shadcn Textarea */}
            <div
              ref={holderRef}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}