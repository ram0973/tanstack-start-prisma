import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from 'crypto'
import { writeFileSync } from 'fs'
import { join } from 'path'
//import z from "zod";
import fs from 'node:fs'

// const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
// const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// const FileSchema = z.object({
//   name: z.string(),
//   type: z.string().refine(type => ALLOWED_FILE_TYPES.includes(type), {
//     message: 'Unsupported file type'
//   }),
//   size: z.number().max(MAX_FILE_SIZE, {
//     message: 'File size must be less than 4MB'
//   }),
//   arrayBuffer: z.instanceof(ArrayBuffer)
// })

export const uploadImage = createServerFn({ method: "POST" })
.validator((data: FormData) => {
    const file = data.get("file") as File | null;
    if (!file) {
      throw new Error("File is required");
    }

    return { file };
  })
.handler(async (ctx) => {
  try {
    // 1. Получаем файл из FormData
    const file = ctx.data.file as File | null
    if (!file) {
      return {
        status: false,
        error: 'No file provided'
      }
    }

    // 2. Валидация размера (макс 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return {
        status: false,
        error: 'File too large (max 100MB)'
      }
    }
		
    // 3. Генерируем уникальный ID
    const fileId = randomUUID()
    const fileName = `${fileId}_${file.name}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, fileName)
		const duration = 0

    // 4. Создаем директорию, если не существует
    await fs.promises.mkdir(uploadDir, { recursive: true })

    // 5. Сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer())
    writeFileSync(filePath, buffer)

    // 6. Рассчитываем дату истечения
    const expires = new Date()
    expires.setHours(expires.getHours() + Math.min(24, Math.max(1, duration)))

    // 7. Возвращаем ответ в формате TMPFiles.org
    return {
      status: true,
      data: {
        url: `http://localhost:8888/uploads/${fileName}`,
        id: fileId,
        name: file.name,
        size: file.size,
				expires: expires.toISOString()
      }
    }
  } catch (error) {
    return {
      status: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
});
