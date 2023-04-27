import { useState } from 'react';
import { Preferences } from './interfaces';

export default function usePreferences(): [Preferences, any] {
    const [preferences, setPreferences] = useState<Preferences | null>(null);

    // Get preferences from localStorage
    if (typeof window !== 'undefined' && preferences === null) {
        let localPreferences = localStorage.getItem("preferences");

        if (localPreferences === null || localPreferences === undefined) {
            setPreferences({
                theme: "dark",
                solidBackground: false,
            })
    
            localStorage.setItem("preferences", JSON.stringify({
                theme: "dark",
                solidBackground: false,
            }));
        } else {
            setPreferences(JSON.parse(localPreferences));
        }
    }
    
    const updatePreferences = (key: string, value: string) => {
        setPreferences({
            ...preferences, [key]: value
        })

        localStorage.setItem("preferences", JSON.stringify(preferences));
    }

    return [preferences, updatePreferences];
}