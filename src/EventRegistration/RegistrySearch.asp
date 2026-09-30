<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Events at Andresen Events - Alpaca Event Registration</title>
<META name="Title" content="Events at Andresen Events - Alpaca Event Registratio">
<META name="description" content="List of Events at Andresen Events - Alpaca Event Registratio">
<META name="keywords" content="alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">
</Head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<%  PageName = "Registry Search Results" %>
<!--#Include file="GlobalVariablesNotLoggedIn.asp"--> 

<!--#Include file="Header.asp"-->
<br>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" ><tr><td class = "roundedtop" align = "left">
		<H2><div align = "left">Events</div></H2>
        </td></tr>
        <tr><td class = "roundedBottom" align = "center" height = "300" valign = "top">
        
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

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "700" >

<%
If Len(Trim(EventName)) > 1 then
	sql2 = "select * from Event, address where Event.Deleted = False and Event.AddressID = Address.AddressID and EventStatus = 'Published' and ( UCase(EventName) = '" & UCase(EventName) & "' ) " & Sortquery
End If 

If Len(Trim(EventName)) <2  then
			sql2 = "select * from Event, EventTypesLookup , address where Event.Deleted = False and Event.AddressID = Address.AddressID and EventStatus = 'Published' and Event.EventTypeID = EventTypesLookup.EventTypeID  " & Sortquery
End If 

		'response.write(sql2)
		acounter = 1
		Set rs2 = Server.CreateObject("ADODB.Recordset")
		rs2.Open sql2, conn, 3, 3 
	if rs2.eof then
	   noresults = true
	end if 
	if Not rs2.eof Then %>
	
	<tr><td class = "body" align ="left" >To register for an event please click 
		on an event below.</td>
</tr>
<tr>
	<td class = "body" align ="left" >
		<form action= 'Registrysearch.asp' method = "post">
		<table border = "0" width = "700"  align = "right">
					<tr>
						<td class = "body">	<table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "right">
						<tr><td class = "body"><b>Sort By:&nbsp;</b></td>
							<td class = "body" colspan = "3"> 
							<select  name="Sort">
							<% if len(Sort) > 1 then %>
							<option value="<%=SortID%>" selected><%=Sort%></option>
							<% end if %>
								<option value="EventName" >Event Name</option>
								<option  value= "EventType">Event Type</option>
								<option  value= "Date">Date</option>
							  </select>
							</td>
							<td class = "body">&nbsp;&nbsp;&nbsp;<b>Order:&nbsp;</b></td>
							<td class = "body" colspan = "3"> 
							<select  name="Order">
							<% If Order = "Asc" Then %>
								<option value="Asc" selected>Ascending</option>
								<option  value= "Desc" >Descending</option>
							<% else %>
								<option value="Asc" >Ascending</option>
								<option  value= "Desc" selected>Descending</option>
							<% End If  %>
							  </select>
							</td>
							<td  align = "center">
							<input type = "hidden" value = "<%=EventName %>" name = "EventName">
								<input type=submit value = "Search" class = "regsubmit2">&nbsp;
							</td>
						</tr>
					</table>
		</td>
						</tr>
					</table>
		  </form>
		</td>
</tr>

	
	<tr>
	   <td>

		<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "900" >

	<% while Not rs2.eof 
	StartDate = rs2("EventStartMonth") & "/" & rs2("EventStartDay") & "/" & rs2("EventStartYear")	
	EndDate = rs2("EventEndMonth") & "/" & rs2("EventEndDay") & "/" & rs2("EventEndYear")
	
	if Datediff("d", StartDate, now) < 1 then
	%>
	  
<tr>
	<td class = "body">
			<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=rs2("EventName") %></a>
	</td>
	<td class = "body">
				<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><% if len(rs2("AddressCity")) > 0 then %><%=rs2("AddressCity") %>,<% end if %>  <%=rs2("AddressState") %></a>
				</td>
					<td class = "body" align = "right">
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=StartDate%></a>
				</td>
					<td class = "body" align = "right">
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=EndDate%></a>					
				</td>
					<td class = "body" align = "center">
					<a href = "EventHome.asp?EventID=<%=rs2("EventID")%>" class = "menu"><%=rs2("EventType")%></a>
				</td>
			</tr>
		

		<%
		end if
		
		 rs2.movenext
	Wend %>
		</table>

		<% End if
rs2.close
Set conn = Nothing	%>

<% 
'response.write("noresults=" & noresults )

if noresults = True then %>
 

<form action= 'RegistrySearch.asp' method = "post">							
<Table border="0"  cellspacing="0" cellpadding="0"   align = "center" valign = "top" width = "700">
<tr><td class = "body" colspan = "2">  We could not find your registry. Please 
	try again. To search for a gift registry, enter the registrant's, or 
	co-registrant's, name below:
</td></tr>

<tr>
<td width = "150"><img src = "images/px.gif" width = "1" height = "1"></td>

<td class = "body" width = "165" valign = "top" align = "center">


<table width = "300"  border = "0" cellspacing="0" cellpadding="0" align = "center"> 
		<tr>
			<td class = "body" align = "left">		
					<b>Event Name: </b><input name="EventName" Value =""  size = "25" maxlength = "61">
			</td>
		</tr>
		<tr>
			<td class = "body" align = "left">		
			</td>
					</tr>
<tr><td height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td bgcolor = "brown"  align = "center" height = "23"><input type=submit class = "regsubmit" value="Search" ></td></tr></table>


								
</form>


<% end if %>
	  </TD>
	</tr>

</table>

<br>	  </TD>
	</tr>	<tr><td></td></tr>
</table><br><br>
<!--#Include file="Footer.asp"-->
</BODY>
</HTML>
