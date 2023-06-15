/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { CarFrame, Alert, Navbar, SEO, Dropdown, Button, AlertArea } from '../../components'
import { useRouter } from 'next/router';

// All the car options and the url to find them at
const links = [
	{ name: "Toyota GR86", link: "toyotagr86" },
	{ name: "BMW LMDh", link: "bmwlmdh" },
	{ name: "Dallara F3", link: "dallaraf3" },
	{ name: "Pro 2 Lite", link: "pro2lite" },
	{ name: "Street Stock", link: "streetstock" }
]

// the update timeout
var updateTimeout = setTimeout(() => { }, Infinity);

type Preset = {
	name: string;
	metal: number;
	rough: number;
	clearcoat: number;
}

const DEFAULT_COLOR = "#6f38b2";
const UPDATE_PREVIEW_TIME = 500;

const toHex = (value: number) => { return value.toString(16).padStart(2, "0") }

const SpecMap = (props: any) => {
	const router = useRouter();

	// The inputs, either from the url or the ui
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [metal, setMetal] = useState(0);
	const [roughness, setRoughness] = useState(0);
	const [clearcoat, setClearcoat] = useState(0);

	// The object that has the selected car's name and link
	const [carImagesLink, setCarImagesLink] = useState(links[0]);

	// If the link has been copied to the clipboard or not
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	// list of texture presets
	const [presets, setPresets] = useState<Preset[]>([
		{ name: "Gloss (Default)", metal: 0, rough: 0, clearcoat: 0 },
		{ name: "Flat", metal: 0, rough: 80, clearcoat: 0 },
		{ name: "Matte", metal: 0, rough: 50, clearcoat: 0 },
		{ name: "Satin", metal: 0, rough: 20, clearcoat: 0 },
		{ name: "Chrome", metal: 100, rough: 0, clearcoat: 0 },
		{ name: "Metallic", metal: 90, rough: 40, clearcoat: 0 },
		{ name: "Candy", metal: 50, rough: 10, clearcoat: 0 },
		{ name: "Pearl", metal: 60, rough: 20, clearcoat: 0 },
		{ name: "Velvet", metal: 80, rough: 100, clearcoat: 0 },
	]);

	// Values from the UI, these will be set to what is shown in the preview after 500ms of the values not changing
	const [toSetValues, setToSetValues] = useState({
		metal: 0,
		roughness: 0,
		clearcoat: 0,
		color,
	})

	useEffect(() => {
		// To save performance, the preview is not updated in realtime, but instead it's updated after the controls have stayed the same for 500ms
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			setMetal(toSetValues.metal);
			setRoughness(toSetValues.roughness);
			setClearcoat(toSetValues.clearcoat);
			setColor(toSetValues.color);
		}, UPDATE_PREVIEW_TIME)
	}, [toSetValues])

	useEffect(() => {
		if (shareLinkCopied) {
			setTimeout(() => {
				setShareLinkCopied(false);
			}, 5000)
		}
	}, [ shareLinkCopied ])

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

	useEffect(() => {
		if (router.query.color !== undefined) {
			setToSetValues({ 
				...toSetValues, 
				color: "#" + router.query.color,
				metal: Number(router.query.metallic),
				roughness: Number(router.query.roughness),
				clearcoat: Number(router.query.clearcoat),
			})

			let carFromUrl = links.filter((link) => {
				return link.link === router.query.car;
			});

			if (carFromUrl.length) {
				setCarImagesLink(carFromUrl[0]);
			}
		}
	}, [ router.query ])

	const getShareUrl = () => {
		let url = `/tools/specmapping?metallic=${metal}&roughness=${roughness}&clearcoat=${clearcoat}&car=${carImagesLink.link}&color=${color.replace('#', '')}`;
	
		router.push(url)

		if (navigator) {
            navigator.clipboard.writeText("https://gabirmotors.com" + url);
        }
	}

	return (
		<>
			<SEO
				title = "Gabir Motors Spec Map Previsualization Tool" 
				description = "The Gabir Motors Spec Map Previsualization Tool can help you to refine your spec maps and make your car look just how you want, no more guessing how certain colors will affect the look of your new livery, just try them out in this helpful tool!" 
				url = "tools/specmapping"
			/>

			<Navbar />

			<div className="min-h-screen absolute text-white max-w-full w-screen">
				<div className="content-center min-h-screen background-carbon_fiber w-full text-center">
					<div className={`text-left grid place-items-center min-h-screen`}>
						<div>
							<div className="p-4 m-4 w-full mx-auto bg-dark-card-handle flex xl:flex-row flex-col-reverse justify-between flex-wrap rounded-lg gap-8">

								<div className="w-full xl:w-1/4 flex-grow flex flex-col justify-between py-2">
									<div className="">
										<div className = "flex flex-row mb-4">
											<h2 className="font-bold text-3xl mr-4 flex-shrink">Choose a Car</h2>
											<div className="ml-2 my-auto flex-grow">
												<Dropdown change = {(e) => {
													setCarImagesLink(JSON.parse(e.target.value));
												}} options = {links.map(link => {
													return { value: JSON.stringify(link), text: link.name, selected: carImagesLink.link === link.link };
												})} />
											</div>
										</div>
										<div className="w-full text-lg">
											<label htmlFor="color">Choose a Color:</label> <input type="color" id="color" value={color} onChange={(e) => { setToSetValues({ ...toSetValues, color: e.target.value }) }} />
											<span className="">
												<input className="bg-dark-card-handle rounded-md ml-2 px-1" type="text" placeholder="Color Hex" value={toSetValues.color} onChange={(e) => { setToSetValues({ ...toSetValues, color: e.target.value }) }} />
											</span>

											<br />

											{ [
												{ name: "Metallic", variable: "metal", id: "metallic" },
												{ name: "Roughness", variable: "roughness", id: "roughness" },
												{ name: "Clear coat", variable: "clearcoat", id: "clearcoat" },
											].map((value) => (
												<div className = "flex flex-row">
													<label htmlFor = { value.id }>{ value.name }</label> 
													<div id = { `${value.id}-container` }>
														<input 
															type="range" 
															min="0" 
															max="100" 
															value={toSetValues[value.variable]} 
															id="metallic" 
															className = "mx-2" 
															onChange={(e) => { 
																setToSetValues({ 
																	...toSetValues, 
																	[value.variable]: parseInt(e.target.value) 
																}) 
															}} /> 
															
															{toSetValues[value.variable]}%
													</div>
												</div>
											)) }
											
											<span>Spec Map Color: </span>
											<span className="">
												<input className="px-1 rounded-md" type="text" placeholder="Spec Map Hex" value={`#${toHex(Math.ceil(metal * 2.55)) + toHex(Math.ceil(roughness * 2.55)) + toHex(Math.ceil(clearcoat * 2.55))}`} disabled />
											</span>
										</div>
									</div>

									<div className = "flex flex-row mt-6">
										<h2 className="font-bold text-3xl mr-4 flex-shrink">Or Use a Preset</h2>
										<div className="ml-2 my-auto flex-grow">
											<Dropdown change = {changePreset} options = {[ ...presets.map((p => {
												return { value: `${p.metal}/${p.rough}/${p.clearcoat}`, text: p.name }
											})) ]} />
										</div>
									</div>

									<div className = "my-4 flex flex-col gap-2">
										<Alert backgroundVisible = {false} id = "slow-loading-spec-map" permaDismiss = {false} type = "warning" closeable = {false}>Some images may take a while to load</Alert>
										<Alert backgroundVisible = {false} id = "thank-you-zach!" permaDismiss = {true} type = "success" closeable = {false}>Huge thank you to <a href = "https://www.tradingpaints.com/profile/666793/Zach-C-Miller" target = "_blank">Bracket (Zach M.)</a> for the images and code help!</Alert>
									</div>

									<div className = "flex flex-row gap-2">
										<div className = "flex-grow">
											<Button block click = {() => {
												getShareUrl();
												setShareLinkCopied(true);
											}}>{ shareLinkCopied ? "Link Copied to Clipboard" : "Share Configuration" }</Button>
										</div>

										<div className = "flex-grow">
											<Button block click = {() => {
												setToSetValues({
													metal: 0,
													roughness: 0,
													clearcoat: 0,
													color: DEFAULT_COLOR
												})

												setCarImagesLink(links[0]);

												router.push('');
											}}>Reset</Button>
										</div>
									</div>
								</div>

								<div className="py-2">
									<CarFrame
										clearcoat={clearcoat / 100}
										metal={metal / 100}
										roughness={roughness / 100}
										color={color}
										imgPath={`https://s.gabekrahulik.repl.co/${carImagesLink.link}`} />
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