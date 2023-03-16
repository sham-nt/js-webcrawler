const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    // if this is an offsite URL, bail immediately
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (currentUrlObj.hostname !== baseUrlObj.hostname){
      return pages
    }
    
    const normalizedURL = normalizeURL(currentURL)
  
    // if we've already visited this page
    // just increase the count and don't repeat
    // the http request
    if (pages[normalizedURL] > 0){
      pages[normalizedURL]++
      return pages
    }
  
    // initialize this page in the map
    // since it doesn't exist yet
    pages[normalizedURL] = 1
  
    // fetch and parse the html of the currentURL
    console.log(`crawling ${currentURL}`)
    let htmlBody = ''
    try {
      const resp = await fetch(currentURL)
      if (resp.status > 399){
        console.log(`Got HTTP error, status code: ${resp.status}`)
        return pages
      }
      const contentType = resp.headers.get('content-type')
      if (!contentType.includes('text/html')){
        console.log(`Got non-html response: ${contentType}`)
        return pages
      }
      htmlBody = await resp.text()
    } catch (err){
      console.log(err.message)
    }
  
    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const nextURL of nextURLs){
      pages = await crawlPage(baseURL, nextURL, pages)
    }
  
    return pages
  }

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
    getURLsFromHTML,
    crawlPage
}
