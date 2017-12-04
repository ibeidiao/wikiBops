const { DOMParser } = require('xmldom');
const fs = require('fs');

module.exports = (() => {
  function analyzeMap(map) {
    const result = {
      id: '',
      arr: [],
    };
    if (map.attributes && map.attributes.length !== 0) {
      const attrs = map.attributes;
      for (let j = 0; j < attrs.length; j += 1) {
        if (attrs[j].name === 'id') {
          result.id = attrs[j].value;
        }
      }
    }

    if (map.attributes && map.childNodes.length !== 0) {
      const content = map.childNodes;
      for (let k = 0; k < content.length; k += 1) {
        const node = content[k];
        if (!node.hasOwnProperty('tagName')) {
          result.arr.push(node.data);
        }
        if (node.hasOwnProperty('tagName')) {
          result.arr.push(node.tagName);
          if (node.childNodes.length !== 0) {
            const el = node.childNodes;
            for (let l = 0; l < el.length; l += 1) {
              const em = el[l];
              if (!em.hasOwnProperty('tagName')) {
                if (em.data !== ' ') {
                  result.arr.push(em.data);
                }
              }
              if (em.hasOwnProperty('tagName')) {
                if (em.tagName === 'if') {
                  result.arr.push('if');
                  if (em.attributes.length !== 0) {
                    for (let m = 0; m < em.attributes.length; m += 1) {
                      if (em.attributes[m].name === 'test') {
                        result.arr.push(em.attributes[m].value);
                      }
                    }
                  }
                  if (em.childNodes.length !== 0) {
                    for (let n = 0; n < em.childNodes.length; n += 1) {
                      if (!em.childNodes[n].hasOwnProperty('tagName')) {
                        result.arr.push(em.childNodes[n].data);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return result;
  }

  function parse(xmlfile) {
    const MAPS = {};
    const xmlStr = fs.readFileSync(xmlfile, 'utf-8');

    const doc = new DOMParser().parseFromString(xmlStr.replace(/[\r\n]/g, '').replace(/\s+/g, ' '), 'text/xml');
    if (doc.childNodes.length !== 0) {
      const root = doc.childNodes[0];
      if (root.childNodes.length !== 0) {
        const maps = root.childNodes;
        for (let i = 0; i < maps.length; i += 1) {
          const map = maps[i];
          const result = analyzeMap(map);
          MAPS[result.id] = result.arr;
        }
      }
    }
    return MAPS;
  }
  return parse;
})();
