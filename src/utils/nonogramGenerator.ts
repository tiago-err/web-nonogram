import {GRID_BLOCKS} from "../constants";

export function generateNonogram(size: number): {grid: number[][]; lineHints: number[][]; columnHints: number[][]} {
	const grid = generateGrid(size);
	const lineHints = generateHints(grid);
	const columnHints = generateHints(transposeGrid(grid));

	return {grid, lineHints, columnHints};
}

function transposeGrid(grid: number[][]): number[][] {
	const transposedGrid = JSON.parse(JSON.stringify(grid));

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid.length; j++) {
			transposedGrid[i][j] = grid[j][i];
		}
	}

	return transposedGrid;
}

export function areHintsFull(grid: number[][], hint: number[], placement: number, isLine: boolean) {
	let count = 0;
	const hintResult: number[] = [];
	(isLine ? grid : transposeGrid(grid))[placement].forEach((column: number) => {
		if (column === GRID_BLOCKS[1]) {
			count++;
		} else if (count > 0) {
			hintResult.push(count);
			count = 0;
		}
	});

	if (hintResult.length === 0 || count > 0) hintResult.push(count);
	return JSON.stringify(hint) === JSON.stringify(hintResult);
}

function generateGrid(size: number): number[][] {
	const grid = [];

	/* eslint-disable @typescript-eslint/no-unused-vars */
	for (const i of Array(size).keys()) {
		const line = [];
		for (const j of Array(size).keys()) {
			line.push(GRID_BLOCKS[Math.round(Math.random())]);
		}
		grid.push(line);
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	return grid;
}

function generateHints(grid: number[][]): number[][] {
	return grid.map((line) => {
		let count = 0;
		const hint = [];

		line.forEach((column) => {
			if (column === GRID_BLOCKS[1]) {
				count++;
			} else if (count > 0) {
				hint.push(count);
				count = 0;
			}
		});

		if (hint.length === 0 || count > 0) hint.push(count);
		return hint;
	});
}
