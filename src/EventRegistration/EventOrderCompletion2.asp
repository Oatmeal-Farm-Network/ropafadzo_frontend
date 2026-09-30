<%@LANGUAGE="VBScript"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="style.css">

</Head>
<body>	

<%
'Option Explicit 

	
Dim objHttp, str
Dim Item_name 
Dim  Item_number
Dim  Payment_status
Dim Payment_amount 
Dim Payment_currency
Dim Txn_id 
Dim Receiver_email 
Dim Payer_email
Dim Business
Dim address_city
Dim address_country
Dim address_country_code
Dim address_name
Dim address_state
Dim address_status
Dim address_street
Dim address_postcode
Dim first_name
Dim last_name
Dim payer_id
Dim payer_status
Dim contact_phone
Dim residence_country
Dim xDb_Conn_Str
Dim Status
Dim custom
Dim shipping
' read post from PayPal system and add 'cmd'
str = Request.Form & "&cmd=_notify-validate"

' post back to PayPal system to validate
set objHttp = Server.CreateObject("Msxml2.ServerXMLHTTP")
' set objHttp = Server.CreateObject("Msxml2.ServerXMLHTTP.4.0")
' set objHttp = Server.CreateObject("Microsoft.XMLHTTP")
objHttp.open "POST", "https://www.paypal.com/cgi-bin/webscr", false
'objHttp.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
 objHTTP.setRequestHeader "Host", "www.paypal.com"
objHttp.Send str
 
Status = "INVALID"
' Check notification validation
if (objHttp.status <> 200 ) then
' HTTP error handling
elseif (objHttp.responseText = "VERIFIED") then
Status = "VERIFIED"
' check that Payment_status=Completed
' check that Txn_id has not been previously processed
' check that Receiver_email is your Primary PayPal email
' check that Payment_amount/Payment_currency are correct
' process payment
'assign posted variables to local variables
 Item_name = Request.Form("item_name")
 Item_number = Request.Form("item_number")
 Payment_status = Request.Form("payment_status")
 Payment_amount = Request.Form("mc_gross")
 Payment_currency = Request.Form("mc_currency")
 Txn_id = Request.Form("txn_id")
 Receiver_email = Request.Form("receiver_email")
 Payer_email = Request.Form("payer_email")
Business= Request.Form("payer_business_name")
address_city= Request.Form("address_city")
address_country= Request.Form("address_country")
address_country_code= Request.Form("address_country_code")
address_name= Request.Form("address_name")
address_state= Request.Form("address_state")
address_status= Request.Form("address_status")
address_street= Request.Form("address_street")
address_postcode= Request.Form("address_postal_code")
first_name= Request.Form("first_name")
last_name= Request.Form("last_name")
payer_id= Request.Form("payer_id")
payer_status= Request.Form("payer_status")
contact_phone= Request.Form("contact_phone")
residence_country= Request.Form("residence_country")
custom= Request.Form("custom")


elseif (objHttp.responseText = "INVALID") then
' log for manual investigation
else
' error
end if
set objHttp = nothing


'Email Contact Information to WebArtists.biz
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

smtpServer = "mail.AlpacaInfinity.com"
strTo = TempEmail & ", contactus@alpacainfinity.com"
strFrom = "contactus@AlpacaInfinity.com"
strSubject = "Your "  & Item_name & " Order"



strBody = "<font face='arial'>Dear " & first_name & " " & last_name & "<br>"
strBody  = strBody &  "Item_name = " & Item_name  & "<br>"
strBody  = strBody &  "item_number = " & custom  & "<br>"
strBody  = strBody &  "payment_status = " & payment_status  & "<br>"
strBody  = strBody &  " Payment_amount  = " &  Payment_amount   & "(" & Payment_currency & ")<br>"
strBody  = strBody &  "   Payer_email = " &   Payer_email  & "<br>"
strBody = strBody & "Thank you for registering with Andresen Events! </font>"



'CDONTS EMail
set objCDONTSmail = Server.CreateObject("CDONTS.NewMail")
objCDONTSmail.BodyFormat = 0
objCDONTSmail.MailFormat = 0
objCDONTSmail.From = strFrom
objCDONTSmail.To = strTo
objCDONTSmail.Subject = strSubject
objCDONTSmail.Body = strBody
objCDONTSmail.Send

set objCDONTSmail = Nothing

'response.write(strBody)
%>


<% 
Dim TempEventID, RegistrationID
TempEventID =session("Event")
if len(TempEventID) > 0 then
else
TempEventID=0
end if

PeopleID = custom
PeopleID = 12
if len(PeopleID) > 0 then
else
if PeopleID > 0 then
else
PeopleID=0
end if
end if %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<%
Query =  "INSERT INTO OrdersEvents (item_number, "
if len(PeopleID) > 0 then
Query =  Query & " PeopleID, "
end if
if len(EventID) > 0 then
Query =  Query & "  EventID, "
end if

Query =  Query & " Payment_status, Payment_amount, Payment_currency,Txn_id  )" 
	   Query =  Query & " Values ('" & item_number & "'," 
	if len(PeopleID) > 0 then
Query =  Query & " " & PeopleID & ", " 
end if
if len(EventID) > 0 then
Query =  Query & " " & TempEventID & ", "
end if   

		Query =  Query & " '" &   Payment_status & "', " 
		Query =  Query & " '" &  Payment_amount & "', " 
		Query =  Query & " '" &   Payment_currency & "', " 	 
		 Query =  Query & " '" &   Txn_id  & "')" 
		'response.write("Query=" & Query)
		
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) 	& ";" 


DataConnection.Execute(Query) 

	DataConnection.Close
	Set DataConnection = Nothing 
	
	
'DatabasePath = "../DB/AndresenEvents2.mdb"
'ITEM_NUMBER=1
'xDb_Conn_Str = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & server.mappath(DatabasePath) & ";"
'Set conn = Server.CreateObject("ADODB.Connection")
'conn.Open xDb_Conn_Str
'strsql = "SELECT * FROM OrdersEvents WHERE EventID = " & EventID
'Set rs = Server.CreateObject("ADODB.Recordset")
'rs.Open strsql, conn, 1, 2

'rs.Close
'Set rs = Nothing
'conn.Close
'Set conn = Nothing
'Response.Clear 







%>
</body>
</html>