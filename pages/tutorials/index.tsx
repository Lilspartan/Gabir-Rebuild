import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow, Navbar, Modal } from '../../components';
import { Client } from "gabir-motors";
import { motion } from 'framer-motion';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { ArticleMetaData } from '../../utils/interfaces';
import { HiArrowRight } from 'react-icons/hi';

interface Props {
    posts: ArticleMetaData[];
}

const Tutorials = (props: Props)  => {
	return (
		<>
			<SEO 
				title = "Gabir Motors | Tutorials" 
				description = "" 
				url = "tutorials"
			/>

			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full">
                   <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mx-4 lg:mx-8 my-16 gap-4">
                        { props.posts.sort((a, b) => {
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                        }).map(post => {
                            if (post.hidden) return <></>
                            else return (
                                <div>
                                    <a href = {`/tutorials/${post.slug}`}>
                                        <div className = "bg-dark-card-body px-4 py-4 h-full flex flex-col transition duration-200 hover:bg-dark-card-handle">
                                            { post.headerImg !== null && <img className = "mb-8 rounded-lg" src = { post.headerImg } alt = { post.headerAlt } /> }
                                            <h2 className = "text-3xl font-bold">{ post.title }</h2>
                                            <span className = "italic opacity-60">{ post.date }</span>
                                            <h3 className="text-xl mb-2">{ post.subtitle }</h3>
                                            <div className="flex flex-row gap-2 mt-auto">
                                                { post.tags.map(tag => (
                                                    <span className = "bg-white px-2 py-0.5 rounded-lg text-black text-sm font-bold">{ tag }</span>
                                                )) }

                                                {/* <span className = "ml-auto font-extrabold link">Read <HiArrowRight className = "inline" /></span> */}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )
                        }) }
                   </div>
                </div>
			</div>
		</>
	)
}

export const getServerSideProps = () => {
    const folder = path.join(process.cwd(), 'posts/');
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter((file) => file.endsWith(".md"));
    const posts = markdownPosts.map((fileName) => {
        const fileContents = fs.readFileSync(`${folder}${fileName}`);
        const matterResults = matter(fileContents);

        return {
            title: matterResults.data.title,
            subtitle: matterResults.data.subtitle,
            edited: matterResults.data.edited,
            date: matterResults.data.date,
            headerImg: matterResults.data.headerImg || null,
            headerAlt: matterResults.data.headerAlt || null,
            tags: matterResults.data.tags,
            slug: fileName.replace('.md', ''),
            hidden: matterResults.data.hidden,
        }
    })
    return {
        props: {
            posts
        }
    };
}

export default Tutorials;