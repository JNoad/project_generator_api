const router = require('express').Router();
const generator = require('../generator')

router.post('/', (req, res) => {
    generator.vue.generateVueProject()
})

module.exports = router