import { Line, PathSegment, Position2D } from '../types'
import { ToSvgElsOptions } from './types'

const applyToSvgElsOptionsToSvgEl = (svgEl: SVGElement, options: ToSvgElsOptions): void => {
  if (options.color != null)
    svgEl.setAttribute('stroke', options.color)
  if (options.lineWidth != null)
    svgEl.setAttribute('stroke-width', options.lineWidth.toString())
}

const createSvgLineEl = (
  line: Line,
  options: ToSvgElsOptions,
) => {
  const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  lineEl.setAttribute('x1', line[0][0].toString())
  lineEl.setAttribute('y1', line[0][1].toString())
  lineEl.setAttribute('x2', line[1][0].toString())
  lineEl.setAttribute('y2', line[1][1].toString())
  applyToSvgElsOptionsToSvgEl(lineEl, options)
  return lineEl
}

const createSvgArcEl = (
  srcPos: Position2D,
  tgtPos: Position2D,
  r: number,
  sweepFlag: boolean,
  options: ToSvgElsOptions,
): SVGElement => {
  const arcEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  arcEl.setAttribute('d', `M ${srcPos[0]} ${srcPos[1]} A ${r} ${r} 0 0 ${sweepFlag ? '1' : '0'} ${tgtPos[0]} ${tgtPos[1]}`)
  arcEl.setAttribute('fill', 'none')
  applyToSvgElsOptionsToSvgEl(arcEl, options)
  return arcEl
}

export const toSvgElParams = (pathSegments: PathSegment[]) => {

}

export const toSvgEls = (
  pathSegments: PathSegment[],
  cornerArcRadius: number,
  options: ToSvgElsOptions,
): SVGElement[] => {
  const els: SVGElement[] = []
  pathSegments.forEach((ps, i) => {
    els.push(createSvgLineEl(ps.line, options))
    if (ps.arc != null)
      els.push(createSvgArcEl(ps.line[1], pathSegments[i + 1].line[0], cornerArcRadius, ps.arc.sweepFlag, options))
  })
  return els
}

export const toSvgPathDParameter = (
  pathSegments: PathSegment[],
  cornerArcRadius: number,
) => {
  const firstPos = pathSegments[0].line[0]
  let d = `M ${firstPos[0]} ${firstPos[1]}`
  for (let i = 0; i < pathSegments.length; i += 1) {
    const pathSegment = pathSegments[i]
    const endOfThisLinePos = pathSegment.line[1]
    d += ` L ${endOfThisLinePos[0]} ${endOfThisLinePos[1]}`

    if (pathSegment.arc != null) {
      const startOfNextLinePos = pathSegments[i + 1].line[0]
      d += ` A ${cornerArcRadius} ${cornerArcRadius} 0 0 ${pathSegment.arc.sweepFlag ? '1' : '0'} ${startOfNextLinePos[0]} ${startOfNextLinePos[1]}`
    }
  }

  return d
}
