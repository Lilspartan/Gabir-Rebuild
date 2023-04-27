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

interface Props {
    metadata: ArticleMetaData;
    author:   Driver;
    content:  string;
}

const Tutorials = (props: Props)  => {
    const router = useRouter();

    const slug = router.query.slug;
    const content = props.content;

    console.log(props.author)

	return (
		<>
			<SEO 
				title = {`Gabir Motors | ${props.metadata.title}`} 
				description = {`${props.metadata.subtitle}\n\nWritten By ${props.author.name}`}
				url = {"tutorials/" + slug} 
                headerImg = {props.metadata.headerImg || "/header.jpg"}
			/>

			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full">
                    <section className="lg:mx-auto mt-16 mx-4 lg:w-1/2">
                        <div className = "w-full flex flex-row justify-start mb-8">
                            <Link href = "/tutorials">
                                <span className="link"><HiArrowLeft className = "inline text-xl" /> Go Back</span>
                            </Link>
                        </div>

                        <h1 className = "lg:text-5xl text-3xl font-extrabold mb-4">{ props.metadata.title }</h1>
                        <span className = "italic opacity-60 block">Last Edit: { props.metadata.edited }</span>
                        { props.author !== null && <h3 className = "font-bold inline">Written By: <span className = "font-normal">{ props.author.name } { props.author.username !== undefined && <span>({ props.author.username })</span> }</span></h3> }
                        { props.author.links !== undefined && props.author.links.map((link) => (
                            <SocialLink link = { link } />
                        )) }
                        <ShareButton metadata = { props.metadata } author = { props.author } />

                        <img className = "mt-8 mb-2 rounded-lg" src = { props.metadata.headerImg } alt = { props.metadata.headerAlt } />
                        <span className = "text-lg ml-4 text-zinc-100">{ props.metadata.headerAlt }</span>

                        <article className = "prose prose-sm lg:prose-xl prose-invert">
                            <Markdown>{ content }</Markdown>
                        </article>
                    </section>
                </div>
			</div>
		</>
	)
}

const SocialLink = ({ link }: { link: {type: string, text: string} }) => {
    switch (link.type) {
        case "twitter": return ( <a href = {`https://twitter.com/${link.text}`} target = "_blank"><AiOutlineTwitter className = "inline text-xl mx-1 cursor-pointer" /></a> );
        case "twitch": return ( <a href = {`https://twitch.com/${link.text}`} target = "_blank"><BsTwitch className = "inline text-xl mx-1 cursor-pointer" /></a> );
    }
} 

export const getServerSideProps = async (props) => {
    const folder = path.join(process.cwd(), 'posts/');
    const file = `${folder}${props.query.slug}.md`;
    const content = fs.readFileSync(file, "utf8");

    const matterResults = matter(content);

    let data = await axios.get('https://api.gabirmotors.com/driver/accountid/' + matterResults.data.authorID);
    let author: Driver | null;

    if (data.data.length) {
        author = data.data[0];
    } else {
        author = null;
    }

    return {
        props: {
            content: matterResults.content,
            metadata: {
                title: matterResults.data.title,
                subtitle: matterResults.data.subtitle,
                edited: matterResults.data.edited,
                date: matterResults.data.date,
                headerImg: matterResults.data.headerImg || null,
                headerAlt: matterResults.data.headerAlt || null,
            },
            author
        }
    };
}

const ShareButton = (props) => {
    const handleClick = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `Gabir Motors | ${props.metadata.title}`,
                    text: `${props.metadata.subtitle}\n\nWritten By ${props.author.name}`,
                    url: document.location.href,
                })
                .then(() => {
                    console.log('Successfully shared');
                })
                .catch(error => {
                    console.error('Something went wrong sharing the blog', error);
                });
        }
    }

    return (
        <>
            <a onClick = {handleClick} href = "#share" className = "block font-bold">Share This Article</a>
        </>
    )
}

export default Tutorials;