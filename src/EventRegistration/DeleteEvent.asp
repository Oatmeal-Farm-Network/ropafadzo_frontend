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
</HEAD>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "DeleteEvents" %>
<!--#Include file="OverviewHeader.asp"-->
<% 
EventID = Request.querystring("EventID")
'response.write("DeleteEvent EventID = " & EventID & "<br/>")

sql = "select * from Event, EventTypesLookup where EventTypesLookup.EventTypeID = Event.EventTypeID and EventID = " & EventID 
'response.write("  sql = " & sql & "<br/>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventName = rs("EventName")
	PublishedDate = rs("PublishedDate")
	EventStartMonth = rs("EventStartMonth")
	EventStartDay = rs("EventStartDay")
	EventStartYear = rs("EventStartYear")
	EventEndMonth = rs("EventEndMonth")
	EventEndDay = rs("EventEndDay")
	EventEndYear = rs("EventEndYear")
    EventType = rs("EventType")
	if len(PublishedDate) > 1 then
	  EventStatus = "Live"
	else
	  EventStatus  = "Draft"
	end if
End If 

%>

<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Delete Event</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
<table width = "100%" border="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align ="center">
	<tr><td class = "body2" colspan= "2"  height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

<tr>
		<td class = "body2" align = "right">
			Event Name:&nbsp;
		</td>
		<td class = "body2">
			<b><%=EventName%></b>
		</td>
</tr>
<tr>
		<td class = "body2" align = "right">
			Status: &nbsp;
		</td>
		<td class = "body2">
			<%=EventStatus%>
		</td>
</tr>
 <tr>
				<td  class = "body2" align = "right">
					Event Type: &nbsp;
				</td>
				<td class = "body2"  >	
					<%=EventType%>
    		</td>
	</tr>
	
	<tr>
		<td class = "body2" align = "right">
			Start Date: &nbsp;</td>
		<td class = "body2">
				<%=EventStartMonth %>/<%= EventStartDay %>/<%=EventStartYear %>
					
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td class = "body2">
				<%=EventEndMonth %>/<%=EventEndDay %>/<%=EventEndYear %>
					
		</td>
	   </tr>
	 
<tr>
  <td colspan ="2" align ="center"><br />
  <H1>Warning! Once your event is deleted, it is gone forever!</h1>
<br />
   </td>
</tr>	
</table>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "200" align = "center">
<tr>
<td>
<form  name=form method="post" action="RegHome.asp?PeopleID=<%=PeopleID%>">
      <input type="Submit" value="Cancel" class = "regsubmit2">
</form>

</td>
<td align = "left">
<form  name=form method="post" action="DeleteEventhandleform.asp?EventID=<%=EventID%>">
               
		<input type="Submit" value="Delete" class = "regsubmit2">

	</form>


</td>
</tr>
</table>
</td>
</tr>
</table>
<br /><br />
<!--#Include virtual="/Footer.asp"--> </Body>
</HTML>