const express = require('express')
const session = require('express-session')
const bodyparesr = require('body-parser')
const passport = require('passport')

const app = express()
const port = 3000

app.use(
  session({
    secret: 'googleAuth'
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyparesr.json())

// 引入passport設定
require('./passport')

app.get('/login', (req, res) => {
  return res.sendFile(`${__dirname}/index.html`)
})

//使用者點擊後會進到這個路由，此時使用者畫面會跳出同意授權的畫面，同意後
//google會根據scope內的要求，打資料回傳到/auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

//因此這裡必須要設回傳的ˊ路由接收資料，才能把資料拿去資料庫儲存，存完再轉到指定路由
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/login'
  })
)

//指定路由在這
app.get('/success', (req, res) => {
  res.json({
    status: 'success',
    message: 'login successfully',
    user: req.user
  })
})

app.listen(3000, () => {
  console.log(`operate server at port: ${port}`)
})