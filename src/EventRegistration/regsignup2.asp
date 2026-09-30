<%@ Language="VBScript" %> 


<html>
<head>

<%  PageName = "Event Home" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->

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

<%
If Not Len(EventID)> 0 Then 
	EventID=Request.Form("EventID") 
	EventID=Request.QueryString("EventID") 
End if

%>

<% 'Logo = rs("Logo")
						'Header = rs("Header")
						'MenuBackgroundColor = rs("MenuBackgroundColor")
						'MenuColor = rs("MenuColor")
						'MenuFontMouseOverColor = rs("MenuFontMouseOverColor")
						'TitleColor = rs("TitleColor")
						'PageBackgroundColor = rs("PageBackgroundColor")
						'PageTextColor = rs("PageTextColor")
						'LayoutStyle = rs("LayoutStyle")
		%>
	
<!--#Include file="EventHeader.asp"-->
<form action= 'RegConfirmation.asp' method = "post">
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=bodywidth -50 %>" align = "center">	
<tr><td class = "body2" colspan = "2" ><h1>Register for <%=EventName %></h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td class = "body">
Select the links below to select to add/edit your selections for the options available at <%=EventName %>. Your registration will not finalized until you make your payment.<br><br> 
</td>
</tr>
</table>

	
<%
'response.write(" 1 EventID = " & EventID & "<br>")

PeopleID = request.querystring("PeopleID")
if len(PeopleID) < 1 then 
Session("PeopleID") = PeopleID
end if 
'response.write("PeopleID=" & peopleID)

EventSubTypeID = request.querystring("EventSubTypeID")

'response.write("EventID = " & EventID & "<br>")
sql3 = "select * from Services where EventID = " & EventID
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if



 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
'response.write(sql3)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 
	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

     if rs("ServiceType") = "Vendors" then
       ShowVendors = True 
     End If


     	if rs("ServiceType") = "Stud Auction" then
       		ShowStudauction = True 
     	End If



     if rs("ServiceType") = "Sponsor" then
       ShowSponsors = True
     End If
     
     if rs("ServiceType") = "Advertising" then
       ShowAdvertising = True
     End If


     if rs("ServiceType") = "Classes / Workshops" then
       ShowClasses = True 
     End If

     if rs("ServiceType") = "Dinner" then
       ShowDinner = True 
     End If

     if rs("ServiceType") = "Silent Auction" then
       ShowSilentAuction = True
     End If
rs.movenext
wend
%>



<% '****************************************************************************** %>
<% '  Halter Show  %>
<% '****************************************************************************** %>

<% if  ShowHalterShow = True  then  %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Halter Show Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventHalter.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Eit Halter Show Selections</a><br><br>
</td>
</tr>
</table>

	
<% end if %>



<% '****************************************************************************** %>
<% '  Fleece Show  %>
<% '****************************************************************************** %>
	
<% if  ShowFleeceShow = True  then %>
  <table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Fleece Show Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventFleece.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Fleece Show Selections</a><br><br>
</td>
</tr>
</table>


<% end if %>

<% '****************************************************************************** %>
<% '  Vendors  %>
<% '****************************************************************************** %>

<% if ShowVendors = True then %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Vendor Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventVendors.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Vendor Space Selections</a><br><br>
</td>
</tr>
</table>

<% end if %>


<% '****************************************************************************** %>
<% '  Sponsors  %>
<% '****************************************************************************** %>

<% if ShowSponsors = True then %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Sponsor Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventSponsors.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Sponsorship Selections</a><br><br>
</td>
</tr>
</table>

<% End If %>
 

<% '****************************************************************************** %>
<% '  Advertising %>
<% '****************************************************************************** %>
    
<% if ShowAdvertising = True then %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Advertising Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventAdvertising.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Advertising Selections</a><br><br>
</td>
</tr>
</table>


<% End If %>


<% '****************************************************************************** %>
<% '  Classes %>
<% '****************************************************************************** %>

<% if ShowClasses = True then %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Class Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventClasses.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Class Selections</a><br><br>
</td>
</tr>
</table>


<% End If %>


<% '****************************************************************************** %>
<% '  Dinner  %>
<% '****************************************************************************** %>

<% if ShowDinner = True then %>
<table width = "600" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" colspan = "2" ><h2>Dinner Options</h2>
</td>
</tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr>
<td>

<a href = "EventDinner.asp?EventID=<%=EventID%>" class = "Body">Click Here to Add/Edit Dinner Selections</a><br><br>
</td>
</tr>
</table>

<% End If %>


					

 <!--#Include file="EventFooter.asp"--> 
  <!--#Include file="Footer.asp"--> 
</body>
</html>

