import { QueryTypes } from 'sequelize';
import db from '../config/database.mjs'

const updateAgentFeeService = async () => {
    try {
        await db.query(
            `UPDATE variations
            SET agentFee = CASE
                -- categoryId = 1 and variationName contains "60 days"
                WHEN variationName LIKE '%60 days%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 1
                ) THEN 150000
                
                -- categoryId = 3 and variationName contains "60 days"
                WHEN variationName LIKE '%60 days%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 3
                ) THEN 200000

                -- categoryId = 3 and variationName contains "180 days"
                WHEN variationName LIKE '%180 days%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 3
                ) THEN 700000

                -- categoryId = 5 and variationName contains "60 days"
                WHEN variationName LIKE '%60 days%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 5
                ) THEN 300000

                -- categoryId = 5 and variationName contains "180 days"
                WHEN variationName LIKE '%180 days%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 5
                ) THEN 700000

                -- categoryId = 6 and variationName contains "180 days" or "6 months"
                WHEN (variationName LIKE '%180 days%' OR variationName LIKE '%6 months%') AND productId IN (
                    SELECT id FROM products WHERE categoryId = 6
                ) THEN 1000000

                -- categoryId = 6 and variationName contains "1 year"
                WHEN variationName LIKE '%1 year%' AND productId IN (
                    SELECT id FROM products WHERE categoryId = 6
                ) THEN 1000000
            END
            WHERE (
                variationName LIKE '%60 days%'
                OR variationName LIKE '%180 days%'
                OR variationName LIKE '%6 months%'
                OR variationName LIKE '%1 year%'
            );`,
            {
                type: QueryTypes.UPDATE
            }
        );
        return { success: true, message: 'Agent fees updated successfully' };
    } catch (error) {
        console.error('Error updating agent fees:', error);
        throw error;
    }
};

export default updateAgentFeeService;