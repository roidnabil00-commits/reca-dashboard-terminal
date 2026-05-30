/**
 * Extracts the Google Drive File ID from various sharing link formats.
 * Supports: /file/d/FILE_ID/, /open?id=FILE_ID, /uc?id=FILE_ID
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null

  // Pattern: /file/d/FILE_ID/
  const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/
  const fileMatch = url.match(filePattern)
  if (fileMatch) return fileMatch[1]

  // Pattern: ?id=FILE_ID or &id=FILE_ID
  const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/
  const idMatch = url.match(idPattern)
  if (idMatch) return idMatch[1]

  // Pattern: /d/FILE_ID
  const shortPattern = /\/d\/([a-zA-Z0-9_-]+)/
  const shortMatch = url.match(shortPattern)
  if (shortMatch) return shortMatch[1]

  return null
}

/**
 * Converts a Google Drive sharing link into an embeddable preview URL.
 */
export function getDrivePreviewUrl(driveLink: string): string | null {
  const fileId = extractDriveFileId(driveLink)
  if (!fileId) return null
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Converts a Google Drive sharing link into a thumbnail URL.
 */
export function getDriveThumbnailUrl(driveLink: string): string | null {
  const fileId = extractDriveFileId(driveLink)
  if (!fileId) return null
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}
