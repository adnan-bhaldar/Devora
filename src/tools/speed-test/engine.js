// The measuring is done by Cloudflare's open-source speed test library. It sends test data to and from
// speed.cloudflare.com and times it. This file holds the settings we give it and a few small helpers.

// Same steps as the library's own default, but grouped (ping, then all downloads, then all uploads) so the
// screen moves through the stages in a clear order. A direction stops early once a request takes over a second,
// so a slow connection uses far less data than a fast one.
export const MEASUREMENTS = [
    { type: 'latency', numPackets: 1 },
    { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },
    { type: 'latency', numPackets: 20 },
    { type: 'download', bytes: 1e5, count: 9 },
    { type: 'download', bytes: 1e6, count: 8 },
    { type: 'download', bytes: 1e7, count: 6 },
    { type: 'download', bytes: 2.5e7, count: 4 },
    { type: 'download', bytes: 1e8, count: 3 },
    { type: 'download', bytes: 2.5e8, count: 2 },
    { type: 'upload', bytes: 1e5, count: 8 },
    { type: 'upload', bytes: 1e6, count: 6 },
    { type: 'upload', bytes: 1e7, count: 4 },
    { type: 'upload', bytes: 2.5e7, count: 4 },
    { type: 'upload', bytes: 5e7, count: 3 },
]

export const ENGINE_OPTIONS = {
    autoStart: false,
    measurements: MEASUREMENTS,
    // The library reports finished tests to Cloudflare unless this is null. We do not want that.
    logAimApiUrl: null,
    logMeasurementApiUrl: null,
}

// Speeds come from the engine in bits per second. `ticks` are the numbers printed around the dial.
export const UNITS = [
    { value: 'mbps', label: 'Mbps', perBit: 1e-6, max: 1000, ticks: [0, 5, 10, 25, 50, 100, 250, 500, 1000] },
    { value: 'mbs', label: 'MB/s', perBit: 1 / 8e6, max: 125, ticks: [0, 1, 2, 5, 10, 25, 50, 100] },
]

export const speedIn = (unit, bitsPerSecond) => (bitsPerSecond == null ? null : bitsPerSecond * unit.perBit)

// Where a value sits on the dial, from 0 to 1. The dial is not linear: slow speeds get more room, because
// the difference between 5 and 50 matters more to most people than the difference between 500 and 545.
export const dialFraction = (unit, value) => Math.min(1, Math.log1p(Math.max(0, value)) / Math.log1p(unit.max))

export function formatSpeed(value) {
    if (value == null) return '—'
    if (value >= 100) return value.toFixed(0)
    if (value >= 10) return value.toFixed(1)
    return value.toFixed(2)
}

export function formatMs(value, decimals = 0) {
    return value == null ? '—' : value.toFixed(decimals)
}

const number = (read) => {
    try {
        const value = read()
        return Number.isFinite(value) ? value : null
    } catch {
        return null
    }
}

const list = (read) => {
    try {
        return (read() ?? []).filter(Number.isFinite)
    } catch {
        return []
    }
}

export const EMPTY_LIVE = {
    download: null,
    upload: null,
    ping: null,
    jitter: null,
    downloadLatency: null,
    uploadLatency: null,
    downloadPoints: [],
    uploadPoints: [],
    pingPoints: [],
}

// Reads what has been measured so far. Anything not measured yet is null (or an empty list).
export function readResults(results) {
    return {
        download: number(() => results.getDownloadBandwidth()),
        upload: number(() => results.getUploadBandwidth()),
        ping: number(() => results.getUnloadedLatency()),
        jitter: number(() => results.getUnloadedJitter()),
        downloadLatency: number(() => results.getDownLoadedLatency()),
        uploadLatency: number(() => results.getUpLoadedLatency()),
        downloadPoints: list(() => results.getDownloadBandwidthPoints().map((point) => point.bps)),
        uploadPoints: list(() => results.getUploadBandwidthPoints().map((point) => point.bps)),
        pingPoints: list(() => results.getUnloadedLatencyPoints()),
    }
}