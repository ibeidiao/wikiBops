exports.getUser = async (ctx, next) => {
  ctx.body = {
    username: '咸鱼',
    age: 30
  };
};