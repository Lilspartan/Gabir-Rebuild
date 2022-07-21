const convertToImperial = (amount: number, unit: "L" | "C" | "M" | "KM", dontConvert: boolean): [number] => {
    if (dontConvert) {
        return [amount];
    }

    switch (unit) {
        case "L":
            return [(amount * 0.264172052)];
        case "C":
            return [amount * 1.8 + 32];
        case "M":
            // convert meters to feet
            // return [amount * 62362204.7242];
            return [amount * 2.237];
        case "KM":
            return [amount * 0.621371192];
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}

export default convertToImperial;