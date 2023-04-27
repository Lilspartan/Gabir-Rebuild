import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow, Navbar, Modal } from '../../components';
import { Client } from "gabir-motors";
import { motion } from 'framer-motion';
import fs from 'fs';
import Link from 'next/link';
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import axios from 'axios'
import { AiOutlineTwitter } from 'react-icons/ai';
import { BsTwitch } from 'react-icons/bs';
import { HiArrowLeft } from 'react-icons/hi';
import path from 'path';
import { ArticleMetaData, Driver } from '../../utils/interfaces';

const Editor = ()  => {
    const [metadata, setMetadata] = useState<ArticleMetaData>({
        title: "",
        subtitle: "",
        headerImg: null,
        headerAlt: null,
        date: "",
        edited: "N/A",
        authorID: -1,
        tags: [ "" ]
    })
    const [content, setContent] = useState("## Write your article here\n\nYou have the full power of markdown at your disposal");
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {   
        let c = localStorage.getItem("content");
        if (c !== null) {
            setContent(c);
        }
    }, [])

	return (
		<>
			<SEO 
				title = {`Gabir Motors | Tutorial Editor`} 
				url = {"tutorials/editor"} 
			/>

			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full">
                    { previewMode ? (
                        <section className="lg:mx-auto mt-16 mx-4 lg:w-1/2">
                        
                            <img className = "my-8 rounded-lg" src = { metadata.headerImg } alt = { metadata.headerAlt } />

                            <h1 className = "lg:text-5xl text-3xl font-extrabold mb-4">{ metadata.title }</h1>
                            <span className = "italic opacity-60 block">Last Edit: { metadata.edited }</span>
                            <h3 className = "font-bold inline">Written By: <span className = "font-normal">Unknown</span></h3>
                            

                            <article className = "prose prose-sm lg:prose-xl prose-invert">
                                <Markdown>{ content }</Markdown>
                            </article>
                        </section>
                    ) : (
                        <div className = "lg:w-1/2 mx-4 lg:mx-auto mt-8">
                            <div className = "block">
                                <label htmlFor="title">Title</label>
                                <input 
                                    name = "title" 
                                    id = "title" 
                                    type="text" 
                                    className = "bg-dark-card-handle px-2 py-1 rounded-lg my-2 mx-2" 
                                    placeholder = "Article Title" value = {metadata.title} 
                                    onChange = {(e) => { 
                                        setMetadata({ ...metadata, title: e.target.value }) 
                                    }} />
                            </div>

                            <div className = "block">
                                <label htmlFor="subtitle">Subtitle</label>
                                <input 
                                    name = "subtitle" 
                                    id = "subtitle" 
                                    type="text" 
                                    className = "bg-dark-card-handle px-2 py-1 rounded-lg my-2 mx-2" 
                                    placeholder = "Subitle" value = {metadata.subtitle} 
                                    onChange = {(e) => { 
                                        setMetadata({ ...metadata, subtitle: e.target.value }) 
                                    }} />
                            </div>

                            <div className = "block">
                                <label htmlFor="headerimg">Header Image</label>
                                <input 
                                    name = "headerimg" 
                                    id = "headerimg" 
                                    type="url" 
                                    className = "bg-dark-card-handle px-2 py-1 rounded-lg my-2 mx-2" 
                                    placeholder = "Header Image (URL)" value = {metadata.headerImg} 
                                    onChange = {(e) => { 
                                        setMetadata({ ...metadata, headerImg: e.target.value }) 
                                    }} />
                            </div>

                            <div className = "block">
                                <label htmlFor="headerimgalt">Header Image Alt Text</label>
                                <input 
                                    name = "headerimgalt" 
                                    id = "headerimgalt" 
                                    type="text" 
                                    className = "bg-dark-card-handle px-2 py-1 rounded-lg my-2 mx-2" 
                                    placeholder = "Header Image Alt Text" value = {metadata.headerAlt} 
                                    onChange = {(e) => { 
                                        setMetadata({ ...metadata, headerAlt: e.target.value }) 
                                    }} />
                            </div>

                            <textarea name="Content" id="Content" className = "mt-8 bg-dark-card-handle h-96 w-full p-4 rounded-lg" value = {content} onChange = {(e) => {
                                setContent(e.target.value);
                                localStorage.setItem("content", e.target.value);
                            }}></textarea>
                        </div>
                    ) }
                </div>
			</div>

            <div className = "fixed z-50 right-0 bottom-0 text-white p-4 cursor-pointer" onClick = {() => { setPreviewMode(!previewMode) }}>
                Toggle Preview
            </div>
		</>
	)
}

export default Editor;