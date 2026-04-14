const ExpressError = require("../utils/ExpressError");
const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid(
        "Hotels",
        "Resorts",
        "Villas",
        "Beach Houses",
        "Mountain Stays",
        "Budget Rooms",
        "Luxury Stays",
        "Trending",
        "Popular Places",
        "Nearby Locations"
      )
      .optional(),
  }).required()
});

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
