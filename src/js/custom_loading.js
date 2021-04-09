import {
    create,
    fractionDependencies,
    addDependencies,
    divideDependencies,
    formatDependencies
} from "mathjs"

/*
,
      "mathjs": {
        "version": "9.3.0",
        "src": "lib/browser/math.js",
        "target": "lib/js/mathjs/"
      }
 */

const config = {
    // optionally, you can specify configuration
}

// Create just the functions we need
const { fraction, add, divide, format } = create({
    fractionDependencies,
    addDependencies,
    divideDependencies,
    formatDependencies
}, config)

// Use the created functions
const a = fraction(1, 3)
const b = fraction(3, 7)
const c = add(a, b)
const d = divide(a, b)
console.log('c =', format(c)) // outputs "c = 16/21"
console.log('d =', format(d)) // outputs "d = 7/9"