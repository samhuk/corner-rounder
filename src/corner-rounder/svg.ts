import { Line, PathSegment, Position2D } from './types'

const createSvgLineEl = (
  line: Line,
) => {
  const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  lineEl.setAttribute('x1', line[0][0].toString())
  lineEl.setAttribute('y1', line[0][1].toString())
  lineEl.setAttribute('x2', line[1][0].toString())
  lineEl.setAttribute('y2', line[1][1].toString())
  lineEl.setAttribute('stroke', '#ccc')
  lineEl.setAttribute('stroke-width', '2')
  return lineEl
}

const createSvgArcEl = (
  srcPos: Position2D,
  tgtPos: Position2D,
  r: number,
  sweepFlag: boolean,
): SVGElement => {
  const svgArcEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  svgArcEl.setAttribute('d', `M ${srcPos[0]} ${srcPos[1]} A ${r} ${r} 0 0 ${sweepFlag ? '1' : '0'} ${tgtPos[0]} ${tgtPos[1]}`)
  svgArcEl.setAttribute('fill', 'none')
  svgArcEl.setAttribute('stroke', '#ccc')
  svgArcEl.setAttribute('stroke-width', '2')
  return svgArcEl
}

export const toSvg = (
  pathSegments: PathSegment[],
  edgeCurveRadius: number,
): SVGElement[] => {
  const els: SVGElement[] = []
  pathSegments.forEach((ps, i) => {
    els.push(createSvgLineEl(ps.line))
    if (ps.arc != null)
      els.push(createSvgArcEl(ps.line[1], pathSegments[i + 1].line[0], edgeCurveRadius, ps.arc.sweepFlag))
  })
  return els
}
