const convertKoboToNaira = (amount) => {
     return amount/100
}

const convertNairaToKobo = (amount) => {
     return amount * 100
}
module.exports = {convertKoboToNaira, convertNairaToKobo}