class ResponseBody {
  constructor(body = {}, errorInfo = '操作成功', errorNo = 0) {
    this.mate = { errorNo, errorInfo };
    this.data = body;
  }
}

module.exports = ResponseBody;
