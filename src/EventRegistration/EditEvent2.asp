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
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Dashboard"%>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->

<%
'rowcount = CInt
rowcount = 1 

Checks= Request.Form("Checks")
Paypal= Request.Form("Paypal")
PaypalEmail= Request.Form("PaypalEmail")
Checkaddress= Request.Form("Checkaddress")
PaymentOptionsID= Request.Form("PaymentOptionsID")
PaymentName= Request.Form("PaymentName")
PaymentStreet= Request.Form("PaymentStreet")
PaymentStreet2= Request.Form("PaymentStreet2")
PaymentCity= Request.Form("PaymentCity")
PaymentState= Request.Form("PaymentState")
PaymentCountry = Request.Form("PaymentCountry")
PaymentZip= Request.Form("PaymentZip")

Edit = Request.Form("Edit")
EventID = Request.Form("EventID")
BusinessName = Request.Form("BusinessName")
EventName= Request.form("EventName")
EventWebsite= Request.form("EventWebsite")
EventWebsiteID= Request.form("EventWebsiteID")
EventTypeID =Request.Form("EventTypeID")
session("EventTypeID") = EventTypeID
EventStartMonth =Request.Form("EventStartMonth")
EventStartDay =Request.Form("EventStartDay")
EventStartYear =Request.Form("EventStartYear")
EventEndMonth =Request.Form("EventEndMonth")
EventEndDay =Request.Form("EventEndDay")
EventEndYear =Request.Form("EventEndYear")
EventLocationID = Request.Form("EventLocationID")
EventLocationName =Request.Form("EventLocationName")
EventLocationWebsite =Request.Form("EventLocationWebsite")
EventLocationWebsiteID =Request.Form("EventLocationWebsiteID")
EventLocationHours =Request.Form("EventLocationHours")
EventLocationEmail =Request.Form("EventLocationEmail")
EventLocationAddressID =Request.Form("EventLocationAddressID")
EventLocationStreet =Request.Form("EventLocationStreet")
EventLocationApt =Request.Form("EventLocationApt")
EventLocationCity =Request.Form("EventLocationCity")
EventLocationState =Request.Form("EventLocationState")
EventLocationCountry =Request.Form("EventLocationCountry")
EventLocationZip = Request.form("EventLocationZip")
EventLocationPhone =Request.Form("EventLocationPhone")
EventLocationPhoneID =Request.Form("EventLocationPhoneID")
EventLocationCell =Request.Form("EventLocationCell")
EventLocationFax =Request.Form("EventLocationFax")
BusinessTypeID =Request.Form("BusinessTypeID")
BusinessWebsite = Request.Form("BusinessWebsite")
BusinessWebsiteID = Request.Form("BusinessWebsiteID")
BusinessHours = Request.Form("BusinessHours")
BusinessEmail = Request.Form("BusinessEmail")
BusinessAddress  = Request.Form("BusinessAddress")
BusinessAddressID = Request.Form("BusinessAddressID")
BusinessApt  = Request.Form("BusinessApt")
BusinessCity  = Request.Form("BusinessCity")
BusinessState = Request.Form("BusinessState")
BusinessCountry = Request.Form("BusinessCountry")
BusinessZip  = Request.Form("BusinessZip")
BusinessPhone = Request.Form("BusinessPhone")
BusinessPhoneID = Request.Form("BusinessPhoneID")
BusinessCell  = Request.Form("BusinessCell")
BusinessFax = Request.Form("BusinessFax")
BusinessID = Request.Form("BusinessID")

'*******  Payment data checked for single quote
str1 = PayPalEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	PayPalEmail = Replace(str1,  str2, "''")
End If 

str1 = Checkaddress
str2 = "'"
If InStr(str1,str2) > 0 Then
	Checkaddress= Replace(str1,  str2, "''")
End If 

str1 = PaymentName
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentName= Replace(str1,  str2, "''")
End If 

str1 = PaymentStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentStreet= Replace(str1,  str2, "''")
End If 

str1 = PaymentStreet2
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentStreet2= Replace(str1,  str2, "''")
End If 

str1 = PaymentCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentCity= Replace(str1,  str2, "''")
End If 

str1 = PaymentZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentZip= Replace(str1,  str2, "''")
End If 



str1 = lcase(EventWebsite)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	EventWebsite= right(EventWebsite, len(EventWebsite) - 7)
End If  


str1 = EventWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventWebsite= Replace(str1,  str2, "''")
End If 


'***** 
' Event Location data checked for single quote
'*****
str1 = lcase(EventLocationWebsite)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	EventLocationWebsite= right(EventLocationWebsite, len(EventLocationWebsite) - 7)
End If  

