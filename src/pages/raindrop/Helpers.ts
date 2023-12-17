export function times(n: number, f: () => void) {
  for (let i = 0; i < n; i++) {
    f()
  }
}

export function random(
  from: number | null = null,
  to: number | null = null,
  interpolation: ((a: number) => number) | null = null
) {
  if (from == null && to === null) {
    from = 0
    to = 1
  } else if (from != null && to == null) {
    to = from
    from = 0
  } else {
    from = 0
    to = 1
  }
  const delta = to - from

  if (interpolation == null) {
    interpolation = (n) => {
      return n
    }
  }
  return from + interpolation(Math.random()) * delta
}

export function chance(c: number) {
  return random() <= c
}
