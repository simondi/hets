import * as Action from './actionTypes';
import * as Constant from './constants';
import store from './store';

import { ApiRequest } from './utils/http';
import { lastFirstName, firstLastName, concat, formatPhoneNumber } from './utils/string';
import { daysAgo, sortableDateTime } from './utils/date';

import _ from 'lodash';
import Moment from 'moment';


function normalize(response) {
  return _.fromPairs(response.map(object => [ object.id, object ]));
}

////////////////////
// Users
////////////////////

function parseUser(user) {
  if (!user.district) { user.district = { id: 0, name: '' }; }
  if (!user.userRoles) { user.userRoles = []; }
  if (!user.groupMemberships) { user.groupMemberships = []; }

  user.name = lastFirstName(user.surname, user.givenName);
  user.fullName = firstLastName(user.givenName, user.surname);
  user.districtName = user.district.name;

  user.groupNames = _.chain(user.groupMemberships)
    .filter(membership => membership.group && membership.group.name)
    .map(membership => membership.group.name)
    .sortBy(name => name)
    .join(', ')
    .value();

  // This field is formatted to be used in updateUserGroups(), which expects
  // [ { groupId: 1 }, { groupId: 2 }, ... ]
  user.groupIds = _.filter(user.groupMemberships, membership => membership.group && membership.group.id)
    .map(membership => { return { groupId: membership.group.id }; });

  _.each(user.userRoles, userRole => {
    userRole.roleId = userRole.role && userRole.role.id ? userRole.role.id : 0;
    userRole.roleName = userRole.role && userRole.role.name ? userRole.role.name : '';
    userRole.effectiveDateSort = sortableDateTime(user.effectiveDate);
    userRole.expiryDateSort = sortableDateTime(user.expiryDate);
  });

  user.path = `${ Constant.USERS_PATHNAME }/${ user.id }`;
  user.url = `#/${ user.path }`;

  user.canEdit = true;
  user.canDelete = true;
}

export function getCurrentUser() {
  return new ApiRequest('/users/current').get().then(response => {
    var user = response;

    // Add display fields
    parseUser(user);

    store.dispatch({ type: Action.UPDATE_CURRENT_USER, user: user });
  });
}

export function searchUsers(params) {
  return new ApiRequest('/users/search').get(params).then(response => {
    var users = normalize(response);

    // Add display fields
    _.map(users, user => { parseUser(user); });

    store.dispatch({ type: Action.UPDATE_USERS, users: users });
  });
}

export function getUsers() {
  return new ApiRequest('/users').get().then(response => {
    var users = normalize(response);

    // Add display fields
    _.map(users, user => { parseUser(user); });

    store.dispatch({ type: Action.UPDATE_USERS, users: users });
  });
}

export function getUser(userId) {
  return new ApiRequest(`/users/${ userId }`).get().then(response => {
    var user = response;

    // Add display fields
    parseUser(user);

    store.dispatch({ type: Action.UPDATE_USER, user: user });
  });
}

export function addUser(user) {
  return new ApiRequest('/users').post(user).then(response => {
    var user = response;

    // Add display fields
    parseUser(user);

    store.dispatch({ type: Action.ADD_USER, user: user });
  });
}

export function updateUser(user) {
  return new ApiRequest(`/users/${ user.id }`).put(user).then(response => {
    var user = response;

    // Add display fields
    parseUser(user);

    store.dispatch({ type: Action.UPDATE_USER, user: user });
  });
}

export function deleteUser(user) {
  return new ApiRequest(`/users/${ user.id }/delete`).post().then(response => {
    var user = response;

    // Add display fields
    parseUser(user);

    store.dispatch({ type: Action.DELETE_USER, user: user });
  });
}

export function updateUserGroups(user) {
  return new ApiRequest(`/users/${ user.id }/groups`).put(user.groupIds).then(() => {
    // After updating the user's group, refresh the user state.
    return getUser(user.id);
  });
}

export function addUserRole(userId, userRole) {
  return new ApiRequest(`/users/${ userId }/roles`).post(userRole).then(() => {
    // After updating the user's role, refresh the user state.
    return getUser(userId);
  });
}

export function updateUserRoles(userId, userRoleArray) {
  return new ApiRequest(`/users/${ userId }/roles`).put(userRoleArray).then(() => {
    // After updating the user's role, refresh the user state.
    return getUser(userId);
  });
}

////////////////////
// Roles,  Permissions
////////////////////

function parseRole(role) {
  role.path = `${ Constant.ROLES_PATHNAME }/${ role.id }`;
  role.url = `#/${ role.path }`;

  role.canEdit = true;
  role.canDelete = false;
}

export function searchRoles(params) {
  return new ApiRequest('/roles').get(params).then(response => {
    var roles = normalize(response);

    // Add display fields
    _.map(roles, role => { parseRole(role); });

    store.dispatch({ type: Action.UPDATE_ROLES, roles: roles });
  });
}

