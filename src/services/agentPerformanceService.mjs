import { Agents, Customers, TransactionDetails } from '../models/associations.mjs';
import { Op, fn, col } from 'sequelize'; // Tambahkan fn dan col
import moment from 'moment'

export const calculateAgentPerformance = async (agentName, startDate, endDate) => {
    try {
        // Pastikan agentName adalah string
        if (typeof agentName !== 'string') {
            throw new Error('Invalid agentName: must be a string');
        }

        // Ubah agentName ke lowercase untuk pencarian case-insensitive
        const lowerCaseAgentName = agentName.toLowerCase();

        const agent = await Agents.findOne({
            where: {
                name: {
                    [Op.like]: `%${lowerCaseAgentName}%` // case-insensitive search

                }
            },
            include: [
                {
                    model: Customers,
                    include: [
                        {
                            model: TransactionDetails,
                            where: {
                                createdAt: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }
                    ]
                }
            ]
        });
        console.log(agent.agentName);
        if (!agent) {
            throw new Error('Agent not found');
        }

        // Proses data untuk menghitung performa
        const performance = {
            agentId: agent.id,
            agentName: agent.name,
            customers: agent.customers.map(customer => {
                // Hitung total spending untuk customer
                const totalSpending = customer.transactionDetails.reduce((sum, trx) => sum + (trx.subtotal * trx.quantity), 0);

                return {
                    customerId: customer.id,
                    customerName: customer.name,
                    transaction: customer.transactionDetails,
                    totalTransactions: customer.transactionDetails.length,
                    totalSpending
                };
            }),
            totalCustomers: agent.customers.length,
            totalSpending: agent.customers.reduce((sum, customer) =>
                sum + customer.transactionDetails.reduce((sum, trx) => sum + (trx.subtotal * trx.quantity), 0), 0
            )
        };
        return performance;
    } catch (error) {
        throw new Error('Failed to calculate agent performance: ' + error.message);
    }
};
