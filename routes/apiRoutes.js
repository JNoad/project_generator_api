const router = require('express').Router();
const generator = require('../generator')

router.post('/', (req, res) => {
    generator.vue.createVueProject('my-proj', './output')
})

module.exports = router