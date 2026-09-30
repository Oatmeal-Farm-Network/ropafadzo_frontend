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
</HEAD>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Createevent" %>
<!--#Include file="OverviewHeader.asp"-->

<%
'rowcount = CInt
rowcount = 1 
Edit = Request.Form("Edit")
Checks= Request.Form("Checks")
Paypal= Request.Form("Paypal")
PaypalEmail= Request.Form("PaypalEmail")
Checkaddress= Request.Form("Checkaddress")
PaymentOptionsID= Request.Form("PaymentOptionsID")
PaymentName= Request.Form("PaymentName")
PaymentStreet= Request.Form("PaymentStreet")
PaymentStreet2= Request.Form("PaymentStreet2")
PaymentApt= Request.Form("PaymentApt")
PaymentCity= Request.Form("PaymentCity")
PaymentState= Request.Form("PaymentState")
PaymentCountry= Request.Form("PaymentCountry")
PaymentZip= Request.Form("PaymentZip")

eventID = Request.Form("EventID")
BusinessName = Request.Form("BusinessName")
EventName= Request.form("EventName")
EventWebsite= Request.form("EventWebsite")
EventWebsiteID= Request.form("EventWebsiteID")
EventTypeID =Request.Form("EventTypeID")

session("EventTypeID") = EventTypeID
ScheduleDateMonth =Request.Form("ScheduleDateMonth")
ScheduleDateDay =Request.Form("ScheduleDateDay")
ScheduleDateYear =Request.Form("ScheduleDateYear")
ScheduleStartTimeHour = Request.Form("ScheduleStartTimeHour")
ScheduleEndTimeHour = Request.Form("ScheduleEndTimeHour")
ScheduleStartTimeMinute =Request.Form("ScheduleStartTimeMinute")
if len(ScheduleStartTimeMinute) > 0 then
else
if len(ScheduleStartTimeMinute) =1 then
ScheduleStartTimeMinute = "0" & ScheduleStartTimeMinute
else
ScheduleStartTimeMinute = "00"
end if
end if

ScheduleEndTimeMinute =Request.Form("ScheduleEndTimeMinute")
if len(ScheduleEndTimeMinute) > 0 then
else
if len(ScheduleEndTimeMinute) =1 then
ScheduleEndTimeMinute = "0" & ScheduleEndTimeMinute
else
ScheduleEndTimeMinute = "00"
end if
end if
ScheduleStartTimeAMPM=Request.Form("ScheduleStartTimeAMPM")
ScheduleEndTimeAMPM=Request.Form("ScheduleEndTimeAMPM")
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
EventLocationPhone =Request.Form("EventLocationPhone")
EventLocationPhoneID =Request.Form("EventLocationPhoneID")
EventLocationCell =Request.Form("EventLocationCell")
EventLocationFax =Request.Form("EventLocationFax")
EventLocationZip =Request.Form("EventLocationZip")
EventLocationCountry =Request.Form("EventLocationCountry")
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

str1 = PaypalEmail
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaypalEmail = Replace(str1,  str2, "''")
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

str1 = PaymentApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentApt= Replace(str1,  str2, "''")
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

str1 = EventLocationZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventLocationZip= Replace(str1,  str2, "''")
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

str1 = StreetAddress
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetAddress= Replace(str1,  str2, "''")
End If 

str1 = StreetApt
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetApt= Replace(str1,  str2, "''")
End If
 
str1 = BusinessCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessCity= Replace(str1,  str2, "''")
End If

str1 = StreetCity
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetCity= Replace(str1,  str2, "''")
End If

str1 = BusinessZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessZip= Replace(str1,  str2, "''")
End If


str1 = StreetZip
str2 = "'"
If InStr(str1,str2) > 0 Then
	StreetZip= Replace(str1,  str2, "''")
End If

str1 = Phone
str2 = "'"
If InStr(str1,str2) > 0 Then
	Phone= Replace(str1,  str2, "''")
End If

str1 = Cell
str2 = "'"
If InStr(str1,str2) > 0 Then
	Cell= Replace(str1,  str2, "''")
End If

str1 = Fax 
str2 = "'"
If InStr(str1,str2) > 0 Then
	Fax= Replace(str1,  str2, "''")
End If

str1 = BusinessEmail 
str2 = "'"
If InStr(str1,str2) > 0 Then
	BusinessEmail= Replace(str1,  str2, "''")
End If
						
