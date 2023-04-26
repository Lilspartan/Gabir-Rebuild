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

const Tutorials = (props)  => {
    const router = useRouter();

    const slug = router.query.slug;
    const content = props.content;

    console.log(props.author)

	return (
		<>
			<SEO 
				title = {`Gabir Motors | ${props.metadata.title}`} 
				description = {`${props.metadata.subtitle}\n\nWritten By ${props.metadata.name}`}
				url = {"tutorials/" + slug}
			/>

			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full">
                    <section className="lg:mx-auto mt-16 mx-4">
                        <h1 className = "lg:text-5xl text-3xl font-bold mb-4">{ props.metadata.title }</h1>
                        <span className = "italic opacity-60 block">Last Edit: { props.metadata.edited }</span>
                        { props.author !== null && <h3 className = "font-bold inline">Written By: <span className = "font-normal">{ props.author.name } { props.author.username !== undefined && <span>({ props.author.username })</span> }</span></h3> }
                        { props.author.links !== undefined && props.author.links.map((link) => (
                            <SocialLink link = { link } />
                        )) }
                        <ShareButton metadata = { props.metadata } author = { props.author } />
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
    const folder = "public/posts/";
    const file = `${folder}${props.query.slug}.md`;
    const content = fs.readFileSync(file, "utf8");

    const matterResults = matter(content);

    let author = await axios.get('https://api.gabirmotors.com/driver/accountid/' + matterResults.data.authorID);

    if (author.data.length) {
        author = author.data[0];
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
                    text: `${props.metadata.subtitle}\n\nWritten By ${props.metadata.name}`,
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