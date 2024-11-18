import db from "../config/database.mjs";

class SalesAnalyticsService {
    static async getOverview(startDate, endDate, sortBy = 'totalSold', order = 'DESC') {
        try {
            const dateCondition = startDate && endDate
                ? `transactionDetails.createdAt BETWEEN :startDate AND :endDate`
                : '1 = 1'; // Tidak ada kondisi tanggal jika startDate atau endDate kosong/null

            const validSortFields = ['totalSold', 'totalOrder', 'netSales', 'productName', 'price'];
            const sortField = validSortFields.includes(sortBy) ? sortBy : 'totalSold';
            const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            const query = `
                SELECT
                    category.id AS categoryId,
                    category.category,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Paid' THEN transactionDetails.quantity ELSE 0 END) AS totalSold,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Pending' THEN transactionDetails.quantity ELSE 0 END) AS totalOrder,
                    products.service,
                    products.price,
                    (products.price * SUM(CASE WHEN transactionDetails.transactionStatus = 'Paid' THEN transactionDetails.quantity ELSE 0 END)) AS netSales,
                    transactionDetails.createdAt
                FROM
                    categories AS category
                JOIN
                    products AS products ON products.categoryId = category.id
                JOIN
                    transactionDetails AS transactionDetails ON products.id = transactionDetails.productId
                WHERE
                    ${dateCondition}
                GROUP BY
                    category.id, products.service, products.price
                ORDER BY
                    ${sortField} ${sortOrder}
                ;
            `;

            const results = await db.query(query, {
                replacements: { startDate, endDate },
                type: db.QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error("Error in SalesAnalyticsService:", error);
            throw error;
        }
    }
}

export default SalesAnalyticsService;