'Checks= Request.Form("Checks")
'Paypal= Request.Form("Paypal")
'PaypalEmail= Request.Form("PaypalEmail")
'Checkaddress= Request.Form("Checkaddress")
'PaymentOptionsID= Request.Form("PaymentOptionsID")
'PaymentName= Request.Form("PaymentName")
'PaymentStreet= Request.Form("PaymentStreet")
'PaymentStreet2= Request.Form("PaymentStreet2")
'PaymentCity= Request.Form("PaymentCity")
'PaymentState= Request.Form("PaymentState")
'PaymentCountry= Request.Form("PaymentCountry")
'PaymentZip = Request.Form("PaymentZip")
				
						
'****************************************************************************************************
'  INSERT OR UPDATE THE EVENT AND BUSINESS WEBSITES INTO THE WEBSITES TABLE
'****************************************************************************************************

If Edit = "True" then

	Query =  " UPDATE Websites Set Website = '" &  EventLocationWebsite & "' " 
	Query =  Query & " where WebsitesID = " & EventLocationWebsiteID & ";" 
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%


sql = "select WebsitesID from websites where Website = '" & EventLocationWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then
	EventLocationWebsiteID = rs("WebsitesID")
end if
rs.close


else

	Query =  "INSERT INTO Websites (Website)" 
	Query =  Query + " Values ('" & EventLocationWebsite  & "') "
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%

sql = "select WebsitesID from websites where Website = '" & EventLocationWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

	EventLocationWebsiteID = rs("WebsitesID")
rs.close

end if

If Edit = "True" then

	Query =  " UPDATE Websites Set Website = '" &  BusinessWebsite & "' " 
	Query =  Query & " where WebsitesID = " & BusinessWebsiteID & ";"
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%

 
sql = "select WebsitesID from websites where Website = '" & BusinessWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessWebsiteID = rs("WebsitesID")
End If


else


	Query =  "INSERT INTO Websites (Website)" 
	Query =  Query & " Values ('" & BusinessWebsite  & "') "
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
 
 sql = "select WebsitesID, Website from websites order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

	BusinessWebsiteID = rs("WebsitesID")
	BusinessWebsite = rs("Website")

rs.close

end if


If Edit = "True" then

	Query =  " UPDATE Websites Set Website = '" &  EventWebsite & "' " 
	Query =  Query & " where WebsitesID = " & EventWebsiteID & ";"
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
 
sql = "select WebsitesID from websites where Website = '" & EventWebsite & "' order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventWebsiteID = rs("WebsitesID")
End If 

rs.close

else

	Query =  "INSERT INTO Websites (Website)" 
	Query =  Query & " Values ('" & EventWebsite  & "') "
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
 
 
 sql = "select WebsitesID from websites  order by WebsitesID Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

	EventWebsiteID = rs("WebsitesID")
rs.close
end if


'******************************************************************************************
'  INSERT OR UPDATE THE EVENT AND BUSINESS ADDRESSES INTO THE ADDRESS TABLE IF THIS IS A NEW EVENT
'******************************************************************************************
If Edit = "True" then
	Query =  " UPDATE Address Set AddressStreet = '" &  EventLocationStreet & "' ,"
	Query =  Query & " AddressApt  = '" &  EventLocationApt & "'," 
	Query =  Query & " AddressCity  = '" &  EventLocationCity & "'," 
	Query =  Query & " AddressState  = '" &  EventLocationState & "'," 
		Query =  Query & " AddressCountry  = '" &  EventLocationCountry & "',"
	Query =  Query & " AddressZip = '" &  EventLocationZip & "'" 
	Query =  Query & " where AddressID = " & EventLocationAddressID & ";" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%

	Query =  " UPDATE Address Set AddressStreet = '" &  BusinessAddress & "' ,"
	Query =  Query & " AddressApt  = '" &  BusinessApt & "'," 
	Query =  Query & " AddressCity  = '" &  BusinessCity & "'," 
	Query =  Query & " AddressState  = '" &  BusinessState & "'," 
	Query =  Query & " AddressCountry  = '" &  BusinessCountry & "'," 
	Query =  Query & " AddressZip = '" &  BusinessZip & "'" 
	Query =  Query & " where AddressID = " & BusinessAddressID & ";" 
		Conn.Execute(Query) 
		Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
