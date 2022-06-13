import { Card } from '..'

const StreamCard = () => {
    return (
        <Card title = "Twitch Stream" id = "stream-card">
            <iframe src="https://player.twitch.tv/?channel=pennyarcade&parent=localhost" className = "rounded-lg" allowFullScreen = {true} frameBorder="0" scrolling="no" height="340" width="100%"></iframe>
        </Card>
    )    
}

export default StreamCard;
