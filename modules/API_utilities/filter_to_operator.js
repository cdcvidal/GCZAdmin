 'use strict';
var moment = require('moment');


var filterToOperator = function(options) {
  this.options = options || '';
};
filterToOperator.prototype.switchCase = function(){
  var output = '';
  var theFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";

  switch( this.options.valueOperator ){
    case 1:
        {
          if(this.options.typeCol=== "number")//equals
            return "[$eq]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
          {
            if ( this.options.valueInput.dateTo === "")
            {
              return "[$gt]="+String(moment(this.options.valueInput.dateFrom).utc().format(theFormat));//this.formatDateToString(valueInput.dateFrom);
            }
            else if (this.options.valueInput.dateFrom === "" )
            {
              return "[$lt]="+String(moment(this.options.valueInput.dateTo).add(1, 'day').utc().format(theFormat));//this.formatDateToString(valueInput.dateTo);
            }
            else{
              return "[$gt]="+String(moment(this.options.valueInput.dateFrom).utc().format(theFormat))+"&selector["+this.options.colName+"][$lt]="+String(moment(this.options.valueInput.dateTo).add(1, 'day').utc().format(theFormat));//this.formatDateToString(valueInput.dateFrom)+"&selector["+colName+"][$lt]="+this.formatDateToString(valueInput.dateTo)+"T23:59:59.999Z";
            }
          }
          //(this.options.typeCol == "text") contains
          else {
            return "[$regex]=(?i)"+String(this.options.valueInput)+"";
          }
          break;
        }
        case 2:
        {
          if(this.options.typeCol=== "number") //not equals
            return "[$ne]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
            return "[$eq]";
          else //(this.options.typeCol == "text") equals
            return "[$regex]=(?i)^"+String(this.options.valueInput)+"$";
          break;
        }
        case 3:
        {
          if(this.options.typeCol=== "number") // less than
            return "[$lt]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
            return "[$eq]";
          else //(this.options.typeCol == "text") not equals
            return "[$regex]=(?i)^(?!.*"+String(this.options.valueInput)+").*$";
          break;
        }
        case 4:
        {
          if(this.options.typeCol=== "number") // less than or equals
            return "[$lte]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
            return "[$eq]";
          else //(this.options.typeCol == "text") start with
            return "[$regex]=(?i)^"+String(this.options.valueInput)+"";
          break;
        }
        case 5:
        {
          if(this.options.typeCol=== "number") // greater than
            return "[$gt]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
            return "[$eq]";
          else //(this.options.typeCol == "text") end with
            return "[$regex]=(?i)"+String(this.options.valueInput)+"$";
          break;
        }
        case 6:
        {
          if(this.options.typeCol=== "number")//greater than or equals
            return "[$gte]="+String(this.options.valueInput);
          else if(this.options.typeCol === "date")
            return "[$eq]";
          else //(this.options.typeCol == "text")
            return "";
          break;
        }
  }
};

module.exports = filterToOperator;