else
	Query =  "INSERT INTO Address(AddressStreet, AddressApt, AddressCity, AddressState, AddressCountry, AddressZip )" 
	Query =  Query & " Values ('" & EventLocationStreet  & "'," 
	Query =  Query & " '" &  EventLocationApt & "', " 
	Query =  Query & " '" & EventLocationCity & "', " 
	Query =  Query & " '" &  EventLocationState & "', " 
		Query =  Query & " '" &  EventLocationCountry & "', " 
	Query =  Query & " '" &  EventLocationZip & "')" 
	Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%

	Query =  "INSERT INTO Address(AddressStreet, AddressApt, AddressCity, AddressState,  AddressCountry, AddressZip )" 
	Query =  Query & " Values ('" & BusinessAddress  & "'," 
	Query =  Query & " '" &  BusinessApt & "', " 
	Query =  Query & " '" & BusinessCity & "', " 
	Query =  Query & " '" &  BusinessState & "', " 
		Query =  Query & " '" &  BusinessCountry & "', " 
	Query =  Query & " '" &  BusinessZip & "')" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
end if 

'****************************************************************************************************
'  INSERT OR UPDATE EVENT AND BUSINESS PHONE NUMBERS INTO THE PHONE TABLE
'****************************************************************************************************
if Edit = "True" then
	Query =  " UPDATE Phone Set Phone = '" &  EventLocationPhone & "', "
	Query =  Query & " Cellphone  = '" &  EventLocationCell & "'," 
	Query =  Query & " Fax  = '" &  EventLocationFax & "'" 
	Query =  Query & " where PhoneID = " & EventLocationPhoneID & ";" 
		Conn.Execute(Query) 
Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
	Query =  " UPDATE Phone Set Phone = '" &  BusinessPhone & "' ,"
	Query =  Query & " Cellphone  = '" &  BusinessCell & "'," 
	Query =  Query & " Fax  = '" &  BusinessFax & "'" 
	Query =  Query & " where PhoneID = " & BusinessPhoneID & ";" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
else
	Query =  "INSERT INTO Phone (Phone, Cellphone, Fax )" 
	Query =  Query & " Values ('" & EventLocationPhone   & "'," 
	Query =  Query & " '" &  EventLocationCell & "', " 
	Query =  Query & " '" &  EventLocationFax & "')" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%

	Query =  "INSERT INTO Phone (Phone, Cellphone, Fax )" 
	Query =  Query & " Values ('" & BusinessPhone   & "'," 
	Query =  Query & " '" &  BusinessCell & "', " 
	Query =  Query & " '" &  BusinessFax & "')" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
end if





'******************************************************************************************
'  FIND THE ADDRESS ID'S FOR THE LOCATION ADDRERSS AND THE BUSINESS ADDRESS
'******************************************************************************************

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

'******************************************************************************************
'  FIND THE PHONE ID'S 
'******************************************************************************************

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



'******************************************************************************************
'  INSERT OR UPDATE EVENT LOCATION INFORMATION INTO THE EVENTLOCATION TABLE
'******************************************************************************************
if Edit = "True" then
	Query =  " UPDATE Eventlocation Set EventLocationName = '" &  EventLocationName & "', "
	Query =  Query & " EventLocationHours = '" &  EventLocationHours & "'," 
	Query =  Query & " AddressID = " & EventLocationAddressID & "," 
	Query =  Query & " PhoneID = " &  EventLocationPhoneID & "," 
	Query =  Query & " EventLocationEmail = '" &  EventLocationEmail & "'" 
	Query =  Query & " where EventLocationID = " & EventLocationID & ";" 
		Conn.Execute(Query) 
		Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
else
	Query =  "INSERT INTO Eventlocation (EventLocationName, EventLocationHours, AddressID, PhoneID, EventLocationEmail, WebsiteID )" 
	Query =  Query & " Values ('" & EventLocationName  & "'," 
	Query =  Query & " '" &  EventLocationHours & "', "
	Query =  Query & " " & EventLocationAddressID & ", " 
	Query =  Query & " " & EventLocationPhoneID & ", " 
	Query =  Query & " '" & EventLocationEmail & "', " 
	Query =  Query & " " &  EventLocationWebsiteID & ")" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
end if 

'******************************************************************************************
'  INSERT Or UPDATE THE BUSINESS INFORMATION INTO THE BUSINESS TABLE
'******************************************************************************************

if BusinessTypeID > 0 then
else
  BusinessTypeID = 0
end if 
if Edit = "True" then
	Query =  " UPDATE Business Set BusinessTypeID = " &  BusinessTypeID & ", "
	Query =  Query & " BusinessName = '" &  BusinessName & "'," 
	Query =  Query & " BusinessWebsiteID = " & BusinessWebsiteID & "," 
	Query =  Query & " BusinessEmail = '" &  BusinessEmail & "'," 
	Query =  Query & " BusinessHours = '" &  BusinessHours & "'," 
	Query =  Query & " AddressID = " &  BusinessAddressID & ","
	Query =  Query & " PhoneID = " &  BusinessPhoneID & ""
	Query =  Query & " where BusinessID = " & BusinessID & ";" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
