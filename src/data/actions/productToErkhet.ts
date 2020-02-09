// import * as mongoose from 'mongoose';
import { sendMessage } from '../../messageBroker';
import { IShapeDocument } from '../../models/definitions/Automations';

const productToErkhet = async (shape: IShapeDocument, data: any, result: object) => {
  const productData = data.doc;
  const invData = {
    action: data.action,
    oldCode: data.oldCode || '',
    object: {
      code: productData.code || '',
      name: productData.name || '',
      measureUnit: productData.sku || '',
      unitPrice: productData.unitPrice || 0,
      costAccount: shape.config.costAccount,
      saleAccount: shape.config.saleAccount,
      categoryCode: productData.categoryCode,
      defaultCategory: shape.config.categoryCode,
    },
  };

  const postData = {
    userEmail: shape.config.userEmail,
    token: shape.config.apiToken,
    apiKey: shape.config.apiKey,
    apiSecret: shape.config.apiSecret,
    orderInfos: JSON.stringify(invData),
  };

  sendMessage({
    action: 'product-change',
    data: postData,
  });

  return result;
};

export default productToErkhet;
