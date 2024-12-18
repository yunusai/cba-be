import { check } from "express-validator";

export const validateCustomer = [
    check('fullName')
        .notEmpty().withMessage('Full name is required.')
        .isString().withMessage('Full name must be a string.'),

    check('motherName')
        .notEmpty().withMessage('Mother name is required.')
        .isString().withMessage('Mother name must be a string.'),

    check('nationality')
        .optional().isString().withMessage('Nationality must be a string.'),

    check('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.'),

    check('phoneNumber')
        .notEmpty().withMessage('Phone number is required.')
        .isString().withMessage('Phone number must be a string.'),

    check('originalAddress')
        .notEmpty().withMessage('Original address is required.')
        .isString().withMessage('Original address must be a string.'),

    check('originalCity')
        .notEmpty().withMessage('Original city is required.')
        .isString().withMessage('Original city must be a string.'),

    check('originalProvince')
        .notEmpty().withMessage('Original province is required.')
        .isString().withMessage('Original province must be a string.'),

    check('zipCode')
        .notEmpty().withMessage('Zip code is required.')
        .isString().withMessage('Zip code must be a string.'),

    check('countryId')
        .notEmpty().withMessage('Country ID is required.')
        .isInt().withMessage('Country ID must be an integer.'),

    check('indonesiaAccomodationName')
        .notEmpty().withMessage('Indonesia accommodation name is required.')
        .isString().withMessage('Accommodation name must be a string.'),

    check('indonesiaAddress')
        .notEmpty().withMessage('Indonesia address is required.')
        .isString().withMessage('Indonesia address must be a string.'),

    check('emergencyContactFullName')
        .notEmpty().withMessage('Emergency contact full name is required.')
        .isString().withMessage('Emergency contact full name must be a string.'),

    check('emergencyContactRelation')
        .notEmpty().withMessage('Emergency contact relation is required.')
        .isIn(['Parent', 'Grandparent', 'Brother/Sister', 'Other'])
        .withMessage('Emergency contact relation must be one of: Parent, Grandparent, Brother/Sister, Other.'),

    check('emergencyContactAddress')
        .notEmpty().withMessage('Emergency contact address is required.')
        .isString().withMessage('Emergency contact address must be a string.'),

    check('emergencyContactCountryId')
        .notEmpty().withMessage('Emergency contact country ID is required.')
        .isInt().withMessage('Emergency contact country ID must be an integer.'),

    check('emergencyContactEmail')
        .notEmpty().withMessage('Emergency contact email is required.')
        .isEmail().withMessage('Invalid emergency contact email format.'),

    check('emergencyContactMobilePhone')
        .notEmpty().withMessage('Emergency contact mobile phone is required.')
        .isString().withMessage('Emergency contact mobile phone must be a string.'),

    check('travelDocument')
        .notEmpty().withMessage('Travel document is required.')
        .isIn(['Passport']).withMessage('Travel document must be Passport.'),

    check('documentNumber')
        .notEmpty().withMessage('Document number is required.')
        .isString().withMessage('Document number must be a string.'),

    check('agentId')
        .notEmpty().withMessage('Agent ID is required.')
        .isInt().withMessage('Agent ID must be an integer.')
    
];
