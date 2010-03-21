var disp = function()
{
  document.documentElement.innerHTML+=Array.prototype.join.call( arguments, ', ')+'<br>';
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
 * TEST
 * Webkit returns document node when the context passed to XPathEvaluator object is an element.
 */
var test_rootnode_sel = function()
{
  /**
   *          <fieldset>
   *          /        \
   *       <form>   <legend>
   *         |  
   *       <input>
   */
  var fset = window.fset = document.createElement('fieldset');
  fset.appendChild( document.createElement('legend') );
  var form = document.createElement('form');
  form.appendChild( document.createElement('input') );
  fset.appendChild( form );

  // get fieldset
  assert( evaluateXPath(fset,'/')[0] == fset, 'Trying to get fieldset element.' ); // fails for webkit
  assert( evaluateXPath(fset,'/form')[0] == form, 'Tring to get form element' );


}

test_rootnode_sel();
