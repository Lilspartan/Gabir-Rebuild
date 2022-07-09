const secondsToFormatted = (seconds: number) => {
    if (seconds === -1) {
        return "N/A";
    }

    let _seconds = seconds;
    let _tempSeconds = _seconds;
    _seconds = _seconds % 60;
    let minutes = (_tempSeconds - _seconds) / 60;
    return `${(minutes > 0 ? minutes + ":" : "")}${(_seconds < 10 ? (minutes > 0 ? "0" : "") + _seconds.toFixed(3) : _seconds.toFixed(3))}`
}

export default secondsToFormatted;