import { Shapes } from '../models';
import { IShapeDocument } from '../models/definitions/Automations';
import { ACTION_KIND, CONDITION_KIND, QUEUE_STATUS } from '../models/definitions/constants';
import { Queues } from '../models/Queue';
import { delay, erkhetPostData, productToErkhet } from './actions';
import { checkDealField } from './conditions/checkDealField';

const actionRun = async (shape: IShapeDocument, data: any, parentId: string, result: object) => {
  switch (shape.kind) {
    case ACTION_KIND.DELAY:
      result = delay(shape, data, result);
      break;

    case ACTION_KIND.ERKHET_POST_DATA:
      result = await erkhetPostData(shape, data, result);
      break;

    case ACTION_KIND.PRODUCT_TO_ERKHET:
      await productToErkhet(shape, data, result);
      break;

    case ACTION_KIND.SEND_EMAIL:
      break;

    case ACTION_KIND.ADD_CUSTOMER:
      break;

    case ACTION_KIND.SEND_MESSAGE:
      break;
  }

  if (!shape.toArrow) {
    await Queues.createQueue({ shapeId: shape._id, postData: data, status: QUEUE_STATUS.COMPLETE, parentId });
    return result;
  }

  for (const nextShapeId of shape.toArrow) {
    const nextShape = await Shapes.getShape(nextShapeId);

    await sequencing(nextShape, data, parentId, result);
  }

  return result;
};

const conditionRun = async (shape: IShapeDocument, data: any, parentId: string, result: object) => {
  let conditionShape: IShapeDocument | boolean = false;
  switch (shape.kind) {
    case CONDITION_KIND.CHECK_DEAL_FIELD:
      conditionShape = await checkDealField(shape, data);

      if (conditionShape) {
        sequencing(conditionShape, data, parentId, result);
      }
      break;
  }
};

const sequencing = async (shape: IShapeDocument, data: any, parentId: string, result: object) => {
  await Queues.createQueue({ shapeId: shape._id, postData: data, status: QUEUE_STATUS.WORKING, parentId });

  if (shape.type === 'action') {
    result = await actionRun(shape, data, parentId, result);
  }

  if (shape.type === 'condition') {
    await conditionRun(shape, data, parentId, result);
  }

  return result;
};

export const asyncAutomationRunner = async (trigger: IShapeDocument, data: any) => {
  let result = {};

  const queue = await Queues.createQueue({ shapeId: trigger._id, postData: data, status: QUEUE_STATUS.WORKING });

  for (const nextShapeId of trigger.toArrow) {
    const nextShape = await Shapes.getShape(nextShapeId);
    result = await sequencing(nextShape, data, queue._id, result);
  }
  return result;
};

export const bgAutomationRunner = async (trigger, data: any) => {
  const queue = await Queues.createQueue({ shapeId: trigger._id, postData: data, status: QUEUE_STATUS.WORKING });

  for (const nextShapeId of trigger.toArrow) {
    const nextShape = await Shapes.getShape(nextShapeId);
    sequencing(nextShape, data, queue._id, {});
  }
};
