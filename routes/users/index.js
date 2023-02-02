const Router = require("koa-router");
let database = require('../../db/base');
const { v4: uuidv4 } = require('uuid');
const router = new Router();
router.allowedMethods();


router.post('/users', async (ctx) => {
    try {
        const { name, token } = JSON.parse(ctx.request.body)
        const check = database.users.find((user) => user.name == name)
        const checkToken = database.users.find((user) => user.token === token)

        if (check && check.token === token) {
            ctx.response.status = 200
            ctx.response.body = { status: 'user exists' }
            return
        }
        else if (check === undefined && !checkToken) {
            const user = database.createUser(name, token);
            ctx.response.status = 201;
            ctx.response.body = { user };
            return
        }
        ctx.response.status = 200
        ctx.response.body = { status: 'user exists'}
        
    }
    catch (err) {
        ctx.response.status = 500;
        ctx.response.body = { status: 'iternal err' }
        console.log(err)
    }
});

router.post('/users/:token', async (ctx) => {
    const { token } = ctx.params
    const user = database.users.find((user) => user.token === token);
    ctx.response.status = 200;
    ctx.response.body = { user }
});

router.get('/users/gettoken', async (ctx) => {
    const newToken = uuidv4();
    ctx.response.status = 200;
    ctx.response.body = { newToken }
})


module.exports = router;