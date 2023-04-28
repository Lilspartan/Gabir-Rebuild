import { useState, useEffect } from 'react';
import { Button, Loading, SEO, Navbar, Alert, AlertArea } from '../components';
import { Client } from "gabir-motors";
import { File, Folder } from '../utils/interfaces';
import axios from 'axios';
import { BsGridFill, BsListUl } from 'react-icons/bs';
import { AiFillFolder, AiFillFolderOpen, AiOutlineFileImage, AiOutlineFileText } from 'react-icons/ai';
import Image from 'next/image';

const client = new Client();

const Teams = ()  => {
	const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Folder | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [galleryMode, setGalleryMode] = useState(true);

	useEffect(() => {
		(async () => {
			let list: {data: Folder} = await axios.get("https://i.gabirmotors.com/assetsList")
            setAssets(list.data);

            // const getFolderNames = async (listOfFiles:Folder) => {
            //     if (listOfFiles.children) {
            //         for (let i = 0; i < listOfFiles.children.length; i ++) {
            //             if (listOfFiles.children[i].type === "directory") {
            //                 await setCategories([ ...categories, listOfFiles.children[i].name ])
            //                 console.log(listOfFiles.children[i].name)
            //                 await getFolderNames(listOfFiles.children[i] as Folder);
            //             }
            //         }
            //     }
            // }

            // getFolderNames(list.data);
            // console.log(categories);
        })()

		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

    const GalleryFileElement = ({ file }: { file: File }) => {
        return (
            <div style = {{ marginTop: "20px", padding: "20px" }} className = {``}>
                <div className="flex place-content-center">
                    <a style = {{ maxHeight: "150px" }} href = {`https://i.gabirmotors.com${file.path.replace('public', '')}`} target = "_blank"><Image width = "150px" height = "150px" objectFit='contain' src={`https://i.gabirmotors.com${file.path.replace('public', '')}`} alt="" /></a>
                </div>
            </div>
        )
    }

    const GalleryFolderElement = ({ folder }: { folder: Folder }) => {
        return  (
            <>
                { folder.children.map((child:File | Folder) => {
                    if ("children" in child) {
                        return <GalleryFolderElement folder = { child } />
                    } else {
                        return <GalleryFileElement file = { child } />  
                    }
                })}
            </>
        )
    }

    const FileElement = ({ file, depth }: { file: File, depth: number }) => {
        let fileType = "text"

        let imageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

        if (imageFileExtensions.includes(file.extension)) fileType = "image";

        return (
            <div className = {`text-left text-xl`} style = {{ marginLeft: depth * 15 + "px" }}>
                <a href = {`https://i.gabirmotors.com${file.path.replace('public', '')}`} target = "_blank">{ fileType === "image" ? <AiOutlineFileImage className = "inline-block" /> : <AiOutlineFileText className = "inline-block" /> } { file.name }</a>
            </div>
        )
    }

    const FolderElement = ({ folder, depth }: { folder: Folder, depth: number }) => {
        const [open, setOpen] = useState(false);
        return  (
            <div className = "text-left" style = {{ marginLeft: depth * 15 + "px" }}>
                <span onClick = {() => { setOpen(!open) }} className = "cursor-pointer text-2xl">{ open ? <AiFillFolderOpen className = "inline-block" /> : <AiFillFolder className = "inline-block" />} { folder.name }</span>
                { open && folder.children.map((child:File | Folder) => {
                    if ("children" in child) {
                        return <FolderElement folder = { child } depth = { depth + 1 } />
                    } else {
                        return <FileElement file = { child } depth = { depth + 1 } />  
                    }
                })}
            </div>
        )
    }

	return (
		<>
			<SEO 
                title = "Gabir Motors | Assets" 
                description = "Gabir Motors and PA League related assets, this page is a helpful repository of images for your liveries!" 
                url = "assets"
            />

			<Loading loading = { loading } />
 
			<Navbar />

            <div className = "fixed bottom-0 right-0 z-40 text-3xl m-4 cursor-pointer text-white" onClick = {() => { setGalleryMode(!galleryMode) }}>
                { galleryMode ? <BsGridFill /> : <BsListUl /> }
            </div>

            <AlertArea>
                <Alert type = "tip" id = "slow-connections" permaDismiss>If you have a slow connection or just trouble loading all the images, <span onClick = {() => { setGalleryMode(false) }} className = "cursor-pointer font-bold">turn off gallery mode</span></Alert>
            </AlertArea>

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "content-center min-h-screen background-carbon_fiber w-full text-center">
                    { galleryMode ? (
                        <div className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:w-2/3 mx-auto">
                            { assets !== null && <GalleryFolderElement folder = { assets } /> }
                        </div>
                    ) : (
                        <div className = "lg:w-1/3 mx-auto flex flex-col">
                            <FolderElement folder = { assets } depth = { 0 } />
                        </div>
                    )}
                </div>
			</div>
		</>
	)
}

export default Teams;