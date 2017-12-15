
exports.formatDate = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
  let timeStr = format;
  const args = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(timeStr)) { timeStr = timeStr.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length)); }
  Object.keys(args).forEach((key) => {
    const n = args[key];
    if (new RegExp(`(${key})`).test(timeStr)) {
      timeStr = timeStr.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? n : (`00${n}`).substr((`${n}`).length),
      );
    }
  });

  return timeStr;
};

exports.formatPage = (pageNum = 1, pageSize = 10) => {
  const offset = (+pageNum - 1) * +pageSize;
  return { offset, pageSize: +pageSize };
};
