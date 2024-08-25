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
    const agent = await Agents.findByPk(input.agentId);
    if (!agent) {
        throw new Error(`Agent not found with ID ${input.agentId}`);
    }

    const newCustomer = await Customers.create(input);
    return newCustomer.toJSON();
}

export const updateCustomer = async (id, customerInput) => {
    // Mulai transaction
    const transaction = await db.transaction();

    try {
        const customer = await Customers.findByPk(id, { transaction });
        if (!customer) {
            throw new Error(`Customer not found with ID ${id}`);
        }

        const agent = await Agents.findByPk(customerInput.agentId, { transaction });
        if (!agent) {
            throw new Error(`Agent not found with ID ${customerInput.agentId}`);
        }

        await customer.update(
            {
                ...customerInput,
                agentId: agent.id,
            },
            { transaction }
        );

        await transaction.commit(); // Selesaikan transaction jika berhasil

        return customer.toJSON();
    } catch (error) {
        await transaction.rollback(); // Batalkan transaction jika terjadi error
        throw error; // Lempar kembali error
    }
}

export const deleteCustomer = async (id) => {
    const customers = await Customers.findByPk(id);
    if(!customers) throw new Error('Customer not found');

    await customers.destroy();
}
