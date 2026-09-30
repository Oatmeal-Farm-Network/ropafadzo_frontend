<%@LANGUAGE="VBScript"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>Untitled Page</title>
</head>
<body>





<script src="https://www.paypalobjects.com/js/external/dg.js"> 	</script>

<form action= "https://www.paypal.com/webapps/adaptivepayment/flow/pay" target="PPDGFrame"> 		
<input id="type" type="hidden" name="expType" value="light"> 
<input id="paykey" type="hidden" name="paykey" value="AP-..."> 		
<input id="preapprovalkey" type="hidden" name="preapprovalkey" value="PA-..."> 
		
<input type="submit" id="submitBtn" value="Pay with PayPal"> 	
</form

<script>    var dgFlow = new PAYPAL.apps.DGFlow({ trigger: 'submitBtn' }); 	</script>



<A href = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=contac_1337907266_biz@alpacainfinity.com&item_name=Cow&amount=5.00&currency_code=USD&return=http://www.AndresenEvents.com/TestConfirm.asp" target = "blank">Help!</A>

<FORM action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_xclick">
<input type="hidden" name="business" value="johna_1282413342_biz@webartists.biz">
<input type="hidden" name="item_name" value="Baseball Hat">
<input type="hidden" name="item_number" value="123">
<input type="hidden" name="amount" value="5.95">
<input type="hidden" name="shipping" value="1.00">
<input type="hidden" name="shipping2" value="0.50">
<input type="hidden" name="handling" value="2.00">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="return" value="http://www.AndresenEvents.com/TestConfirm.asp">
<input type="hidden" name="undefined_quantity" value="1">
<input type="image" src="http://www.paypalobjects.com/en_US/i/btn/x-click-but23.gif" border="0" name="submit" width="68" height="23" alt="Make payments with PayPal - it's fast, free and secure!">
</form>
</body>
</html>
