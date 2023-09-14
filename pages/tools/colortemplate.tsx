/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { Navbar, SEO, Modal, Button } from '../../components';

import 'ag-psd/initialize-canvas';

import { readPsd, Layer } from 'ag-psd';
import * as _ from 'lodash';

import { motion } from 'framer-motion';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { FaChevronRight, FaChevronLeft, FaSearch } from 'react-icons/fa';

type UploadState = "INVALID_TYPE" | "VALID" | "INVALID_PSD" | "PARSING";

var updateTimeout = setTimeout(() => { }, 1);
const UPDATE_PREVIEW_TIME = 100;

export interface Image {
    top:                   number;
    left:                  number;
    bottom:                number;
    right:                 number;
    blendMode:             string;
    opacity:               number;
    clipping:              boolean;
    transparencyProtected: boolean;
    hidden:                boolean;
    name:                  string;
    id:                    number;
    blendClippendElements: boolean;
    blendInteriorElements: boolean;
    knockout:              boolean;
    protected:             Protected;
    layerColor:            string;
    timestamp:             number;
    referencePoint:        ReferencePoint;
    canvas:                Canvas;
    imageData:             string;
}

export interface Canvas {
}

export interface Protected {
    transparency: boolean;
    composite:    boolean;
    position:     boolean;
}

export interface ReferencePoint {
    x: number;
    y: number;
}


async function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
  
      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      // Read file
      reader.readAsArrayBuffer(file)
    })
}

async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file));
}

const parseLayer = (layers: Layer[]): Layer | Layer[] => {
    return _.flattenDeep(
        layers.map((layer) => {
            if (layer.children) {
                return parseLayer(layer.children);
            }
            return layer;
        })
    );
};

