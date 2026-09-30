<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
 "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<% PageName = "Refunds" %>
<!--#Include file="GlobalVariablesNotLoggedIn.asp"-->
<%  

EventID = request.querystring("EventID")

sql = "select EventName from Event where EventID = " & EventID 
'response.write("sql=" & sql )
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3 
	
if Not rs.eof then 
	EventName = rs("EventName")
end if 
rs.close

%>



<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%=EventName %> - Refunds</title>
<META name="Title" content="<%=EventName %> - Refunds">
<META name="description" content="<%=EventName %>" >
<META name="keywords" content="<%=EventName %>">
 <meta name="subjects" content="Event Registration" >
<meta name="robots" content="index,follow" >
<meta name="rating" content="Safe for kids" >
<meta name="revisit-after" content="1" >
<meta name="Googlebot" content="index,follow" >
<meta name="robots" content="All" >
<link rel="shortcut icon" href="favicon.ico" > 
<link rel="icon" href="favicon.ico" > 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
     
     <!--#Include file="Header.asp"--> 
   		
		<!--#Include file="EventHeader.asp"-->
		<table border = "0"><tr><td width = "5"><img src= "images/px.gif" alt = "<%=EventName %>" width = "0" height = "0"></td>
		<td align = "left">
		<h1>Refunds</h1>
		
		
		
		<!--#Include file="BodyTextInclude.asp"--> 

		</td></tr>
		</table>
  <!--#Include file="EventFooter.asp"-->
  <!--#Include file="Footer.asp"--> 

</body>
</html>