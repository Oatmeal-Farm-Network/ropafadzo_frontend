<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Photo Contest" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<meta name="keywords" content="Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpacas Shows" >
<link rel="shortcut icon" href="file:///infinityknot.ico" > 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" > 
<meta name="author" content="The Andresen Goup" >
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

	
<!--#Include file="EventHeader.asp"-->
						 
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=textwidth %>" align = "center">	
<tr><td class = "body2" colspan = "2" ><br><h1><%=EventName %> Photo Contest</h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>



<table border = "0" bordercolor = "<%=PageHightlightColor%>" cellpadding=0 cellspacing=0 width = "<%=textwidth %>" bgcolor = "<%=PageHightlightColor%>" align = "center" >
	<tr>
		<td class = "body">	
			<% if len(HeaderImage) > 1 then %>
			<center><img src = "<%=HeaderImage%>" width = "550" alt = "<%=EventName %> <%=PageName %>"></center>
			<br>
			<% end if %>
			<br>
			<!--#Include file="BodyTextInclude.asp"--> 
			<br><br>
		</td>
	</tr>
</table>
 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