str1 = lcase(BusinessWebsite)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	BusinessWebsite= right(BusinessWebsite, len(BusinessWebsite) - 7)
End If  

Dim str1
Dim str2

str1 = EventName
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventName= Replace(str1,  str2, "''")
End If  

str1 = EventLocationName
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationName = Replace(str1,  str2, "''")
End If  

str1 = EventLocationWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationWebsite= Replace(str1,  str2, "''")
End If  

str1 = EventLocationHours
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationHours= Replace(str1,  str2, "''")
End If  

str1 = EventLocationEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationEmail= Replace(str1,  str2, "''")
End If  

str1 = EventLocationStreet
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationStreet= Replace(str1,  str2, "''")
End If  

str1 = EventLocationApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationApt= Replace(str1,  str2, "''")
End If  

str1 = EventLocationCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationCity= Replace(str1,  str2, "''")
End If  

str1 = EventLocationPhone
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationPhone= Replace(str1,  str2, "''")
End If

str1 = EventLocationCell
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationCell= Replace(str1,  str2, "''")
End If

str1 = EventLocationFax 
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationFax= Replace(str1,  str2, "''")
End If

str1 = EventLocationZip 
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationZip= Replace(str1,  str2, "''")
End If



'***** 
' Business data checked for single quote
'*****
str1 = BusinessName
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessName= Replace(str1,  str2, "''")
End If 

str1 = BusinessWebsite
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessWebsite= Replace(str1,  str2, "''")
End If 

str1 = BusinessHours
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessHours= Replace(str1,  str2, "''")
End If 

str1 = BusinessAddress
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessAddress= Replace(str1,  str2, "''")
End If 

str1 = BusinessApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessApt= Replace(str1,  str2, "''")
End If 

str1 = BusinessCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessCity= Replace(str1,  str2, "''")
End If

str1 = BusinessZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessZip= Replace(str1,  str2, "''")
End If

str1 = BusinessPhone
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessPhone= Replace(str1,  str2, "''")
End If

str1 = BusinessCell
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessCell= Replace(str1,  str2, "''")
End If

str1 = BusinessFax 
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessFax= Replace(str1,  str2, "''")
End If

str1 = BusinessEmail 
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessEmail= Replace(str1,  str2, "''")
End If



'****************************************************************************************************
'  UPDATE THE EVENT BUSINESS  TABLE
'****************************************************************************************************
if len(BusinessID) > 0 then
Query =  " UPDATE Business Set BusinessName = '" &  BusinessName & "', " 
if BusinessTypeID > 0 then
 Query =  Query & " BusinessTypeID  = " &  BusinessTypeID & "," 
end if
  Query =  Query & " BusinessEmail  = '" &  BusinessEmail & "'," 
  Query =  Query & " Businesshours  = '" &  BusinessHours & "'" 
Query =  Query & " where BusinessID = " & BusinessID & ";" 

Conn.Execute(Query) 

end if



'****************************************************************************************************
'  UPDATE THE EVENT AND BUSINESS WEBSITES INTO THE WEBSITES TABLE
'****************************************************************************************************
if len(EventWebsiteID) > 0 then
Query =  " UPDATE Websites Set Website = '" &  BusinessWebsite & "' " 
Query =  Query & " where WebsitesID = " & BusinessWebsiteID & ";"

Conn.Execute(Query) 


Query =  " UPDATE Websites Set Website = '" &  EventWebsite & "' " 
Query =  Query & " where WebsitesID = " & EventWebsiteID & ";"
Conn.Execute(Query) 

end if
				
'****************************************************************************************************
'  INSERT OR UPDATE THE PAYMENT OPTIONS
'****************************************************************************************************
if not EventTypeID = 5 then
If Edit = "True" then
if Checks = "on" then
  Checks = "True"
else
  checks = "False"
end if 

if PayPal = "on" then
  PayPal = "True"
else
  PayPal = "False"
end if 

 Query =  " UPDATE PaymentOptions Set Checks = " &  Checks & " ," 
 Query =  Query & " Paypal  = " &  Paypal & "," 
 Query =  Query & " PaypalEmail  = '" &  PaypalEmail & "'," 
 Query =  Query & " PaymentName = '" &  PaymentName & "'," 
 Query =  Query & " PaymentStreet = '" &  PaymentStreet & "'," 
 Query =  Query & " PaymentStreet2 = '" & PaymentStreet2 & "'," 
 Query =  Query & " PaymentCity = '" &  PaymentCity & "'," 
 Query =  Query & " PaymentState = '" &  PaymentState & "'," 
 Query =  Query & " PaymentCountry = '" &  PaymentCountry & "',"
 Query =  Query & " PaymentZip = '" &  PaymentZip & "',"  
 Query =  Query & " EventID = '" &  EventID & "'"  
 Query =  Query & " where PaymentOptionsID = " & PaymentOptionsID & ";" 
 
	Conn.Execute(Query) 


