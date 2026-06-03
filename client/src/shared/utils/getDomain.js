export const getDomain = (url) => {
  if (!url) return null
  try {
    const { hostname } = new URL(url)
    return hostname.replace('www.', '')
  } catch {
    return null
  }
}