export function getRole(roleId) {
  return new ApiRequest(`/roles/${ roleId }`).get().then(response => {
    var role = response;

    // Add display fields
    parseRole(role);

    store.dispatch({ type: Action.UPDATE_ROLE, role: role });
  });
}

export function addRole(role) {
  return new ApiRequest('/roles').post(role).then(response => {
    var role = response;

    // Add display fields
    parseRole(role);

    store.dispatch({ type: Action.ADD_ROLE, role: role });
  });
}

export function updateRole(role) {
  return new ApiRequest(`/roles/${ role.id }`).put(role).then(response => {
    var role = response;

    // Add display fields
    parseRole(role);

    store.dispatch({ type: Action.UPDATE_ROLE, role: role });
  });
}

export function deleteRole(role) {
  return new ApiRequest(`/roles/${ role.id }/delete`).post().then(response => {
    var role = response;

    // Add display fields
    parseRole(role);

    store.dispatch({ type: Action.DELETE_ROLE, role: role });
  });
}

export function getRolePermissions(roleId) {
  return new ApiRequest(`/roles/${ roleId }/permissions`).get().then(response => {
    var permissions = normalize(response);

    store.dispatch({ type: Action.UPDATE_ROLE_PERMISSIONS, rolePermissions: permissions });
  });
}

export function updateRolePermissions(roleId, permissionsArray) {
  return new ApiRequest(`/roles/${ roleId }/permissions`).put(permissionsArray).then(() => {
    // After updating the role's permissions, refresh the permissions state.
    return getRolePermissions(roleId);
  });
}

////////////////////
// Favourites
////////////////////

export function getFavourites(type) {
  return new ApiRequest(`/users/current/favourites/${ type }`).get().then(response => {
    var favourites = normalize(response);

    store.dispatch({ type: Action.UPDATE_FAVOURITES, favourites: favourites });
  });
}

export function addFavourite(favourite) {
  return new ApiRequest('/users/current/favourites').post(favourite).then(response => {
    // Normalize the response
    var favourite = _.fromPairs([[ response.id, response ]]);

    store.dispatch({ type: Action.ADD_FAVOURITE, favourite: favourite });
  });
}

export function updateFavourite(favourite) {
  return new ApiRequest('/users/current/favourites').put(favourite).then(response => {
    // Normalize the response
    var favourite = _.fromPairs([[ response.id, response ]]);

    store.dispatch({ type: Action.UPDATE_FAVOURITE, favourite: favourite });
  });
}

export function deleteFavourite(favourite) {
  return new ApiRequest(`/users/current/favourites/${ favourite.id }/delete`).post().then(response => {
    // No needs to normalize, as we just want the id from the response.
    store.dispatch({ type: Action.DELETE_FAVOURITE, id: response.id });
  });
}

////////////////////
// Equipment
////////////////////
function getBlockDisplayName(blockNumber) {
  if (blockNumber == 1) { return '1'; }
  if (blockNumber == 2) { return '2'; }
  return 'Open';
}