else
	Query =  "INSERT INTO Business(BusinessTypeID, BusinessName, BusinessWebsiteID, BusinessEmail, BusinessHours, AddressID,  PhoneID  )" 
	Query =  Query & " Values (" & BusinessTypeID & ", "
	Query =  Query & " '" & BusinessName & "', "  
	Query =  Query & " " & BusinessWebsiteID & ", " 
	Query =  Query & " '" &  BusinessEmail & "', " 
	Query =  Query & " '" &  BusinessHours & "'," 
	Query =  Query & " " & BusinessAddressID & "," 
	Query =  Query & " " &  BusinessPhoneID & ")" 
		Conn.Execute(Query) 
		Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
end if

'******************************************************************************************
'  FIND THE EVENT LOCATION ID
'******************************************************************************************

sql = "select EventLocationID from EventLocation where EventLocationName = '" & EventLocationName  & "' and EventLocationHours = '" & EventLocationHours & "' and  AddressID = " & EventLocationAddressID & " order by EventLocationID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventLocationID = rs("EventLocationID")
End If 
rs.close

'******************************************************************************************
'  FIND THE BUSINESS ID
'******************************************************************************************

sql = "select BusinessID from business where BusinessTypeID = " & BusinessTypeID  & " and BusinessName = '" & BusinessName & "' and  BusinessWebsiteID = " & BusinessWebsiteID & " and BusinessEmail = '" & BusinessEmail & "' and BusinessHours = '" & BusinessHours &  "' order by BusinessID Desc;"  
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessID = rs("BusinessID")
End If 

rs.close

'******************************************************************************************
'  FIND THE BUSINESS TYPE
'******************************************************************************************

sql = "select BusinessType from BusinessTypeLookup where BusinessTypeID = " & BusinessTypeID   & " order by BusinessType Desc;" 
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessType = rs("BusinessType")
End If 

rs.close



'******************************************************************************************
'  FIND THE EVENT TYPE
'******************************************************************************************

sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID   & " order by EventTypeID Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventType = rs("EventType")
End If 

rs.close

PeopleID = request.Form("PeopleID")
if len(PeopleID) > 0 then
else
PeopleID =  Session("PeopleID")
end if
Session("PeopleID") = PeopleID

'******************************************************************************************
'  INSERT OR UPDATE THE EVENT INFORMATION INTO THE EVENT TABLE
'******************************************************************************************
if Edit = "True" then
	Query =  " UPDATE Event Set EventName = '" &  EventName & "', "
	Query =  Query & " EventTypeID = " &  EventTypeID & "," 
	Query =  Query & " AddressID = " & EventLocationAddressID & "," 
	Query =  Query & " WebsiteID = " &  EventWebsiteID & "" 
	Query =  Query & " where EventID = " & EventID & ";" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%  Query =  "Update EventSchedule Set  ScheduleDateMonth  = " & ScheduleDateMonth & ", "
	Query =  Query & " ScheduleDateDay  = " & ScheduleDateDay & ", "
	Query =  Query & " ScheduleDateYear  = " & ScheduleDateYear & ", "
	Query =  Query & " ScheduleStartTimeHour  = " & ScheduleStartTimeHour  & ", " 
	Query =  Query & "  ScheduleEndTimeHour  = " & ScheduleEndTimeHour & ", " 
	Query =  Query & "  ScheduleStartTimeMinute  = " & ScheduleStartTimeMinute & ", "
	Query =  Query & "  ScheduleEndTimeMinute  = " & ScheduleEndTimeMinute & ", "
	Query =  Query & "  ScheduleStartTimeAMPM  = '" & ScheduleStartTimeAMPM & "', "
	Query =  Query & "  ScheduleEndTimeAMPM  = '" & ScheduleEndTimeAMPM & "' "
	Query =  Query & " where EventID = " & EventID & ";" 

	Conn.Execute(Query)
	Conn.Close 
%>	

<!--#Include virtual="/Conn.asp"-->
<% '**************************************************************************************
'  FIND THE EVENT ID
'******************************************************************************************

sql = "select EventID from Event where EventName = '" & EventName   & "'  and WebsiteID = " & EventWebsiteID & " and EventLocationID  = " & EventLocationID & " order by eventid desc;"


Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventID = rs("EventID")
	session("EventID")= EventID
End If 

rs.close


