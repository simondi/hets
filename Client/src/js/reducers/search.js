import * as Action from '../actionTypes';

const DEFAULT_SEARCHES = {
  equipmentList: {},
  owners: {},
};

export default function searchReducer(state = DEFAULT_SEARCHES, action) {
  switch(action.type) {
    case Action.UPDATE_EQUIPMENT_LIST_SEARCH:
      return { ...state, equipmentList: action.equipmentList };

    case Action.UPDATE_OWNERS_SEARCH:
      return { ...state, owners: action.owners };
  }

  return state;
}