end if
end if 
'****************************************************************************************************
'   UPDATE THE EVENT AND BUSINESS ADDRESSES INTO THE ADDRESS TABLE IF THIS IS A NEW EVENT
'***************************************************************************************************
if len(addressID) > 0 then
Query =  " UPDATE Address Set AddressStreet = '" &  BusinessAddress & "' ,"
Query =  Query & " AddressApt  = '" &  BusinessApt & "'," 
Query =  Query & " AddressCity  = '" &  BusinessCity & "'," 
Query =  Query & " AddressState  = '" &  BusinessState & "'," 
Query =  Query & " AddressCountry  = '" &  BusinessCountry & "'," 
Query =  Query & " AddressZip = '" &  BusinessZip & "'" 
Query =  Query & " where AddressID = " & BusinessAddressID & ";" 
Conn.Execute(Query) 
end if
'response.write("Query=" & Query)
if len(EventLocationAddressID) > 0 then
Query =  " UPDATE Address Set AddressStreet = '" &  EventLocationStreet & "' ,"
Query =  Query & " AddressApt  = '" &  EventLocationApt & "'," 
Query =  Query & " AddressCity  = '" &  EventLocationCity & "'," 
Query =  Query & " AddressState  = '" &  EventLocationState & "'," 
Query =  Query & " AddressCountry  = '" &  EventLocationCountry & "'," 
Query =  Query & " AddressZip = '" &  EventLocationZip & "'" 
Query =  Query & " where AddressID = " & EventLocationAddressID & ";" 
Conn.Execute(Query) 
end if
'response.write("Query=" & Query)
'****************************************************************************************************
'   UPDATE EVENT AND BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'****************************************************************************************************

Query =  " UPDATE Phone Set Phone = '" &  BusinessPhone & "' ,"
Query =  Query & " Cellphone  = '" &  BusinessCell & "'," 
 Query =  Query & " Fax  = '" &  BusinessFax & "'" 
Query =  Query & " where PhoneID = " & BusinessPhoneID & ";" 

Conn.Execute(Query) 


'****************************************************************************************************
'  FIND THE WEBSITE ID'S FOR THE LOCATION WEBSITE AND THE BUSINESS WEBSITE
'****************************************************************************************************

sql = "select WebsitesID from websites where Website = '" & EventLocationWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationWebsiteID = rs("WebsitesID")
End If 


sql = "select WebsitesID from websites where Website = '" & EventWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventWebsiteID = rs("WebsitesID")
End If 

rs.close




'****************************************************************************************************
'  FIND THE ADDRESS ID'S FOR THE LOCATION ADDRERSS AND THE BUSINESS ADDRESS
'****************************************************************************************************

sql = "select * from Address where AddressStreet = '" & EventLocationStreet  & "' and AddressApt = '" & EventLocationApt & "' and  AddressCity = '" & EventLocationCity & "' and AddressZip = '" & EventLocationZip & "' order by AddressID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationAddressID = rs("AddressID")
End If 

sql = "select * from Address where AddressStreet = '" & BusinessAddress  & "' and AddressApt = '" & BusinessApt & "' and  AddressCity = '" & BusinessCity & "' and AddressZip = '" & BusinessZip & "' order by AddressID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessAddressID = rs("AddressID")
End If 

rs.close

'****************************************************************************************************
'  FIND THE PHONE ID'S 
'****************************************************************************************************

sql = "select * from Phone where Phone = '" & EventLocationPhone  & "' and Cellphone = '" & EventLocationCell & "' and  fax = '" & EventLocationFax & "' order by PhoneID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationPhoneID = rs("PhoneID")
End If 

sql = "select * from Phone where Phone = '" & BusinessPhone  & "' and Cellphone = '" & BusinessCell & "' and  fax = '" & BusinessFax & "' order by PhoneID Desc"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessPhoneID = rs("PhoneID")
End If 

rs.close



'****************************************************************************************************
'  UPDATE EVENT LOCATION INFORMATION INTO THE EVENTLOCATION TABLE
'****************************************************************************************************

Query =  " UPDATE Eventlocation Set EventLocationName = '" &  EventLocationName & "', "
Query =  Query & " EventLocationHours = '" &  EventLocationHours & "'," 
Query =  Query & " AddressID = " & EventLocationAddressID & "," 
Query =  Query & " PhoneID = " &  EventLocationPhoneID & "," 
Query =  Query & " EventLocationEmail = '" &  EventLocationEmail & "'" 
Query =  Query & " where EventLocationID = " & EventLocationID & ";" 