function parseEquipment(equipment) {
  if (!equipment.owner) { equipment.owner = { id: 0, organizationName: '' }; }
  if (!equipment.equipmentType) { equipment.equipmentType = { id: 0, name: '', description: '' }; }
  if (!equipment.localArea) { equipment.localArea = { id: 0, name: '' }; }
  if (!equipment.localArea.serviceArea) { equipment.localArea.serviceArea = { id: 0, name: '' }; }
  if (!equipment.localArea.serviceArea.district) { equipment.localArea.serviceArea.district = { id: 0, name: '' }; }
  if (!equipment.localArea.serviceArea.district.region) { equipment.localArea.serviceArea.district.region = { id: 0, name: '' }; }
  if (!equipment.status) { equipment.status = Constant.EQUIPMENT_STATUS_CODE_PENDING; }
  if (!equipment.equipmentAttachments) { equipment.equipmentAttachments = []; }

  equipment.isApproved = equipment.status === Constant.EQUIPMENT_STATUS_CODE_APPROVED;
  equipment.isNew = equipment.status === Constant.EQUIPMENT_STATUS_CODE_PENDING;
  equipment.isArchived = equipment.status === Constant.EQUIPMENT_STATUS_CODE_ARCHIVED;
  equipment.isMaintenanceContractor = equipment.owner.isMaintenanceContractor === true;

  // UI display fields
  equipment.serialNumber = equipment.serialNumber || '';
  equipment.equipmentCode = equipment.equipmentCode || '';
  equipment.licencePlate = equipment.licencePlate || '';
  equipment.operator = equipment.operator || ''; // TODO Needs review from business
  equipment.organizationName = equipment.owner.organizationName;
  equipment.ownerPath = equipment.owner.id ? `#/owners/${ equipment.owner.id }` : '';
  equipment.typeName = equipment.equipmentType ? equipment.equipmentType.name : '';
  equipment.localAreaName = equipment.localArea.name;
  equipment.districtName = equipment.localArea.serviceArea.district.name;
  equipment.lastVerifiedDate = equipment.lastVerifiedDate || '';
  equipment.daysSinceVerified = daysAgo(equipment.lastVerifiedDate);

  // Seniority data
  equipment.serviceHoursThisYear = equipment.serviceHoursThisYear || 0;
  equipment.serviceHoursLastYear = equipment.serviceHoursLastYear || 0;
  equipment.serviceHoursTwoYearsAgo = equipment.serviceHoursTwoYearsAgo || 0;
  equipment.serviceHoursThreeYearsAgo = equipment.serviceHoursThreeYearsAgo || 0;

  equipment.isSeniorityOverridden = equipment.isSeniorityOverridden || false;
  equipment.seniorityOverrideReason = equipment.seniorityOverrideReason || '';

  // The number of years of active service of this piece of equipment at the time seniority is calculated - April 1 of the current fiscal year
  equipment.yearsOfService = equipment.yearsOfService || 0;
  equipment.receivedDate = equipment.receivedDate || '';
  equipment.approvedDate = equipment.approvedDate || '';
  // The max date of a time card for this fiscal year - can be null if there are none.
  equipment.lastTimeRecordDateThisYear = equipment.lastTimeRecordDateThisYear || '';
  // e.g. "Open-500" or "1-744"
  var block = getBlockDisplayName(equipment.blockNumber);
  equipment.seniorityText = concat(block, equipment.seniority, ' - ');

  equipment.currentYear = Moment().year();
  equipment.lastYear = equipment.currentYear - 1;
  equipment.twoYearsAgo = equipment.currentYear - 2;
  equipment.threeYearsAgo = equipment.currentYear - 3;

  // It is possible to have multiple instances of the same piece of equipment registered with HETS.
  // However, the HETS clerks would like to know about it via this flag so they can deal with the duplicates.
  equipment.hasDuplicates = equipment.hasDuplicates || false;
  equipment.duplicateEquipment = equipment.duplicateEquipment || [];

  equipment.isWorking = equipment.isWorking || false;
  // TODO Descriptive text for time entries. Needs to be added to backend
  equipment.currentWorkDescription = equipment.currentWorkDescription || '' ;

  equipment.path = `${ Constant.EQUIPMENT_PATHNAME }/${ equipment.id }`;
  equipment.url = `#/${ equipment.path }`;

  equipment.canView = true;
  equipment.canEdit = true;
  equipment.canDelete = false; // TODO Needs input from Business whether this is needed.
}

export function searchEquipmentList(params) {
  return new ApiRequest('/equipment/search').get(params).then(response => {
    var equipmentList = normalize(response);

    // Add display fields
    _.map(equipmentList, equip => { parseEquipment(equip); });

    store.dispatch({ type: Action.UPDATE_EQUIPMENT_LIST, equipmentList: equipmentList });
  });
}

export function getEquipmentList() {
  return new ApiRequest('/equipment').get().then(response => {
    var equipmentList = normalize(response);

    // Add display fields
    _.map(equipmentList, equip => { parseEquipment(equip); });

    store.dispatch({ type: Action.UPDATE_EQUIPMENT_LIST, equipmentList: equipmentList });
  });
}

export function getEquipment(equipmentId) {
  return new ApiRequest(`/equipment/${ equipmentId }`).get().then(response => {
    var equipment = response;

    // Add display fields
    parseEquipment(equipment);

    store.dispatch({ type: Action.UPDATE_EQUIPMENT, equipment: equipment });
  });
}

export function addEquipment(equipment) {
  return new ApiRequest('/equipment').post(equipment).then(response => {
    var equipment = response;

    // Add display fields
    parseEquipment(equipment);

    store.dispatch({ type: Action.UPDATE_EQUIPMENT, equipment: equipment });
  });
}

export function updateEquipment(equipment) {
  return new ApiRequest(`/equipment/${ equipment.id }`).put(equipment).then(response => {
    var equipment = response;

    // Add display fields
    parseEquipment(equipment);

    store.dispatch({ type: Action.UPDATE_EQUIPMENT, equipment: equipment });
  });
}

////////////////////
// Physical Attachments
////////////////////

function parsePhysicalAttachment(attachment) {
  if (!attachment.type) { attachment.type = { id: 0, code: '', description: ''}; }

  attachment.typeName = attachment.type.description;
  // TODO Add grace period logic to editing/deleting attachments
  attachment.canEdit = true;
  attachment.canDelete = true;
}

