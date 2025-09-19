const { processDBRequest } = require('../../utils');

const findUserByEmail = async (email) => {
  const query = `
        SELECT
            id,
            email,
            role_id,
            password,
            is_active,
            is_email_verified
        FROM users where email = $1
    `;
  const queryParams = [email];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

module.exports = { findUserByEmail };
