import { Card } from '../'

const ChatCard = (props) => {
    return (
        <Card title = "Twitch Chat" id = "chat-card" dismissible = {true} onDismiss = {props.setDismissedCards} dismissedCards = {props.dismissedCards}>
            <iframe id="twitch-chat-embed"
                    src={`https://www.twitch.tv/embed/${props.channel}/chat?darkpopout&parent=${typeof window !== "undefined" && window.location.hostname}`}
                    height="500"
                    width="100%"
                    className = "rounded-lg">
            </iframe>
        </Card>
    )    
}

export default ChatCard;