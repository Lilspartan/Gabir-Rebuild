import { useEffect } from 'react'

interface Props {
    to: string;
}

const Redirect = ({ to }: Props) => {
    useEffect(() => {
        window.location.href = to;
    }, [])

    return (
        <div>Redirecting...</div>
    )
}

export default Redirect