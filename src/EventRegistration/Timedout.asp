<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->


<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Event Registry</title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >



<!--#Include file="Header.asp"-->


<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "400" height = "400" align = "center" >
	<tr>
		<td class = "body" align = "center" valign = "top">
			<H1>Session Timed Out</H1>
			 Please log back in to continue using this website.
			
<form  name=form method="post" action="Handlelogin.asp?Action=RegHome">
			
<table width = "400" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
  <tr>
    <td class = "body2" align = "right" width = "110">Email Address:&nbsp;</td>
    <td align = "left"><input name="Email" Value =""  size = "43" maxlength = "61"></td>
  </tr>
   <tr><td class = "body2" align = "right" width = "110">Password:&nbsp; </td>
   <td align = "left"><input name="password" type = password Value =""  size = "43" maxlength = "61"></td>
   </tr>
   <tr>
     <td></td>
     <td  class = "body">
	
	<br>
    <input type="submit" class = "regsubmit2" value="Continue"  ><br>
    <br></form>

</td></tr></table>

</td>
</tr>
</table>		
			
			


<!--#Include virtual="Footer.asp"--> </Body>
</HTML>