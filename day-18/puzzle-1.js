const { getFileLines } = require('../input-tools')

const homeworkLines = getFileLines('day-18/test.txt')


const makeTree = (expression, parent = null, depth = 0) => {
    const [l,r] = expression

    const node = {}

    node.left = Array.isArray(l) ? makeTree(l, node, depth+1) : l
    node.right = Array.isArray(r) ? makeTree(r, node, depth+1) : r
    node.parent = parent
    node.depth = depth
    
    return node
}

const calculateMagnitude = (tree) => {
    const {left, right} = tree

    const leftValue = left.parent ? calculateMagnitude(left) : left
    const rightValue = right.parent ? calculateMagnitude(right) : right

    return 3 * leftValue + 2 * rightValue
}

const updateDepths = (tree, depth = 0) => {
    tree.depth = depth 

    const {left, right} = tree 

    if(left.parent) {
        updateDepths(left, depth + 1)
    }
    
    if(right.parent) {
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

// const [first, second, ...rest] = homeworkLines 
// console.log(calculateMagnitude(makeTree([[1, 2], [[3, 4], 5]])), '=>', 143)
// console.log(calculateMagnitude(makeTree([[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]])), '=>', 1384)
// console.log(calculateMagnitude(makeTree([[[[1, 1], [2, 2]], [3, 3]], [4, 4]])), '=>', 445)
// console.log(calculateMagnitude(makeTree([[[[3, 0], [5, 3]], [4, 4]], [5, 5]])), '=>', 791)
// console.log(calculateMagnitude(makeTree([[[[5, 0], [7, 4]], [5, 5]], [6, 6]])), '=>', 1137)
// console.log(calculateMagnitude(makeTree([[[[8, 7], [7, 7]], [[8, 6], [7, 7]]], [[[0, 7], [6, 6]], [8, 7]]])), '=>', 3488)
// console.log(calculateMagnitude(makeTree([1,1])))
// console.log(calculateMagnitude(makeTree([[[[4,3],4],4],[7,[[8,4],9]]])))

const first = [1,1]
const second = [2,2]

const left = makeTree(first)
const right = makeTree(second)

console.log(left)
console.log(right)

const tree = add(left, right)

console.log(tree)