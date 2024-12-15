"use strict";

parserFactory.register("sakuranovel.id", () => new SakuranovelParser());


class SakuranovelParser extends WordpressBaseParser {
    constructor() {
        super();
    }

    async getChapterUrls(dom) {
        return [...dom.querySelectorAll("ul.series-chapterlists a")]
            .map(a => ({
                sourceUrl:  a.href,
                title: a.getAttribute('title').trim()
            }))
            .map(this.adjustChapterTitle)
            .reverse();
    }
    
    extractTitleImpl(dom) {
        return dom.querySelector(".series-title>h2");
    }

    adjustChapterTitle(chapter) {
        let title = chapter.title.replace(/\r\n|\r|\n|Bahasa Indonesia/g, "");
        let index = title.indexOf("Chapter");
        if (0 < index) {
            title = title.substring(index);
        }
        chapter.title = title.trim();
        return chapter;
    }

    findCoverImageUrl(dom) {
        return util.getFirstImgSrc(dom, "div.series-thumb");
    }

    removeUnwantedElementsFromContentElement(element) {
        util.removeChildElementsMatchingCss(element, ".flexch-infoz span.date");
        super.removeUnwantedElementsFromContentElement(element);
    }

    findContent(dom) {
        return WordpressBaseParser.findContentElement(dom) || 
            dom.querySelector("#content") ||
            dom.querySelector(".asdasd");
    }

    getInformationEpubItemChildNodes(dom) {
        return [...dom.querySelectorAll("series-synops p>span")];
    }
}
