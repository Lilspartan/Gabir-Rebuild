import { useState, useEffect } from 'react';
import fs from 'fs';
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';
import axios from 'axios'
import { AiOutlineTwitter } from 'react-icons/ai';
import { BsFillMoonFill, BsFillSunFill, BsShareFill, BsTwitch } from 'react-icons/bs';
import { HiArrowLeft, HiArrowUp } from 'react-icons/hi';
import path from 'path';
import { ArticleMetaData, Driver } from '../../utils/interfaces';
import DefaultTemplate from '../../templates/Default';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as DarkStyle, oneLight as LightStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import slugify from 'slugify';
import { MdOpenInFull, MdCloseFullscreen } from 'react-icons/md';

interface Props {
    metadata: ArticleMetaData;
    author:   Driver;
    content:  string;
}

interface TOCType {
    title: string;
    id:    string;
    level: number;
}

const Tutorials = (props: Props)  => {
    const router = useRouter();

    const [darkMode, setDarkMode] = useState(true);

    const slug = router.query.slug;
    const content = props.content;

    useEffect(() => {
        let localTheme = localStorage.getItem('reading-theme');
        if (localTheme !== null) {
            setDarkMode(localTheme === "dark");
        }
    }, [])

    const CodeBlock = ({className, children}) => {
        let lang = 'text'; // default monospaced text
        if (className && className.startsWith('lang-')) {
          lang = className.replace('lang-', '');
        }
        return (
          <SyntaxHighlighter language={lang} style={darkMode ? DarkStyle : LightStyle}>
            {children}
          </SyntaxHighlighter>
        );
    }
    
    // markdown-to-jsx uses <pre><code/></pre> for code blocks.
    const PreBlock = ({children, ...rest}) => {
        if ('type' in children && children ['type'] === 'code') {
            return CodeBlock(children['props']);
        }
        return <pre {...rest}>{children}</pre>;
    };

    const TableOfContents = () => {
        const [TOC, setTOC] = useState<TOCType[]>([]);
        const [open, setOpen] = useState(true);

        let regex = /[*+~.()#'"!:@?]/g

        useEffect(() => {
            let splitContent = content.replaceAll('\r', '').split('\n');

            setTOC(splitContent.map((currentLine) => {
                if (currentLine.startsWith('######')) return { title: currentLine.replace('###### ', ''), id: slugify(currentLine.replace('###### ', ''), { lower: true, remove: regex }), level: 6 };
                else if (currentLine.startsWith('#####')) return { title: currentLine.replace('##### ', ''), id: slugify(currentLine.replace('##### ', ''), { lower: true, remove: regex }), level: 5 };
                else if (currentLine.startsWith('####')) return { title: currentLine.replace('#### ', ''), id: slugify(currentLine.replace('#### ', ''), { lower: true, remove: regex }), level: 4 };
                else if (currentLine.startsWith('###')) return { title: currentLine.replace('### ', ''), id: slugify(currentLine.replace('### ', ''), { lower: true, remove: regex }), level: 3 };
                else if (currentLine.startsWith('##')) return { title: currentLine.replace('## ', ''), id: slugify(currentLine.replace('## ', ''), { lower: true, remove: regex }), level: 2 };
                else if (currentLine.startsWith('#')) return { title: currentLine.replace('# ', ''), id: slugify(currentLine.replace('# ', ''), { lower: true, remove: regex }), level: 1 };
            }))
        }, [])

        return (
            <div className = "hidden md:flex fixed right-0 top-0 mt-4 h-screen w-1/3 lg:w-1/5 pointer-events-none flex-col p-4">
                <div className = "dark:bg-[#333333] bg-[#eeeeee] p-4 rounded-lg pointer-events-auto">
                    <div className="flex flex-row justify-between">
                        <h1 className = "text-2xl font-bold">Table of Contents</h1>

                        <div className = "self-center text-xl cursor-pointer" onClick = {() => { setOpen(!open) }}>
                            { open ? <MdCloseFullscreen /> : <MdOpenInFull /> }
                        </div>
                    </div>

                    { open && (
                        <ul>
                            { TOC.map((header) => {
                                if (header && header.level <= 2) {
                                    return (
                                        <li className = "my-3"><a href = {`#${header.id}`} className = "hover:underline">{ header.title }</a></li>
                                    )
                                }
                            }) }
                        </ul>
                    ) }
                </div>
            </div>
        )
    }

	return (
		<>
            <DefaultTemplate
                doLoading = {false}
                title = {`Gabir Motors | ${props.metadata.title}`} 
				desc = {`${props.metadata.subtitle}${props.author !== null && `\n\nWritten by ${props.author.name}`}`}
				url = {"tutorials/" + slug} 
                headerImg = {props.metadata.headerImg !== null ? props.metadata.headerImg : '/header.jpg'} 
                solidBg = {true} 
                darkMode = {darkMode}
            >
                <TableOfContents />

                <section className="lg:mx-auto mt-16 mx-4 md:w-2/3 md:pr-4 lg:pr-0 lg:w-1/2">
                    <div className = "w-full flex flex-row justify-start mb-8">
                        <a href = "/tutorials" className="link"><HiArrowLeft className = "inline text-xl" /> Go Back</a>
                    </div>
                    
                    { props.metadata.headerImg !== null ? (
                        <div className = "my-8 rounded-lg shadow-xl flex flex-col justify-end text-white"
                            style = {{ 
                                backgroundImage: `url('${props.metadata.headerImg}')`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                            }}
                        >
                            <div className = "p-4 w-full rounded-lg" style = {{ paddingTop: "10%", background: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)", opacity: 1, scale: 1 }}>
                                <h1 className = "drop-shadow-xl lg:text-5xl text-3xl font-extrabold mb-4">{ props.metadata.title }</h1>
                                <span className = "italic dark:opacity-60 opacity-80 block">Last Edit: { props.metadata.edited }</span>
                                { props.author !== null && <h3 className = "font-bold inline">Written By: <span className = "font-normal">{ props.author.name } { props.author.username !== undefined && <span>({ props.author.username })</span> }</span></h3> }
                                { (props.author!==null && props.author.links !== undefined) && props.author.links.map((link) => (
                                    <SocialLink link = { link } />
                                )) }
                            </div>
                        </div>
                    ) : (
                        <div className = "mt-16">
                            <h1 className = "drop-shadow-xl lg:text-5xl text-3xl font-extrabold mb-4">{ props.metadata.title }</h1>
                            <span className = "italic dark:opacity-60 opacity-80 block">Last Edit: { props.metadata.edited }</span>
                            { props.author !== null && <h3 className = "font-bold inline">Written By: <span className = "font-normal">{ props.author.name } { props.author.username !== undefined && <span>({ props.author.username })</span> }</span></h3> }
                            { (props.author!==null && props.author.links !== undefined) && props.author.links.map((link) => (
                                <SocialLink link = { link } />
                            )) }
                        </div>
                     ) }
                   
                    <article className = "prose prose-sm lg:prose-xl dark:prose-invert">
                        <Markdown options={{
                            overrides: {
                                pre: PreBlock,
                            }
                        }}>{ content }</Markdown>
                    </article>
                </section>
                
                <div className = "fixed bottom-0 right-0 text-xl flex flex-row text-black dark:text-white m-4">
                    <a className = "rounded-l-xl px-2 cursor-pointer py-2 bg-[#eeeeee] dark:bg-[#333333] transition duration-200 opacity-70 hover:opacity-100" onClick = { () => { setDarkMode(!darkMode); localStorage.setItem("reading-theme", !darkMode ? "dark" : "light") } }><span>{ darkMode ? <BsFillSunFill /> : <BsFillMoonFill /> }</span></a>
                    <a className = "px-2 cursor-pointer py-2 bg-[#eeeeee] dark:bg-[#333333] transition duration-200 opacity-70 hover:opacity-100" onClick = { () => { 
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
                     } }><BsShareFill /></a>
                    <a className = "rounded-r-xl px-2 cursor-pointer py-2 bg-[#eeeeee] dark:bg-[#333333] transition duration-200 opacity-70 hover:opacity-100" onClick = { () => { window.scrollTo(0, 0) } }><HiArrowUp /></a>
                </div>
            </DefaultTemplate>
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

    // author = null;
    
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
                tags: matterResults.data.tags,
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