const _ = require('lodash');
const HISTORY_DISTANCE = 5;

// get a list of transactions
const listTransactions = async (z, bundle) => {
  var cursor = await z.cursor.get();
  cursor = cursor ? parseInt(cursor) : 0;
  let params;
  if (cursor) {
    params = { knowledge: Math.max(0, cursor - HISTORY_DISTANCE) };
  } else {
    params = { limit: 50, page: 1 };
  }
  const responsePromise = z.request({
    url: '{{process.env.BASE_URL}}/transactions',
    params: params,
  }).then(response => z.JSON.parse(response.content));
  const response = await responsePromise;
  await z.cursor.set(String(response.knowledge));
  return response.transactions;
};

module.exports = {
  key: 'transaction',
  noun: 'Transaction',

  list: {
    display: {
      label: 'New Transaction',
      description: 'Lists the transactions.'
    },
    operation: {
      perform: listTransactions,
      canPaginate: true,
    }
  },

  sample: {
    "id":"a9d11eef-a2fb-43de-9fa1-d10d6b9a611e",
    "requested_at":"2018-12-09T00:58:55.242Z"
  },
};
