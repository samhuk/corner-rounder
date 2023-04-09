import { determinePathSegments } from './routing'
import { toSvgPathDParameter, toSvgLinesAndArcs } from './svg'
import { RoundCornersResult, RoundCornersOptions } from './types'

export const roundCorners = (options: RoundCornersOptions): RoundCornersResult => {
  const pathSegments = determinePathSegments(options.route, options.r, options.overRadiusHandling ?? 'radiusSacrifice')
  return {
    pathSegments,
    toSvgLinesAndArcs: _options => toSvgLinesAndArcs(pathSegments, options.r, _options),
    toSvgPathDParameter: () => toSvgPathDParameter(pathSegments, options.r),
  }
}
