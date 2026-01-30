export function resolvePath(path: string) {
  if (path === '') return `${import.meta.env.BASE_URL}/assets/AssetError.svg`
  return `${import.meta.env.BASE_URL}/${path}`
}