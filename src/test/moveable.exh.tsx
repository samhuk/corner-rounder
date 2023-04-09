import React, { useEffect, useRef } from 'react'
import exhibit, { PropModifierType, simpleNumberSliderModifier, simpleTextInputModifier } from 'exhibitor'
import { Position2D, Route } from '../corner-rounder/types'
import { roundCorners } from '../corner-rounder'

const Component = (props: {
  radius: number
  pos0: Position2D
  pos1: Position2D
  pos2: Position2D
  color: string
  lineWidth: number
}) => {
  const elRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const el = elRef.current
    if (el == null)
      return undefined

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svgEl.setAttribute('x', '0')
    svgEl.setAttribute('y', '0')
    svgEl.setAttribute('width', '700px')
    svgEl.setAttribute('height', '500px')

    const padding = 200
    const route: Route = [props.pos0, props.pos1, props.pos2]
    const modifiedRoute: Route = route.map(pos => [pos[0] + padding, pos[1] + padding])

    roundCorners({
      route: modifiedRoute,
      r: props.radius,
    }).toSvgLinesAndArcs({
      color: props.color,
      lineWidth: props.lineWidth,
    }).forEach(pathSvgEl => svgEl.appendChild(pathSvgEl))

    el.appendChild(svgEl)

    return () => {
      el.removeChild(svgEl)
    }
  }, [elRef.current, props])

  return (
    <div className="cl-quadrants" ref={elRef} />
  )
}

exhibit(Component, 'Moveable')
  .defaults({
    radius: 10,
    pos0: [0, 0],
    pos1: [50, 50],
    pos2: [100, 0],
    color: 'white',
    lineWidth: 2,
  })
  .propModifiers([
    {
      type: PropModifierType.NUMBER_SLIDER,
      label: 'pos0.x',
      min: -500,
      max: 500,
      init: p => p.pos0[0],
      apply: (newValue, props) => ({ ...props, pos0: [newValue, props.pos0[1]] }),
    },
    {
      type: PropModifierType.NUMBER_SLIDER,
      label: 'pos0.y',
      min: -500,
      max: 500,
      init: p => p.pos0[1],
      apply: (newValue, props) => ({ ...props, pos0: [props.pos0[0], newValue] }),
    },
    simpleNumberSliderModifier('radius', { min: 0, max: 100, step: 1 }),
    simpleNumberSliderModifier('lineWidth', { min: 1, max: 20, step: 1 }),
    simpleTextInputModifier('color'),
  ])
  .build()
