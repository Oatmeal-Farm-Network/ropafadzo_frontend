<%@ Language="VBScript" %> 
<html>
<head>
<title>Alpaca Event Registration at Andresen Events</title>
<META name="Title" content="Alpaca Event Registration at Andresen Events">
<META name="description" content="Alpaca Event Registration at Andresen Events">
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">
<%  PageName = "Home Page" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">


<!--#Include file="Header.asp"-->

	
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = " <%=pagewidth %>" >
	<tr>
	<td class = "body" width = "780" height = "270" background = "/images/ButterflyBackground.jpg" valign = "top">
<h1><%=PageTitle %></h1>
<br>
<%=PageText %>

<table width = "703" border = "0" cellspacing="0" cellpadding="0" align = "center">
<tr>
<td width = "221" valign = "top" class = "body"><h3><center><b>Register for an Event</b></center></h3>
Find the events that you want to attend, find out everything you want to know about them, and register quick and easily. 
</td>
<td width = "20"><img src = "images/px.gif" width = "1" height = "1"></td>
<td width = "221" valign = "top" class = "body"><h3><center><b>Create Your Event</b></center></h3>
Andresen Events puts you in charge of your event registration with simple but powerful tools to create, manage, and sell out your event. It's free to sign up and get started.
</td>
<td width = "20"><img src = "images/px.gif" width = "1" height = "1"></td>
<td width = "221" valign = "top" class = "body"><h3><center><b>Manage Your Event</b></center></h3>
Improve your event pages and customize it with colors, logos, images, personalized URL and more. 
</td>
</tr>

<tr>
<td width = "232" valign = "top" class = "body">
<div align = "Center"><a href = "RegistrySearch.asp?Action=List" class = "menu">Register Now</a><img src = "images/px.gif" width = "5" height = "1"></div><br>
</td>
<td width = "3"><img src = "images/px.gif" width = "1" height = "1"></td>
<td width = "232" valign = "top" class = "body">
<div align = "Center"><a href = "RegCreateType.asp?Action=List" class = "menu">Create an Event Now</a><img src = "images/px.gif" width = "5" height = "1"></div><br>
</td>
<td width = "3"><img src = "images/px.gif" width = "1" height = "1"></td>
<td width = "232" valign = "top" class = "body">
<div align = "Center"><a href = "regLogin.asp" class = "menu">Manage Your Event Now</a><img src = "images/px.gif" width = "5" height = "1"></div><br>
</td>
</tr>
<tr><td colspan = "5" class="body">
	<h3><b>Open for Alpaca Shows</b></h3>
	We now provide registration services for Alpaca Shows, and soon we will offer registration services for a wide range of other types of events.
</td>
</tr> 
</table>

<br>
</td>
<td width = "200" valign = "top"><img src = "/images/px.gif" height = "50" width = "200">
<table border = "0" cellpadding = "0" cellspacing = "0" width = "200">
<tr><td bgcolor = "AE6D9C" height = "30"><a href = "RegistrySearch.asp" class = "whitebody">&nbsp;<font size = "2">Register for an Event</font></a></td></tr>
<tr><td height = "9"  ><img src = "px.gif" width = "1" height = "1"></td></tr>
<tr><td bgcolor = "#5C82C2" height = "25"><a href = "RegCreateType.asp?Action=List" class = "whitebody">&nbsp;<font size = "2">Create Your Event</font></a></td></tr>
<tr><td height = "9"  ><img src = "px.gif" width = "1" height = "1"></td></tr>
<tr><td bgcolor = "#CC6D6A" height = "25">

<% if Session("LoggedIn") = "True" then %>
<a href = 'regHome.asp' class = "whitebody" >&nbsp;<font size = "2">Manage Your Event</font></a>
<% else %>			
<a href = 'regLogin.asp'class = "whitebody" >&nbsp;<font size = "2">Manage Your Event</font></a>
<% End If %>
</td></tr></table>


<td></tr>
<tr>
<td colspan = "2">
   <table align = "center">
	<tr >
		<td align = "center">
    
 
<%
noresults = false


EventName =request.Form("EventName")
If Len(Trim(Eventname))> 1 Then
	session("EventName")  = EventName
Else
	'EventName = session("EventName")
End If 

	
Sortquery= "Order by EventName"
Sort = request.Form("Sort")
Order = request.Form("Order")

If Len(Order) < 2 Then
	Order = "Desc"
End If

If Sort = "EventName" Then
	Sortquery = "Order by Eventname " & Order
	Sort = "Event Name"
	SortID = "EventName"  
End if

If Sort = "EventType" Then
	Sortquery = "Order by EventType " & Order
	Sort = "Event Type" 
	SortID = "EventType" 
End If

If Sort = "Date" Then
	Sortquery = "Order by EventStartYear " & Order & ", EventStartMonth " & Order & ", EventStartDay " & Order
	Sort = "Date" 
	SortID = "Date" 
End If

	
%>

</td>
	</tr>
</table>



<%	
If Len(Trim(EventName)) > 1 then
	sql2 = "select * from Event where EventStatus = 'Published' and ( UCase(EventName) = '" & UCase(EventName) & "' ) " & Sortquery
End If 

If Len(Trim(EventName)) <2  then
			sql2 = "select * from Event, EventTypesLookup where EventStatus = 'Published' and Event.EventTypeID = EventTypesLookup.EventTypeID  " & Sortquery
End If 

		acounter = 1
		Set rs2 = Server.CreateObject("ADODB.Recordset")
		rs2.Open sql2, conn, 3, 3 
	if rs2.eof then
	   noresults = true
	end if 
	if Not rs2.eof Then %>
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "900" >
	<tr>
	    <td class = "body" >
		<h2>Events Open for Registration</H2></td></tr>
<tr><td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td></tr>
	
	<tr><td class = "body" align ="left" >To register for an event please click on an event below.</td>
</tr>
	
	<tr>
	   <td>

		<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "900" >
			<tr bgcolor =  "#DBF5F3">

             <td class = "body" width = "400" align = "center">
					Event Name
				</td>
				<td class = "body" width = "100" align = "center">
					Start Date
				</td>
				<td class = "body" width = "100" align = "center">
					End Date
				</td>
				<td class = "body" align = "center">
				    Event Type
				</td>
	</tr>

	<% while Not rs2.eof 	%>
	  
<tr>
				<td class = "body">
			
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=rs2("EventName") %></a>
				</td>
					<td class = "body">
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=rs2("EventStartMonth")%>/<%=rs2("EventStartDay")%>/<%=rs2("EventStartYear")%></a>
				</td>
					<td class = "body">
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=rs2("EventEndMonth")%>/<%=rs2("EventEndDay")%>/<%=rs2("EventEndYear")%></a>					
				</td>
					<td class = "body" align = "center">
					<%=rs2("EventType")%>
				</td>
			</tr>
	

		<% rs2.movenext
	Wend %>
		</table>

		<% End if
rs2.close
Set conn = Nothing	%>
</td>
</tr>
</table>
<br><br>
<!--#Include file="Footer.asp"-->



</body>
</html>