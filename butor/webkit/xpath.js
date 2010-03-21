var disp = function()
{
  document.documentElement.appendChild(
    document.createTextNode( Array.prototype.join.call( arguments, ', ') )
  );
}

var assert = function(exp,msg)
{
  if(!exp)
    disp('Assertion Failed: '+msg);
  else
    disp('OK: '+msg);
}

var evaluateXPath = function(aNode, aExpr){  
 var xpe = new XPathEvaluator();  
 var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?aNode.documentElement : aNode.ownerDocument.documentElement);  
 var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);  
 var found = [];  
 var res;  
 while (res = result.iterateNext())  
  found.push(res);  
 return found;  
}

/**
 * TEST:
 * Webkit returns document node when the context passed to XPathEvaluator object is an element without a parent node.
 */
var test_rootnode = function()
{
  /**
   *          <table>
   *          /     \
   *        <tr>    <tr>
   *         |  
   *        <td>
   */
  var table = window.table = document.createElement('table');
  var rows = [ document.createElement('tr'), document.createElement('tr') ]; 
  rows[0].appendChild( document.createElement('td') );

  // try to get table by evaluating xpath
  assert( evaluateXPath(table,'/')[0] == table, 'Trying to get table element.' ); // fails for webkit
}

test_rootnode();
