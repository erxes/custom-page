import * as mongoose from 'mongoose';
import { sendRPCMessage } from '../../messageBroker';
import { IShapeDocument } from '../../models/definitions/Automations';

const erkhetPostData = async (shape: IShapeDocument, data: any, result: object) => {
  if (!shape.config.url) {
    return result;
  }

  const { API_MONGO_URL = '' } = process.env;
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };
  const apiMongoClient = await mongoose.createConnection(API_MONGO_URL, options);
  const apiProducts = apiMongoClient.db.collection('products');
  const productsIds = data.deal.productsData.map(item => item.productId);
  const products = await apiProducts.find({ _id: { $in: productsIds } }).toArray();

  const productCodeById = {};
  for (const product of products) {
    productCodeById[product._id] = product.code;
  }

  const details = [];
  for (const productData of data.deal.productsData) {
    details.push({
      count: productData.quantity,
      amount: productData.amount,
      discount: productData.discount,
      inventoryCode: productCodeById[productData.productId] || '',
    });
  }

  const payments = {};
  const configure = {
    prepay: 'preAmount',
    cash: 'cashAmount',
    bank: 'mobileAmount',
    pos: 'cartAmount',
    wallet: 'debtAmount',
    barter: 'debtBarterAmount',
    after: 'debtAmount',
    other: 'debtAmount',
  };

  for (const paymentKind of Object.keys(data.deal.paymentsData)) {
    const payment = data.deal.paymentsData[paymentKind];
    payments[configure[paymentKind]] = payment.amount;
  }

  const orderInfos = [
    {
      date: new Date().toISOString().slice(0, 10),
      orderId: data.deal._id,
      hasVat: true,
      hasCitytax: true,
      details,
      ...payments,
    },
  ];

  const postData = {
    userEmail: shape.config.userEmail,
    token: shape.config.apiToken,
    apiKey: shape.config.apiKey,
    apiSecret: shape.config.apiSecret,
    orderInfos: JSON.stringify(orderInfos),
  };
  console.log(postData);
  const response = await sendRPCMessage({
    action: 'get-response-send-order-info',
    data: postData,
  });

  return response;
};

export default erkhetPostData;
