const express = require('express');
const asyncHandler = require('express-async-handler');
// const Op = Sequelize.Op

const { Restaurant } = require('../../db/models');
const { Review } = require('../../db/models');
const { User } = require('../../db/models');
const { Rating } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateCreateInfo = [
    check('name')
        .exists({ checkFalsy: true })
        .custom(value => {
            return Restaurant.findOne({ where: { name:value }}).then(rest => {
                if (rest) {

                    return Promise.reject('Restaurant Name is already in use');
                }
                return false
            });
        }),

    check('location')
        .exists({ checkFalsy: true })
        .custom(value => {
            return Restaurant.findOne({ where: { location: value }}).then(rest => {
                if (rest) {

                    // console.log("\n\n\n\n\n", rest, "\n\n\n\n\n")
                    // // return rest
                    return Promise.reject('Restaurant Location is already in use');
                }
                return false
            });
        }),

    check('phoneNumber')
        .exists({ checkFalsy: true })
        .custom(value => {
            return Restaurant.findOne({ where: { phoneNumber:value }}).then(rest => {
                if (rest) {

                    return Promise.reject('Restaurant PhoneNumber is already in use');
                }
                return false
            })
        }),
    handleValidationErrors
];

const validateEditInfo = [
    check('name')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            return Restaurant.findOne({ where: { name:value }}).then(rest => {
                if (rest) {
                    if (!rest.id === req.body.restaurantId) {
                        return Promise.reject('Restaurant Name is already in use');
                    }
                }
                return false
            });
        }),

    check('location')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            return Restaurant.findOne({ where: { location: value }}).then(rest => {
                if (rest) {
                    if (!rest.id === req.body.restaurantId) {
                        return Promise.reject('Restaurant Location is already in use');
                    }
                }
                return false
            });
        }),

    check('phoneNumber')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            return Restaurant.findOne({ where: { phoneNumber:value }}).then(rest => {
                if (rest) {
                    if (!rest.id === req.body.restaurantId) {
                        return Promise.reject('Restaurant PhoneNumber is already in use');
                    }
                }
                return false
            })
        }),
    handleValidationErrors
]

// GET all restaurants
router.get('/', asyncHandler(async(req, res)=> {
    const restaurants = await Restaurant.findAll({order: [['id', 'DESC']]});
    return res.json(restaurants);
}));

// GET one restaurant
router.get('/:id', asyncHandler(async(req, res)=> {
    const id = parseInt(req.params.id, 10);
    // console.log(`\n\n\n\n`,  id, `\n\n\n\n`)
    const restaurant = await Restaurant.findByPk(id)
    const reviews =  await Restaurant.findByPk(id, {
        include: [
            {
                model: Review,
                required: true,
                where: { restaurantId: id },
            },
            {
                model: Rating,
                require: true,
                where: { restaurantId: id}
            },
        ],
    });
    //
    // console.log(`\n\n\n\n`, reviews.Reviews[0].dataValues.userId, `\n\n\n\n`)
    // console.log(`\n\n\n\n`, reviews, `\n\n\n\n`)

    // const userArr = reviews.Reviews.map(each => User.findAll({ where: {id: each?.dataValues?.userId}}))
    // console.log("\n\n\n\n\n", userArr, `\n\n\n\n`)
    if (reviews) {
        return res.json(reviews)
    } else {
        return res.json(restaurant);
    }


}));

// CREATE a new restaurant
router.post('/', validateCreateInfo, asyncHandler( async(req, res) => {
    const { name, location, phoneNumber, imgSrc, userId } = req.body;
    // console.log("\n\n\n\n\n", name, "\n\n\n\n\n")

    const newRestaurant = await Restaurant.create({
        name, location, phoneNumber, imgSrc, userId
    })
    return res.json(newRestaurant);

}));

// Edit an existing restaurant
router.put('/:id', validateEditInfo, asyncHandler( async(req, res) => {
    const { name, location, phoneNumber, img, restaurantId} = req.body;


    const updateRestaurantId = await Restaurant.update({
        name, location, phoneNumber, img
    }, {where: { id: restaurantId}})

    const restaurant = await Restaurant.findByPk(...updateRestaurantId)
    return res.json(restaurant);
}));

// Delete a restaurant
router.delete('/:id', asyncHandler( async(req, res) => {
    const id = req.params.id;
    // console.log(`\n\n\n\n`, 'brefore delete', `\n\n\n\n`)
    await Restaurant.destroy({where: {id}})
    // console.log(`\n\n\n\n deleted Id === `, deletedRestaurantId, `\n\n\n\n`)

    return res.json(id);
}));

module.exports = router;
