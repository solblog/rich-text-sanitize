// JavaScript HTML Sanitizer, (c) Alexander Yumashev, Jitbit Software.

// homepage https://github.com/jitbit/HtmlSanitizer

// License: MIT https://github.com/jitbit/HtmlSanitizer/blob/master/LICENSE

// console.log('Sanitizer loading');


const tagWhitelist_ = {
    A: true, ABBR: true, B: true, BLOCKQUOTE: true, BODY: true, BR: true, CENTER: true, CODE: true, DIV: true,
    EM: true, FONT: true, H1: true, H2: true, H3: true, H4: true, H5: true, H6: true, HR: true, I: true, IMG: true,
    LABEL: true, LI: true, OL: true, P: true, PRE: true, SMALL: true, SOURCE: true, SPAN: true, STRONG: true,
    TABLE: true, TBODY: true, TR: true, TD: true, TH: true, THEAD: true, UL: true, U: true, VIDEO: true,
};


// "p", "strong", "br", "em", "u", "ol", "li", "ul"

/*
const tagWhitelist_ = {
    'BODY': true, 'BR': true, 'EM': true, 'I': true, 'LI': true, 'OL': true, 'P': true, 'STRONG': true, 'UL': true, 'U': true,
};
*/

const contentTagWhiteList_ = { FORM: true }; // tags that will be converted to DIVs
// const contentTagWhiteList_ = {}; // tags that will be converted to DIVs


const attributeWhitelist_ = { align: true, color: true, controls: true, height: true, href: true, src: true, style: true,
    target: true, title: true, type: true, width: true };

/*
const attributeWhitelist_ = {};
*/

const cssWhitelist_ = { color: true, 'background-color': true, 'font-size': true, 'text-align': true, 'text-decoration': true,
    'font-weight': true };
// const cssWhitelist_ = {};

const schemaWhiteList_ = ['http:', 'https:', 'data:', 'm-files:', 'file:', 'ftp:']; // which "protocols" are allowed in "href", "src" etc

/*
const schemaWhiteList_ = []; // which "protocols" are allowed in "href", "src" etc
*/

// const uriAttributes_ = { 'href': true, 'action': true };
const uriAttributes_ = {};

export class HtmlSanitizer {

    static SanitizeHtml(input) {

        input = input.trim();

        console.log('input', input);

        if (input === '') { return ''; } // to save performance and not create iframe

        if (input === '<br>') { return ''; } // firefox "bogus node" workaround

        const iframe = document.createElement('iframe');

        if (iframe.sandbox === undefined) {
            alert('Your browser does not support sandboxed iframes. Please upgrade to a modern browser.');
            return '';
        }
        // iframe['sandbox'] = 'allow-same-origin'; Does not compile...
        console.log(iframe.sandbox);
        iframe.style.display = 'none';
        document.body.appendChild(iframe); // necessary so the iframe contains a document
        const iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframedoc.body == null) { iframedoc.write('<body></body>'); } // null in IE
        iframedoc.body.innerHTML = input;

        console.log('iframedoc.body', iframedoc.body);
        console.log('iframedoc.doc', iframedoc);

        const resultElement = HtmlSanitizer.makeSanitizedCopy(iframedoc.body , iframedoc);
        // console.log('resultElement', resultElement);
        document.body.removeChild(iframe);
        return resultElement.innerHTML.replace(/<br[^>]*>(\S)/g, '<br>\n$1').replace(/div><div/g, 'div>\n<div');

    }

    static makeSanitizedCopy(node , iframedoc) {

         console.log('*** Recursive call ***');

         let newNode;

         console.log('node.nodeType', node.nodeType);
         console.log('Node tag name', node.tagName);
         console.log('Node.TEXT_NODE', Node.TEXT_NODE);
         console.log('Node.ELEMENT_NODE', Node.ELEMENT_NODE);

         if (node.nodeType === Node.TEXT_NODE) {
            newNode = node.cloneNode(true);
        } else if (node.nodeType === Node.ELEMENT_NODE && (tagWhitelist_[node.tagName] || contentTagWhiteList_[node.tagName])) {
            console.log('node.tagName', node.tagName);
            // remove useless empty spans (lots of those when pasting from MS Outlook)
            if ((node.tagName === 'SPAN' || node.tagName === 'B' || node.tagName === 'I' || node.tagName === 'U')
            && node.innerHTML.trim() === '') {
                return document.createDocumentFragment();
            }

            if (contentTagWhiteList_[node.tagName]) {
                newNode = iframedoc.createElement('DIV');
            } else {
                newNode = iframedoc.createElement(node.tagName);
            }

            for (let i = 0; i < node.attributes.length; i++) {
                console.log('Attribute', node.attributes[i]);
                const attr = node.attributes[i];
                if (attributeWhitelist_[attr.name]) {
                    if (attr.name === 'style') {
                        for (let s = 0; s < node.style.length; s++) {
                            const styleName = node.style[s];
                            if (cssWhitelist_[styleName]) {
                                newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName));
                            }
                        }
                    } else {
                        if (uriAttributes_[attr.name]) { // if this is a "uri" attribute, that can have "javascript:" or something
                            if (attr.value.indexOf(':') > -1 && !HtmlSanitizer.startsWithAny(attr.value, schemaWhiteList_)) {
                                continue;
                            }
                        }
                        newNode.setAttribute(attr.name, attr.value);
                    }
                }
            }
            console.log('node.childNodes.length', node.childNodes.length);
            for (let i = 0; i < node.childNodes.length; i++) {
                console.log('node.childNodes[i]', node.childNodes[i]);
                const subCopy = HtmlSanitizer.makeSanitizedCopy(node.childNodes[i], iframedoc);
                newNode.appendChild(subCopy, false);
            }
        } else {
            console.log('Case3');
            newNode = document.createDocumentFragment();
        }
         return newNode;
    }

    static startsWithAny(str, substrings) {
        for (let i = 0; i < substrings.length; i++) {
            if (str.indexOf(substrings[i]) === 0) {
                return true;
            }
        }
        return false;
    }

}
