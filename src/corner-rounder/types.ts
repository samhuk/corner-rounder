import { ToSvgElsOptions } from './svg/types'

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
  /**
   * An array of the rounded route's line and corner arcs
   */
  pathSegments: PathSegment[]
  /**
   * Creates a list of SVG `<line>` and `<path>` elements that represents the rounded-corners route.
   */
  toSvgLineAndArcs: (options: ToSvgElsOptions) => SVGElement[]
  /**
   * Creates elements that represents the route with rounded edges.
   */
  toSvgPathDParameter: () => string
}
