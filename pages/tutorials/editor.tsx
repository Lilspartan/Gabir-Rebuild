import { useState, useEffect } from 'react';
import { Button, Loading, SEO , CalendarRow, Navbar, Modal } from '../../components';
import Markdown from 'markdown-to-jsx';
import { ArticleMetaData, Driver } from '../../utils/interfaces';
import DefaultTemplate from '../../templates/Default';
import { BsFillSunFill, BsFillMoonFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as DarkStyle, oneLight as LightStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Editor = ()  => {
    const [metadata, setMetadata] = useState<ArticleMetaData>({
        title: "Test Title",
        subtitle: "",
        headerImg: "/1.jpg",
        headerAlt: null,
        date: "",
        edited: "N/A",
        authorID: -1,
        tags: [ "" ],
        hidden: false
    })
    const [content, setContent] = useState("## Write your article here\n\nYou have the full power of markdown at your disposal\n\nto learn more about markdown, [click here](https://www.markdownguide.org/basic-syntax/)\n\n> Click the eye icon in the bottom right to preview\n\n");
    const [previewMode, setPreviewMode] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {   
        let c = localStorage.getItem("content");
        if (c !== null) {
            setContent(c);
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

	return (
		<>
			<SEO 
				title = {`Gabir Motors | Tutorial Editor`} 
				url = {"tutorials/editor"} 
			/>

			<Navbar />

			<DefaultTemplate
                doLoading = {false}
                title = {`Gabir Motors | Article Editor`} 
				desc = {`Create and preview your own Gabir Motors tutorials`}
				url = {"tutorials/editor"} 
                solidBg = {true} 
                darkMode = {darkMode}
            >
                { previewMode ? (
                    <>
                        <section className="lg:mx-auto mt-16 mx-4 lg:w-1/2">    
                            { metadata.headerImg !== null && metadata.headerImg !== "" ? (
                                <div className = "my-8 rounded-lg shadow-xl flex flex-col justify-end text-white"
                                    style = {{ 
                                        backgroundImage: `url('${metadata.headerImg}')`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}
                                >
                                    <div className = "p-4 w-full rounded-lg" style = {{ paddingTop: "10%", background: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)", opacity: 1, scale: 1 }}>
                                        <h1 className = "drop-shadow-xl lg:text-5xl text-3xl font-extrabold mb-4">{ metadata.title }</h1>
                                        <span className = "italic dark:opacity-60 opacity-80 block">Last Edit: N/A</span>
                                        <h3 className = "font-bold inline">Written By: <span className = "font-normal">Anonymous</span></h3>
                                    </div>
                                </div>
                            ) : (
                                <div className = "mt-16">
                                    <h1 className = "drop-shadow-xl lg:text-5xl text-3xl font-extrabold mb-4">{ metadata.title }</h1>
                                    <span className = "italic dark:opacity-60 opacity-80 block">Last Edit: N/A</span>
                                    <h3 className = "font-bold inline">Written By: <span className = "font-normal">Anonymous</span></h3>
                                </div>
                            ) }
                        
                            <article className = "prose prose-sm lg:prose-xl dark:prose-invert">
                                <Markdown options={{
                                    overrides: {
                                        pre: PreBlock,
                                    },
                                }}>{ content }</Markdown>
                            </article>
                        </section>
                    </>
                ) : (
                    <div className = "lg:w-1/2 mx-4 lg:mx-auto mt-8">
                        <div className = "block">
                            <label htmlFor="title">Title</label>
                            <input 
                                name = "title" 
                                id = "title" 
                                type="text" 
                                className = "dark:bg-black bg-[#eeeeee] px-2 py-1 rounded-lg my-2 mx-2" 
                                placeholder = "Article Title" value = {metadata.title} 
                                onChange = {(e) => { 
                                    setMetadata({ ...metadata, title: e.target.value }) 
                                }} />
                        </div>

                        <div className = "block">
                            <label htmlFor="headerimg">Header Image</label>
                            <input 
                                name = "headerimg" 
                                id = "headerimg" 
                                type="url" 
                                className = "dark:bg-black bg-[#eeeeee] px-2 py-1 rounded-lg my-2 mx-2" 
                                placeholder = "Header Image (URL)" value = {metadata.headerImg} 
                                onChange = {(e) => { 
                                    setMetadata({ ...metadata, headerImg: e.target.value }) 
                                }} />
                        </div>

                        <textarea name="Content" id="Content" className = "mt-8 dark:bg-black bg-[#eeeeee] h-96 w-full p-4 rounded-lg" value = {content} onChange = {(e) => {
                            setContent(e.target.value);
                            localStorage.setItem("content", e.target.value);
                        }}></textarea>
                    </div>
                ) }
            </DefaultTemplate>

            <div className = "fixed bottom-0 right-0 text-xl flex flex-row dark:text-black text-white m-4">
                <a className = "rounded-l-xl px-2 cursor-pointer py-2 dark:bg-white bg-black transition duration-200 opacity-70 hover:opacity-100" onClick = { () => { setDarkMode(!darkMode); localStorage.setItem("reading-theme", !darkMode ? "dark" : "light") } }><span>{ darkMode ? <BsFillSunFill /> : <BsFillMoonFill /> }</span></a>
                <a className = "rounded-r-xl px-2 cursor-pointer py-2 dark:bg-white bg-black transition duration-200 opacity-70 hover:opacity-100" onClick = { () => { setPreviewMode(!previewMode) } }><span>{ previewMode ? <BsEyeFill /> : <BsEyeSlashFill /> }</span></a>
            </div>
		</>
	)
}

export default Editor;