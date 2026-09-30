<%@LANGUAGE="VBScript"%>
<!DOCTYPE html>
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
DSN_Name = "AEDB2"
DSN_Name = "MasterDB2"

'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=Test;PWD=Test"
Set rs = Server.CreateObject("ADODB.Recordset")


Set rs = Server.CreateObject("ADODB.Recordset")
Dim TempEventID, TempPeopleID
'Custom = "102"
PeopleID = Custom


if len(Payment_amount) < 1 then
  Payment_amount = "0"
end if  
	
	
Query =  "Select Account, TempMinusAccount From People where PeopleID=" & PeopleID 
rs.Open Query, conn, 3, 3
	if not rs.eof then 
	  Account = rs("Account")
	  TempMinusAccount = rs("TempMinusAccount")
	end if
rs.close



Query =  "Update People set TempMinusAccount = 0,"
Query = Query & " Account =" & Account - TempMinusAccount & " "
Query = Query & " where PeopleID=" & PeopleID 
Conn.Execute(Query) 

Query =  " UPDATE Ads Set AdPaidFor = True , " 
Query =  Query & " AdPaidDate = '" & now  & "' " 
Query =  Query & " where PeopleID = " & PeopleID & ";" 

	'response.Write("query=" & query)
	Conn.Execute(Query) 

	


%>
</body>
</html>