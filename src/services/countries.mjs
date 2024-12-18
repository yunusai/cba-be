import Countries from "../models/countries.mjs";

// Get All Countries
export const getAllCountries = async () => {
    return await Countries.findAll();
};

// Get Country by ID
export const getCountryById = async (id) => {
    const country = await Countries.findByPk(id);
    if (!country) throw new Error('Country not found');
    return country;
};

// Create a New Country
export const createCountry = async (data) => {
    const { code, country } = data;
    const newCountry = await Countries.create({ code, country });
    return newCountry;
};

// Update a Country by ID
export const updateCountry = async (id, data) => {
    const country = await Countries.findByPk(id);
    if (!country) throw new Error('Country not found');

    const { code, country: countryName } = data;
    await country.update({ code, country: countryName });

    return country;
};

// Delete a Country by ID
export const deleteCountry = async (id) => {
    const country = await Countries.findByPk(id);
    if (!country) throw new Error('Country not found');

    await country.destroy();
};
