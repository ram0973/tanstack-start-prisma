import { Button } from '@react-email/components'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

// Определяем поддерживаемые типы для полей ввода
type InputFieldType = string | number | readonly string[] | undefined

export const FormPasswordInput = <T extends Record<string, unknown>>({
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
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<div className="relative flex w-full items-center justify-end">
								<Input
									className="mt-1"
									type={isPasswordVisible ? "text" : "password"}
									placeholder={placeholder} {...props} {...field}
									value={field.value as InputFieldType ?? ''} />
								<Button
									className="absolute mr-2 h-3 w-6 rounded-full"
									type="button"
									tabIndex={-1}
									onClick={(e) => {
										e.preventDefault();
										setIsPasswordVisible(!isPasswordVisible);
									}}
								>
									{isPasswordVisible ? <EyeIcon size={18} /> : <EyeOffIcon size={18}/>}
								</Button>
							</div>

						</FormControl>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
}
