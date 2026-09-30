
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<% loginpage = True %>

<!--#Include virtual="Header.asp"-->

<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "400">
	<tr>
		<td class = "body" >
			<a name="Ancestry"></a>
			<h2><b>Send Registry Password</b></h2>
			Enter the email address associated with your account and we will email you your password.
      </td>
	</tr>
	
<form action= 'RegSendpasswordstep2.asp' method = "post">
	<tr > 
		<td  align = "center" class = "body">
			E-mail Address: <input name="Email" size = "32" value="">
		</td>
	</tr>
<tr>
		<td  valign = "middle" class = "body">

			<div align = "center">
			<input type=submit value = "Send Password" class = "regsubmit2" size = "110"  >
			</form>
		</td>

</tr>
</table><br><br><br>

<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>