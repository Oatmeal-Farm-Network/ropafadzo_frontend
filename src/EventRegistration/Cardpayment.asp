<html>

<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> - Sign Up</title>
<META name="description" content="contact <%= WebSiteName %>">
<META name="keywords" content="Sign Up for Alpaca Bargain Hunter.">
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacabargainhunter.com/infinityknot.ico" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">




</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="alpacabargainhunter/Header2.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" class = "BodyBackground" height = "300" width = "761">
	<tr>
	    <td class = "body" valign = "top"  ><br>
		Please enter your payment amount below and  press the "pay now" button.
			
<table >
   <tr>
      <td width ="390" align = "right">
<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_xclick">
<input type="hidden" name="business" value="ContactUs@Alpacainfinity.com">
<input type="hidden" name="item_name" value="Alpaca Infinity / The Andresen Group">
Amout: <input type="text" name="amount" value=""><br>
<input type="hidden" name="shipping" value="0.00">
<input type="hidden" name="no_shipping" value="0">
<input type="hidden" name="cancel_return" value="http://www.alpacainfinity.com/alpacabargainhunter/signup.asp">
<input type="hidden" name="return" value="http://www.alpacainfinity.com/alpacabargainhunter/completion.asp">

<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-BuyNowBF">
<input type="image" src="images/btn_paynowCC_LG.gif" border="0" name="submit" >
<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>
</td>
<td width ="20" align = "left">&nbsp;
</td>
 
	</tr>
</table>



<br><br><br><br><br><br>
		</td>
	</tr>
</table>



<!--#Include file="alpacabargainhunter/Footer.asp"-->



</body>
</html>