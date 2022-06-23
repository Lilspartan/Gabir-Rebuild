import { Card } from '../';

const ChatCard = (props) => {
    if (typeof window !== "undefined") {
        return (
            <Card title = "Twitch Chat" id = "chat-card">
                <iframe id="twitch-chat-embed"
                        src={`https://www.twitch.tv/embed/${props.channel}/chat?${props.theme === "dark" ? "darkpopout&" : ""}parent=${window.location.hostname}`}
                        height="500"
                        width="100%"
                        className = "rounded-lg">
                </iframe>
            </Card>
        )    
    } else {
        return <></>
    }
}

export default ChatCard;