import { determinePathSegments } from './routing'
import { toSvgPathDParameter, toSvgEls } from './svg'
import { RoundCornersResult, RoundCornersOptions } from './types'

export const roundCorners = (options: RoundCornersOptions): RoundCornersResult => {
  const pathSegments = determinePathSegments(options.route, options.cornerArcRadius)
  return {
    pathSegments,
    toSvgEls: _options => toSvgEls(pathSegments, options.cornerArcRadius, _options),
    toSvgPathDParameter: () => toSvgPathDParameter(pathSegments, options.cornerArcRadius),
  }
}