else
	Query =  "INSERT INTO Event (PeopleID, AddressID, EventName, EventTypeID, WebsiteID, BusinessID, PublishedDate, "
	Query =  Query & " EventLocationID   )"
	Query =  Query & " Values (" & PeopleID & ", "
	Query =  Query & " " & EventLocationAddressID & ", "  
	Query =  Query & " '" & EventName & "', "  
	Query =  Query & " " & EventTypeID & ", " 
	Query =  Query & " " &  EventWebsiteID & ", " 
	Query =  Query & " " &  BusinessID & ", " 
	Query =  Query & " date(now())," 
	Query =  Query & " " &  EventLocationID & ")" 
	
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->
<%'***************************************************************************************
'  FIND THE EVENT ID
'******************************************************************************************

sql = "select EventID from Event where EventName = '" & EventName   & "'  and WebsiteID = " & EventWebsiteID & " and EventLocationID  = " & EventLocationID & " order by eventid desc;"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventID = rs("EventID")
	session("EventID")= EventID
End If 

rs.close


Query =  "INSERT INTO EventSchedule ("
if len(ScheduleDateMonth) > 0 then
Query =  Query & " ScheduleDateMonth,"
end if
if len(ScheduleDateDay) > 0 then
Query =  Query &  " ScheduleDateDay,"
end if
if len(ScheduleDateYear) > 0 then
Query =  Query &  " ScheduleDateYear,"
end if
if len(ScheduleDateHour) > 0 then
Query =  Query &   " ScheduleStartTimeHour,"
end if
if len(ScheduleStartTimeMinute) > 0 then
Query =  Query &   " ScheduleStartTimeMinute,"
end if
if len(ScheduleStartTimeAMPM) > 0 then
Query =  Query &   " ScheduleStartTimeAMPM,"
end if



if len(ScheduleEndTimeHour) > 0 then
Query =  Query & " ScheduleEndTimeHour,"
end if
if len(ScheduleEndTimeMinute) > 0 then
Query =  Query &  " ScheduleEndTimeMinute,"
end if
if len(ScheduleEndTimeAMPM) > 0 then
Query =  Query &  " ScheduleEndTimeAMPM,"
end if

Query =  Query & " EventID ) "
	Query =  Query &  " Values (" 


 if len(ScheduleDateMonth) > 0 then
	Query =  Query & " " & ScheduleDateMonth & ", "  
end if
if len(ScheduleDateDay) > 0 then
	Query =  Query & " " & ScheduleDateDay & ", "  
end if
if len(ScheduleDateYear) > 0 then
	Query =  Query & " " & ScheduleDateYear & ", " 
end if
if len(ScheduleDateHour) > 0 then
	Query =  Query & " " &  ScheduleStartTimeHour & ", "
end if
if len(ScheduleStartTimeMinute) > 0 then
	Query =  Query & " " &  ScheduleStartTimeMinute & ", " 
end if
if len(ScheduleStartTimeAMPM) > 0 then
	Query =  Query & " '" &  ScheduleStartTimeAMPM & "', " 
end if
if len(ScheduleEndTimeHour) > 0 then
	Query =  Query & " " &  ScheduleEndTimeHour & ", " 
end if
if len(ScheduleEndTimeMinute) > 0 then
	Query =  Query & " " &  ScheduleEndTimeMinute & ", " 
end if
if len(ScheduleEndTimeAMPM) > 0 then
Query =  Query & " '" &  ScheduleEndTimeAMPM 	& "', " 
end if

Query =  Query & " " &  EventID 	& ")" 

' response.write("Query =" & Query  )
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->


<%
end if 


				
'******************************************************************************************
'  INSERT OR UPDATE THE PAYMENT OPTIONS
'******************************************************************************************
If not EventTypeID = 5 then
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
 	Query =  Query & " PaymentApt = '" & PaymentApt & "'," 
 	Query =  Query & " PaymentCity = '" &  PaymentCity & "'," 
 	Query =  Query & " PaymentState = '" &  PaymentState & "'," 
 	Query =  Query & " PaymentCountry = '" &  PaymentCountry & "',"
 	Query =  Query & " PaymentZip = '" &  PaymentZip & "',"  
 	Query =  Query & " EventID = '" &  EventID & "'"  
 	Query =  Query & " where PaymentOptionsID = " & PaymentOptionsID & ";" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