export function getPhysicalAttachment(id) {
  // TODO Implement back-end endpoints
  return Promise.resolve({ id: id }).then(response => {
    var attachment = response;

    // Add display fields
    parsePhysicalAttachment(attachment);
  });
}

export function addPhysicalAttachment(attachment) {
  // TODO Implement back-end endpoints
  return Promise.resolve(attachment).then(response => {
    var attachment = response;

    // Add display fields
    parsePhysicalAttachment(attachment);
  });
}

export function updatePhysicalAttachment(attachment) {
  // TODO Implement back-end endpoints
  return Promise.resolve(attachment).then(response => {
    var attachment = response;

    // Add display fields
    parsePhysicalAttachment(attachment);
  });
}

export function deletePhysicalAttachment(attachment) {
  // TODO Implement back-end endpoints
  return Promise.resolve(attachment).then(response => {
    var attachment = response;

    // Add display fields
    parsePhysicalAttachment(attachment);
  });
}

////////////////////
// Owners
////////////////////

function parseOwner(owner) {
  if (!owner.localArea) { owner.localArea = { id: 0, name: '' }; }
  if (!owner.localArea.serviceArea) { owner.localArea.serviceArea = { id: 0, name: '' }; }
  if (!owner.localArea.serviceArea.district) { owner.localArea.serviceArea.district = { id: 0, name: '' }; }
  if (!owner.localArea.serviceArea.district.region) { owner.localArea.serviceArea.district.region = { id: 0, name: '' }; }
  if (!owner.contacts) { owner.contacts = []; }
  if (!owner.equipmentList) { owner.equipmentList = []; }

  owner.path = `${ Constant.OWNERS_PATHNAME }/${ owner.id }`;
  owner.url = `#/${ owner.path }`;

  // Add display fields for owner contacts
  owner.contacts = normalize(owner.contacts);
  _.map(owner.contacts, contact => { parseContact(contact, owner.path, owner.primaryContact ? owner.primaryContact.id : 0); });

  _.map(owner.equipmentList, equipment => { parseEquipment(equipment); });

  // TODO Owner status needs to be populated in sample data. Setting to Approved for the time being...
  owner.status = owner.status || Constant.OWNER_STATUS_CODE_APPROVED;

  owner.organizationName = owner.organizationName || '';
  owner.ownerEquipmentCodePrefix = owner.ownerEquipmentCodePrefix || '';
  owner.doingBusinessAs = owner.doingBusinessAs || '';
  owner.registeredCompanyNumber = owner.registeredCompanyNumber || '';
  owner.meetsResidency = owner.meetsResidency || false;
  owner.workSafeBCPolicyNumber = owner.workSafeBCPolicyNumber || '';
  owner.workSafeBCExpiryDate = owner.workSafeBCExpiryDate || '';
  owner.cglEndDate = owner.cglEndDate || '';

  // UI display fields
  owner.isMaintenanceContractor = owner.isMaintenanceContractor || false;
  owner.isApproved = owner.status === Constant.OWNER_STATUS_CODE_APPROVED;
  owner.primaryContactName = owner.primaryContact ? firstLastName(owner.primaryContact.givenName, owner.primaryContact.surname) : '';
  owner.localAreaName = owner.localArea.name;
  owner.districtName = owner.localArea.serviceArea.district.name;
  owner.numberOfEquipment = Object.keys(owner.equipmentList).length;
  owner.numberOfPolicyDocuments = owner.numberOfPolicyDocuments || 0;  // TODO

  owner.canView = true;
  owner.canEdit = true;
  owner.canDelete = false; // TODO Needs input from Business whether this is needed.
}

export function searchOwners(params) {
  return new ApiRequest('/owners/search').get(params).then(response => {
    var owners = normalize(response);

    // Add display fields
    _.map(owners, owner => { parseOwner(owner); });

    store.dispatch({ type: Action.UPDATE_OWNERS, owners: owners });
  });
}

export function getOwner(ownerId) {
  return new ApiRequest(`/owners/${ ownerId }`).get().then(response => {
    var owner = response;

    // Add display fields
    parseOwner(owner);

    store.dispatch({ type: Action.UPDATE_OWNER, owner: owner });
  });
}

export function getOwners() {
  return new ApiRequest('/owners').get().then(response => {
    var owners = normalize(response);

    // Add display fields
    _.map(owners, owner => { parseOwner(owner); });

    store.dispatch({ type: Action.UPDATE_OWNERS_LOOKUP, owners: owners });
  });
}

export function addOwner(owner) {
  return new ApiRequest('/owners').post(owner).then(response => {
    var owner = response;

    // Add display fields
    parseOwner(owner);

    store.dispatch({ type: Action.ADD_OWNER, owner: owner });
  });
}

export function updateOwner(owner) {
  return new ApiRequest(`/owners/${ owner.id }`).put(owner).then(response => {
    var owner = response;

    // Add display fields
    parseOwner(owner);

    store.dispatch({ type: Action.UPDATE_OWNER, owner: owner });
  });
}

