import db from "../config/database.mjs";

class AgentPerformanceService {
    static async getAgentPerformance( startDate, endDate) {
        try {
            const query = `
                SELECT
                    agents.id AS agentId,
                    agents.name AS agentName,
                    categories.id AS categoryId,
                    categories.category AS categoryName,
                    products.productName,
                    products.price,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Done' THEN transactionDetails.quantity ELSE 0 END) AS totalSold,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Pending' THEN transactionDetails.quantity ELSE 0 END) AS totalOrder,
                    (products.price * SUM(CASE WHEN transactionDetails.transactionStatus = 'Done' THEN transactionDetails.quantity ELSE 0 END)) AS totalSales
                FROM
                    agents
                JOIN
                    customers ON customers.agentId = agents.id
                JOIN
                    transactionCustomers ON transactionCustomers.customerId = customers.id
                JOIN
                    transactionDetails ON transactionDetails.id = transactionCustomers.transactionId
                JOIN
                    products ON products.id = transactionDetails.productId
                JOIN
                    categories ON categories.id = products.categoryId
                WHERE
                    transactionDetails.createdAt BETWEEN :startDate AND :endDate
                GROUP BY
                    categories.id, products.id
                ORDER BY
                    totalSales DESC
            `;

            // Eksekusi query menggunakan sequelize.query
            const results = await db.query(query, {
                replacements: { startDate, endDate },
                type: db.QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error("Error in AgentPerformanceService:", error);
            throw error;
        }
    }
}

export default AgentPerformanceService;
