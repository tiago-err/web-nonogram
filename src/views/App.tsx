import {useEffect, useState} from "react";
import "../App.css";
import {motion} from "framer-motion";
import {SIZES} from "../constants";
import {generateNonogram} from "../utils/nonogramGenerator";
import {Nonogram} from "../components/Nonogram";
import Icon from "@mdi/react";
import {mdiKeyboardBackspace} from "@mdi/js";

function App() {
	const [grid, setGrid] = useState<{grid: number[][]; lineHints: number[][]; columnHints: number[][]} | undefined>(undefined);
	const [showGrid, setShowGrid] = useState(false);
	const [showSizes, setShowSizes] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setShowSizes(!showGrid);
		}, 301 * SIZES.length);
	}, [showGrid]);

	function selectSize(e: any): void {
		const size = parseInt(e.target.className);
		setGrid(generateNonogram(size));
		setShowGrid(true);
	}

	return (
		<div className="App">
			<header className="App-header">
				{!showSizes && showGrid && grid && (
					<motion.div
						initial={{opacity: 0}}
						animate={{opacity: showGrid ? 1 : 0}}
						transition={{duration: 0.3}}
						style={{position: "absolute", top: "5%", left: "5%", display: "flex"}}
						onClick={() => setShowGrid(false)}>
						<Icon path={mdiKeyboardBackspace} title="Restart" size={1.5} color="white" style={{cursor: "pointer"}} />
					</motion.div>
				)}
				{(showSizes || !showGrid) &&
					SIZES.map((size, index) => (
						<motion.div
							className={`${size}`}
							style={{
								minWidth: "8%",
								margin: "0.5em 0",
								padding: "0.3em 0.5em",
								borderRadius: "20px",
								backgroundColor: "white",
								color: "#282c34",
								cursor: "pointer",
							}}
							initial={{opacity: 0}}
							animate={{opacity: !showGrid ? 1 : 0}}
							transition={{duration: 0.3 * (index + 1)}}
							onClick={selectSize}
							key={size}>
							{size} x {size}
						</motion.div>
					))}
				{!showSizes && showGrid && grid && (
					<motion.div
						style={{display: "flex", flexDirection: "column"}}
						initial={{opacity: 0}}
						animate={{opacity: showGrid ? 1 : 0}}
						transition={{duration: 0.5}}>
						<Nonogram grid={grid.grid} lineHints={grid.lineHints} columnHints={grid.columnHints} />
					</motion.div>
				)}
			</header>
		</div>
	);
}

export default App;