export function deleteOwner(owner) {
  return new ApiRequest(`/owners/${ owner.id }/delete`).post().then(response => {
    var owner = response;

    // Add display fields
    parseOwner(owner);

    store.dispatch({ type: Action.DELETE_OWNER, owner: owner });
  });
}

export function addOwnerContact(contact, ownerId) {
  return new ApiRequest(`/owners/${ ownerId }/contacts`).post(contact).then(response => {
    var contact = response;

    // Add display fields
    parseContact(contact);

    store.dispatch({ type: Action.ADD_CONTACT, contact: contact });
  });
}

export function updateOwnerEquipment(owner, equipmentArray) {
  return new ApiRequest(`/owners/${ owner.id }/equipment`).put(equipmentArray).then(() => {
    // After updating the owner's equipment, refresh the owner state.
    return getOwner(owner.id);
  });
}

////////////////////
// Contacts
////////////////////

function parseContact(contact, parentPath, primaryContactId) {
  contact.name = firstLastName(contact.givenName, contact.surname);
  contact.phone = contact.workPhoneNumber ?
    `${ formatPhoneNumber(contact.workPhoneNumber) } (w)` :
    (contact.mobilePhoneNumber ? `${ formatPhoneNumber(contact.mobilePhoneNumber) } (c)` : '');

  contact.isPrimary = contact.id === primaryContactId;

  contact.path = parentPath ? `${ parentPath }/${ Constant.CONTACTS_PATHNAME }/${ contact.id }` : null;
  contact.url = contact.path ? `#/${ contact.path }` : null;

  contact.canEdit = true;
  contact.canDelete = true;
}

export function getContacts() {
  return new ApiRequest('/contacts').get().then(response => {
    var contacts = normalize(response);

    // Add display fields
    _.map(contacts, contact => { parseContact(contact); });

    store.dispatch({ type: Action.UPDATE_CONTACTS, contacts: contacts });
  });
}

export function getContact(contactId) {
  return new ApiRequest(`/contacts/${ contactId }`).get().then(response => {
    var contact = response;

    // Add display fields
    parseContact(contact);

    store.dispatch({ type: Action.UPDATE_CONTACT, contact: contact });
  });
}

export function addContact(contact) {
  return new ApiRequest('/contacts').post(contact).then(response => {
    var contact = response;

    // Add display fields
    parseContact(contact);

    store.dispatch({ type: Action.ADD_CONTACT, contact: contact });
  });
}

export function updateContact(contact) {
  return new ApiRequest(`/contacts/${ contact.id }`).put(contact).then(response => {
    var contact = response;

    // Add display fields
    parseContact(contact);

    store.dispatch({ type: Action.UPDATE_CONTACT, contact: contact });
  });
}

export function deleteContact(contact) {
  return new ApiRequest(`/contacts/${ contact.id }/delete`).post().then(response => {
    var contact = response;

    // Add display fields
    parseContact(contact);

    store.dispatch({ type: Action.DELETE_CONTACT, contact: contact });
  });
}

////////////////////
// Projects
////////////////////

function parseProject(project) {
  if (!project.localArea) { project.localArea = { id: 0, name: '' }; }
  if (!project.localArea.serviceArea) { project.localArea.serviceArea = { id: 0, name: '' }; }
  if (!project.localArea.serviceArea.district) { project.localArea.serviceArea.district = { id: 0, name: '' }; }
  if (!project.localArea.serviceArea.district.region) { project.localArea.serviceArea.district.region = { id: 0, name: '' }; }
  if (!project.contacts) { project.contacts = []; }
  if (!project.rentalRequests) { project.rentalRequests = []; }
  if (!project.rentalAgreements) { project.rentalAgreements = []; }  // TODO Server needs to send this (HETS-153)

  project.path = `${ Constant.PROJECTS_PATHNAME }/${ project.id }`;
  project.url = `#/${ project.path }`;

  // Add display fields for contacts
  _.map(project.contacts, contact => { parseContact(contact, project.path, project.primaryContact ? project.primaryContact.id : 0); });

  // Add display fields for rental requests and rental agreements
  _.map(project.rentalRequests, obj => { parseRentalRequest(obj); });
  _.map(project.rentalAgreements, obj => { parseRentalAgreement(obj); });

  project.name = project.name || '';
  project.provincialProjectNumber = project.provincialProjectNumber || '';
  project.information = project.information || '';

  project.numberOfRequests = project.numberOfRequests || Object.keys(project.rentalRequests).length;
  project.numberOfHires = project.numberOfHires || Object.keys(project.rentalAgreements).length;

  // UI display fields
  project.status = project.status || Constant.PROJECT_STATUS_CODE_ACTIVE;
  project.isActive = project.status === Constant.PROJECT_STATUS_CODE_ACTIVE;
  project.localAreaName = project.localArea.name;

  project.primaryContactName = project.primaryContact ? firstLastName(project.primaryContact.givenName, project.primaryContact.surname) : '';
  project.primaryContactRole = project.primaryContact ? project.primaryContact.role : '';
  project.primaryContactEmail = project.primaryContact ? project.primaryContact.emailAddress : '';
  project.primaryContactPhone = project.primaryContact ? project.primaryContact.workPhoneNumber || project.primaryContact.mobilePhoneNumber || '' : '';

  project.canView = true;
  project.canEdit = true;
  project.canDelete = false; // TODO Needs input from Business whether this is needed.
}