const ColorTemplate = (props: any) => {
	// The inputs, either from the url or the ui
	const [color1, setColor1] = useState("#FF0000");
	const [color2, setColor2] = useState("#00FF00");
	const [color3, setColor3] = useState("#0000FF");

    const [images, setImages] = useState<Image[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    // File name of the file in the imput
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadState, setUploadState] = useState<UploadState | null>(null);

	// eslint-disable-next-line
	const [size, setSize] = useState(600);

    const [toSetValues, setToSetValues] = useState({
		color1,
		color2,
		color3,
	})

    function parseColor(colorHex: string) {
		if(colorHex.substring(0,1) === "#") {
			colorHex = colorHex.substring(1);
		}
		
		let r = parseInt(colorHex.substr(0,2),16);
		let g = parseInt(colorHex.substr(2,2), 16);
		let b = parseInt(colorHex.substr(4,2), 16);
		
		return {
			r: r/255,
			g: g/255,
			b: b/255
		};
	}

	function drawTemplateCustomBlend(templateUrl: string, color1: string, color2: string, color3: string) {
		let img = document.getElementById('template') as HTMLImageElement;
		let img_download = document.getElementById('template_download') as HTMLImageElement;
		
		if (!img) return;

		img.crossOrigin = "anonymous";
		img_download.crossOrigin = "anonymous";

		img.onload = function() {
			let c1 = parseColor(color1);
			let c2 = parseColor(color2);
			let c3 = parseColor(color3);
			
			let canvas = document.getElementById('canv') as HTMLCanvasElement;
			if (!canvas) return;
			let ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.save();

			// draw the image onto the canvas first
			ctx.drawImage(img, 0, 0, size, size);
			
			// for each pixel, multiply our colors by the red/green/blue content of the pixel appropriately, then clamp it to 0/255
			let imageData = ctx.getImageData(0,0,size,size);
			for(let x=0; x<size; ++x)	{
				for(let y=0; y<size; ++y) {
					let pixelIndex = y * (size*4) + x*4;
					
					let pR = imageData.data[pixelIndex];
					let pG = imageData.data[pixelIndex+1];
					let pB = imageData.data[pixelIndex+2];
	
					let r = pR * c1.r + pG * c2.r + pB * c3.r;
					let g = pR * c1.g + pG * c2.g + pB * c3.g;
					let b = pR * c1.b + pG * c2.b + pB * c3.b;
	
					let max = Math.max(r,g,b);
					if(max > 255) {
						r = r * (255/max);
						g = g * (255/max);
						b = b * (255/max);
					}
					
					imageData.data[pixelIndex] = r|0;
					imageData.data[pixelIndex+1] = g|0;
					imageData.data[pixelIndex+2] = b|0;
				}
			}
			
			ctx.putImageData(imageData,0,0);
			ctx.restore();
		};	

        img_download.onload = function() {
			let c1 = parseColor(color1);
			let c2 = parseColor(color2);
			let c3 = parseColor(color3);
			
			let canvas = document.getElementById('canv_download') as HTMLCanvasElement;
			if (!canvas) return;
			let ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.save();

			// draw the image onto the canvas first
			ctx.drawImage(img, 0, 0, 2048, 2048);
			
			// for each pixel, multiply our colors by the red/green/blue content of the pixel appropriately, then clamp it to 0/255
			let imageData = ctx.getImageData(0,0,2048,2048);
			for(let x=0; x<2048; ++x)	{
				for(let y=0; y<2048; ++y) {
					let pixelIndex = y * (2048*4) + x*4;
					
					let pR = imageData.data[pixelIndex];
					let pG = imageData.data[pixelIndex+1];
					let pB = imageData.data[pixelIndex+2];
	
					let r = pR * c1.r + pG * c2.r + pB * c3.r;
					let g = pR * c1.g + pG * c2.g + pB * c3.g;
					let b = pR * c1.b + pG * c2.b + pB * c3.b;
	
					let max = Math.max(r,g,b);
					if(max > 255) {
						r = r * (255/max);
						g = g * (255/max);
						b = b * (255/max);
					}
					
					imageData.data[pixelIndex] = r|0;
					imageData.data[pixelIndex+1] = g|0;
					imageData.data[pixelIndex+2] = b|0;
				}
			}
			
			ctx.putImageData(imageData,0,0);
			ctx.restore();
		};	

		if(templateUrl) {
			img.src = templateUrl;
			img_download.src = templateUrl;
		}
	}

    useEffect(() => {
		// To save performance, the preview is not updated in realtime, but instead it's updated after the controls have stayed the same for 500ms
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			setColor1(toSetValues.color1);
			setColor2(toSetValues.color2);
			setColor3(toSetValues.color3);

            drawTemplateCustomBlend(selectedImage, toSetValues.color1, toSetValues.color2, toSetValues.color3);
		}, UPDATE_PREVIEW_TIME)
	}, [toSetValues])

	useEffect(() => {
		if (selectedImage !== null) {
            drawTemplateCustomBlend(selectedImage, color1, color2, color3);
        }
	}, [selectedImage])

	const changeColor1 = (e: any) => { setToSetValues({ ...toSetValues, color1: e.target.value }); }
	const changeColor2 = (e: any) => { setToSetValues({ ...toSetValues, color2: e.target.value }); }
	const changeColor3 = (e: any) => { setToSetValues({ ...toSetValues, color3: e.target.value }); }

    const newFile = async (e:any) => {
        setUploadState("PARSING");

        let file = e.target.files[0];
        let bytes = await getAsByteArray(file);
        const psd = await readPsd(bytes);

        console.log(psd)
        
        // get only layers that have a template
        const parsedLayers: Layer[] = _.flattenDeep([parseLayer(psd.children || [])]).filter((layer) => {
            return (layer.name.startsWith("car_pattern"));
        });        
        
        let images = parsedLayers.map((layer, i) => {
            if (layer.canvas) {
                return {
                    ...layer,
                    imageData: (layer.canvas as any).toDataURL()
                }
            }
        });

        if (images.length) {
            setImages(images as Image[]);
            setSelectedImage(images[0].imageData);
        } else {
            setUploadState("INVALID_PSD");
        }
    }

    const checkFile = (e) => {
        let file = e.target.files[0];

        setUploadedFile(e)

        if (file.name.endsWith('.psd')) {
            setUploadState("VALID");
        } else {
            setUploadState("INVALID_TYPE");
        }
    }

    const changeTemplate = (direction) => {
        let currentIndex;
        for (let i = 0; i < images.length; i ++) {
            if (images[i].imageData === selectedImage) currentIndex = i;
        }

        currentIndex += direction;
        
        if (currentIndex < 0) currentIndex = images.length - 1;
        if (currentIndex > images.length -1) currentIndex = 0;

        setSelectedImage(images[currentIndex].imageData);
    }

	return (
		<>
			<SEO
				title = "Color Templates" 
				description = "" 
				url = "tools/colortemplate"
			/>

			<Navbar />

			<div className="min-h-screen absolute text-white max-w-full w-screen">
				<div className="content-center min-h-screen background-carbon_fiber w-full text-center">
					<div className={`text-left grid place-items-center min-h-screen`}>
						<div>
							<div className="p-4 m-4 w-full mx-auto bg-dark-card-handle flex xl:flex-row flex-col-reverse justify-between flex-wrap rounded-lg gap-8">
                                { images === null && (
                                    <div>
                                        { uploadState !== "PARSING" && (
                                            <>
                                                <h1 className = "font-bold text-4xl">Upload PSD</h1>

                                                <div className="max-w-xl mt-8">
                                                    <label>
                                                        <Button block>Upload Template PSD</Button>
                                                        <input type="file" name="file_upload" className="hidden" accept = ".psd" onChange = {(e) => {
                                                            setUploadedFile(e.target.files[0].name);
                                                            checkFile(e);
                                                        } }/>
                                                    </label>
                                                </div>
                                            </>
                                        ) }

                                        <div>
                                            { uploadState === "INVALID_TYPE" && ( <span className = "text-center block text-red-500 mt-4 text-lg">Invalid File Type (Must be .psd)</span> ) }
                                            { uploadState === "PARSING" && ( <span className = "text-center block text-4xl font-bold animate-pulse">Loading...</span> ) }
                                        </div>

                                        { uploadState === "VALID" && (
                                            <div className = "mt-4 flex flex-row justify-end">
                                                <AnimatedButton text = "Continue" click = {() => { newFile(uploadedFile) }} />
                                            </div>
                                        ) }
                                    </div>
                                ) }
                                
                                {/* <input type="file" name="" id="" onChange = {(e) => {
                                    newFile(e)
                                } }/> */}

                                { images !== null && (
                                    <div className = "flex flex-row gap-8 h-full">
                                        <div className = "">
                                            {/* <Button block click = {() => { setOpen(true) }}>Select a Template</Button>  */}

                                            <h2 className = "text-2xl font-bold text-center mb-4">1. Choose your Template</h2>

                                            <div className = "flex flex-row justify-center select-none">
                                                <div onClick = {() => { changeTemplate(-1) }} className = "bg-light-card-handle text-black p-4 rounded-l-lg hover:opacity-60 opacity-100 transition duration-100 cursor-pointer"><FaChevronLeft /></div>
                                                <div onClick = {() => { setOpen(true) }} className = "bg-light-card-handle text-black p-4 hover:opacity-60 opacity-100 transition duration-100 cursor-pointer"><FaSearch /></div>
                                                <div onClick = {() => { changeTemplate(1) }}className = "bg-light-card-handle text-black p-4 rounded-r-lg hover:opacity-60 opacity-100 transition duration-100 cursor-pointer"><FaChevronRight /></div>
                                            </div>

                                            <h2 className = "text-2xl font-bold text-center mb-4 mt-8">2. Choose your Colors</h2>

                                            <div className = "flex flex-col gap-4 mt-8">
                                                <div className = "flex flex-row gap-2">
                                                    <div className = "self-center">
                                                        <input type="color" id="color" value={color1} onChange={changeColor1} />
                                                    </div>
                                                    <div className="">
                                                        <input className="bg-[#333333] rounded-md py-2 px-4 text-xl" type="text" placeholder="Color Hex" value = {color1} onChange={changeColor1} />
                                                    </div>
                                                </div>

                                                <div className = "flex flex-row gap-2">
                                                    <div className = "self-center">
                                                        <input type="color" id="color" value={color2} onChange={changeColor2} />
                                                    </div>
                                                    <div className="">
                                                        <input className="bg-[#333333] rounded-md py-2 px-4 text-xl" type="text" placeholder="Color Hex" value = {color2} onChange={changeColor2} />
                                                    </div>
                                                </div>

                                                <div className = "flex flex-row gap-2">
                                                    <div className = "self-center">
                                                        <input type="color" id="color" value={color3} onChange={changeColor3} />
                                                    </div>
                                                    <div className="">
                                                        <input className="bg-[#333333] rounded-md py-2 px-4 text-xl" type="text" placeholder="Color Hex" value = {color3} onChange={changeColor3} />
                                                    </div>
                                                </div>
                                            </div>

                                            <h2 className = "text-2xl font-bold text-center mb-4 mt-8">3. Download your Template</h2>

                                            <div className = "mt-8">
                                                <Button block click = {() => {
                                                    var canvas = document.getElementById("canv_download") as HTMLCanvasElement;
                                                    var url = canvas?.toDataURL("image/png");
                                                    var link = document.createElement('a');
                                                    link.download = 'template.png';
                                                    link.href = url;
                                                    link.click();
                                                }}>Download template</Button>
                                            </div>

                                            {/* <div className = "mt-4 flex flex-row justify-start self-end">
                                                <AnimatedButton text = "Go Back" click = {() => { newFile(uploadedFile) }} reverse />
                                            </div> */}
                                        </div>

                                        <div className = "w-full lg:w-1/2">				
                                            <img id="template" style={{display: "none"}} width = {size + "px"} height = {size + "px"} alt = "preview of your colored template"/>
                                            <svg width="0" height="0">
                                            <filter id="cmatrix">
                                                <feColorMatrix id="cmatrix_params"
                                                in="SourceGraphic"
                                                type="matrix" 
                                                values="0 1 0 0 0
                                                        0 0 1 0 0
                                                        1 0 0 0 0
                                                        0 0 0 1 0" />
                                            </filter>
                                            </svg>
                                            <canvas id="canv" width = {size + "px"} height = {size + "px"} />
                                        </div>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>wds

            <div className = "hidden">				
                <img id="template_download" style={{display: "none"}} width = {"2048px"} height = {"2048px"} alt = "preview of your colored template"/>
                <svg width="0" height="0">
                <filter id="cmatrix">
                    <feColorMatrix id="cmatrix_params"
                    in="SourceGraphic"
                    type="matrix" 
                    values="0 1 0 0 0
                            0 0 1 0 0
                            1 0 0 0 0
                            0 0 0 1 0" />
                </filter>
                </svg>
                <canvas id="canv_download" width = {"2048px"} height = {"2048px"} />
            </div>

            <Modal id = "template-selection" open = {open} setOpen = {setOpen} closeButton>
                <div className = "grid grid-cols-6 gap-5 my-8 ml-8">
                    { images && images.map((image) => (
                        <img src = {image.imageData}  className = {`w-24 transition duration-300 hover:-translate-y-2 cursor-pointer ${selectedImage === image.imageData && "border-2"}`} onClick = {() => {
                            setSelectedImage(image.imageData);
                        }} />
                    )) }
                </div>
            </Modal>
		</>
	)
}

const AnimatedButton = ({ click , text, reverse = false}, { click: Function, text: string, reverse: boolean }) => {
    return (
        <motion.div 
            whileHover = "hover" initial = "none" 
            className = "text-xl"
        >
            { reverse && (
                <motion.div 
                variants = {{
                    hover: { opacity: 1, rotate: 360, scale: 1.2, transition: { duration: 0.2 } },
                    none: { opacity: 0, rotate: 300, scale: 0.8, transition: { duration: 0.2 } },
                }}
                className = "inline-block"
                >
                    <BsArrowLeftShort className = "inline-block text-3xl" />
                </motion.div>
            ) }
            
            { reverse ? (
                <motion.a variants = {{
                    hover: { x: "5%" },
                    none: { x: "0%" },
                }} href = "#" onClick = {click} className = "text-center inline-block font-bold">{ text }</motion.a>
            ) : (
                <motion.a variants = {{
                    hover: { x: "-5%" },
                    none: { x: "0%" },
                }} href = "#" onClick = {click} className = "text-center inline-block font-bold">{ text }</motion.a>
            ) }
        
            { !reverse && (
                <motion.div 
                variants = {{
                    hover: { opacity: 1, rotate: 360, scale: 1.2, transition: { duration: 0.2 } },
                    none: { opacity: 0, rotate: 300, scale: 0.8, transition: { duration: 0.2 } },
                }}
                className = "inline-block"
                >
                    <BsArrowRightShort className = "inline-block text-3xl" />
                </motion.div>
            ) }
        </motion.div>
    )
}

export default ColorTemplate;