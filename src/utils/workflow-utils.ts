/**
 * Sanitize workflow data before saving to the database
 * This removes any non-serializable objects like functions or class instances
 */
export const sanitizeWorkflowData = (data: any): any => {
  // Return null or primitive values as is
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== "object") {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeWorkflowData(item));
  }

  // Handle Objects - create a new object with sanitized properties
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip functions and symbols
    if (typeof value === "function" || typeof value === "symbol") {
      continue;
    }

    // Handle DOM elements, File objects, etc.
    if (
      value instanceof Element ||
      value instanceof File ||
      // Check for other non-serializable browser APIs
      (typeof window !== "undefined" &&
        (value instanceof Blob ||
          value instanceof FileList ||
          value instanceof ImageData))
    ) {
      // For File objects, we might want to store some metadata
      if (value instanceof File) {
        sanitized[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
          lastModified: value.lastModified,
        };
      } else {
        // Skip other non-serializable objects
        continue;
      }
    } else if (value === undefined) {
      // Skip undefined values
      continue;
    } else if (typeof value === "object") {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeWorkflowData(value);
    } else {
      // Pass through primitive values
      sanitized[key] = value;
    }
  }

  return sanitized; // Return the sanitized object
};
