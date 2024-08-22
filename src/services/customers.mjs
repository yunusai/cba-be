import Customers from "../models/customers.mjs";
import Agents from "../models/agents.mjs";

export const findAllCustomers = async () => {
    const customers = await Customers.findAll({include: Agents})
    return customers.map(customer => customers.toJSON());
}

export const findCustomerById = async (id) => {
    const customers = await Customers.findByPk(id, {include: Agents});
    if(!customers) throw new Error('Data not found')
    return customers.map(customer => customers.toJSON());
}

export const findCustomerByName = async (name) => {
    const customers = await Customers.findOne({where: {name}, include: Agents})
    if(!customers) throw new Error('Data Not Found');
    return customers.toJSON();
}

export const saveCustomer = async (input) => {
    const agent = await Agents.findByPk(input.agent);
    if(!agent) throw new Error ('Agent not found')

    const newCustomer = await Customers.create({
        ...input,
        agent: agent.id
    })
    return newCustomer.toJSON();
}

export const updateCustomer = async (id, customerInput) => {
    const customers = await Customers.findByPk(id);
    if (!customers) throw new Error('Customer not found');

    const agents = await Agents.findByPk(customerInput.agent);
    if (!agents) throw new Error('Agent not found');

    await customers.update({
        ...customerInput,
        agent: agents.id,
    })
    return customers.toJSON();
}

export const deleteCustomer = async (id) => {
    const customers = await Customers.findByPk(id);
    if(!customers) throw new Error('Customer not found');

    await customers.destroy();
}
