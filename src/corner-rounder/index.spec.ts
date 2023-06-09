import { roundCorners } from '.'

describe('corner-rounder', () => {
  describe('roundCorners', () => {
    const fn = roundCorners

    test('empty route (invalid)', () => {
      const result = fn({ route: [], r: 10 })
      expect(result.pathSegments).toEqual([])
    })

    test('one-point route (invalid)', () => {
      const result = fn({ route: [[0, 0]], r: 10 })
      expect(result.pathSegments).toEqual([])
    })

    test('two-point route (just a straight line)', () => {
      const result = fn({ route: [[0, 0], [50, 50]], r: 10 })
      expect(result.pathSegments).toEqual([
        {
          line: [
            [0, 0],
            [50, 50],
          ],
        },
      ])
    })

    test('multiple-point route', () => {
      const result = fn({ route: [[0, 0], [50, 50], [100, 50], [150, 25]], r: 10 })
      expect(result.pathSegments).toEqual([
        {
          arc: {
            r: 10,
            sweepFlag: false,
          },
          line: [
            [0, 0],
            [47.071067811865476, 47.071067811865476],
          ],
        },
        {
          arc: {
            r: 10.000000000000002,
            sweepFlag: false,
          },
          line: [
            [54.14213562373095, 50],
            [97.63932022500211, 50],
          ],
        },
        {
          line: [
            [102.11145618000168, 48.94427190999916],
            [150, 25],
          ],
        },
      ])
    })
  })
})
