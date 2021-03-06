module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "rules": {
        "func-names": 2,
        "no-with": 2,
        "semi": [
            2,
            "always"
        ],
        "no-multiple-empty-lines": 2,
        "space-unary-ops": [
            2,
            {
                "words": false,
                "nonwords": false
            }
        ],
        "no-spaced-func": 2,
        "comma-dangle": [
            2,
            "never"
        ],
        "quotes": [
            2,
            "single"
        ],
        "yoda": [
            2,
            "always"
        ],
        "key-spacing": [
            2,
            {
                "afterColon": true
            }
        ],
        "valid-jsdoc": 2
    }
};