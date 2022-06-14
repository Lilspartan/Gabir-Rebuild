import { Card } from '..'
import { Connection } from '../../utils/interfaces';

const ConnectionCard = ({ connection, setDismissedCards, dismissedCards }: { connection:Connection, dismissedCards:any, setDismissedCards:any },props) => {
    return (
        <Card title = "Connection Status" id = "connection-card" dismissible = {true} onDismiss = {setDismissedCards} dismissedCards = {dismissedCards}>
            <h1 className = "font-bold text-center text-xl inline">Connection Status: </h1>
                <h1 className = "font-bold text-center text-xl inline">{connection === "disconnected" ? (
                    <span className = "text-red-600">Disconnected</span> 
                ): (connection === "connected" ? (
                    <span className = "text-green-600">Connected</span> 
                ) : (
                    <span className = "text-yellow-600">Connecting</span> 
                ))}
            </h1>
        </Card>
    )    
}

export default ConnectionCard;