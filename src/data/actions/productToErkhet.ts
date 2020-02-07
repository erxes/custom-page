// import * as mongoose from 'mongoose';
import { sendMessage } from '../../messageBroker';
import { IShapeDocument } from '../../models/definitions/Automations';

const productToErkhet = async (shape: IShapeDocument, data: any, result: object) => {
  const invData = {
    code: data.code,
    name: data.name,
    measureUnit: data.SKU,
    costAccount: shape.config.costAccount,
    saleAccount: shape.config.saleAccount,
  };

  const postData = {
    userEmail: shape.config.userEmail,
    token: shape.config.apiToken,
    apiKey: shape.config.apiKey,
    apiSecret: shape.config.apiSecret,
    inventoryData: JSON.stringify(invData),
  };

  sendMessage({
    action: 'product-change',
    data: postData,
  });

  return result;
};

export default productToErkhet;
