import { useState, useEffect } from 'react';
import { Loading, SEO, Navbar } from '../../components';
import { ArticleMetaData, IracingAPIData, Driver } from '../../utils/interfaces';
import { useRouter } from 'next/router'
import axios from 'axios';

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

const Profile = ()  => {
	const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IracingAPIData | null>(null);
    const [articles, setArticles] = useState<ArticleMetaData[] | null>(null);
    const [driverData, setDriverData] = useState<Driver | null>(null)

    const router = useRouter()
    const { account_id: ID } = router.query

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500)
	}, [])

    useEffect(() => {
        (async () => {
			if (ID) {
                let res = await axios.get('/api/iracing_data/' + ID);
                
                if (res.data) {
                    setData(res.data);

                    let articles_res = await axios.get('/api/articles/' + ID);

                    if (articles_res.data.length) {
                        setArticles(articles_res.data);
                    }
                }

                let driverRes = await axios.get('https://api.gabirmotors.com/driver/accountid/' + ID);

                if (driverRes.data.length) {
                    setDriverData(driverRes.data[0]);
                }
            }
		})()
    }, [ ID ])

	return (
		<>
			<SEO title = {`Gabir Motors | Driver Profile`} />

			<Loading loading = { loading } />
 
			<Navbar />

			<div className = "min-h-screen absolute overflow-hidden text-white max-w-full w-screen background-carbon_fiber">
                {data !== null && (
                    <div className = "flex flex-col lg:flex-row justify-around lg:gap-8 gap-4 lg:mx-16 mx-4 mt-4 min-h-screen">
                        <div className="flex flex-col gap-4 lg:gap-8 flex-grow lg:my-8">
                            <div className = "bg-dark-card-handle p-8 rounded-lg flex flex-row gap-8">
                                { driverData !== null && driverData.team &&  (
                                    <img className = "h-24 my-auto inline" src = {`https://i.gabirmotors.com/assets/teams/${driverData.team.abbr}/main.png`} alt = {`${driverData.team.name} logo`} />
                                ) }

                                <div className = "my-auto">
                                    <h1 className = "text-center font-extrabold text-4xl">{ data.memberInfo.displayName }</h1>
                                    <h3 className = "text-center font-bold text-xl">Joined { data.memberInfo.memberSince }</h3>
                                    <h3 className = "text-center text-xl">Last Seen { timeSince(new Date(data.memberInfo.lastLogin)) } ago</h3>
                                </div>

                                <div className="my-auto">
                                    
                                </div>

                                {/* <div className = "flex flex-col">
                                    { data.memberInfo.licenses.map((license, index) => (
                                        <div key = {index} className = "flex flex-row gap-2 font-extrabold text-black px-2 py-1 my-2 rounded-lg" style = {{ backgroundColor: "#" + license.color }}>
                                            <span>{ license.category.charAt(0).toUpperCase() + license.category.replace("_", " ").slice(1) }</span>
                                            <span>{ license.groupName }</span>
                                        </div>
                                    )) }
                                </div> */}
                            </div>

                            <div className = "flex-grow bg-dark-card-handle p-4 lg:p-8 rounded-lg">
                                <span className = "font-bold text-2xl">Recent Awards</span>

                                { data.recentAwards.map((award, i) => (
                                    <div key = { i } className = "my-4 bg-[#333333] rounded-lg p-4 flex flex-row">
                                        <img src = {`https://members.iracing.com${award.iconUrlLarge}`} alt="" className = "inline w-12 my-auto rounded-lg mr-4" />
                                        <span className = "font-bold text-lg my-auto">{ award.name }</span>
                                        {/* <span className = "ml-auto italic my-auto">Awarded { award.awardCount } times</span> */}
                                        <span className = "ml-auto italic my-auto">{ timeSince(new Date(award.awardDate)) } ago</span>
                                    </div>
                                )) }
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-8 lg:my-8 flex-grow">
                            { data.recentEvents.length >= 1 && (
                                <div className = "bg-dark-card-handle p-4 lg:p-8 rounded-lg">
                                    <span className = "font-bold text-2xl">Recent Events</span>

                                    { data.recentAwards.length ? data.recentEvents.map((event, i) => (
                                        <div key = { i } className = "my-4 bg-[#333333] rounded-lg p-4 flex flex-row">
                                            <img src = {event.logoUrl} alt="" className = "inline w-12 my-auto rounded-lg mr-4" />
                                            <span className="my-auto font-bold">{ event.eventName }</span>
                                            <span className="ml-auto italic font-extrabold">{ event.eventType }</span>
                                        </div>
                                    )) : "No Recent Events" }
                                </div>
                            ) }

                            { articles && articles.length && (
                                <div className = "bg-dark-card-handle p-4 lg:p-8 rounded-lg">
                                    <span className = "font-bold text-2xl">Articles</span>

                                    { articles.map((article, i) => (
                                        <a href = {`https://gabirmotors.com/tutorials/${article.slug}`} target = "_blank">
                                            <div key = { i } className = "my-4 bg-[#333333] rounded-lg p-4 flex flex-row hover:shadow-lg transition duration-300">
                                                <span className="my-auto font-bold">{ article.title }</span>
                                            </div>
                                        </a>
                                    )) }
                                </div>
                            ) }
                        </div>
                    </div>
                )}
			</div>
		</>
	)
}

export default Profile;