else
	Query =  "INSERT INTO PaymentOptions (Checks, Paypal, PaypalEmail, PaymentName, PaymentStreet, PaymentStreet2, PaymentApt, PaymentCity, PaymentState, PaymentCountry, PaymentZip, EventID)"
	if Checks = "on" then
		Query =  Query & " Values (True," 
	else
		Query =  Query & " Values (False," 
	end if 
	if Paypal = "on" then
		Query =  Query & " True, " 
	else
		Query =  Query & " False, " 
	end if
	
	Query =  Query & " '" & PaypalEmail & "', " 
	Query =  Query & " '" &  PaymentName & "', " 
	Query =  Query & " '" &  PaymentStreet & "', " 
	Query =  Query & " '" &  PaymentStreet2 & "', " 
	Query =  Query & " '" &  PaymentApt & "', " 
	Query =  Query & " '" &  PaymentCity & "', " 
	Query =  Query & " '" &  PaymentState & "', " 
	Query =  Query & " '" &  PaymentCountry & "', "
	Query =  Query & " '" &  PaymentZip & "', " 
	Query =  Query & " " &  EventID  & ")" 
	Conn.Execute(Query) 
	Conn.Close %>
<!--#Include virtual="/Conn.asp"-->

<%
end if
	
	end if
' Change double quote to single before displaying data

str1 = EventName
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventName= Replace(str1,  str2, "'")
End If 
 
str1 = EventWebsite
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventWebsite= Replace(str1,  str2, "'")
End If 
 
str1 = EventLocationName
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationName = Replace(str1,  str2, "'")
End If  

str1 = EventLocationWebsite
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationWebsite= Replace(str1,  str2, "'")
End If  

str1 = EventLocationHours
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationHours= Replace(str1,  str2, "'")
End If  

str1 = EventLocationEmail
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationEmail= Replace(str1,  str2, "'")
End If  

str1 = EventLocationStreet
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationStreet= Replace(str1,  str2, "'")
End If

str1 = EventLocationApt
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationApt= Replace(str1,  str2, "'")
End If

str1 = EventLocationCity
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationCity= Replace(str1,  str2, "'")
End If  

str1 = EventLocationZip
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationZip= Replace(str1,  str2, "'")
End If
  
str1 = EventLocationPhone
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationPhone= Replace(str1,  str2, "'")
End If  

str1 = EventLocationCell
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationCell= Replace(str1,  str2, "'")
End If  

str1 = EventLocationFax
str2 = "''"
If InStr(str1,str2) > 0 Then
	EventLocationFax= Replace(str1,  str2, "'")
End If  

str1 = PaypalEmail
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaypalEmail = Replace(str1,  str2, "'")
End If 

str1 = PaymentName
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaymentName= Replace(str1,  str2, "'")
End If 

str1 = PaymentStreet
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaymentStreet= Replace(str1,  str2, "'")
End If 

str1 = PaymentStreet2
str2 = "'"
If InStr(str1,str2) > 0 Then
	PaymentStreet2= Replace(str1,  str2, "'")
End If
 
str1 = PaymentApt
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaymentApt= Replace(str1,  str2, "'")
End If 
str1 = PaymentCity
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaymentCity= Replace(str1,  str2, "'")
End If
 
str1 = PaymentZip
str2 = "''"
If InStr(str1,str2) > 0 Then
	PaymentZip= Replace(str1,  str2, "'")
End If 

str1 = BusinessName
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessName= Replace(str1,  str2, "'")
End If 

str1 = BusinessWebsite
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessWebsite= Replace(str1,  str2, "'")
End If 

str1 = BusinessHours
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessHours= Replace(str1,  str2, "'")
End If
 
str1 = BusinessEmail 
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessEmail= Replace(str1,  str2, "'")
End If
			
str1 = BusinessAddress
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessAddress= Replace(str1,  str2, "'")
End If 

str1 = BusinessApt
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessApt= Replace(str1,  str2, "'")
End If 

str1 = BusinessCity
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessCity= Replace(str1,  str2, "'")
End If

str1 = BusinessPhone
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessPhone= Replace(str1,  str2, "'")
End If  

str1 = BusinessCell
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessCell= Replace(str1,  str2, "'")
End If  

str1 = BusinessFax
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessFax= Replace(str1,  str2, "'")
End If  

str1 = BusinessZip
str2 = "''"
If InStr(str1,str2) > 0 Then
	BusinessZip= Replace(str1,  str2, "'")
End If

%>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth  %>"><tr><td class = "roundedtop" align = "left">
	<H1>Create an Event:  Confirm Your Information</H1>
</td></tr>
<tr><td class = "roundedBottom">

