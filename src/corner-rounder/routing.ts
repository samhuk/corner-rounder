import { Line, PathSegment, Position2D, Route } from './types'

const getIntermediatePathSegment = (
  pos0: Position2D,
  pos1: Position2D,
  pos2: Position2D,
  r: number,
): { pathSegment: PathSegment, nextPos0: Position2D } => {
  const pi = Math.PI
  const x0 = pos0[0]
  const y0 = pos0[1]
  const x1 = pos1[0]
  const y1 = pos1[1]
  const x2 = pos2[0]
  const y2 = pos2[1]

  // Changes in x and y of each of the 3 points
  const dx01 = x1 - x0
  const dy01 = y1 - y0
  const dx12 = x2 - x1
  const dy12 = y2 - y1
  const dx02 = x2 - x0
  const dy02 = y2 - y0

  // Triangle side-lengths
  const d01 = Math.sqrt(dx01 ** 2 + dy01 ** 2)
  const d12 = Math.sqrt(dx12 ** 2 + dy12 ** 2)
  const d02 = Math.sqrt(dx02 ** 2 + dy02 ** 2)

  // Key results
  const A = Math.acos((d01 ** 2 + d12 ** 2 - d02 ** 2) / (2 * d01 * d12))
  const BHalved = (pi - A) / 2
  const w = r * Math.tan(BHalved)

  // Angle from x-axis of each line
  const theta01 = Math.atan2(dy01, dx01)
  const theta12 = Math.atan2(dy12, dx12)

  // Walk-back and walk-forward points
  const x1wb = x1 - (w * Math.cos(theta01))
  const y1wb = y1 - (w * Math.sin(theta01))
  const x1wf = x1 + (w * Math.cos(theta12))
  const y1wf = y1 + (w * Math.sin(theta12))

  // Gradient of each lines
  const m01 = dx01 !== 0 ? dy01 / dx01 : Infinity
  const m12 = dx12 !== 0 ? dy12 / dx12 : Infinity

  // Walked-back line
  const line: Line = [pos0, [x1wb, y1wb]]

  // If the gradients of the two lines are equal, then no arc is needed or possible.
  if (m01 === m12)
    return { pathSegment: { line }, nextPos0: pos1 }

  // -- Determine the center point of the arc
  let xc = 0
  let yc = 0
  /* The first four conditionals below are determined by taking the limit of the full expression in the last conditional
   * when m01 or m12 tends to 0 or infinity. We can't avoid doing this because computers don't understand such things,
   * and will fall over producing NaN and other nonsense.
   */
  // If the first line segment is perfectly horizontal
  if (m01 === 0) {
    xc = x1wb
    yc = (1 / m12) * (x1wf - x1wb) + y1wf
  }
  // If the second line segment is perfectly horizontal
  else if (m12 === 0) {
    xc = x1wf
    yc = (1 / m01) * (x1wb - x1wf) + y1wb
  }
  // If the first line segment is perfectly vertical
  else if (m01 === Infinity) {
    xc = x1wf + (m12 * (y1wf - y1wb))
    yc = y1wb
  }
  // If the second line segment is perfectly vertical
  else if (m12 === Infinity) {
    xc = x1wb - (m01 * (y1wf - y1wb))
    yc = y1wf
  }
  else {
    xc = ((m01 * m12) / (m01 - m12)) * ((x1wf / m12) - (x1wb / m01) + y1wf - y1wb)
    yc = (1 / m12) * (x1wf - xc) + y1wf
  }

  // We need to tell the SVG path engine which arc to draw depending on two things:
  // 1) If we are going clockwise or anti-clockwise
  // 2) If atan2 gives us an angle change of greater than 180 or less than -180
  const arcStartAngle = Math.atan2(y1wb - yc, x1wb - xc)
  const arcEndAngle = Math.atan2(y1wf - yc, x1wf - xc)
  const arcAngleChangeInitial = arcEndAngle - arcStartAngle
  const arcAngleChange = arcAngleChangeInitial <= -pi
    ? -arcAngleChangeInitial - pi
    : arcAngleChangeInitial >= pi
      ? -arcAngleChangeInitial + pi
      : arcAngleChangeInitial
  const sweepFlag = arcAngleChange > 0

  return {
    pathSegment: { line, arc: { sweepFlag } },
    nextPos0: [x1wf, y1wf],
  }
}

export const determinePathSegments = (route: Route, cornerArcRadius: number): PathSegment[] => {
  // Cannot have a route with less than 2 points
  if (route.length < 2)
    return []

  // If the route is only 2 points, then it is just a straight line
  if (route.length === 2) {
    return [{
      line: [route[0], route[1]],
    }]
  }

  const pathSegments: PathSegment[] = []
  const lenMinusTwo = route.length - 2
  let pos0: Position2D = route[0]

  for (let i = 0; i < lenMinusTwo; i += 1) {
    const { pathSegment, nextPos0 } = getIntermediatePathSegment(pos0, route[i + 1], route[i + 2], cornerArcRadius)
    pos0 = nextPos0
    pathSegments.push(pathSegment)
  }

  // Add on the last line segment (which can never have an arc after it)
  const lastPos = route[route.length - 1]
  pathSegments.push({ line: [pos0, lastPos] })

  return pathSegments
}
