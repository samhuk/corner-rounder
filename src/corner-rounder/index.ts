import { determinePathSegments } from './routing'
import { toSvg } from './svg'
import { RoundCornersResult, RoundCornersOptions } from './types'

export const roundCorners = (options: RoundCornersOptions): RoundCornersResult => {
  const pathSegments = determinePathSegments(options.route, options.cornerArcRadius)
  return {
    pathSegments,
    toSvg: () => toSvg(pathSegments, options.cornerArcRadius),
  }
}
