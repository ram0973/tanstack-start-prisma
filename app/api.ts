// The entry handler, similar to client and ssr, handles the API incoming requests and routes them to the appropriate API route handler
import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from "@tanstack/react-start/api";

export default createStartAPIHandler(defaultAPIFileRouteHandler);
