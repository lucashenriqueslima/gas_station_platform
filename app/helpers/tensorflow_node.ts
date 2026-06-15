import util from 'node:util'

const nodeUtil = util as Record<string, unknown>
if (typeof nodeUtil['isNullOrUndefined'] !== 'function') {
	nodeUtil['isNullOrUndefined'] = (v: unknown) => v === null || v === undefined;
}
if (typeof nodeUtil['isArray'] !== 'function') {
	nodeUtil['isArray'] = Array.isArray;
}

nodeUtil.isNullOrUndefined ??= (value: unknown) => value === null || value === undefined

await import('@tensorflow/tfjs-node')
