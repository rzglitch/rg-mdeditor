/**
 * Dom diffing library
 * https://gomakethings.com/dom-diffing-with-vanilla-js/
 */

const diff = {
  /**
   * Convert a template string into HTML DOM nodes
   * @param  {String} str The template string
   * @return {Node}       The template HTML
   */
  stringToHTML: (str) => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    return doc.body;
  },
  /**
   * Get the type for a node
   * @param  {Node}   node The node
   * @return {String}      The type
   */
  getNodeType: (node) => {
    if (node.nodeType === 3) return "text";
    if (node.nodeType === 8) return "comment";
    return node.tagName.toLowerCase();
  },
  /**
   * Get the content from a node
   * @param  {Node}   node The node
   * @return {String}      The type
   */
  getNodeContent: (node) => {
    if (node.childNodes && node.childNodes.length > 0) return null;
    return node.textContent;
  },
  /**
   * Compare the template to the UI and make updates
   * @param  {Node} template The template HTML
   * @param  {Node} elem     The UI HTML
   */
  changeDiff: (template, elem) => {
    // Get arrays of child nodes
    let domNodes = Array.prototype.slice.call(elem.childNodes);
    let templateNodes = Array.prototype.slice.call(template.childNodes);

    // If extra elements in DOM, remove them
    let count = domNodes.length - templateNodes.length;
    if (count > 0) {
      for (; count > 0; count--) {
        domNodes[domNodes.length - count].parentNode.removeChild(
          domNodes[domNodes.length - count]
        );
      }
    }

    // Diff each item in the templateNodes
    templateNodes.forEach(function (node, index) {
      // If element doesn't exist, create it
      if (!domNodes[index]) {
        elem.appendChild(node.cloneNode(true));
        return;
      }

      // If element is not the same type, replace it with new element
      if (diff.getNodeType(node) !== diff.getNodeType(domNodes[index])) {
        domNodes[index].parentNode.replaceChild(
          node.cloneNode(true),
          domNodes[index]
        );
        return;
      }

      // If content is different, update it
      let templateContent = diff.getNodeContent(node);
      if (
        templateContent &&
        templateContent !== diff.getNodeContent(domNodes[index])
      ) {
        domNodes[index].textContent = templateContent;
      }

      // If target element should be empty, wipe it
      if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
        domNodes[index].innerHTML = "";
        return;
      }

      // If element is empty and shouldn't be, build it up
      // This uses a document fragment to minimize reflows
      if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
        let fragment = document.createDocumentFragment();
        diff.changeDiff(node, fragment);
        domNodes[index].appendChild(fragment);
        return;
      }

      // If there are existing child elements that need to be modified, diff them
      if (node.childNodes.length > 0) {
        diff.changeDiff(node, domNodes[index]);
      }
    });
  },
};

export default diff;
