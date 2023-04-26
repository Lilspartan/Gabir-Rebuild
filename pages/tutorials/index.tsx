import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow, Navbar, Modal } from '../../components';
import { Client } from "gabir-motors";
import { motion } from 'framer-motion';
import fs from 'fs';
import Link from 'next/link';
import matter from 'gray-matter';
import path from 'path';

const Tutorials = (props)  => {
	return (
		<>
			<SEO 
				title = "Gabir Motors | Tutorials" 
				description = "View the schedule for the Gabir Motors Cup" 
				url = "calendar"
			/>

			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen">
                <div className = "flex flex-col content-center min-h-screen background-carbon_fiber w-full">
                   <div className="flex flex-col w-full lg:w-1/2 mx-2 lg:mx-auto my-16 gap-4">
                        { props.posts.map(post => (
                            <div>
                                <Link href = {`/tutorials/${post.slug}`}>
                                    <div className = "bg-dark-card-body p-4 cursor-pointer">
                                        <h2 className = "text-3xl font-bold">{ post.title }</h2>
                                        <span className = "italic opacity-60">{ post.date }</span>
                                        <h3 className="text-xl">{ post.subtitle }</h3>
                                    </div>
                                </Link>
                            </div>
                        )) }
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
            subtitle: matterResults.data.subtitle || "",
            edited: matterResults.data.edited || "",
            date: matterResults.data.date,
            slug: fileName.replace('.md', ''),
        }
    })
    return {
        props: {
            posts
        }
    };
}

export default Tutorials;