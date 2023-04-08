/**
 * Represents a 2-dimensional coordinate, i.e `[x, y]`
 */
export type Position2D = [number, number]

export type Line = [Position2D, Position2D]

export type Route = Position2D[]

export type RoundCornersOptions = {
  route: Route
  cornerArcRadius: number
}

export type PathSegment = {
  line: Line
  arc?: {
    sweepFlag: boolean
  }
}

export type RoundCornersResult = {
  pathSegments: PathSegment[]
  toSvg: () => SVGElement[]
}
