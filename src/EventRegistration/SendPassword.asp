<html>

<head>
<!--#Include virtual="globalvariablesNotLoggedIn.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Send Password</title>
<META name="description" content="contact <%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas for sale, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<% loginpage = True %>

<!--#Include virtual="Header.asp"-->
<br>
<table border = "5" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "600" height = "300" bgcolor = "#DBF5F3" valign = "top">
	<tr>
		<td class = "body2" align = "center" >
			<a name="Ancestry"></a>
			<h2><center>Send Password</center> </h2>
			Please enter the email address associated with your account below<br>
			 and we will email you your password.
      </td>
	</tr>
	
<form action= 'SendpasswordStep2.asp' method = "post">
	<tr > 
		<td  align = "center" class = "body2">
			E-mail Address: <input name="Email" size = "52" value="">
		</td>
	</tr>
<tr>
		<td  valign = "top" align = "center" class = "body2">
	
			<div align = "center">
			<input type=submit value = "Send Password" size = "110"  class = "regsubmit2"></div>
			
		</td>
</tr>
<tr>
<td><br><br><br>
</td>
</tr>
</form>
</table>

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>