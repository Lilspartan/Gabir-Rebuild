import fs from 'fs';
import path from 'path';
import axios from 'axios'
import Head from 'next/head';
import slugify from 'slugify';
import matter from 'gray-matter';
import { motion } from 'framer-motion';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import { Modal } from '../../components';
import { useState, useEffect } from 'react';
import DefaultTemplate from '../../templates/Default';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ArticleMetaData, Driver, PitwallData } from '../../utils/interfaces';
import { oneDark as DarkStyle, oneLight as LightStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { AiOutlineTwitter } from 'react-icons/ai';
import { BsFillMoonFill, BsFillSunFill, BsShareFill, BsTwitch, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { HiArrowLeft, HiArrowUp } from 'react-icons/hi';
import { MdOpenInFull, MdCloseFullscreen } from 'react-icons/md';
import { BiLinkExternal } from 'react-icons/bi';

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

export interface TwitchStream {
    id:            string;
    user_id:       string;
    user_login:    string;
    user_name:     string;
    game_id:       string;
    game_name:     string;
    type:          string;
    title:         string;
    viewer_count:  number;
    started_at:    string;
    language:      string;
    thumbnail_url: string;
    tag_ids:       any[];
    tags:          string[];
    is_mature:     boolean;
}

function getTimezoneName() {
    const today = new Date();
    const short = today.toLocaleDateString(undefined);
    const full = today.toLocaleDateString(undefined, { timeZoneName: 'short' });
  
    // Trying to remove date from the string in a locale-agnostic way
    const shortIndex = full.indexOf(short);
    if (shortIndex >= 0) {
      const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
      
      // by this time `trimmed` should be the timezone's name with some punctuation -
      // trim it from both sides
      return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  
    } else {
      // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
      return full;
    }
}

const Time = ({ timestamp }: { timestamp: number | string }) => {
    const dateToTime = date => date.toLocaleString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric'
    });

    let localDate = new Date(Number(timestamp));

    return (
        <span className = "ml-2 dark:bg-[#333333] dark:text-white bg-[#eeeeee] text-black px-2 py-1 rounded-lg">{ dateToTime(localDate) } { getTimezoneName() }</span>
    )
}

// const secondsToFormatted = (seconds: number) => {
//     if (seconds === -1) {
//         return "N/A";
//     }

//     let _seconds = seconds;
//     let _tempSeconds = _seconds;
//     _seconds = _seconds % 60;
//     let minutes = (_tempSeconds - _seconds) / 60;
//     return `${(minutes > 0 ? minutes + ":" : "")}${(_seconds < 10 ? (minutes > 0 ? "0" : "") + _seconds.toFixed(3) : _seconds.toFixed(3))}`
// }


// const PitwallWidget = ({ channel, url }: { channel: string, url: string }) => {
//     const [pitwallData, setPitwallData] = useState<PitwallData | "fetching" | "offline" | "error">("fetching");

//     useEffect(() => {
//         (async () => {
//             try {
//                 let res = await axios.get('https://streaming.gabirmotors.com/pitwall/channel/' + url);
//                 let data = res.data;

//                 if (data.name !== undefined) {
//                     setPitwallData(data);
//                 }
//             } catch (e) {
//                 setPitwallData("offline");
//             }
//         })()
//     }, [])

//     return (
//         <>
//             { pitwallData !== "error" && pitwallData !== "fetching" && pitwallData !== "offline" && (
//                 <a href = {`https://pitwall.gabirmotors.com/user/${channel}`} target = "_blank" className = "no-underline">
//                     <div className = "dark:bg-[#333333] dark:text-white bg-[#eeeeee] text-black my-2 px-4 rounded-lg py-2 transition duration-200 hover:-translate-y-1 flex flex-row justify-between">
//                         <>
//                             <div>
//                                 <span className = "font-bold text-2xl">Race Overview:</span>

//                                 <div className="">
//                                     <div className="flex flex-row gap-2">
//                                         <span className="font-bold">Time Remaining:</span>
//                                         <span>{ new Date(pitwallData.session.session.timeRemaining * 1000).toISOString().substr(11, 8) }</span>
//                                     </div>

//                                     <div className="flex flex-row gap-2">
//                                         <span className="font-bold">Position:</span>
//                                         <span>{ pitwallData.driverData.driver.raceData.position }</span>
//                                     </div>

