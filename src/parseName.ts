/** `# Abc...` -> `Abc` */

export const parseName = (text: string) => {
  const heading = text.split('\n').at(0)?.trim() ?? ''
  const match = heading.match(/^#\s*(.*)/)
  return match ? match[1] : ''
}
