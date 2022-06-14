const convertToImperial = (amount: number, unit: "L" | "C" | "M" | "KM", dontConvert: boolean): [number, string] => {
    if (dontConvert) {
        return [amount, unit];
    }

    switch (unit) {
        case "L":
            return [(amount * 0.264172052), "Gallons"];
        case "C":
            return [amount * 1.8 + 32, "F"];
        case "M":
            // convert meters to feet
            return [amount * 3.280839895, "ft"];
        case "KM":
            return [amount * 0.621371192, "mi"];
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}

export default convertToImperial;