export function searchProjects(params) {
  return new ApiRequest('/projects/search').get(params).then(response => {
    var projects = normalize(response);

    // Add display fields
    _.map(projects, project => { parseProject(project); });

    store.dispatch({ type: Action.UPDATE_PROJECTS, projects: projects });
  });
}

export function getProjects() {
  return new ApiRequest('/projects').get().then(response => {
    var projects = normalize(response);

    // Add display fields
    _.map(projects, project => { parseProject(project); });

    store.dispatch({ type: Action.UPDATE_PROJECTS_LOOKUP, projects: projects });
  });
}

export function getProject(projectId) {
  return new ApiRequest(`/projects/${ projectId }`).get().then(response => {
    var project = response;

    // Add display fields
    parseProject(project);

    store.dispatch({ type: Action.UPDATE_PROJECT, project: project });
  });
}

export function addProject(project) {
  return new ApiRequest('/projects').post(project).then(response => {
    var project = response;

    // Add display fields
    parseProject(project);

    store.dispatch({ type: Action.ADD_PROJECT, project: project });
  });
}

export function updateProject(project) {
  return new ApiRequest(`/projects/${ project.id }`).put(project).then(response => {
    var project = response;

    // Add display fields
    parseProject(project);

    store.dispatch({ type: Action.UPDATE_PROJECT, project: project });
  });
}

////////////////////
// Rental Requests
////////////////////

function parseRentalRequest(request) {
  if (!request.localArea) { request.localArea = { id: 0, name: '' }; }
  if (!request.localArea.serviceArea) { request.localArea.serviceArea = { id: 0, name: '' }; }
  if (!request.localArea.serviceArea.district) { request.localArea.serviceArea.district = { id: 0, name: '' }; }
  if (!request.localArea.serviceArea.district.region) { request.localArea.serviceArea.district.region = { id: 0, name: '' }; }
  if (!request.project) { request.project = { id: 0, name: '' }; }
  if (!request.equipmentType) { request.equipmentType = { id: 0, name: '' }; }
  if (!request.primaryContact) { request.primaryContact = { id: 0, givenName: '', surname: '' }; }
  if (!request.attachments) { request.attachments = []; }
  if (!request.rentalRequestRotationList) { request.rentalRequestRotationList = []; }

  // Add display fields for primary contact
  parseContact(request.primaryContact);

  // Add display fields for rotation list items
  _.map(request.rentalRequestRotationList, listItem => { parseRentalRequestRotationList(listItem); });

  request.status = request.status || Constant.RENTAL_REQUEST_STATUS_CODE_IN_PROGRESS;
  request.equipmentCount = request.equipmentCount || 0;
  request.expectedHours = request.expectedHours || 0;

  request.projectId = request.projectId || request.project.id;
  request.projectName = request.projectName || request.project.name;
  request.projectPath = request.projectId ? `projects/${ request.projectId }`: '';

  request.expectedStartDate = request.expectedStartDate || '';
  request.expectedEndDate = request.expectedEndDate || '';

  // UI display fields
  request.isActive = request.status === Constant.RENTAL_REQUEST_STATUS_CODE_IN_PROGRESS;
  request.isCompleted = request.status === Constant.RENTAL_REQUEST_STATUS_CODE_COMPLETED;
  request.isCancelled = request.status === Constant.RENTAL_REQUEST_STATUS_CODE_CANCELLED;
  request.localAreaName = request.localArea.name;
  request.equipmentTypeName = request.equipmentTypeName || request.equipmentType.name;

  // Primary contact for the rental request/project
  request.primaryContactName = request.primaryContact ? firstLastName(request.primaryContact.givenName, request.primaryContact.surname) : '';
  request.primaryContactEmail = request.primaryContact ? request.primaryContact.emailAddress : '';
  request.primaryContactRole = request.primaryContact ? request.primaryContact.role : '';
  request.primaryContactPhone = request.primaryContact ? request.primaryContact.workPhoneNumber || request.primaryContact.mobilePhoneNumber || '' : '';

  // Flag element as a rental request.
  // Rental requests and rentals are merged and shown in a single list on Project Details screen
  request.isRentalRequest = true;

  request.path = `${ Constant.RENTAL_REQUESTS_PATHNAME }/${ request.id }`;
  request.url = `#/${ request.path }`;

  request.canView = true;
  request.canEdit = true;
  request.canDelete = false; // TODO Needs input from Business whether this is needed.
}

