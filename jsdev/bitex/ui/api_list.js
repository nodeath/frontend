goog.provide('bitex.ui.ApiList');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('bitex.ui.DataGrid');
goog.require('goog.ui.registry');

goog.require('goog.dom.TagName');
goog.require('bitex.util');

/**
 * @desc Column Last Used of the Api List
 */
var MSG_API_TABLE_COLUMN_LAST_USED = goog.getMsg('Last Used');

/**
 * @desc Column Label of the Api List
 */
var MSG_API_TABLE_COLUMN_LABEL = goog.getMsg('Label');

/**
 * @desc Column API Keu of the Api List
 */
var MSG_API_TABLE_COLUMN_API_KEY = goog.getMsg('API Key');

/**
 * @desc Column Permissions of the Api List
 */
var MSG_API_TABLE_COLUMN_PERMISSIONS = goog.getMsg('Permissions');

/**
 * @desc Column Actions of the Api List
 */
var MSG_API_TABLE_COLUMN_ACTIONS = goog.getMsg('Actions');

/**
 * @desc Revoke Button in the Actions column of the Api List
 */
var MSG_API_TABLE_COLUMN_ACTION_REVOKE = goog.getMsg('revoke');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
bitex.ui.ApiList = function( opt_domHelper) {
  var grid_columns = [
    {
      'property': 'LastUsed',
      'label': MSG_API_TABLE_COLUMN_LAST_USED,
      'sortable': false,
      'formatter': function(s, rowSet) {
        return  bitex.util.convertServerUTCDateTimeStrToTimestamp(s.substr(0, 10), s.substr(11)).toLocaleString();
      },
      'classes': function() { return goog.getCssName(bitex.ui.ApiList.CSS_CLASS, 'last-used'); }
    },{
      'property': 'Label',
      'label': MSG_API_TABLE_COLUMN_LABEL,
      'sortable': false,
      'classes': function() { return goog.getCssName(bitex.ui.ApiList.CSS_CLASS, 'label'); }
    },{
      'property': 'ApiKey',
      'label': MSG_API_TABLE_COLUMN_API_KEY,
      'sortable': false,
      'classes': function() { return goog.getCssName(bitex.ui.ApiList.CSS_CLASS, 'value'); }
    },{
      'property':'PermissionList',
      'label': MSG_API_TABLE_COLUMN_PERMISSIONS,
      'sortable': false,
      'formatter': function(value, rowSet) {
        return goog.dom.createDom( 'a', {
          'class':'btn btn-mini btn-info btn-api-key-show-permissions',
          'href':'#',
          'data-action':'SHOW_PERMISSIONS',
          'data-row': value
        }, goog.dom.createDom( 'i', ['icon-white', 'icon-tasks']));
      },
      'classes': function() { return goog.getCssName(bitex.ui.ApiList.CSS_CLASS, 'permission-list'); }
    },{
      'property': 'Created',
      'label': MSG_API_TABLE_COLUMN_ACTIONS,
      'sortable': false,
      'formatter': function(value, rowSet){
        return goog.dom.createDom( 'a', {
          'class':'btn btn-mini btn-danger btn-api-key-revoke',
          'href':'#',
          'data-action':'REVOKE_API_KEY',
          'data-row': rowSet['ApiKey']
        },MSG_API_TABLE_COLUMN_ACTION_REVOKE,' ', goog.dom.createDom( 'i', ['icon-white', 'icon-remove']));
      },
      'classes': function() { return goog.getCssName(bitex.ui.ApiList.CSS_CLASS, 'details');}
    }
  ];

  /**
   * @desc deposit table title
   */
  var MSG_API_LIST_TABLE_TITLE  = goog.getMsg('API Keys');


  var options = {
    'rowIDFn':this.getRowId,
    'rowClassFn':this.getRowClass,
    'columns': grid_columns,
    'title': MSG_API_LIST_TABLE_TITLE,
    'showSearch': false
  };

  bitex.ui.DataGrid.call(this, options, opt_domHelper);
};
goog.inherits(bitex.ui.ApiList, bitex.ui.DataGrid);

/**
 * Events fired by Api
 * @enum {string}
 */
bitex.ui.ApiList.EventType = {
  REVOKE_API_KEY: 'revoke_api_key',
  SHOW_PERMISSIONS: 'show_permissions'
};

/**
 * @type {Object}
 */
bitex.ui.ApiList.prototype.selected_permission_list_;


/**
 * @type {string}
 */
bitex.ui.ApiList.prototype.selected_api_key_;


/**
 * @type {string}
 */
bitex.ui.ApiList.CSS_CLASS = goog.getCssName('deposit-list');

/** @inheritDoc */
bitex.ui.ApiList.prototype.getCssClass = function() {
  return bitex.ui.ApiList.CSS_CLASS;
};


/** @inheritDoc */
bitex.ui.ApiList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  handler.listen(this.getElement(), goog.events.EventType.CLICK, this.handleClick_);
};

/**
 * @return {Object}
 */
bitex.ui.ApiList.prototype.getPermissionList = function() {
  return this.selected_permission_list_;
};

/**
 * @return {string}
 */
bitex.ui.ApiList.prototype.getAPIKey = function() {
  return this.selected_api_key_;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bitex.ui.ApiList.prototype.handleClick_ = function(e) {
  if (goog.dom.classes.has(e.target, 'btn-api-key-show-permissions' )) {
    this.selected_permission_list_ = goog.json.parse(e.target.getAttribute('data-row'));
    this.dispatchEvent(bitex.ui.ApiList.EventType.SHOW_PERMISSIONS);
  } else if (goog.dom.classes.has(e.target, 'btn-api-key-revoke' )) {
    this.selected_api_key_ = e.target.getAttribute('data-row');
    this.dispatchEvent(bitex.ui.ApiList.EventType.REVOKE_API_KEY);
  }
};


/**
 * @param {Object} row_set
 * @return {string}
 */
bitex.ui.ApiList.prototype.getRowId = function(row_set) {
  return this.makeId(row_set['APIKey'] );
};


goog.ui.registry.setDecoratorByClassName(
  bitex.ui.ApiList.CSS_CLASS,
  function() {
    return new bitex.ui.ApiList();
  });