Conn.Execute(Query) 

'****************************************************************************************************
'  FIND THE EVENT LOCATION ID
'****************************************************************************************************

sql = "select EventLocationID from EventLocation where EventLocationName = '" & EventLocationName  & "' and EventLocationHours = '" & EventLocationHours & "' and  AddressID = " & EventLocationAddressID & " order by EventLocationID Desc"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventLocationID = rs("EventLocationID")
End If 


rs.close

'****************************************************************************************************
'  FIND THE BUSINESS ID
'****************************************************************************************************

sql = "select BusinessID from business where BusinessTypeID = " & BusinessTypeID  & " and BusinessName = '" & BusinessName & "' and  BusinessWebsiteID = " & BusinessWebsiteID & " and BusinessEmail = '" & BusinessEmail & "' and BusinessHours = '" & BusinessHours &  "' order by BusinessID Desc;"  
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessID = rs("BusinessID")
End If 

rs.close


'****************************************************************************************************
'  FIND THE BUSINESS TYPE
'****************************************************************************************************

sql = "select BusinessType from BusinessTypeLookup where BusinessTypeID = " & BusinessTypeID   & " order by BusinessType Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	BusinessType = rs("BusinessType")
End If 

rs.close

'****************************************************************************************************
'  FIND THE EVENT TYPE
'****************************************************************************************************

sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID   & " order by EventTypeid Desc;"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventType = rs("EventType")
End If 
rs.close

PeopleID = request.Form("PeopleID")
if len(PeopleID) > 1 then
else
PeopleID =  Session("PeopleID")
end if
Session("PeopleID") = PeopleID


'****************************************************************************************************
'  UPDATE THE EVENT INFORMATION INTO THE EVENT TABLE
'****************************************************************************************************

Query =  " UPDATE Event Set EventName = '" &  EventName & "', "
Query =  Query & " EventTypeID = " &  EventTypeID & "," 
Query =  Query & " AddressID = " & EventLocationAddressID & "," 
Query =  Query & " WebsiteID = " &  EventWebsiteID & "," 
if len( EventStartMonth ) > 0 then
Query =  Query & " EventStartMonth = " &  EventStartMonth & "," 
end if
if len(EventStartDay ) > 0 then
Query =  Query & " EventStartDay = " &  EventStartDay & "," 
end if
if len(EventStartYear) > 0 then
Query =  Query & " EventStartYear = " &  EventStartYear & "," 
end if

if len(EventEndMonth) > 0 then
Query =  Query & " EventEndMonth = " &  EventEndMonth & "," 
end if
if len(EventEndDay) > 0 then
Query =  Query & " EventEndDay =" &  EventEndDay & "," 
end if
if len(EventEndYear) > 0 then
Query =  Query & " EventEndYear = " &  EventEndYear  
end if
Query =  Query & " where EventID = " & EventID & ";" 

Conn.Execute(Query) 

'****************************************************************************************************
'  FIND THE EVENT ID
'****************************************************************************************************

sql = "select EventID from Event where EventName = '" & EventName   & "'  and WebsiteID = " & EventWebsiteID & " order by eventid desc;"

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventID = rs("EventID")
	session("EventID")= EventID
End If 

rs.close

str1 = EventName
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventName= Replace(str1,  str2, "'")
End If 

%>
<br>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "890"><tr><td class = "roundedtop" align = "left">
		<H1>Event Facts: Review Your Event Information</H1>
</td></tr>
<tr><td class = "roundedBottom">

<form  name=form method="post" action="RegCreateStep2.asp">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "890" align = "center">

	<tr>
	   <td width = "420" valign = "top">
	
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H2>A Little About Your Event</H2>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" align = "center">

	<tr>
				<td  class = "body2" align = "right" width = "160">
					Event Type:
				</td>
				<td class = "body2"  align = "left">
					
		<%=EventType %>
    	</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			Event Name:&nbsp;
		</td>
		<td class = "body2" align = "left">
			<%=EventName%>
		</td>
</tr>
	<tr>
		<td class = "body2" align = "right">
			Start Date: &nbsp;</td>
		<td class = "body2" align = "left">
				<%=EventStartMonth %>/<%= EventStartDay %>/<%=EventStartYear %>
					
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td class = "body2" align = "left">
				<%=EventEndMonth %>/<%=EventEndDay %>/<%=EventEndYear %>
					
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			Event Website: &nbsp;
		</td>
		<td class = "body2" align = "left">
			<%=EventWebsite%>
		</td>