//                                     <div className="flex flex-row gap-2">
//                                         <span className="font-bold">Lap:</span>
//                                         <span>{ pitwallData.driverData.driver.raceData.lap }</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className = "self-end">
//                                 <span className="text-sm mr-2 opacity-70">
//                                     See more on the Pitwall
//                                 </span><BiLinkExternal className = "inline opacity-70" />
//                             </div>
//                         </>
//                     </div>
//                 </a>
//             ) }
//         </>
//     )
// }

const TwitchWidget = ({ channel }: { channel: string }) => {
    const [channelInfo, setChannelInfo] = useState<TwitchStream | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("https://api.twitch.tv/helix/streams?user_login=" + channel, {
                headers: {
                    'Client-ID': 'v354nab7jsgctl2zww4ic69tc4l3hf',
                    'Authorization': 'Bearer u26uz5iwqqe7o0flwqr517ww2r79oq'
                }
            });
            const data = await res.json();
            if (data.data.length) {
                setChannelInfo(data.data[0]);
            }
        })()
    }, [])

    return (
        <a href = {`https://twitch.tv/${channel}`} target = "_blank" className = "no-underline">
            <div className = "dark:bg-[#333333] dark:text-white bg-[#eeeeee] text-black my-2 px-4 rounded-lg py-2 transition duration-200 hover:-translate-y-1 flex flex-row">
                <div>
                    <BsTwitch className = "text-xl inline mr-2" /> { channelInfo !== null ? channelInfo.user_name : channel }
                </div>

                { channelInfo !== null ? (
                    <div className = "ml-auto text-red-500 flex flex-row">
                        <BsEyeFill className = "text-xl inline self-center mr-1"/> { channelInfo.viewer_count }
                    </div>
                ) : (
                    <div className = "ml-auto italic dark:text-zinc-400 text-zinc-500 flex flex-row">
                        <BsEyeSlashFill className = "text-xl inline self-center mr-1"/> offline
                    </div>
                ) }
            </div>
        </a>
    )
}

