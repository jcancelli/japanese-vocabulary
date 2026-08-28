export class StrokePoint implements Vec2 {
	readonly x: number
	readonly y: number
	readonly pressure: number
	readonly timestamp: number

	constructor(x: number, y: number, pressure: number, timestamp: number = Date.now()) {
		this.x = x
		this.y = y
		this.pressure = pressure
		this.timestamp = timestamp
	}
}

export class StrokeSegment {
	readonly first: StrokePoint
	readonly last: StrokePoint

	constructor(a: StrokePoint, b: StrokePoint) {
		if (a.timestamp > b.timestamp) {
			this.first = b
			this.last = a
		} else {
			this.first = a
			this.last = b
		}
	}

	get duration(): number {
		return this.last.timestamp - this.first.timestamp
	}

	get length(): number {
		return Math.hypot(this.last.x - this.first.x, this.last.y - this.first.y)
	}

	get velocity(): Vec2 {
		const duration = this.duration
		return {
			x: (this.last.x - this.first.x) / duration,
			y: (this.last.y - this.first.y) / duration,
		}
	}

	get speed(): number {
		return this.length / this.duration
	}

	accelerationSince(previous: StrokeSegment): Vec2 {
		if (previous.last !== this.first) {
			throw new Error()
		}
		const prevVelocity = previous.velocity
		const currentVelocity = this.velocity
		const duration = this.duration
		return {
			x: (currentVelocity.x - prevVelocity.x) / duration,
			y: (currentVelocity.y - prevVelocity.y) / duration,
		}
	}

	static between(a: StrokePoint, b: StrokePoint): StrokeSegment {
		return new StrokeSegment(a, b)
	}
}

export class Stroke implements Iterable<StrokePoint> {
	private _points: StrokePoint[]

	get points(): ReadonlyArray<StrokePoint> {
		return this._points
	}

	readonly element: SVGPathElement

	private svgPath: string

	private _color: string

	get color(): string {
		return this._color
	}

	set color(value: string) {
		this.element.setAttribute("stroke", value)
		this._color = value
	}

	private _width: number

	get width(): number {
		return this._width
	}

	set width(value: number) {
		this.element.setAttribute("stroke-width", value.toString())
		this._width = value
	}

	get firstPoint(): StrokePoint {
		return this._points[0]
	}

	get lastPoint(): StrokePoint {
		return this._points[this._points.length - 1]
	}

	get pointsCount(): number {
		return this._points.length
	}

	constructor(points: Iterable<StrokePoint> = [], color: string = "#000000", width: number = 1) {
		this._points = $state(Array.from(points))

		this.element = document.createElementNS("http://www.w3.org/2000/svg", "path")
		this.element.id = crypto.randomUUID()
		this.element.setAttribute("fill", "none")
		this.element.setAttribute("stroke-linecap", "round")

		this._color = $state(color)
		this.element.setAttribute("stroke", color)

		this._width = $state(width)
		this.element.setAttribute("stroke-width", width.toString())

		if (this._points.length > 0) {
			const commands: string[] = [
				"M",
				this.firstPoint.x.toString(),
				this.firstPoint.y.toString(),
			]
			for (let i = 1; i < this.pointsCount; i++) {
				const p = this._points[i]
				commands.push("L", p.x.toString(), p.y.toString())
			}
			this.svgPath = commands.join(" ")
		} else {
			this.svgPath = ""
		}
		this.element.setAttribute("d", this.svgPath)
	}

	add(point: StrokePoint): Stroke {
		this._points.push(point)
		if (this.pointsCount === 1) {
			this.svgPath = "M " + point.x.toString() + " " + point.y.toString()
		} else {
			this.svgPath += " L " + point.x.toString() + " " + point.y.toString()
		}
		this.element.setAttribute("d", this.svgPath)
		return this
	}

	get(i: number): StrokePoint {
		return i >= 0 ? this._points[i] : this._points[this._points.length + i]
	}

	slice(from?: number, to?: number): Stroke {
		from = from ?? 0
		to = to ?? this._points.length
		return new Stroke(this._points.slice(from, to))
	}

	emptyCopy(): Stroke {
		return new Stroke([], this._color, this._width)
	}

	*rangeIterator(from?: number, to?: number): Iterator<StrokePoint> {
		from = from ?? 0
		to = to ?? this._points.length
		if (to < 0) {
			to = this.pointsCount + to
		}
		for (let i = from; i < to; i++) {
			yield this._points[i]
		}
	}

	*[Symbol.iterator](): Iterator<StrokePoint> {
		for (const point of this._points) {
			yield point
		}
	}
}

export interface Vec2 {
	x: number
	y: number
}
