exports.truncString = (string, n) => {
    return (string.length > n) ? string.substr(0, n - 1) + '…' : string;
};

exports.generateShortUID = () => {
    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
};

exports.fileIsImage = (mime) => {
    const imageType = /^image\//;

    return !!imageType.test(mime);
};
