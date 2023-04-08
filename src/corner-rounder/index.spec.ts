import { roundCorners } from '.'

describe('corner-rounder', () => {
  describe('roundCorners', () => {
    const fn = roundCorners

    test('empty route (invalid)', () => {
      const result = fn({ route: [], cornerArcRadius: 10 })
      expect(result.pathSegments).toEqual([])
    })

    test('one-point route (invalid)', () => {
      const result = fn({ route: [[0, 0]], cornerArcRadius: 10 })
      expect(result.pathSegments).toEqual([])
    })

    test('two-point route (just a straight line)', () => {
      const result = fn({ route: [[0, 0], [50, 50]], cornerArcRadius: 10 })
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
      const result = fn({ route: [[0, 0], [50, 50], [100, 50], [150, 25]], cornerArcRadius: 10 })
      expect(result.pathSegments).toEqual([
        {
          line: [
            [0, 0],
            [50, 50],
          ],
        },
      ])
    })
  })
})
