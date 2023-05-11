import { useState, useEffect } from 'react';
import { Loading, SEO, Navbar } from '../components';
import { motion } from 'framer-motion';

interface Props {
    doLoading:  boolean;
    title?:     string;
    desc?:      string
    url?:       string;
    headerImg?: string;
    children:   any;
    solidBg?:   boolean;
    darkMode?:  boolean;
}

const DefaultTemplate = ({ doLoading, title, desc, url, children, headerImg, solidBg=false, darkMode=true }: Props)  => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

    const change = {
        dark: { backgroundColor: "#222222", color: "#ffffff" },
        light: { backgroundColor: "#ffffff", color: "#222222" },
    }

	return (
		<>
			<SEO 
				title = { title }
				description = { desc }
				url = { url }
                headerImg = { headerImg }
			/>

			{ doLoading && <Loading loading = { loading } /> }

            <Navbar invertOpenButton = {!darkMode}/>

            <div className = {`${darkMode && "dark"} min-h-screen absolute overflow-hidden max-w-full w-screen`}>
                <motion.div 
                    key = {String(darkMode)} 
                    variants = {change} 
                    initial = {!loading ? (darkMode ? "light" : "dark") : (darkMode ? "dark" : "light")} 
                    animate = {!loading ? (darkMode ? "dark" : "light") : (darkMode ? "dark" : "light")} 
                    transition = {{ duration: 0.2 }}
                    className = {`flex flex-col content-center min-h-screen w-full`}>
                    { children }
                </motion.div>
            </div>
		</>
	)
}

export default DefaultTemplate;