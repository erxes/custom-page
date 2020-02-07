export const AUTOMATION_STATUS = {
  DRAFT: 'draft',
  PUBLISH: 'publish',
  DELETE: 'delete',

  ALL: ['draft', 'publish', 'delete'],
};

export const AUTOMATION_TYPE = {
  TRIGGER: 'trigger',
  ACTION: 'action',
  CONDITION: 'condition',

  ALL: ['trigger', 'action', 'condition'],
};

export const TRIGGER_KIND = {
  TIME: 'time',
  FORM_SUBMIT: 'formSubmit',
  PAGE_VISIT: 'pageVisit',
  SEGMENT_ADD: 'segmentAdd',
  ADD_CUSTOMER: 'addCustomer',
  REMOVE_CUSTOMER: 'removeCustomer',
  CHANGE_DEAL: 'changeDeal',
  CHANGE_TICKET: 'changeTicket',
  CHANGE_TASK: 'changeTask',
  CHANGE_LIST_PRODUCT: 'changeListProduct',
  // etc

  ALL: [
    'time',
    'formSubmit',
    'pageVisit',
    'segmentAdd',
    'addCustomer',
    'removeCustomer',
    'changeDeal',
    'changeTicket',
    'changeTask',
    'changeListProduct',
  ],
};

export const ACTION_KIND = {
  DELAY: 'delay',
  EJECT_AUTOMATION: 'ejectAutomation',
  SEND_EMAIL: 'sendEmail',
  SEND_NOTIFICATION: 'sendNotification',
  ERKHET_POST_DATA: 'erkhetPostData',
  PRODUCT_TO_ERKHET: 'productToErkhet',
  ADD_CUSTOMER: 'addCustomer',
  UPDATE_CUSTOMER: 'updateCustomer',
  SEND_MESSAGE: 'sendMessage',
  ADD_DEAL: 'addDeal',
  UPDATE_DEAL_STAGE: 'updateDealStage',
  EDIT_DEAL: 'updateDeal',
  ASSIGN_TO_DEAL: 'assignToDeal',
  ADD_NOTE_TO_DEAL: 'addNoteToDeal',
  ADD_TASK: 'addTask',
  UPDATE_TASK_STAGE: 'updateTaskStage',
  EDIT_TASK: 'updateTask',
  ASSIGN_TO_TASK: 'assignToTask',
  ADD_NOTE_TO_TASK: 'addNoteToTask',
  ADD_TICKET: 'addTicket',
  UPDATE_TICKET_STAGE: 'updateTicketStage',
  EDIT_TICKET: 'updateTicket',
  ASSIGN_TO_TICKET: 'assignToTicket',
  ADD_NOTE_TO_TICKET: 'addNoteToTicket',

  ALL: [
    'delay',
    'ejectAutomation',
    'sendEmail',
    'sendNotification',
    'erkhetPostData',
    'productToErkhet',
    'addCustomer',
    'updateCustomer',
    'sendMessage',
    'addDeal',
    'updateDealStage',
    'updateDeal',
    'assignToDeal',
    'addNoteToDeal',
    'addTask',
    'updateTaskStage',
    'updateTask',
    'assignToTask',
    'addNoteToTask',
    'addTicket',
    'updateTicketStage',
    'updateTicket',
    'assignToTicket',
    'addNoteToTicket',
  ],
};

export const CONDITION_KIND = {
  CHECK_EMAIL_STATUS: 'checkEmailStatus',
  CHECK_FIELD: 'checkField',
  CHECK_CUSTOMER_FIELD: 'checkCustomerField',
  CHECK_DEAL_STAGE: 'checkDealStage',
  CHECK_DEAL_FIELD: 'checkDealField',
  CHECK_TASK_STAGE: 'checkTaskStage',
  CHECK_TASK_FIELD: 'checkTaskField',
  CHECK_TICKET_STAGE: 'checkTicketStage',
  CHECK_TICKET_FIELD: 'checkTicketField',

  ALL: [
    'checkEmailStatus',
    'checkField',
    'checkCustomerField',
    'checkDealStage',
    'checkDealField',
    'checkTaskStage',
    'checkTaskField',
    'checkTicketStage',
    'checkTicketField',
  ],
};

export const ALL_KIND = TRIGGER_KIND.ALL.concat(ACTION_KIND.ALL, CONDITION_KIND.ALL);

export const QUEUE_STATUS = {
  PENDING: 'pending',
  WORKING: 'working',
  COMPLETE: 'complete',
  ERROR: 'error',
  ASYNC: 'async',

  ALL: ['pending', 'working', 'complete', 'error', 'async'],
};
