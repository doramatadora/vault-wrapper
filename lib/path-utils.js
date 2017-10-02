'use strict';

const pathToRegex = require('path-to-regexp');

const regexCache = {};

const regexPathTest = (pattern, path) => {
    const rx = regexCache[pattern] || (regexCache[pattern] = pathToRegex(pattern));
    return rx.test(path);
};

const matchArray = (patternArray, path) => patternArray
    ? patternArray.some(e => regexPathTest(e, path))
    : false;

const slash = {
    trim: {
        left: (str) => str && str.substr(0, 1) === '/' ? str.substr(1) : str,
        right: (str) => str && str.substr(-1) === '/' ? str.substring(0, str.length - 1) : str
    },
    append: {
        left: (str) => str && str.substr(0, 1) !== '/' ? `/${str}` : str,
        right: (str) => str && str.substr(-1) !== '/' ? `${str}/` : str
    }
};

slash.trim.edges = (str) => slash.trim.left(slash.trim.right(str));

const toObjectPath = (path) => typeof (path) === 'string'
    ? path.replace('.', '_').replace('/', '.')
    : path;

const countLevels = (path) => ( path.match(/\//g) || [] ).length + 1;

module.exports = {
    slash,
    toObjectPath,
    regexPathTest,
    matchArray,
    countLevels
};
