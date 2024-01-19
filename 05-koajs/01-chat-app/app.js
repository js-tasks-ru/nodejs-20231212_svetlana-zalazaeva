const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx) => {
  const r = await new Promise(resolve => {
    const id = ctx.request.query.r;
    ctx.state.resolve = resolve;
    subscribers[id] = ctx;
  });
});

router.post('/publish', async (ctx) => {
  let message = ctx.request.body.message;
  if (message) {
    await publish(message);
  }
  ctx.response.status = 200;
});

function publish(message) {

  for (let id in subscribers) {
    let ctx = subscribers[id];
    ctx.body = message;
    ctx.state.resolve()
  }

  subscribers = Object.create(null);
}


app.use(router.routes());

module.exports = app;
