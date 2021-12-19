const { getFileLines } = require('../input-tools')

const homeworkLines = getFileLines('day-18/test1.txt')

const findLeftMostLevel4 = (node) => {
    if (node.depth === 4) {
        return node
    }

    const left = findLeftMostLevel4(node.left)

    if (left) {
        return left
    }

    return findLeftMostLevel4(node.right)

}


const split = (list) => {

    let result = list

    let itemToSplit = result.findIndex(n => n.value >= 10)
    let wasSplit = false

    while (itemToSplit > -1) {
        wasSplit = true
        let item = result[itemToSplit]

        const leftList = result.slice(0, Math.max(itemToSplit, 0))
        const rightList = result.slice(itemToSplit + 1)

        result = [
            ...leftList,
            { value: Math.floor(item.value / 2), depth: item.depth + 1 },
            { value: Math.ceil(item.value / 2), depth: item.depth + 1 },
            ...rightList
        ]

        itemToSplit = result.findIndex(n => n.value >= 10)


    }

    return [wasSplit, result]

}
const explode = (list) => {
    // Find the left most node with depth 4
    let pairtToExplode = list.findIndex(n => n.depth >= 4)
    let result = list
    let wasExploded = false

    while (pairtToExplode > -1) {
        wasExploded = true
        const leftNode = result[pairtToExplode]
        const rightNode = result[pairtToExplode + 1]

        const nodeToAddLeft = result[pairtToExplode - 1]
        const nodeToAddRight = result[pairtToExplode + 2]

        const leftList = result.slice(0, Math.max(pairtToExplode - 1, 0))
        const rightList = result.slice(pairtToExplode + 3)

        const explodedPart = [
            nodeToAddLeft ? { ...nodeToAddLeft, value: nodeToAddLeft.value + leftNode.value } : null,
            { value: 0, position: "?", depth: leftNode.depth - 1 },
            nodeToAddRight ? { ...nodeToAddRight, value: nodeToAddRight.value + rightNode.value } : null,
        ].filter(n => n !== null)


        result = [
            ...leftList,
            ...explodedPart,
            ...rightList
        ]

        pairtToExplode = result.findIndex(n => n.depth === 4)

    }

    return [ wasExploded, result]
}

const makeTree = (expression, parent = null, depth = 0) => {
    const [l, r] = expression

    const node = {}

    node.left = Array.isArray(l) ? makeTree(l, node, depth + 1) : l
    node.right = Array.isArray(r) ? makeTree(r, node, depth + 1) : r
    node.parent = parent
    node.depth = depth

    return node
}

const makeList = (expression, current = "", depth = 0) => {
    const [l, r] = expression

    return [
        ...(Array.isArray(l) ? makeList(l, current + "l", depth + 1) : [{ value: l, position: current + "l", depth }]),
        ...(Array.isArray(r) ? makeList(r, current + "r", depth + 1) : [{ value: r, position: current + "r", depth }])
    ]
}

const makeArray = (tree) => {
    const { left, right } = tree

    const leftValue = left.parent ? makeArray(left) : left
    const rightValue = right.parent ? makeArray(right) : right

    return [leftValue, rightValue]
}

const calculateMagnitude = (tree) => {
    const { left, right } = tree

    const leftValue = left.parent ? calculateMagnitude(left) : left
    const rightValue = right.parent ? calculateMagnitude(right) : right

    return 3 * leftValue + 2 * rightValue
}

const updateDepths = (tree, depth = 0) => {
    tree.depth = depth

    const { left, right } = tree

    if (left.parent) {
        updateDepths(left, depth + 1)
    }

    if (right.parent) {
        updateDepths(right, depth + 1)
    }
}

const add = (tree1, tree2) => {
    const node = {}

    tree1.parent = node
    tree2.parent = node

    node.left = tree1
    node.right = tree2
    node.parent = null

    updateDepths(node)

    return node
}

const printTree = tree => console.log(JSON.stringify(makeArray(tree)))

let [currentList, ...rest] = homeworkLines.map(l => makeList(eval(l)))

while(rest.length > 0) {
    let [next, ...tail] = rest 
    rest = tail

    
    console.log(currentList)
    console.log(next)

    currentList = currentList.concat(next).map(i => ({...i, depth: i.depth + 1}))

    let wasSplit = false 
    let wasExploded = false
    do {
    
        let explRes = explode(currentList)
        let splRes = split(explRes[1])
    
        wasSplit = splRes[0]
        wasExploded = explRes[0]
        currentList = splRes[1]
    } while(wasSplit || wasExploded)

   
    
    console.log('---')
    console.log(currentList)
    console.log('---')
    
    console.log()
}


console.log(currentList)


// const test = makeList([[[[[9,8],1],2],3],4])
// //console.log(test, null, 2)
// const result = explode(test)
// console.log(result)



// const test2 = makeList([7,[6,[5,[4,[3,2]]]]])
// //console.log(test, null, 2)
// const result2 = explode(test2)
// console.log(result2)





// console.log(list)

// const exploded = explode(list)
// console.log(exploded)

// const splitted = split(exploded)

// console.log(splitted)

// const splitted2 = explode(splitted)
// console.log(splitted2)

// // const exploded2 = explode(exploded)
// // console.log(exploded2)


// //console.log(test)

// //console.log(first, second, JSON.stringify(makeArray(add(makeTree(eval(first)), makeTree(eval(second))))))


// // console.log(calculateMagnitude(makeTree([[1, 2], [[3, 4], 5]])), '=>', 143)
// // console.log(calculateMagnitude(makeTree([[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]])), '=>', 1384)
// // console.log(calculateMagnitude(makeTree([[[[1, 1], [2, 2]], [3, 3]], [4, 4]])), '=>', 445)
// // console.log(calculateMagnitude(makeTree([[[[3, 0], [5, 3]], [4, 4]], [5, 5]])), '=>', 791)
// // console.log(calculateMagnitude(makeTree([[[[5, 0], [7, 4]], [5, 5]], [6, 6]])), '=>', 1137)
// // console.log(calculateMagnitude(makeTree([[[[8, 7], [7, 7]], [[8, 6], [7, 7]]], [[[0, 7], [6, 6]], [8, 7]]])), '=>', 3488)
// // console.log(calculateMagnitude(makeTree([1,1])))
// // console.log(calculateMagnitude(makeTree([[[[4,3],4],4],[7,[[8,4],9]]])))
