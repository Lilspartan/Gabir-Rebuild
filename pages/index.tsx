import { useState, useEffect } from 'react';
import { DriverCard, Card, ChatCard, StreamCard, ConnectionCard, NotesCard, Button, Loading, Alert } from '../components';
import classnames from 'classnames';
import Head from 'next/head';

export default function Channels() {
	const [loading, setLoading] = useState(true);
	const [channels, setChannels] = useState([ "" ])
  	const [selected, setSelected] = useState("");

	useEffect(() => {
		(async () => {
      let res = await fetch('https://streaming.gabirmotors.com/pitwall/channels');
      let data = await res.json();

      setChannels(data);
      setSelected(data[0])
      setLoading(false);
    })()
	}, [])

	return (
		<>
			<Loading loading = { loading } />

			<div id = "bg" className = {`dark background-c min-h-screen h-auto`}>
				{/* <Alert permaDismiss = {true} title = "Notice" id = "in-testing" body = "Multiple pit walls is currently in testing" /> */}

				{/* <span className="text-white fixed p-2 z-40 opacity-50">Gabir Motors Pit Wall V1.2</span> */}

				<div className = "text-black dark:text-white flex flex-col-reverse lg:flex-row justify-center lg:px-16">
					<Head>
						<title>Gabir Motors Pit Wall</title>
						<link rel="icon" href="/small_logo.png" />
						<link rel="stylesheet" href="https://use.typekit.net/mzl0gsb.css" />

						<meta name="title" content="Gabir Motors Pit Wall" />
						<meta name="description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />

						<meta property="og:type" content="website" />
						<meta property="og:url" content="https://pitwall.gabirmotors.com/" />
						<meta property="og:title" content="Gabir Motors Pit Wall" />
						<meta property="og:description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />
						<meta property="og:image" content="/header.jpg" />

						<meta property="twitter:card" content="summary_large_image" />
						<meta property="twitter:url" content="https://pitwall.gabirmotors.com/" />
						<meta property="twitter:title" content="Gabir Motors Pit Wall" />
						<meta property="twitter:description" content="Harness your inner Pit Crew using this handy tool to keep up with all the car stats your heart desires in real time!

						Powered by Gabir Motors, the world's premiere pretend Motorsports Company. " />
						<meta property="twitter:image" content="/header.jpg"></meta>
					</Head>

          <div className = "">
            <h1 className = "acumin text-6xl font-extrabold text-center">CHOOSE YOUR PATH</h1>
            <div className="flex flex-col lg:flex-row justify-center w-screen p-16">
              <div className = "lg:w-1/2 lg:border-r-2">
                <h2 className = "text-4xl font-extrabold text-center mb-20">PIT CREW</h2>
                
                <div className="flex flex-row justify-center">
                  <select onChange = {(e) => {
                    setSelected(e.target.value)
                  }} value = {selected} name="channel" id="channel" className = "rounded-lg text-white bg-dark-card-handle py-4 px-8 transition duration-200 text-xl font-bold">
                    {channels.map((channel, i) => {
                      return (
                        <option value = {channel}>{ channel }</option>
                      )
                    })}
                  </select>
                </div>
                
                <div className = " p-8">
                  <Button link = {`/${selected}`} block = {true}>Enter the Pit Wall</Button>  
                </div>
              </div>
              <div className = "lg:w-1/2 lg:border-l-2">
                <h2 className = "text-4xl font-extrabold text-center mb-20">DRIVER</h2>

                <div className = "w-full text-center italic font-extrabold text-gray-500 text-xl">Driver Client Coming Soon</div>
              </div>
            </div>
          </div>

				</div>
			</div>
		</>
	)
}