const Tutorials = (props: Props)  => {
    const router = useRouter();

    const [darkMode, setDarkMode] = useState(true);
    const [allDrivers, setAllDrivers] = useState<Driver[]>();

    const slug = router.query.slug;
    const content = props.content;

    useEffect(() => {
        let localTheme = localStorage.getItem('reading-theme');
        if (localTheme !== null) {
            setDarkMode(localTheme === "dark");
        }

        (async () => {
            let res = await axios.get('https://api.gabirmotors.com/drivers');
            let data = res.data;

            if (data.length) {
                setAllDrivers(data);
            }
        })();
    }, [])

    const Driver = ({ accountId }: { accountId: string }) => {
        const [driver, setDriver] = useState<Driver | "error" | "fetching">("fetching");
        const [open, setOpen] = useState(false);

        useEffect(() => {
            if (allDrivers) {
                let foundDriver = allDrivers.filter(d => {
                    return d.account_id === accountId; 
                })
                
                if (foundDriver.length) {
                    setDriver(foundDriver[0]);
                } else {
                    setDriver("error");
                }
            } else {
                setDriver("fetching");
            }
        }, [])
    
        if (driver !== "error" && driver !== "fetching") {
            return (
                <>
                    <Modal open = {open} setOpen = {setOpen} id = {`${driver.name}-inspector`}>
                        <div>
                            { driver.team !== undefined ? (
                                <a href = {`/teams/${driver.team.abbr}`}>
                                    <img src = {`https://i.gabirmotors.com/assets/teams/${driver.team.abbr}/main.png`} alt = {`${driver.team.name} logo`} className = "h-32 mx-auto" />
                                </a>
                            ) : (
                                <img src = {`https://i.gabirmotors.com/assets/teams/LWP/main.png`} alt = {`Lone Wolf Pack logo`} className = "h-32 mx-auto" />
                            ) }

                            <h2 className = "text-xl text-white" style = {{ margin: "4px 4px" }}>{ driver.car_number !== "" && <span className = "bg-white px-2 py-1 rounded-lg text-black">#{ driver.car_number }</span> } { driver.name } { driver.username !== undefined && `(${driver.username})` }</h2>
                        
                            <div className = "flex flex-row justify-center mt-4">
                                { (driver !== null && driver.links !== undefined) && driver.links.map((link) => (
                                    <span className="text-4xl mt-4"><SocialLink link = { link } dontDoDark /></span>
                                )) }
                            </div>
                        </div>
                    </Modal>

                    <span className = "font-bold ml-2 cursor-pointer dark:bg-[#333333] dark:text-white bg-[#eeeeee] text-black px-2 py-1 rounded-lg" onClick = {() => { setOpen(true) }}>
                        { driver.name } { driver.username !== undefined && `(${driver.username})` }
                    </span>
                </>
            )
        } else if (driver === "error") {
            return (
                <span className = "text-red-500 font-bold ml-2">
                    Error Fetching Driver
                </span>
            )
        } else {
            return (
                <span className = "font-bold ml-2">
                    Fetching Driver
                </span>
            )
        }
    }

    const CustomImage = ({ url, caption }: { url: string, caption: string }) => {
        return (
                <div className = "flex flex-col">
                    <a className = "flex flex-row justify-center" href = {`/posts/${slug}/${url}`} target = "_blank">
                        <img 
                            src = {`/posts/${slug}/${url}`} 
                            alt= {caption}
                            className="block" style = {{ margin: "0px" }}
                        />
                    </a>

                    <div className = "ml-2 text-sm font-bold mb-6 mt-2 text-center">{ caption }</div>
                </div>
        )
    }

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
            }).filter(item => {
                return item !== undefined;
            }))
        }, [])

        return (
            <>
                { TOC.length > 0 && (
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
                                        if (header) {
                                            return (
                                                <li className = {`my-3`} style = {{ marginLeft: `${(header.level - 2) * 16 + 8}px` }}><a href = {`#${header.id}`} className = "hover:underline">{ header.title }</a></li>
                                            )
                                        }
                                    }) }
                                </ul>
                            ) }
                        </div>
                    </div>
                ) }
            </>
        )
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": props.metadata.title,
        "image": [
          props.metadata.headerImg || "/header.jpg"
        ],
        "datePublished": new Date(props.metadata.date),
        "dateModified": new Date(props.metadata.edited),
        "author": [{
            "@type": "Person",
            "name": props.author.name,
            "url": "https://gabirmotors.com"
          }]
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
                <Head>
                    <script
                        key="structured-data"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                </Head>

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
                                    <span className="text-xl"><SocialLink link = { link } /></span>
                                )) }
                            </div>
                        </div>
                    ) : (
                        <div className = "mt-16">
                            <h1 className = "drop-shadow-xl lg:text-5xl text-3xl font-extrabold mb-4">{ props.metadata.title }</h1>
                            <span className = "italic dark:opacity-60 opacity-80 block">Last Edit: { props.metadata.edited }</span>
                            { props.author !== null && <h3 className = "font-bold inline">Written By: <span className = "font-normal">{ props.author.name } { props.author.username !== undefined && <span>({ props.author.username })</span> }</span></h3> }
                            { (props.author!==null && props.author.links !== undefined) && props.author.links.map((link) => (
                                <span className="text-xl"><SocialLink link = { link } /></span>
                            )) }
                        </div>
                     ) }
                   
                    <article className = "prose prose-sm lg:prose-xl dark:prose-invert">
                        <Markdown options={{
                            overrides: {
                                pre: PreBlock,
                                Driver: {
                                    component: Driver
                                },
                                TwitchWidget: {
                                    component: TwitchWidget
                                },
                                Time: {
                                    component: Time
                                },
                                Image: {
                                    component: CustomImage
                                }
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

const SocialLink = ({ link, dontDoDark=false }: { link: {type: string, text: string}, dontDoDark?: boolean }) => {
    const classes = `inline mx-1 cursor-pointer transition duration-200 ${dontDoDark && "text-white"}`

    switch (link.type) {
        case "twitter": return ( <a href = {`https://twitter.com/${link.text}`} target = "_blank"><AiOutlineTwitter className = {`${classes} hover:text-twitter`} /></a> );
        case "twitch": return ( <a href = {`https://twitch.com/${link.text}`} target = "_blank"><BsTwitch className = {`${classes} hover:text-twitch`} /></a> );
    }
} 

export const getServerSideProps = async (props) => {
    try {
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
    } catch (err) {
        return {
            redirect: {
              permanent: false,
              destination: "/tutorials",
            },
            props:{},
          };
    }
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