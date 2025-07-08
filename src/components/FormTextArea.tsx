import type { ReactNode } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'

export const FormTextArea = <T extends Record<string, unknown>>({
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
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea placeholder={placeholder} {...props} {...field} value={field.value as string ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
