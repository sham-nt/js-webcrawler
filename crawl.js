const { JSDOM } = require('jsdom')

function normalizeURL (urlString) {
    // normalize url : relative or absolute path, ending with or without '/' , Capitalization of text
    const urlObj = new URL(urlString)
    let hostpath  = `${urlObj.hostname}${urlObj.pathname}`
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
        hostpath = hostpath.slice(0,-1)
    }
    return hostpath
}

function getURLsFromHTML(htmlBody,baseURL) {
    // get all urls from html
    // return array of urls
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for(const linkElement of linkElements ) {
        let urlString = linkElement.href
        if(urlString[0] === '/') {
            urlString = baseURL + urlString
        }
        try {
            const href = new URL(urlString).href
            urls.push(href)
            
        } catch (error) {
            console.log(`error with relative URL: ${error.message}`)
            
        }
        
    }

    return urls

}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}