export function searchRentalRequests(params) {
  return new ApiRequest('/rentalrequests/search').get(params).then(response => {
    var rentalRequests = normalize(response);

    // Add display fields
    _.map(rentalRequests, req => { parseRentalRequest(req); });

    store.dispatch({ type: Action.UPDATE_RENTAL_REQUESTS, rentalRequests: rentalRequests });
  });
}

export function getRentalRequest(id) {
  return new ApiRequest(`/rentalrequests/${ id }`).get().then(response => {
    var rentalRequest = response;

    // Add display fields
    parseRentalRequest(rentalRequest);

    store.dispatch({ type: Action.UPDATE_RENTAL_REQUEST, rentalRequest: rentalRequest });
  });
}

export function addRentalRequest(rentalRequest) {
  return new ApiRequest('/rentalrequests').post(rentalRequest).then(response => {
    var rentalRequest = response;

    // Add display fields
    parseRentalRequest(rentalRequest);

    store.dispatch({ type: Action.ADD_RENTAL_REQUEST, rentalRequest: rentalRequest });
  });
}

export function updateRentalRequest(rentalRequest) {
  return new ApiRequest(`/rentalrequests/${ rentalRequest.id }`).put(rentalRequest).then(response => {
    var rentalRequest = response;

    // Add display fields
    parseRentalRequest(rentalRequest);

    store.dispatch({ type: Action.UPDATE_RENTAL_REQUEST, rentalRequest: rentalRequest });
  });
}

////////////////////
// Rental Request Rotation List
////////////////////

function parseRentalRequestRotationList(rotationListItem) {
  if (!rotationListItem.rentalRequest) { rotationListItem.rentalRequest = { id: 0, isRentalRequest: true }; }
  if (!rotationListItem.equipment) { rotationListItem.equipment = { id: 0, equipmentCode: '' }; }
  if (!rotationListItem.equipment.equipmentType) { rotationListItem.equipment.equipmentType = { id: 0, name: '' }; }
  if (!rotationListItem.equipment.owner) { rotationListItem.equipment.owner = { id: 0, organizationName: '' }; }

  // The rental agreement (if any) created for an accepted hire offer.
  rotationListItem.rentalAgreement = rotationListItem.rentalAgreement || null;

  // The sort order of the piece of equipment on the rotaton list at the time the request was created.
  // This is the order the equipment will be offered the available work.
  rotationListItem.rotationListSortOrder = rotationListItem.rotationListSortOrder || 0;

  rotationListItem.isForceHire = rotationListItem.isForceHire || false;
  rotationListItem.wasAsked = rotationListItem.wasAsked || false;
  rotationListItem.askedDateTime = rotationListItem.askedDateTime || '';
  rotationListItem.offerResponseDatetime = rotationListItem.offerResponseDatetime || '';
  rotationListItem.offerResponse = rotationListItem.offerResponse || '';
  rotationListItem.offerRefusalReason = rotationListItem.offerRefusalReason || '';
  rotationListItem.offerResponseNote = rotationListItem.offerResponseNote || '';
  rotationListItem.note = rotationListItem.note || '';

  var equipment = rotationListItem.equipment;

  // UI display fields
  rotationListItem.isHired = rotationListItem.isHired || false;
  rotationListItem.seniority = `${getBlockDisplayName(equipment.blockNumber)}-${equipment.seniority} (${equipment.numberInBlock})`;
  rotationListItem.serviceHoursThisYear = rotationListItem.serviceHoursThisYear || equipment.serviceHoursThisYear || 0; // TODO calculated field from the server
  rotationListItem.equipmentId = equipment.id;
  rotationListItem.equipmentCode = equipment.equipmentCode;

  // String format: "{year} {make}/{model}/{serialNumber}/{size}" - e.g. "1991 Bobcat/KOM450/442K00547/Medium"
  rotationListItem.equipmentDetails = concat(equipment.year, concat(equipment.make, concat(equipment.model, concat(equipment.serialNumber, equipment.size, '/'), '/'), '/'), ' ');

  // Primary contact for the owner of the piece of equipment
  rotationListItem.contact = rotationListItem.contact || (equipment.owner ? equipment.owner.primaryContact : null);
  rotationListItem.contactName = rotationListItem.contact ? firstLastName(rotationListItem.contact.givenName, rotationListItem.contact.surname) : '';
  rotationListItem.contactEmail = rotationListItem.contact ? rotationListItem.contact.emailAddress : '';
  rotationListItem.contactPhone = rotationListItem.contact ? rotationListItem.contact.workPhoneNumber || rotationListItem.contact.mobilePhoneNumber || '' : '';

  // TODO Status TBD
  rotationListItem.status = 'N/A';
}

