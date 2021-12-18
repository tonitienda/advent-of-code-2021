const { getFileLines } = require('../input-tools')

const homeworkLines = getFileLines('day-18/test0.txt')


const explode = (tree) => {
    

    return tree
}

const makeTree = (expression, parent = null, depth = 0) => {
    const [l,r] = expression

    const node = {}

    node.left = Array.isArray(l) ? makeTree(l, node, depth+1) : l
    node.right = Array.isArray(r) ? makeTree(r, node, depth+1) : r
    node.parent = parent
    node.depth = depth
    
    return node
}

const makeArray = (tree) => {
    const { left, right } = tree 

    const leftValue = left.parent ? makeArray(left) : left 
    const rightValue = right.parent ? makeArray(right) : right 

    return [leftValue, rightValue]
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

const printTree = tree => console.log(JSON.stringify(makeArray(tree)))

let [first, ...rest] = homeworkLines

let current = makeTree(eval(first))

while(rest.length > 0) {
    let [next, ...tail] = rest 
    rest = tail

    const toAdd =  makeTree(eval(next))

    printTree(current)
    printTree(toAdd)

    const joined = add(current, toAdd)
    const exploded = explode(joined)
}

//console.log(first, second, JSON.stringify(makeArray(add(makeTree(eval(first)), makeTree(eval(second))))))


// console.log(calculateMagnitude(makeTree([[1, 2], [[3, 4], 5]])), '=>', 143)
// console.log(calculateMagnitude(makeTree([[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]])), '=>', 1384)
// console.log(calculateMagnitude(makeTree([[[[1, 1], [2, 2]], [3, 3]], [4, 4]])), '=>', 445)
// console.log(calculateMagnitude(makeTree([[[[3, 0], [5, 3]], [4, 4]], [5, 5]])), '=>', 791)
// console.log(calculateMagnitude(makeTree([[[[5, 0], [7, 4]], [5, 5]], [6, 6]])), '=>', 1137)
// console.log(calculateMagnitude(makeTree([[[[8, 7], [7, 7]], [[8, 6], [7, 7]]], [[[0, 7], [6, 6]], [8, 7]]])), '=>', 3488)
// console.log(calculateMagnitude(makeTree([1,1])))
// console.log(calculateMagnitude(makeTree([[[[4,3],4],4],[7,[[8,4],9]]])))
