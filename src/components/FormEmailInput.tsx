import type { ReactNode } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

// Определяем поддерживаемые типы для полей ввода
type InputFieldType = string | number | readonly string[] | undefined

export const FormEmailInput = <T extends Record<string, unknown>>({
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
              <Input type="email" placeholder={placeholder} {...props} {...field} value={field.value as InputFieldType ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
