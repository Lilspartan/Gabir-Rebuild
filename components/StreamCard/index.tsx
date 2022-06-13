import { Card } from '..'

const StreamCard = (props) => {
    return (
        <Card title = "Twitch Stream" id = "stream-card" dismissible = {true} onDismiss = {props.setDismissedCards} dismissedCards = {props.dismissedCards}>
            <iframe src={`https://player.twitch.tv/?channel=${props.channel}&parent=${typeof window !== "undefined" && window.location.hostname}`} className = "rounded-lg" allowFullScreen = {true} frameBorder="0" scrolling="no" height="340" width="100%"></iframe>
        </Card>
    )    
}

export default StreamCard;