<form  name=form method="post" action="RegCreateStep2.asp">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "100%" align = "center">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			Please verify your information below, then select either of the options at the bottom of this page to either go back and make changes or proceed to the text step.
			<br>* Required field
		</td>
	</tr>
	<tr>
	<% if screenwidth < 898 then %>	
</tr><tr><td width = "100%">
<% else %>
<td width = "50%" valign = "top">
<% end if %>
	
	   
	
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
	<H1>A Little About Your Event</H1>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "100%" align = "center">
	<tr>
				<td  class = "body2right" width = "200">
					Event Type:
				</td>
				<td class = "body2"  align = "left">
					
		<%=EventType %>
    	</td>
	</tr>
	<tr>
		<td class = "body2right">
			Event Name:&nbsp;
		</td>
		<td class = "body2" align = "left">
			<%=EventName%>
		</td>
</tr>
	<tr>
		<td class = "body2right">
			Date: &nbsp;</td>
		<td class = "body2" align = "left">
				<%=ScheduleDateMonth %>/<%= ScheduleDateDay %>/<%=ScheduleDateYear %><br />
					<%=ScheduleStartTimeHour%>:<%=ScheduleStartTimeMinute%> - <%=ScheduleEndTimeHour%>:<%=ScheduleEndTimeMinute%>
		</td>
	   </tr>
	   <tr>
		<td class = "body2right">
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
        	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
	<H1>Event Location</H1>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "100%" align = "center">
<tr>							<td class = "body2right" width = "200">
								Name of Location: &nbsp;
							</td>
							<td class = "body2" align = "left" >
								<%=EventLocationName%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								Location's Website: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationWebsite%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								Hours Of Operation: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationHours%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								Contact Email: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationEmail%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								Mailing Address: &nbsp;
							</td>
							<td class = "body2" align = "left">
									<%=EventLocationStreet%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								Apartment / Suite: &nbsp;
							</td>
							<td class = "body2" align = "left">
								<%=EventLocationApt%>
							</td>
						</tr>
						<tr>
							<td class = "body2right">
								City: &nbsp;
							</td>
							<td class = "body2" align = "left">
								<%=EventLocationCity%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<%=EventLocationState%>
						</td>
					</tr>
					<tr>
							<td   class = "body2right">
								Country: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<%=EventLocationCountry%>
						</td>
					</tr>

					<tr>
						<td class = "body2right">
								Phone: &nbsp;
							</td>
						<td class = "body2" align = "left">
								<%=EventLocationPhone%>
							</td>
					</tr>
					<tr>
						<td class = "body2right">
								Cell: &nbsp;
							</td>
						<td class = "body2" align = "left">
								<%=EventLocationCell%>
							</td>
					</tr>
					<tr>
						<td class = "body2right">
								Fax: &nbsp;
							</td>
						<td class = "body2" align = "left">
								<%=EventLocationFax%>
							</td>
					</tr>
</table>
</td>
					</tr>
</table>

       </td>
       
   <% if screenwidth < 898 then %>	
</tr><tr><td width = "100%">
<% else %>
<td width = "50%" valign = "top">
<% end if %>    

	  <%'Payment Options Table

If not EventTypeID = 5 then

%>
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
	<H1>Payment Options</H1>
</td></tr>
<tr><td class = "roundedBottom">	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "100%" align = "center">
	<tr>			
	  	<td  colspan = "2" class = "body2" align = "left">
	     <%  if Checks = "on" or Checks = "True" or len(PaymentName) > 1 or len(PaymentStreet) > 1 or len(PaymentStreet2) > 1 or len(PaymentCity) > 1  or len(PaymentZip) > 1 or  PayPal = "on" or PayPal = "True" or len(PaypalEmail) > 1 then %>	
	     	
	     	
       	 	Accept payment in the following ways:<br>
			<input name="PaymentOptionsID" Value ="<%=PaymentOptionsID%>"  type = "hidden"> 
			</td>
		</tr>
				<% 	if PayPal = "on" or PayPal = "True" or len(PaypalEmail) > 1  then %>
		   		<tr>
				<td class = "body2" colspan = "2" align = "left">
				<img src = "images/px.gif" width = "20" height = "1">Paypal Email Address: &nbsp;
				<%=PaypalEmail%><br>
				</td>
				</tr>
				<% end if %>
				
				<%  if Checks = "on" or Checks = "True" or len(PaymentName) > 1 or len(PaymentStreet) > 1 or len(PaymentStreet2) > 1 or len(PaymentCity) > 1 or len(PaymentState) > 1 or len(PaymentCountry) > 1 or len(PaymentZip) > 1 then %>

						
					<tr>
						  <td   class = "body2" colspan = "2" align = "left">
								<img src = "images/px.gif" width = "20" height = "1">Address that the check should be sent to:
							</td>
						</tr>
					<tr>
						<td   class = "body2right" width = "170">
								Pay To:&nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2" width = "280">
							<%=PaymentName%>
							</td>
					</tr>
					<tr>
						  <td   class = "body2right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<%=PaymentStreet%>
							</td>
						</tr>
						<tr>
						<td    class = "body2right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2" align = "left">
								<%=PaymentStreet2%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2" align = "left">
								<%=PaymentCity%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right" >
								State / Provence: &nbsp;
					</td>
					<td  align = "left" valign = "top" class = "body2">

							<%=PaymentState%>
							</td>
						</tr>
						<tr>
					<td   class = "body2right">
								Country:  &nbsp;
					</td>
					<td  align = "left" valign = "top" class = "body2">
					
						<%=PaymentCountry%>
					</td>
					</tr>

						<tr>
							<td   class = "body2right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=PaymentZip%>
							</td>
						</tr>
					<% end if %>
			<% else %>
				<tr>
					<td   class = "body2" colspan = "2">
						Currently you do not have any payment options selected.
							</td>
						</tr>

			
			<% end if %>
		</table>
