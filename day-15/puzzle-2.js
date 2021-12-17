const { getFileLines, printMatrix } = require('../input-tools')

const createDistToStart = (points) => {
    const distances = []

    for (let i = 0; i < points.length; i++) {
        distances[i] = []
        for (let j = 0; j < points[i].length; j++) {
            distances[i][j] = Infinity
        }
    }

    return distances
}



const getCandidates = ([i, j], points) => {
    const size = points.length * 5 

    return [
        [i - 1, j],
        [i, j + 1],
        [i + 1, j],
        [i, j - 1]
    ].filter(p => p[0] >= 0 && p[0] < size && p[1] >= 0 && p[1] < size)

}

const findLowestNode = (distances, path) => {
    let lowestDistance = Infinity
    let node = null

    // console.log()
    // console.log(distances)
    for(let i =0; i<distances.length; i++){
        for(let j = 0; j< distances[i].length; j++) {
            const dist = getDistance(distances, i, j)
            // console.log([i,j], dist)
            if(dist < lowestDistance && !path[`${i}-${j}`]) {
                lowestDistance = dist
                node = [i,j] 

                // There is no lowest distance than 1
                if(lowestDistance <= 1) {
                    return node
                }
            }
        }
    }

    // console.log(node)
    // console.log()
    return node
}

const costsCache = []
const getCost = (points, i, j) => {
    if(!costsCache[i]) {
        costsCache[i]=[]
    }
    if(!costsCache[i][j]) {
        const adder = Math.floor(Math.max(i, j) / points.length)
        const cost = points[i % points.length][j % points.length] % 9

        costsCache[i][j] = cost + adder
    }

    return costsCache[i][j]
}

const getDistance = (distances, i, j) => {

    // console.log('getDistance')
    // console.log(distances)
    // console.log(i,j)

    if(!distances[i] || distances[i][j] === undefined) {
        // console.log(Infinity)
        return Infinity
    }

    // console.log(distances[i][j])
    // console.log()
    return distances[i][j]
}

const setDistance = (distances, i, j, distance) => {
    if(!distances[i]) {
        distances[i]=[]
    }

    // console.log(`Set Distance`)
    // console.log(i,j, distance)
    // console.log()
    distances[i][j] = distance
}

const dijkstra = (distances, points, destPoint) => {
    const path = {}
    let found = false
    while(!found) {
        const node = findLowestNode(distances, path)
        // console.log(`NODE`)
        // console.log(node)
        const id = `${node[0]}-${node[1]}`
        path[id] = true

        if(node[0] === destPoint[0] && node[1] === destPoint[1] ) {
            return path
        }

        const parentDistance = getDistance(distances, node[0], node[1])

        const adjacent = getCandidates(node, points)

        for(let [i,j] of adjacent) {
            const cost = getCost(points, i,j)
            const currentDistance = getDistance(distances, i, j)
            
            // console.log(`Cost: `, cost, `currentDistance`, currentDistance, 'parentDistance', parentDistance)

            setDistance(distances, i, j, Math.min(currentDistance, parentDistance + cost ))

        }
    }
}


const points = getFileLines('day-15/input.txt').map(l => l.split("").map(Number))
//const distances = createDistToStart(points)

// The matrix is a square
const last = (points.length * 5) -1
const destNode = [last, last]
//const destNode = [points.length -1, points.length -1]

const distances = []
distances[0] = [0]

const path = dijkstra(distances, points, destNode)
console.log()
//console.log(Object.keys(path))
console.log(distances[destNode[0]][destNode[1]])


