const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.get('/', (req, res) => {
      res.redirect('/lists')
    })

    server.get('/lists/:id', (req, res) => {
      const queryParams = { id: req.params.id }
      app.render(req, res, '/list', queryParams)
    })

    server.get('/lists/:listId/table/add-guest/:tableId', (req, res) => {
      const queryParams = { listId: req.params.listId, tableId: req.params.tableId, addGuest: true }
      app.render(req, res, '/table', queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`Server Ready on http://localhost:3000`)
    })
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
