const { normalizeURL,getURLsFromHTML } = require('./crawl.js')
const { test,expect } = require('@jest/globals')

test('normalizeURL hostname + pathname', () => {
    const input = 'https://boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'boot.dev/path'
    expect(actual).toBe(expected)
})

test('normalizeURL trailing(/)', () => {
    const input = 'https://boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'boot.dev/path'
    expect(actual).toBe(expected)
})

test('normalizeURL Capitalized and different protocol', () => {
    const input = 'http://Boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'boot.dev/path'
    expect(actual).toBe(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="https://boot.dev/path/"> 
            Boot.dev Blog
            </a>
        </body>
    </html>
            `
    const inputBaseURL = 'https://boot.dev'
    const actual = getURLsFromHTML(inputHTML,inputBaseURL)
    const expected = ['https://boot.dev/path/']
    expect(actual).toEqual(expected)
})


test('getURLsFromHTML relative',() => {
    const inputHTML = `
    <html>
        <body>
            <a href="/path/"> 
            Boot.dev Blog
            </a>
        </body>
    </html>
            `
    const inputBaseURL = 'https://boot.dev'
    const actual = getURLsFromHTML(inputHTML,inputBaseURL)
    const expected = ['https://boot.dev/path/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML multiple',() => {
    const inputHTML = `
    <html>
        <body>
            <a href="/path/"> 
            Boot.dev Blog Path
            </a>
            <a href="https://boot.dev/path2/"> 
            Boot.dev Blog Path2
            </a>
        </body>
    </html>
            `
    const inputBaseURL = 'https://boot.dev'
    const actual = getURLsFromHTML(inputHTML,inputBaseURL)
    const expected = ['https://boot.dev/path/' , 'https://boot.dev/path2/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid',() => {
    const inputHTML = `
    <html>
        <body>
            <a href="bloop"> 
            Boot.dev Blog
            </a>
        </body>
    </html>
            `
    const inputBaseURL = 'https://boot.dev'
    const actual = getURLsFromHTML(inputHTML,inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})