import { toSvgPathDParameter } from '.'
import { determinePathSegments } from '../routing'

describe('corner-rounder/svg', () => {
  describe('toSvgPathDParameter', () => {
    const fn = toSvgPathDParameter

    test('basic test', () => {
      const pathSegments = determinePathSegments([
        // "L"-shape
        [0, 0],
        [0, 50],
        [50, 50],
      ], 10)

      const result = fn(pathSegments, 10)

      expect(result).toBe('M 0 0 L -6.123233995736765e-16 40 A 10 10 0 0 0 9.999999999999998 50 L 50 50')
    })
  })
})
