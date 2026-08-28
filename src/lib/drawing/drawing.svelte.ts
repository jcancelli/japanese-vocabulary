import type { Stroke } from "./stroke.svelte"

export class Drawing {
	private _strokes: Stroke[]

	get strokes(): ReadonlyArray<Readonly<Stroke>> {
		return this._strokes
	}

	private undoCount: number // Track undo/redo without removing elements from the stack

	get canUndo(): boolean {
		return this._strokes.length > this.undoCount
	}

	get canRedo(): boolean {
		return this.undoCount > 0
	}

	readonly element: SVGSVGElement

	constructor(element: SVGSVGElement, strokes?: Iterable<Stroke>) {
		this._strokes = $state(Array.from(strokes ?? []))
		this.undoCount = $state(0)
		this.element = element
	}

	stroke(stroke: Stroke): void {
		this.actualizeUndo()
		this._strokes.push(stroke)
		this.element.appendChild(stroke.element)
	}

	undo(): void {
		if (this.undoCount >= this._strokes.length) {
			return
		}
		this.undoCount++
		this._strokes[this._strokes.length - this.undoCount + 1].element.remove()
	}

	redo(): void {
		if (this.undoCount === 0) {
			return
		}
		this.undoCount--
		this.element.appendChild(this._strokes[this._strokes.length - this.undoCount - 1].element)
	}

	clear(): void {
		this._strokes = []
		this.undoCount = 0
		this.element.innerHTML = ""
	}

	private actualizeUndo(): void {
		if (this.undoCount === 0) {
			return
		}
		this._strokes.splice(this._strokes.length - this.undoCount)
		this.undoCount = 0
	}
}
