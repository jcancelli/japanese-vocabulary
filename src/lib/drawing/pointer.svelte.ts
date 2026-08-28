import { Stroke, StrokePoint, StrokeSegment } from "./stroke.svelte"

export type PointerEventListener = (e: PointerEvent) => void
export type StrokeListener = (stroke: Stroke) => void

export class Pointer {
	private _stroke: Stroke

	get stroke(): Stroke {
		return this._stroke
	}

	private _isDrawing: boolean

	get isDrawing(): boolean {
		return this._isDrawing
	}

	private readonly enterCallback: PointerEventListener
	private readonly leaveCallback: PointerEventListener
	private readonly downCallback: PointerEventListener
	private readonly upCallback: PointerEventListener
	private readonly moveCallback: PointerEventListener
	private readonly cancelCallback: PointerEventListener

	private filters: PointerFilter[]

	private strokeListeners: StrokeListener[]

	constructor() {
		this._stroke = $state(new Stroke())
		this._isDrawing = $state(false)
		this.enterCallback = this.onEnter.bind(this)
		this.leaveCallback = this.onLeave.bind(this)
		this.downCallback = this.onDown.bind(this)
		this.upCallback = this.onUp.bind(this)
		this.moveCallback = this.onMove.bind(this)
		this.cancelCallback = this.onCancel.bind(this)
		this.filters = []
		this.strokeListeners = []
	}

	addFilter(filter: PointerFilter): Pointer {
		this.filters.push(filter)
		return this
	}

	addStrokeListener(listener: StrokeListener): void {
		this.strokeListeners.push(listener)
	}

	removeStrokeListener(listener: StrokeListener): void {
		this.strokeListeners = this.strokeListeners.filter((l) => l !== listener)
	}

	attach(e: EventTarget): void {
		e.addEventListener("pointerenter", this.enterCallback as EventListener)
		e.addEventListener("pointerleave", this.leaveCallback as EventListener)
		e.addEventListener("pointerdown", this.downCallback as EventListener)
		e.addEventListener("pointerup", this.upCallback as EventListener)
		e.addEventListener("pointermove", this.moveCallback as EventListener)
		e.addEventListener("pointercancel", this.cancelCallback as EventListener)
	}

	detach(e: EventTarget): void {
		e.removeEventListener("pointerenter", this.enterCallback as EventListener)
		e.removeEventListener("pointerleave", this.leaveCallback as EventListener)
		e.removeEventListener("pointerdown", this.downCallback as EventListener)
		e.removeEventListener("pointerup", this.upCallback as EventListener)
		e.removeEventListener("pointermove", this.moveCallback as EventListener)
		e.removeEventListener("pointercancel", this.cancelCallback as EventListener)
	}

	private point(x: number, y: number, pressure: number): void {
		const point = new StrokePoint(x, y, pressure)
		let filterData: PointerFilterData = {
			point: point,
			stroke: this._stroke,
			segment:
				this._stroke.pointsCount > 0 ?
					StrokeSegment.between(point, this._stroke.lastPoint)
				:	undefined,
			discardPoint: false,
		}
		for (const filter of this.filters) {
			filterData = filter.process(filterData)
			if (filterData.discardPoint) {
				return
			}
		}
		this._stroke = filterData.stroke
		this._stroke.add(filterData.point)
	}

	private start(x: number, y: number, pressure: number): void {
		this.point(x, y, pressure)
		this._isDrawing = true
	}

	private end(x: number, y: number, pressure: number): void {
		this.point(x, y, pressure)
		this._isDrawing = false
		for (const listener of this.strokeListeners) {
			listener(this._stroke)
		}
		this._stroke = this.stroke.emptyCopy()
	}

	private onEnter(e: PointerEvent): void {
		if (!isPrimaryDown(e)) {
			return
		}
		this.start(e.offsetX, e.offsetY, e.pressure)
	}

	private onLeave(e: PointerEvent): void {
		if (!this._isDrawing) {
			return
		}
		this.end(e.offsetX, e.offsetY, e.pressure)
	}

	private onDown(e: PointerEvent): void {
		if (this._isDrawing || !isPrimaryDown(e)) {
			return
		}
		this.start(e.offsetX, e.offsetY, e.pressure)
	}

	private onUp(e: PointerEvent): void {
		if (!this._isDrawing || isPrimaryDown(e)) {
			return
		}
		this.end(e.offsetX, e.offsetY, e.pressure)
	}

	private onMove(e: PointerEvent): void {
		if (!this._isDrawing) {
			return
		}
		this.point(e.offsetX, e.offsetY, e.pressure)
	}

	private onCancel(e: PointerEvent): void {
		this._isDrawing = false
		this._stroke = this.stroke.emptyCopy()
	}
}

export interface PointerFilter {
	process(data: PointerFilterData): PointerFilterData
}

export interface PointerFilterData {
	point: StrokePoint
	stroke: Stroke
	segment?: StrokeSegment
	discardPoint: boolean
}

export class DenoiseFilter implements PointerFilter {
	private _threshold: number

	constructor(threshold: number) {
		if (threshold < 0) {
			throw new Error()
		}
		this._threshold = $state(threshold)
	}

	get threshold(): number {
		return this._threshold
	}

	set threshold(value: number) {
		if (value < 0) {
			throw new Error()
		}
		this._threshold = value
	}

	process(data: PointerFilterData): PointerFilterData {
		if (data.discardPoint || data.stroke.pointsCount === 0) {
			return data
		}
		if (data.segment!.length < this._threshold) {
			data.discardPoint = true
		}
		return data
	}
}

export function makeDenoiseFilter(threshold: number = 1): DenoiseFilter {
	return new DenoiseFilter(threshold)
}

export class CustomFilter implements PointerFilter {
	private _gain: number

	constructor(gain: number = 0.5) {
		if (gain < 0 || gain > 1) {
			throw new Error(`Invalid gain`)
		}
		this._gain = $state(gain)
	}

	get gain(): number {
		return this._gain
	}

	set gain(value: number) {
		if (value < 0 || value > 1) {
			throw new Error(`Invalid gain`)
		}
		this._gain = value
	}

	process(data: PointerFilterData): PointerFilterData {
		const { stroke, point, segment, discardPoint } = data
		if (discardPoint) {
			return data
		}
		return data
	}
}

export function makeCustomFilter(gain: number = 0): CustomFilter {
	return new CustomFilter(gain)
}

function isPrimaryDown(e: PointerEvent): boolean {
	return (e.buttons & 1) === 1
}
