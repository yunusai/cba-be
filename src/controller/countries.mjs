import * as countryService from "../services/countries.mjs";

// Get All Countries
export const getAllCountries = async (req, res) => {
    try {
        const countries = await countryService.getAllCountries();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Country by ID
export const getCountryById = async (req, res) => {
    try {
        const country = await countryService.getCountryById(req.params.id);
        res.json(country);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a New Country
export const createCountry = async (req, res) => {
    try {
        const country = await countryService.createCountry(req.body);
        res.status(201).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Country by ID
export const updateCountry = async (req, res) => {
    try {
        const country = await countryService.updateCountry(req.params.id, req.body);
        res.json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Country by ID
export const deleteCountry = async (req, res) => {
    try {
        await countryService.deleteCountry(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Lookup API to return list of countries for dropdown
export const lookupCountries = async (req, res) => {
    try {
        const countries = await countryService.getAllCountries();
        res.json(countries.map(({ id, code, country }) => ({ id, code, name: country })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
