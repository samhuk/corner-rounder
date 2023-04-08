import { ToSvgLineAndArcsOptions } from './svg/types'

/**
 * Represents a 2D coordinate, i.e `[x, y]`
 */
export type Position2D = [x: number, y: number]

/**
 * Represents a 2D line from one given coordinate to another.
 */
export type Line = [src: Position2D, dest: Position2D]

/**
 * Represents a route in 2D space, i.e. a list of 2D vectors.
 */
export type Route = Position2D[]

export type RoundCornersOptions = {
  /**
   * The list of 2D coordinates that represents the path with corners that
   * you want to round.
   */
  route: Route
  /**
   * The radius of the arc used to round the corners of the given route.
   */
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
   * Creates a list of individual SVG `<line>` and `<path>` (arc) elements that represents the rounded-corners route.
   *
   * @example
   * import roundCorners from 'corner-rounder'
   *
   * const result = roundCorners({
   *   route: [...],
   *   cornerArcRadius: 5,
   * })
   *
   * const routeEls = result.toSvgLineAndArcs({ color: 'orange', ... })
   * const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
   * routeEls.forEach(el => svgEl.appendChild(el))
   */
  toSvgLineAndArcs: (options?: ToSvgLineAndArcsOptions) => (SVGLineElement | SVGPathElement)[]
  /**
   * Creates the SVG `<path>` element `d` parameter required to represent the rounded-corners route.
   *
   * @example
   * import roundCorners from 'corner-rounder'
   *
   * const result = roundCorners({
   *   route: [...],
   *   cornerArcRadius: 5,
   * })
   *
   * const d = result.toSvgPathDParameter() // E.g. "M 0 0 L 0 40 A 10 10 0 0 0 10 50 L 50 50"
   * const svgPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
   * svgPathEl.setAttribute('d', pathDParameter)
   */
  toSvgPathDParameter: () => string
}
