import { useEffect } from 'react';

const Redirect = () => {
    useEffect(() => {
        window.location.href = "/tools/specmapping"
    }, [])

    return (
        <div>Redirecting...</div>
    )
}

export default Redirect