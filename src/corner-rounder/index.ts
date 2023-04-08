import { determinePathSegments } from './routing'
import { toSvgPathDParameter, toSvgLineAndArcs } from './svg'
import { RoundCornersResult, RoundCornersOptions } from './types'

export const roundCorners = (options: RoundCornersOptions): RoundCornersResult => {
  const pathSegments = determinePathSegments(options.route, options.cornerArcRadius)
  return {
    pathSegments,
    toSvgLineAndArcs: _options => toSvgLineAndArcs(pathSegments, options.cornerArcRadius, _options),
    toSvgPathDParameter: () => toSvgPathDParameter(pathSegments, options.cornerArcRadius),
  }
}
