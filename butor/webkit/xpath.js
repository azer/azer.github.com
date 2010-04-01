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

  var doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
  doc.documentElement.appendChild(fset);

  // get fieldset
  assert( evaluateXPath(doc,'/')[0] == fset, 'Trying to get fieldset element.' ); // fails for webkit
  assert( evaluateXPath(doc,'/form')[0] == form, 'Tring to get form element' );
  
  document.documentElement.appendChild( fset );

  //assert( evaluateXPath(,'/')[0] == fset, '' );
}

test_rootnode_sel();
