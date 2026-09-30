<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Language" content="en-us">
<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/infinityknot.ico" /> 
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
<%  PageName = "Registry" %>
<title>Registry Login</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<% Current = "EventsList" %>
<!--#Include file="AdminEventsHeader.asp"-->
<!--#Include file="OverviewHeader.asp"-->
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Your Events</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
<table   border="0" cellspacing="0" cellpadding="0" align = "left"  width = "<%=screenwidth - 35 %>" >
<tr>
	   <td>
<%	
     if len(PeopleID) < 1 then
       Response.redirect("regLogin.asp")
     
     end if 
	sql2 = "select * from People, Event where Event.Deleted = False and Event.PeopleID  = People.PeopleID and People.PeopleID = " & PeopleID
	'response.write("Reg Home sql2 = " & sql2 & "<br/>")
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	if Not rs2.eof Then %>
<table border = "0" cellspacing="0" cellpadding="0" align = "left"  valign ="top"  width = "100%" >
<tr><td class = "body2" width = "50" align = "center">
</td>
<td class = "body2" width = "400" align = "center" height = "40">
<b>Event Name</b>
</td>
<td class = "body2" width = "100" align = "center">
<b>Event Status</b>
</td>
<td class = "body2" width = "100" align = "center">
<b>Start Date</b>
</td>
<td class = "body2" width = "100" align = "center">
<b>End Date</b>
</td>
<td class = "body2" width = "50" align = "center">
</td>
</tr>
<% while Not rs2.eof 	%>
<tr><td class = "body2" align = "center">
<a href="RegManageHome.asp?EventID=<%=rs2("EventID") %>" class = "body2">Edit</a>
</td>
<td class = "body2">
		&nbsp;&nbsp;&nbsp;<a href = "RegManageHome.asp?EventID=<%=rs2("EventID") %>" class = "body"><%=rs2("EventName")%></a>
	</td>
	<td   class = "body2" align = "center"><%=rs2("EventStatus")%>
	</td>
	<td class = "body2" align = "right">
		<%=rs2("EventStartMonth")%>/<%=rs2("EventStartDay")%>/<%=rs2("EventStartYear")%>&nbsp;&nbsp;&nbsp;
	</td>
	<td class = "body2" align = "right">
		<%=rs2("EventEndMonth")%>/<%=rs2("EventEndDay")%>/<%=rs2("EventEndYear")%>&nbsp;&nbsp;&nbsp;
	</td>
	<td class = "body2" align = "center"> 
		<a href = "DeleteEvent.asp?EventID=<%=rs2("EventID") %>&PeopleID=<%=PeopleID %>" class = "body2">delete</a>
		</td>
</tr>
		<% rs2.movenext
	Wend %>
		</table>

<% else %>
 <table width = "<%=screenwidth - 35 %>">
    <tr><td class = "body2"><h2>No Events Available</h2>
 You do not currently have any events listed. To list an event please <a href = "regcreateType.asp?PeopleID=<%=PeopleID%>" class = "body2" >click here</a>.
</td></tr></table>

		<% End if
rs2.close
Set conn = Nothing	%>

	  </TD>
	</tr>
</table>
</TD>
	</tr>
</table>
<!--#Include virtual="/Footer.asp"-->
</BODY>
</HTML>
