function sumArray(arr) {
    let sum = 0;

    for (let item of arr) {
        if (Array.isArray(item)) {
            sum += sumArray(item);
            continue;
        }

        sum += Number(item) || 0;
    }

    return sum;
}

function sumArrayReduce(arr) {
    return arr.reduce((acc, item) => acc + (Array.isArray(item) ? sumArrayReduce(item) : Number(item) || 0), 0);
}

console.log(sumArray(JSON.parse(process.argv[2])));
console.log(sumArrayReduce(JSON.parse(process.argv[2])));
