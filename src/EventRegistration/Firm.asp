<html>
<head>
<%  PageName = "Our Firm" %>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
    

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
        <!--#Include file="Header.asp"--> 
   		
		
		<table border = "0"><tr><td width = "5"><img src= "images/px.gif" alt = "Washington Accountant Firm" width = "0" height = "0"></td>
		<td>
		<h1><%=PageTitle %></h1>
		
		
		<% if len(HeaderImage) > 1 then %>
		<center><img src = "<%=HeaderImage%>" width = "550" alt = "Washington Accounting"></center>
		<br>
		<% end if %>
		<!--#Include file="BodyTextInclude.asp"--> 

		</td></tr>
		</table>
    <!--#Include file="Footer.asp"--> 
</body>
</html>