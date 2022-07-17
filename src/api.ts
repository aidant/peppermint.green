export const normalizeValue = <
  V extends string,
  S extends string,
  Value extends Record<V | S, number>
>(
  value: Value,
  {
    valueProperty,
    scaleProperty,
    scale,
    multiplier,
    precision,
  }: { valueProperty: V; scaleProperty: S; scale: number; multiplier?: number; precision?: number }
): Value => {
  value = Object.assign(Object.create(null), value)

  // @ts-expect-error
  value[valueProperty] = value[valueProperty] / Math.pow(10, value[scaleProperty] - scale)
  // @ts-expect-error
  value[scaleProperty] = scale

  if (typeof multiplier === 'number') {
    // @ts-expect-error
    value[valueProperty] = value[valueProperty] * multiplier
  }

  if (typeof precision === 'number') {
    // @ts-expect-error
    value[valueProperty] =
      Math.round(value[valueProperty] * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  return value
}