////////////////////
// Rental Agreements
////////////////////

function parseRentalAgreement(agreement) {
  if (!agreement.equipment) { agreement.equipment = { id: 0, equipmentCode: '' }; }
  if (!agreement.equipment.equipmentType) { agreement.equipment.equipmentType = { id: 0, name: '' }; }
  if (!agreement.project) { agreement.project = { id: 0, name: '' }; }
  if (!agreement.rentalAgreementRates) { agreement.rentalAgreementRates = []; }
  if (!agreement.rentalAgreementConditions) { agreement.rentalAgreementConditions = []; }
  if (!agreement.timeRecords) { agreement.timeRecords = []; }

  agreement.number = agreement.number || '';
  agreement.note = agreement.note || '';
  agreement.estimateStartWork = agreement.estimateStartWork || '';
  agreement.datedOn = agreement.datedOn || '';
  agreement.estimateHours = agreement.estimateHours || 0;
  agreement.equipmentRate = agreement.equipmentRate || 0.0;
  agreement.ratePeriod = agreement.ratePeriod || '';  // e.g. hourly, daily, etc.
  agreement.rateComment = agreement.rateComment || '';

  // UI display fields
  agreement.status = agreement.status || Constant.RENTAL_AGREEMENT_STATUS_CODE_ACTIVE;  // TODO
  agreement.isActive = agreement.status === Constant.RENTAL_AGREEMENT_STATUS_CODE_ACTIVE;
  agreement.isCompleted = agreement.status === Constant.RENTAL_AGREEMENT_STATUS_CODE_COMPLETED;
  agreement.equipmentId = agreement.equipment.id;
  agreement.equipmentCode = agreement.equipment.equipmentCode;
  agreement.equipmentMake = agreement.equipment.make;
  agreement.equipmentModel = agreement.equipment.model;
  agreement.equipmentSize = agreement.equipment.size;
  agreement.equipmentTypeName = agreement.equipment.equipmentType.name;
  agreement.lastTimeRecord = agreement.lastTimeRecord || '';  // TODO Server needs to send this

  // Flag element as a rental agreement
  // Rental requests and rentals are merged and shown in a single list on Project Details screen
  agreement.isRentalAgreement = true;
}

////////////////////
// Look-ups
////////////////////

export function getCities() {
  return new ApiRequest('/cities').get().then(response => {
    var cities = normalize(response);

    store.dispatch({ type: Action.UPDATE_CITIES_LOOKUP, cities: cities });
  });
}

export function getDistricts() {
  return new ApiRequest('/districts').get().then(response => {
    var districts = normalize(response);

    store.dispatch({ type: Action.UPDATE_DISTRICTS_LOOKUP, districts: districts });
  });
}

export function getRegions() {
  return new ApiRequest('/regions').get().then(response => {
    var regions = normalize(response);

    store.dispatch({ type: Action.UPDATE_REGIONS_LOOKUP, regions: regions });
  });
}

export function getLocalAreas() {
  return new ApiRequest('/localareas').get().then(response => {
    var localAreas = normalize(response);

    store.dispatch({ type: Action.UPDATE_LOCAL_AREAS_LOOKUP, localAreas: localAreas });
  });
}

export function getServiceAreas() {
  return new ApiRequest('/serviceareas').get().then(response => {
    var serviceAreas = normalize(response);

    store.dispatch({ type: Action.UPDATE_SERVICE_AREAS_LOOKUP, serviceAreas: serviceAreas });
  });
}

export function getEquipmentTypes() {
  return new ApiRequest('/equipmenttypes').get().then(response => {
    var equipmentTypes = normalize(response);

    store.dispatch({ type: Action.UPDATE_EQUIPMENT_TYPES_LOOKUP, equipmentTypes: equipmentTypes });
  });
}

export function getGroups() {
  return new ApiRequest('/groups').get().then(response => {
    var groups = normalize(response);

    store.dispatch({ type: Action.UPDATE_GROUPS_LOOKUP, groups: groups });
  });
}

export function getRoles() {
  return new ApiRequest('/roles').get().then(response => {
    var roles = normalize(response);

    store.dispatch({ type: Action.UPDATE_ROLES_LOOKUP, roles: roles });
  });
}

export function getPermissions() {
  return new ApiRequest('/permissions').get().then(response => {
    var permissions = normalize(response);

    store.dispatch({ type: Action.UPDATE_PERMISSIONS_LOOKUP, permissions: permissions });
  });
}

////////////////////
// Version
////////////////////

export function getVersion() {
  return new ApiRequest('/version').get().then(response => {
    store.dispatch({ type: Action.UPDATE_VERSION, version: response });
  });
}
