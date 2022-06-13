import { Card } from '../'

const ChatCard = () => {
    return (
        <Card title = "Twitch Chat" id = "chat-card">
            <iframe id="twitch-chat-embed"
                    src="https://www.twitch.tv/embed/pennyarcade/chat?parent=localhost"
                    height="500"
                    width="100%"
                    className = "rounded-lg">
            </iframe>
        </Card>
    )    
}

export default ChatCard;