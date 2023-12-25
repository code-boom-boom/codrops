export function times(n: number, f: (q: number) => void) {
  for (let i = 0; i < n; i++) {
    f(i)
  }
}

export function random(
  from: number = 0,
  to: number = 1,
  interpolation: (a: number) => number = (n) => n
) {
  if (arguments.length === 1) {
    to = from
    from = 0
  }

  const delta = to - from
  return from + interpolation(Math.random()) * delta
}

export function chance(c: number) {
  return random() <= c
}
