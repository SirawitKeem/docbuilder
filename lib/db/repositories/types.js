/**
 * Repository interface สำหรับ Field Profile
 * @typedef {Object} FieldProfileRepo
 * @property {() => Promise<Object>} get
 * @property {(values: Object) => Promise<Object>} save
 */

/**
 * Repository interface สำหรับ Documents
 * @typedef {Object} DocumentsRepo
 * @property {() => Promise<Array>} getAll
 * @property {(data: Object) => Promise<Object>} create
 */

export {};
