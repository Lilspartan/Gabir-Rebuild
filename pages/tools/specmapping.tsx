/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { CarFrame, Alert, Navbar, SEO } from '../../components'

const links = [
	{ name: "GR86", link: "https://spec-mapping-images.gabekrahulik.repl.co" },
	{ name: "Porsche 911", link: "https://carontrack.gabekrahulik.repl.co" },
]

var updateTimeout = setTimeout(() => { }, 999999);

type Preset = {
	name: string;
	metal: number;
	rough: number;
	clearcoat: number;
}

const toHex = (value: number) => { return value.toString(16).padStart(2, "0") }

const SpecMap = (props: any) => {
	const [loading, setLoading] = useState((props.loading !== undefined ? props.loading : true));

	// The inputs, either from the url or the ui
	const [color, setColor] = useState("#242fb3");
	const [metal, setMetal] = useState(0);
	const [roughness, setRoughness] = useState(0);
	const [clearcoat, setClearcoat] = useState(0);
	const [carImagesLink, setCarImagesLink] = useState(links[0]);

	// If the user should continue to the tool on a smaller screen
	const [continueWithSmallScreen, setContinueWithSmallScreen] = useState(false);

	// eslint-disable-next-line
	const [presets, setPresets] = useState<Preset[]>([
		{ name: "Flat", metal: 0, rough: 80, clearcoat: 0 },
		{ name: "Matte", metal: 0, rough: 50, clearcoat: 0 },
		{ name: "Satin", metal: 0, rough: 20, clearcoat: 0 },
		{ name: "Gloss", metal: 0, rough: 0, clearcoat: 0 },
		{ name: "Chrome", metal: 100, rough: 0, clearcoat: 0 },
		{ name: "Metallic", metal: 90, rough: 40, clearcoat: 0 },
		{ name: "Candy", metal: 50, rough: 10, clearcoat: 0 },
		{ name: "Pearl", metal: 60, rough: 20, clearcoat: 0 },
		{ name: "Velvet", metal: 80, rough: 100, clearcoat: 0 },
	]);

	const [toSetValues, setToSetValues] = useState({
		metal: 0,
		roughness: 0,
		clearcoat: 0,
		color: "#242fb3"
	})

	useEffect(() => {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			setMetal(toSetValues.metal);
			setRoughness(toSetValues.roughness);
			setClearcoat(toSetValues.clearcoat);
			setColor(toSetValues.color);
		}, 500)
	}, [toSetValues])

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1500)
	}, [])

	const changePreset = (e: any) => {
		var values = e.target.value.split('/');
		setToSetValues({
			...toSetValues,
			metal: values[0],
			roughness: values[1],
			clearcoat: values[2],
		})

		setMetal(values[0]);
		setRoughness(values[1]);
		setClearcoat(values[2]);
	}

	return (
		<>
			<SEO
				title = "Gabir Motors Spec Map Previsualization Tool" 
				description = "The Gabir Motors Spec Map Previsualization Tool can help you to refine your spec maps and make your car look just how you want, no more guessing how certain colors will affect the look of your new livery, just try them out in this helpful tool!" 
				url = "tools/specmapping"
			/>

			<Navbar />
			
			<div className="min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
				<div className="content-center min-h-screen background-carbon_fiber w-full text-center">
					<div className={`text-left grid place-items-center h-screen`}>
						<div>
							<div className="p-4 m-4 w-full mx-auto bg-dark-card-handle flex flex-row justify-end flex-wrap">

								<div className="w-full lg:w-1/3">
									<div className="">
										<div className = "flex flex-row mb-4">
											<h2 className="acumin text-3xl mr-4">Choose a Car</h2>
											<div className="ml-4 my-auto">
												<select onChange={(e) => {
													setCarImagesLink(JSON.parse(e.target.value));
												}} className="w-full text-black">
													{links.map(link => (
														<option value={`${JSON.stringify(link)}`}>{link.name}</option>
													))}
												</select>
											</div>
										</div>
										<div className="w-full">
											<label htmlFor="color">Choose a Color:</label> <input type="color" id="color" value={color} onChange={(e) => { setToSetValues({ ...toSetValues, color: e.target.value }) }} />
											<span className="">
												<input className="bg-dark-card-handle rounded-md ml-2" type="text" placeholder="Color Hex" value={toSetValues.color} onChange={(e) => { setToSetValues({ ...toSetValues, color: e.target.value }) }} />
											</span>
											<br />
											<label htmlFor="metallic">Metallic</label> <span id="metallic-container"><input type="range" min="0" max="100" value={toSetValues.metal} id="metallic" onChange={(e) => { setToSetValues({ ...toSetValues, metal: parseInt(e.target.value) }) }} /> {toSetValues.metal}%</span><br />
											<label htmlFor="rough">Roughness</label> <span id="rough-container"><input type="range" min="0" max="100" value={toSetValues.roughness} id="rough" onChange={(e) => { setToSetValues({ ...toSetValues, roughness: parseInt(e.target.value) }) }} /> {toSetValues.roughness}%</span><br />
											<label htmlFor="clearcoat">Clear coat</label> <span id="clearcoat-container"><input type="range" min="0" max="100" value={toSetValues.clearcoat} id="clearcoat" onChange={(e) => { setToSetValues({ ...toSetValues, clearcoat: parseInt(e.target.value) }) }} /> {toSetValues.clearcoat}%</span><br />
											<span>Spec Map Color: </span>
											<span className="">
												<input className="" type="text" placeholder="Spec Map Hex" value={`#${toHex(Math.ceil(metal * 2.55)) + toHex(Math.ceil(roughness * 2.55)) + toHex(Math.ceil(clearcoat * 2.55))}`} disabled />
											</span>
										</div>
									</div>

									<div className = "flex flex-row mt-6">
										<h2 className="acumin text-3xl mr-4">Or Use a Preset</h2>
										<div className="ml-4 my-auto">
												<select onChange={changePreset} className="w-full text-black">
												<option value="0/0/0">Select One</option>
												{presets.map(p => (
													<option value={`${p.metal}/${p.rough}/${p.clearcoat}`}>{p.name}</option>
												))}
											</select>
											</div>
									</div>

									<div className = "my-4 flex flex-col gap-2">
										<Alert id = "slow-loading-spec-map" permaDismiss = {false} type = "warning" closeable = {false}>Some images may take a while to load</Alert>
										<Alert id = "thank-you-zach!" permaDismiss = {true} type = "success" closeable = {false}>Huge thank you to <a href = "https://www.tradingpaints.com/profile/666793/Zach-C-Miller" target = "_blank">Bracket (Zach M.)</a> for the images and code help!</Alert>
									</div>

								</div>

								<div className="py-2 w-full lg:w-2/3">
									<CarFrame
										clearcoat={clearcoat / 100}
										metal={metal / 100}
										roughness={roughness / 100}
										color={color}
										imgPath={carImagesLink.link} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SpecMap;