</td>
</tr>
</table><br>
	<% end if %>

	
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
	<H1>Who is Putting on the Event?</H1>
</td></tr>
<tr><td class = "roundedBottom">	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "100%" align = "center">
					<tr>
						<td class = "body2right" width = "150">
							Organization's Name: &nbsp;
						</td>
						<td class = "body2" width = "300" align = "left">
							<%=BusinessName%>
						</td>
					</tr>
					<tr>
						<td class = "body2right">
							Organization's Type: &nbsp;
						</td>
						<td class = "body2" align = "left">
						<%=BusinessType %>
						</td>
					</tr>
					<tr>
						<td class = "body2right">
							Website: &nbsp;
						</td>
						<td class = "body2" align = "left">
								<%=BusinessWebsite%>
							</td>
						</tr>
						<tr>
						<td class = "body2right">
							Hours of Operation: &nbsp;
						</td>
						<td class = "body2" align = "left">
							<%=BusinessHours%>
							</td>
						</tr>
					<tr>
							<td class = "body2right">
								Contact Email: &nbsp;
							</td>
						<td class = "body2" align = "left">
							<%=BusinessEmail%>
						</td>

					<tr>
						  <td   class = "body2right">
								Mailing Address: &nbsp;
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
							<td   class = "body2right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2" align = "left">
								<%=BusinessCity%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessState%>

							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessZip%>
							</td>
						</tr>

								<tr>
							<td   class = "body2right">
								Country: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<%=BusinessCountry%>
						</td>
					</tr>

						<tr>
							<td   class = "body2right">
								Postal Code: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessZip%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								Phone: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessPhone%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								Cell: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessCell%>
							</td>
						</tr>
						<tr>
							<td   class = "body2right">
								Fax: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<%=BusinessFax%>
					</td>
				</tr>
				<tr><td height = "65"><br>
				</td>
				</tr>
		</table>
			</td>
				</tr>
		</table>
	</td>
</tr>
</table>

<table width = "100%"  align = "center"  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
	<td class ="body2" valign = "top"  align = "center">
			<center><a href = "regcreate.asp?EventID=<%=EventID %>&PeopleID=<%=session("PeopleID")%>&Edit=True" class = "body2"><h2><center>Make Change</center></h2></a>
			<a href = "regcreate.asp?EventID=<%=EventID %>&PeopleID=<%=session("PeopleID")%>&Edit=True" class = "body2">Click here to go back and make changes.</a><br><br></center>
	</td>
	<td class ="body2" valign = "top"  align = "center">
			<center><a href = "regcreateStep3.asp?EventID=<%=EventID%>&EventTypeID=<%=EventTypeID%>&PeopleID=<%=session("PeopleID")%>" class = "body2"><h2><center>Proceed</center></h2></a>
			<a href = "regcreateStep3.asp?EventID=<%=EventID%>&EventTypeID=<%=EventTypeID%>&PeopleID=<%=session("PeopleID")%>" class = "body2">Click here to proceed to the next step.</a><br><br></center>
		</td>
	</tr>
</table>
		
					
 </form> 
<br>
		</td>
	</tr>
</table><br><br>








		<!--#Include file="Footer.asp"-->

		</Body>
</HTML>

