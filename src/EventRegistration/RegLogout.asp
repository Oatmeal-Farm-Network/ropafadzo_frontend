<html>

<head>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Login</title>

<link rel="stylesheet" type="text/css" href="Style.css">
<!--#Include file="GlobalVariables.asp"-->

</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   bgcolor = "white">

<% loginpage = True %>
<%
Session.Abandon
%> 



<!--#Include file="Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "600" height = "300">
	<tr>
	    <td class = "body"  height = "83" valign = "top" >
			<br>
			<br><h1>Sign Out</H1>
			You have been signed out of our system. Thanks for spending time at Andresen Events.<br>
			Please feel free to <a href = "defualt.asp" class = "body">click here</a> to go to our home page.
			<% Response.Redirect("Default.asp") %>
		</td>
		
		

	</tr>
</table>	
<% response.redirect("Default.asp")%>

<!--#Include virtual="/administration/Footer.asp"-->



</body>
</html>