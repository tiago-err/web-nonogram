import {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";
import {motion} from "framer-motion";
import {GRID_BLOCKS} from "../constants";
import {areHintsFull} from "../utils/nonogramGenerator";

export function Nonogram(props: {grid: number[][]; lineHints: number[][]; columnHints: number[][]}) {
	const [selected, setSelected] = useState<number[][]>(props.grid.map((line) => line.map((item) => GRID_BLOCKS[0])));
	const [crossedOut, setCrossedOut] = useState<number[][]>(props.grid.map((line) => line.map((item) => GRID_BLOCKS[0])));
	const [disappearGrid, setDisappearGrid] = useState(false);
	const [gameWon, setGameWon] = useState(false);
	const [fillSelection, setFillSelection] = useState<0 | 1>(0);

	useEffect(() => {
		if (JSON.stringify(props.grid) === JSON.stringify(selected)) {
			setDisappearGrid(true);
			setTimeout(() => {
				setGameWon(true);
			}, 500);
		}
	}, [selected, props.grid]);

	function onClickItem(e: any) {
		const className = typeof e.target.className === "string" ? e.target.className : e.target.parentElement.classList[0];
		const [line, column] = className.split("_");

		const selections = [
			{selected, setSelected},
			{selected: crossedOut, setSelected: setCrossedOut},
		];
		if (selections[fillSelection === 0 ? 1 : 0].selected[line][column] !== GRID_BLOCKS[1]) {
			const {selected: newSelection} = JSON.parse(JSON.stringify(selections[fillSelection]));
			newSelection[line][column] = newSelection[line][column] === GRID_BLOCKS[1] ? GRID_BLOCKS[0] : GRID_BLOCKS[1];
			selections[fillSelection].setSelected(newSelection);
		}
	}

	return (
		<>
			{gameWon && (
				<motion.div initial={{opacity: 0}} animate={{opacity: !gameWon ? 0 : 1}} transition={{duration: 0.3}}>
					You have won! <br /> To restart, please press the arrow to go back
				</motion.div>
			)}
			{!gameWon && (
				<motion.div
					initial={{opacity: 1}}
					animate={{opacity: disappearGrid ? 0 : 1}}
					transition={{duration: 0.5}}
					className="nonogram"
					style={{display: "flex", flexDirection: "column"}}>
					<div className="grid-line-hints" style={{display: "flex"}}>
						<div
							className="line-hints"
							style={{display: "flex", flexDirection: "column", marginRight: "1.1em", justifyContent: "space-between", opacity: 0}}>
							{(JSON.parse(JSON.stringify(props.lineHints)) as number[][])
								.sort((a, b) => b.length - a.length)
								.filter((value, index) => index === 0)
								.map((hints) => (
									<div className="line-hint" key={`line-hint-hidden`} style={{display: "flex", justifyContent: "flex-end", height: "1.5em"}}>
										{hints.map((hint, index) => (
											<div key={`line-hint-hidden-${index}`} style={{marginLeft: index === 0 ? 0 : "0.6em"}}>
												{hint}
											</div>
										))}
									</div>
								))}
						</div>
						<div className="column-hints" style={{display: "flex", justifyContent: "space-between", marginBottom: "1.1em", width: "100%"}}>
							{props.columnHints.map((hints, column) => (
								<motion.div
									className="column-hint"
									key={`column-hint-${column}`}
									initial={{color: "white"}}
									animate={{opacity: areHintsFull(selected, hints, column, false) ? 0.3 : 1}}
									transition={{duration: 0.5}}
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "flex-end",
										width: `${100 / props.columnHints.length}%`,
									}}>
									{hints.map((hint, index) => (
										<div key={`column-hint-${column}-${index}`}>{hint}</div>
									))}
								</motion.div>
							))}
						</div>
					</div>
					<div className="grid-line-hints" style={{display: "flex"}}>
						<div
							className="line-hints"
							style={{display: "flex", flexDirection: "column", marginRight: "1.1em", justifyContent: "space-between"}}>
							{props.lineHints.map((hints, line) => (
								<motion.div
									className="line-hint"
									key={`column-hint-${line}`}
									initial={{color: "white"}}
									animate={{opacity: areHintsFull(selected, hints, line, true) ? 0.3 : 1}}
									transition={{duration: 0.5}}
									style={{display: "flex", justifyContent: "flex-end", height: "1.5em"}}>
									{hints.map((hint, index) => (
										<div key={`column-hint-${line}-${index}`} style={{marginLeft: index === 0 ? 0 : "0.6em"}}>
											{hint}
										</div>
									))}
								</motion.div>
							))}
						</div>
						<div className="grid" style={{display: "grid", gridTemplateColumns: props.grid.map((item) => "auto").join(" ")}}>
							{props.grid.map((line, line_index) => {
								return line.map((item, item_index) => (
									<div
										className={`${line_index}_${item_index}`}
										key={`${line_index}_${item_index}`}
										onClick={onClickItem}
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											width: "1.5em",
											height: "1.5em",
											border: "2px solid white",
											cursor: "pointer",
											backgroundColor: selected[line_index][item_index] === GRID_BLOCKS[1] ? "#eaeaea" : "#282c34",
										}}>
										{crossedOut[line_index][item_index] === GRID_BLOCKS[1] && (
											<Icon
												className={`${line_index}_${item_index}`}
												path={mdiClose}
												title="Cross Out"
												size={1.5}
												color={`rgb(255,255,255)`}
											/>
										)}
									</div>
								));
							})}
						</div>
					</div>
					<div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "3em 0 0 3em"}}>
						<div
							onClick={() => setFillSelection(0)}
							style={{
								display: "block",
								width: "1.5em",
								height: "1.5em",
								border: "2px solid white",
								color: `rgba(255,255,255,0)`,
								cursor: "pointer",
								backgroundColor: fillSelection === 0 ? "#eaeaea" : "#282c34",
							}}>
							X
						</div>
						<div
							onClick={() => setFillSelection(1)}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "1.5em",
								height: "1.5em",
								border: "2px solid white",
								cursor: "pointer",
							}}>
							<Icon path={mdiClose} title="Cross Out" size={1.5} color={`rgba(255,255,255,${fillSelection})`} />
						</div>
					</div>
				</motion.div>
			)}
		</>
	);
}
