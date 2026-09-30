<%@LANGUAGE="VBScript"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group">
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
objHTTP.Open "POST", "https://www.sandbox.paypal.com/cgi-bin/webscr" , false
 objHTTP.setRequestHeader "Host", "www.sandbox.paypal.com"
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
Invoice= Request.Form("Invoice")

elseif (objHttp.responseText = "INVALID") then
' log for manual investigation
else
' error
end if
set objHttp = nothing





AdministrationPath = "/Administration"
WebSiteName = "Andresen Events"
PhysicalPath = "e:\inetpub\wwwroot\Internet-host\johnandmom\andresenevents.com\www\"
Slogan = ""
BorderColor = "#ebebeb"
Style = "Style.css"
Showsearch = True

'**************************************************************
 ' Hard Coded Variables
'**************************************************************
Slogan = ""
BorderColor = "#ebebeb"
URL = "http://www.AndresenEvents.com"
DatabasePath = "../DB/AndresenEvents.mdb"

'**************************************************************
 ' Hard Coded Variables
'**************************************************************
DSN_Name = "MasterDB"


'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=admin;PWD=Chickens"
Set rs = Server.CreateObject("ADODB.Recordset")
Dim TempEventID, TempPeopleID

Custom = "15"

EventID = Custom

if len(Payment_amount) < 1 then
  Payment_amount = "0"
end if  
	
	Query =  " UPDATE event Set Paid = True , " 
	Query =  Query & " PaidAmount = '" & Payment_amount  & "' ," 
		Query =  Query & " PaidDate = '" & now  & "' " 
	Query =  Query & " where EventID = " & EventID & ";" 
	'response.Write("query=" & query)
	Conn.Execute(Query) 

	

strsql = "SELECT * FROM Event, People WHERE Event.PeopleID = People.PeopleID and EventID = " & EventID
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open strsql, conn, 1, 2
if not rs.eof then
  EventName = rs("EventName")
  PeopleEmail = rs("PeopleEmail")
end if
rs.close


	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;> </font></td><td align = right><font face=arial size:2;> </font></td><td align = right><font face=arial size:2;>Total: </font></td><td align = right><font face=arial size:2;>" &  Payment_amount   & "</font></td></tr>"

EmailTransactionList = EmailTransactionList & "</table>"

Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

smtpServer = "mail.AlpacaInfinity.com"
strTo = TempEmail & ", contactus@alpacainfinity.com"
strFrom = "DoNotReply@AndresenEvents.com"
strSubject = "Andresen Events Signup"

PeopleEmail = "John@TheAndresenGroup.com"
Payer_email = "John@TheAndresenGroup.com"
strBody = "<font face='arial'>Dear " & first_name & " " & last_name & "<br>"
strBody  = strBody &  "Thank your for signing up with Andresen events. <br> Below is your transaction information:<br>"
strBody  = strBody & "Event Name: " & Eventname & "<br>"
strBody  = strBody &  " Payment Amount " &  Payment_amount   & "(" & Payment_currency & ")<br>"
strBody = strBody & "Thank you for signing up with Andresen Events! </font>"



'CDONTS EMail
set objCDONTSmail = Server.CreateObject("CDONTS.NewMail")
objCDONTSmail.BodyFormat = 0
objCDONTSmail.MailFormat = 0
objCDONTSmail.From = strFrom
objCDONTSmail.To =  Payer_email
objCDONTSmail.cc = "John@theAndresenGroup.com"
objCDONTSmail.Subject = strSubject
objCDONTSmail.Body = strBody
objCDONTSmail.Send


strSubject = EventName & " Andresen Events Sign Up" 
strBody = "<font face='arial'>You Received A Payment<br>"
strBody  = strBody &  "Below is the transaction information:<br>"

strBody  = strBody &  "Customer:<br>"
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   first_name  & " " & last_name & "<br>"
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   BusinessName & "<br>"
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   Payer_email  & "<br>"
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   contact_phone  & "<br>"
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   address_name & "<br> " 	
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   address_street & "<br> " 
strBody  = strBody &  " &nbsp;&nbsp;&nbsp;  " &   address_city & ", " & address_state & " " & address_country & address_postcode & "<br> " 	
strBody  = strBody &  "<br>"	
strBody  = strBody &  "Transaction:<br>"	
strBody  = strBody & EmailTransactionList	
strBody  = strBody &  " Payment Amount: " &  Payment_amount   & "(" & Payment_currency & ")<br>"
strBody  = strBody &  "	" 

	
	
	'CDONTS EMail
set objCDONTSmail = Server.CreateObject("CDONTS.NewMail")
objCDONTSmail.BodyFormat = 0
objCDONTSmail.MailFormat = 0
objCDONTSmail.From = strFrom
objCDONTSmail.To = PeopleEmail
objCDONTSmail.cc = "John@theAndresenGroup.com"
objCDONTSmail.Subject = strSubject
objCDONTSmail.Body = strBody
objCDONTSmail.Send
set objCDONTSmail = Nothing



%>
</body>
</html>