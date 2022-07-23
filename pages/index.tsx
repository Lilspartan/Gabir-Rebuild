import { useState, useEffect } from 'react';
import { Button, Loading, SEO } from '../components';
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
			<SEO />

			<Loading loading = { loading } />

			<div id = "bg" className = {`dark background-c min-h-screen h-auto`}>
				{/* <Alert permaDismiss = {true} title = "Notice" id = "in-testing" body = "Multiple pit walls is currently in testing" /> */}

				{/* <span className="text-white fixed p-2 z-40 opacity-50">Gabir Motors Pit Wall V1.2</span> */}

				<div className = "text-black dark:text-white flex flex-col-reverse lg:flex-row justify-center lg:px-16">

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
                        <option value = {channel} key = {i}>{ channel }</option>
                      )
                    })}
                  </select>
                </div>
                
                <div className = " p-8">
                  <Button link = {`/user/${selected}`} block = {true}>Enter the Pit Wall</Button>  
                </div>
              </div>
              <div className = "lg:w-1/2 lg:border-l-2">
                <h2 className = "text-4xl font-extrabold text-center mb-20">DRIVER</h2>

                <div className = " p-8">
                  <Button link = {`/download`} block = {true}>Download Driver Client</Button>  
                </div>
              </div>
            </div>
          </div>

				</div>
			</div>
		</>
	)
}