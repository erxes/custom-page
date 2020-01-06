import { Shapes } from '../../models';
import { IAutomationDocument } from '../../models/definitions/Automations';

export default {
  shapes(automation: IAutomationDocument) {
    return Shapes.find({ automationId: automation._id });
  },
};
