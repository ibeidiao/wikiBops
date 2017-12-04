
const parse = require('./parse');

const XML2SQL = (() => {
  const mapsCache = {};
  const userDefinedFunc = {};
  // 简单防止注入
  function escape(param) {
    if (typeof param === 'number') {
      return param;
    }
    if (typeof param === 'string') {
      return `'${param}'`;
    }
    throw new Error('参数的基本类型不是 number 或者 string，不能进行防注入处理！');
  }

  // 根据字符串生成对应function
  function templer(str) {
    return new Function(
      'escape',
      `var arr = []; arr.push("${
        str.replace(/[\r\t\n]/g, ' ') // 在代码中去掉换行符
          .replace(/#{/g, '");arr.push(escape(this.') // 替换变量的开始部分
          .replace(/}/g, '));arr.push("') // 替换变量的结尾部分
      }");return arr.join("");`,
    );
  }

  // 根据map + vo 生成sql字符串
  function formatStr(map, definedFunc) {
    const strArr = [];
    let length = 0;
    do {
      if (length === 0) {
        strArr.push(map[0]);
        length += 1;
      } else if (map[length] === 'where') {
        strArr.push('where');
        strArr.push(map[length + 1]);
        length += 2;
      } else if (map[length] === 'if') {
        if (eval(map[length + 1].replace(/\s+and\s+/g, ' && ').replace(/\s+or\s+/g).replace(/@/g, 'definedFunc.'), ' || ')) {
          strArr.push(map[length + 2]);
        }
        length += 3;
      } else if (map[length] === 'set') {
        strArr.push('set');
        length += 1;
      } else {
        strArr.push(map[length]);
        length += 1;
      }
    } while (length < map.length);

    return strArr.join(' ').replace(/\s+/g, ' ');
  }

  return {
    getSQL(filePath, mapId, vo) {
      if (!mapsCache[filePath]) {
        mapsCache[filePath] = parse(filePath);
      }
      const maps = mapsCache[filePath];
      const map = maps[mapId];
      const str = formatStr.apply(vo, [map, userDefinedFunc]);
      const sql = templer(str).apply(vo, [escape]);

      return sql;
    },
    definedFunc(name, func) {
      if (typeof name === 'string' && typeof func === 'function') {
        userDefinedFunc[name] = func;
      } else {
        throw new Error('参数格式／类型不对！arguments[0]应为string arguments[1]应为number');
      }
    },
  };
})();

module.exports = XML2SQL;
