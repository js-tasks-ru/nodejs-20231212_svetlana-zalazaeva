const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

var message = null;

router.get('/subscribe', async (ctx, next) => {
  await new Promise(resolve => setTimeout(resolve, 5000))
  ctx.body = message;
  message = null;
});

router.post('/publish', async (ctx, next) => {
  message = ctx.request.body.message
  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;
