import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/users/$id')({
  GET: () => {
    return json({ message: 'Hello "/api/users/id$"!' })
  },
})
