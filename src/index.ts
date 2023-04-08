/**
 * This file defines the public API of the package. Everything here will be available from
 * the top-level package name when importing as an npm package.
 *
 * E.g. `import { ... } from 'corner-rounder`
 */
import { roundCorners } from './corner-rounder'

export { roundCorners } from './corner-rounder'
export default roundCorners

export * from './types'
