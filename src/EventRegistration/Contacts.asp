<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Contacts</title>
<% 
Sort=request.form("Sort") 
If Len(Sort) < 4 Then
	Sort = "Prodname"
End if
%>
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Contacts"%>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->
<% PageTitleText = "Contacts"  %>

<!--#Include file="970Top.asp"-->


<table width = "960" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr ><td align = "center">


<% dim PeopleEmail(100000)
dim PeoplePhone(100000)
Dim PeopleFirstName(100000)
Dim PeopleLastName(100000) 
Dim DateAdded(100000)
dim AddressApt(100000)
Dim AddressCity(100000)
Dim AddressState(100000)
Dim AddressZip(100000)
Dim AddressCountry(100000)
Dim AddressStreet(100000)
Dim CurrentPeopleID(100000)
 sql = "select distinct People.*, address.* from People, Address, OrdersSetupEvents, Instructors, Judges where (OrdersSetupEvents.PeopleId = People.PeopleID or Instructors.PeopleID = People.PeopleID or Judges.PeopleID = People.PeopleID) and People.AddressID = Address.AddressID and not (Deleted = true) and OrdersSetupEvents.EventID=" & eventID & " order by PeopleLastName "

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	rowcount = 1
	 
	
Recordcount = rs.RecordCount +1
if Recordcount > 1 then %>
<% PageTitleText = "List of Contacts"  %>
<!--#Include file="940Top.asp"-->
<table width = "940" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr bgcolor = "eeeeee">
	<th class = "body" height = "25"><b>Name</b></th>
		<th class = "body"><b>Address</b></th>
		<th class = "body"><b>Email</b></th>
	<th class = "body"><b>Options</b></th>
</tr>
	
<%
order = "Even"
 While  Not rs.eof    
CurrentPeopleID(rowcount) = rs("PeopleID")
PeopleEmail(rowcount) = rs("PeopleEmail")
PeopleFirstName(rowcount) = rs("PeopleFirstName")
PeopleLastName(rowcount) = rs("PeoplelastName")
PeoplePhone(rowcount) = rs("PeoplePhone")
AddressApt(rowcount) = rs("AddressApt")
AddressCity(rowcount) = rs("AddressCity")
AddressState(rowcount) = rs("AddressState")
AddressZip(rowcount) = rs("AddressZip")
AddressCountry(rowcount) = rs("AddressCountry")
 AddressStreet(rowcount) = rs("AddressStreet")

if order = "Even" then
  order = "Odd"
%>
<tr>
<% else 
order = "Even"%>

<tr  bgcolor = "#eeeeee">
<% end if %>
		<td class = "body"  width = "200">

	<input type = "hidden" name="CurrentPeopleID(<%=rowcount%>)" value= "<%= CurrentPeopleID(rowcount)%>">
	&nbsp;<a href = "ContactsEdit.asp?CurrentPeopleID=<%=CurrentPeopleID(rowcount)%>" class = "body"><%=PeopleLastName(rowcount)%>&nbsp;, <%=PeopleFirstName(rowcount)%>&nbsp;</a></td>
		<td class = "body" ><a href = "ContactsEdit.asp?CurrentPeopleID=<%=CurrentPeopleID(rowcount)%>" class = "body"><%=AddressStreet(rowcount)%>&nbsp;<%=AddressCity(rowcount)%>&nbsp;<%=AddressState(rowcount)%>&nbsp;<%=AddressZip(rowcount)%>&nbsp;</a></td>
		<td class = "body" align = "left"><a href = "ContactsEdit.asp?CurrentPeopleID=<%=CurrentPeopleID(rowcount)%>" class = "body"><%=PeopleEmail(rowcount)%>&nbsp;</a></td>
		<td class = "body">&nbsp;<a href = "ContactsEdit.asp?CurrentPeopleID=<%=CurrentPeopleID(rowcount)%>" class = "body"><img src= "images/edit.gif" alt = "edit" height ="18" width = "7" border = "0"></a></td>
	</tr>
<%
		rowcount = rowcount + 1
	   rs.movenext
	Wend
TotalCount=rowcount 
	rs.close
 else %>
 <tr>
		<td class = "body"  >
<center><b>Currently there are contacts associated with your event.</b></center>
</td>
</tr>
<% end if %>

</table>

<!--#Include file="940Bottom.asp"-->
 <br> <br> <br> <br>
 </td></tr></table>
 
 <!--#Include file="970Bottom.asp"-->
 
 
<!--#Include virtual="/Footer.asp"--> </Body>
</HTML>