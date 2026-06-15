let counter = 100

export function genId(prefix = 'id') {
  return `${prefix}-${++counter}`
}
