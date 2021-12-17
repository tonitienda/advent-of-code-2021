const { getFileContent } = require('../input-tools')


const HexMap = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111",
}

const toBinary = (hex) => {
   return hex.split("").map(c => HexMap[c]).join("")
}

const processHeader = (binary) => {
    const version = binary.substring(0, 3)
    const type = binary.substring(3, 6)


    return [{
        version: parseInt(version, 2), type: parseInt(type, 2)
    }, binary.substring(6)]
}

const processLiteralBody = (binary) => {
    let i = 0
    let number = ""
    let isLast = false
    const blockLength = 5
    while (!isLast) {
        let block = binary.substring(i * blockLength, blockLength + i * blockLength)

        number += block.substring(1, blockLength)
        isLast = block[0] === "0"
        i++
    }

    //console.log(`Literal package:`, number)
   // console.log("Remove trailing zeroes:",  (i * blockLength), '=>',  (i * blockLength + (4 - (i * blockLength) % 4) %4))

    const blockToIgnore =  (i * blockLength + (4 - (i * blockLength) % 4) %4)
    return [parseInt(number, 2), binary.substring(blockToIgnore)]
}

const processOperator1Body = (binary) => {
    //console.log(`processOperator1Body:`, binary)

    const packetsNumber = parseInt(binary.substring(0, 11), 2)

    //console.log(`Packets number:`, packetsNumber)

    return processPacket(binary.substring(11), packetsNumber)
}


const processOperator0Body = (binary) => {

    //console.log(`processOperator0Body`)
    const length = parseInt(binary.substring(0, 15), 2)

    const packets = binary.substring(15, 15 + length)
    //console.log(length, '-', binary, '=>', packets)
    const [value, _] = processPacket(packets)

    return [value, binary.substring(15 + length)]
}

const processOperatorBody = (binary) => {
    const type = binary.substring(0, 1)
    if (type === "1") {
        return processOperator1Body(binary.substring(1))
    } else {
        return processOperator0Body(binary.substring(1))
    }
}


const processPacket = (binary, packetsNumber) => {
    let rest = binary

    const packets = []
    //console.log(`out - packetsNumber:`,packetsNumber, `packets:`, packets.length)

    while (rest.length > 0 && (!packetsNumber || packets.length < packetsNumber)) {
        //   console.log(`packetsNumber:`,packetsNumber, `packets:`, packets.length)
        console.log(rest)
        const [header, rest2] = processHeader(rest)
        rest = rest2

        console.log(header)
        if (header.type === 4) {
            const [value, rest3] = processLiteralBody(rest)
            packets.push(
                {
                    ...header,
                    value
                }
            )
            rest = rest3
            console.log(rest.length)
        } else {
            // console.log(`processing operator`)
            const [subpackets, rest4] = processOperatorBody(rest)

            packets.push(
                {
                    ...header,
                    subpackets
                }
            )
            rest = rest4

        }
    }
    console.log('exit')

    return [packets, rest]
}


// TEST1 = 16
// TEST2 = 12
// TEST3 = 23
// TEST4 = 31
const packet = getFileContent('day-16/test3.txt')[0]
const binary = toBinary(packet)


console.log(packet)
console.log(binary)

const [packets, rest] = processPacket(binary)

//console.log(JSON.stringify(packets, null, 2))