</tr>
 </table>
	</td>
</tr>
 </table>     
        <br>
 <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H2>Event Location</H2>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" cellpadding=0 cellspacing=0  width = "420"  align = "center">
						<tr>
							<td class = "body2" align = "right" width = "160">
								Name of Location: &nbsp;
							</td>
							<td class = "body2" align = "left" >
								<%=EventLocationName%>
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Location's Website: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationWebsite%>
							</td>
						</tr>
	
						<tr>
							<td class = "body2" align = "right">
								Contact Email: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationEmail%>
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Street: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationStreet%>
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								Apartment / Suite: &nbsp;
							</td>
							<td class = "body2" align = "left">
								<%=EventLocationApt%>
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td class = "body2" align = "left">
								<%=EventLocationCity%>
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<%=EventLocationState%>
						</td>
					</tr>
					<tr>
							<td  align = "right" class = "body2">
								Country: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<%=EventLocationCountry%>
						</td>
					</tr>
</table>
</td>
		</tr>
</table>

       </td>	
	   <td width = "420" valign = "top">
		
	<% if PayPal = "True" or Checks = "True" then %>
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H2>Payment Options</H2>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5  width = "420" align = "center">
	<tr>			
				  <td  colspan = "2" class = "body2">
			        Accept payment in the following ways:
				  </td>
				 </tr>
					
						<input name="PaymentOptionsID" Value ="<%=PaymentOptionsID%>"  type = "hidden">
						<% 
						   if PayPal = "True" then

						   %><tr>
						<td class = "body2" colspan = "2">
								<img src = "images/px.gif" width = "20" height = "1">Paypal Email Address: &nbsp;
					
								<%=PaypalEmail%><br>

							</td>
						</tr>
						<% end if %>
						<%  if Checks = "True" then %>

						
					<tr>
						  <td   class = "body2" colspan = "2">
								<img src = "images/px.gif" width = "20" height = "1">Address that the check should be sent to:
							</td>
						</tr>
					<tr>
						<td   class = "body2" align = "right" width = "170" valign = "top">
								Pay To:&nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2" width = "280">
							<%=PaymentName%> <br />
							<%=PaymentStreet%><br />
							<%=PaymentStreet2%><br />
							<%=PaymentCity%> &nbsp; <%=PaymentState%>	&nbsp; <%=PaymentCountry%>&nbsp;  <%=PaymentZip%>
							</td>
						</tr>
					<% end if %>
		</table>

</td>
</tr>
</table>
<br>
<% end if %>

	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H2>Who is Putting on the Event?</H2>
</td></tr>
<tr><td class = "roundedBottom">


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" align = "center">
	<tr>
		<td class = "body2" align = "right" width = "150">
							Organization's Name: &nbsp;
		</td>
		<td class = "body2" width = "300" align = "left">
							<%=BusinessName%>
						</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							Organization's Type: &nbsp;
						</td>
						<td class = "body2" align = "left">
						<%=BusinessType %>
						</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							Website: &nbsp;
						</td>
						<td class = "body2" align = "left">
								<%=BusinessWebsite%>
							</td>
						</tr>
					<tr>
							<td class = "body2" align = "right">
								Contact Email: &nbsp;
							</td>
						<td class = "body2" align = "left">
							<%=BusinessEmail%>
						</td>

					<tr>
						  <td   class = "body2" align = "right">
								Street: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessAddress%>
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2" align = "left">
							<%=BusinessApt%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2" align = "left">
								<%=BusinessCity%>
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessState%>

							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								Country: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessCountry%>

							</td>
						</tr>

						<tr>
							<td   class = "body2" align = "right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessZip%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessPhone%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessCell%>
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessFax%>
					</td>
				</tr>
		</table>
	</td>
</tr>
</table>
	</td>
</tr>
</table>

<table width = "900"  align = "center"  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
	<td class ="body2" valign = "top"  align = "center">
			<h2><center>Make More Changes</h2>
			<a href = "editEvent.asp?EventID=<%=EventID %>&Edit=True" class = "body2">Click here to go back and make changes.</a></center><br><br>
	</td>
	<td class ="body2" valign = "top"  align = "center">
			<h2><center>Event Page</h2>
			<a href = "RegManageHome.asp?EventID=<%=EventID%>" class = "body2">Go to Event Dashboard.</a></center><br><br>
		</td>
	</tr>
</table>
		
					
 </form> 
<br></td>
	</tr>
</table>
	<br><br>

<!--#Include virtual="/Footer.asp"-->
</Body>
</HTML>

