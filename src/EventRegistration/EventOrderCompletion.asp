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
'DSN_Name = "AEDB2"
DSN_Name = "MasterDB"

'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=admin;PWD=Chickens"
Set rs = Server.CreateObject("ADODB.Recordset")
Dim TempEventID, TempPeopleID

'Custom = "202E14"

str = Custom


    if instr(Custom,"E") > 0 then
       Eat=instr(Custom,"E")
       Custom1 = left(Custom, Eat - 1)
       Custom2 = right(Custom, len(Custom) - Eat)
       ' response.write(" Custom1 = " &   Custom1 & "<br>")
        '        response.write(" Custom2 = " &   Custom2 & "<br>")
 end if




'Custom = 182
'session("EventID") = 14
EventID = Custom2
TempEventID = EventID


TempPeopleID = Custom1
PeopleID = TempPeopleID 
'TempEventID =session("EventID")

if len(TempEventID) > 0 then
else
if TempEventID > 0 then
else
TempEventID=0
end if
end if 

EmailTransactionList = "<table border = '0' width = '600'><tr><td width = 350><font face=arial size:2;><b><center>Item</center></b></font></td><td width = 100><font face=arial size:2;><b><center>Price</center></b></font></td><td width = 50><font face=arial size:2;><b><center>#</center></b></font></td><td width = 100><font face=arial size:2;><b><center>Total</center></b></font></td></tr>"

dim AdvertisingNameArray(1000)
	dim AdvertisingQTYArray(1000)
	AdvertisingCounter = 0
	
	dim VendorNameArray(1000)
	dim VendorQTYArray(1000)
	dim VendorTableQTYArray(1000)
	dim DontNeedTableArray(1000)
	VendorCounter = 0

	dim SponsorNameArray(1000)
	dim SponsorQTYArray(1000)
	SponsorCounter = 0
	
	dim ClassesNameArray(1000)
	dim ClassesQTYArray(1000)
	ClassesCounter = 0

	dim ExtraOptionNameArray(1000)
	dim ExtraOptionQTYArray(1000)
	ExtraOptionCounter = 0

i=0
sql = "select * from registrationtemp where Status='Draft' and EventId = " & TempEventID & " and PeopleID =" & TempPeopleID & " Order by ItemPrice"
'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3
	'response.write("<br>Recordcount = " & rs.recordcount & "<br>")
	while not rs.eof    
	i = i +1
		'response.write("<br>i = " & i & "<br>")
		ExtraOptionsName	 = rs("ServiceDescription")
		Quantity = rs("Quantity")
		VegitarianQTY = rs("VegitarianQTY")
		ExtraTablesQTY = rs("ExtraTables")


	if ExtraOptionsName = "Production Class Entries"  and Quantity > 0 then
    	OldProductionClassEntriesQuantity = Quantity
    end if


	if ExtraOptionsName = "Halter Show Entries"  and Quantity > 0 then
    	AnimalQTY = Quantity
    end if

	if ExtraOptionsName = "Companion Animal"  and Quantity > 0 then
    	UnshownQTY = Quantity
    end if


	if ExtraOptionsName = "Vet Check"  and Quantity > 0 then
    	VetCheckQTY = Quantity
    end if


	if ExtraOptionsName = "AOBA Fee"  and Quantity > 0 then
    	AOBAFeeQuantity = Quantity
    end if

	if ExtraOptionsName = "Animal Stalls"  and Quantity > 0 then
    	UpdateAnimalStallQTY = Quantity
    end if


	if trim(ExtraOptionsName) = "Fleece Show Entry"  and Quantity > 0 then
    	FleecesQTY = Quantity
    end if


	if ExtraOptionsName = "Spin-Off Entry"  and Quantity > 0 then
    	SpinOffQTY = Quantity
    end if

    if ExtraOptionsName = "Electricity" and Quantity > 0 then
    		ElectricityQTY = Quantity
    end if

    if ExtraOptionsName = "Stall Mats" and Quantity > 0 then
    	StallMatsQTY =  Quantity
    end if 

 	if ExtraOptionsName = "Dinner Ticket" and Quantity > 0 then
    	OldDinnerTicketQTY =  Quantity
    end if 
    
    if VegitarianQTY > 0 then
    	OldVegitarianQTY = VegitarianQTY   	   
    end if
     
     if ExtraOptionsName = "Display Stalls" and Quantity > 0 then
    	DisplayStallQTY =  Quantity
     end if 
 	
str1 = ExtraOptionsName
str2 = "Advertising"
If InStr(str1,str2) > 0 Then

	newAdName = right(ExtraOptionsName, len(ExtraOptionsName)- 14 )
		if not newAdName = OldAdname then
			AdvertisingCounter = AdvertisingCounter + 1
			AdvertisingNameArray(AdvertisingCounter) = newAdName
			AdvertisingQTYArray(AdvertisingCounter) =  Quantity
		end if
	OldAdname = newAdName	
End If 


str1 = ExtraOptionsName
str2 = "Vendor"
If InStr(str1,str2) > 0 Then

	newVendorName = right(ExtraOptionsName, len(ExtraOptionsName)- 9 )
		if not newVendorName = OldVendorname then
			VendorCounter = VendorCounter + 1
			VendorNameArray(VendorCounter) = newVendorName
			VendorQTYArray(VendorCounter) =  Quantity
			VendorTableQTYArray(VendorCounter) =  rs("ExtraTables")
			DontNeedTableArray(VendorCounter) =  rs("DontNeedTable")
		'response.write("<br>VendorCounter=" & VendorCounter )	
		end if
	Vendorname = newVendorName	
End If 

 str1 = ExtraOptionsName
str2 = "Sponsorship"
If InStr(str1,str2) > 0 Then

	newSponsorName = right(ExtraOptionsName, len(ExtraOptionsName)- 14 )
		if not newSponsorName = OldSponsorname then
			SponsorCounter = SponsorCounter + 1
			SponsorNameArray(SponsorCounter) = newSponsorName
			SponsorQTYArray(SponsorCounter) =  Quantity
		end if
	Sponsorname = newSponsorName	
End If 

str1 = ExtraOptionsName
str2 = "Classes"
If InStr(str1,str2) > 0 Then

	newClassesName = right(ExtraOptionsName, len(ExtraOptionsName)- 10 )
		if not newClassesName = OldClassesname then
			ClassesCounter = ClassesCounter + 1
			ClassesNameArray(ClassesCounter) = newClassesName
			ClassesQTYArray(ClassesCounter) =  Quantity
		end if
	Classesname = newClassesName	
End If 



str1 = ExtraOptionsName
str2 = "Extra Option"
If InStr(str1,str2) > 0 Then

	newExtraOptionName = right(ExtraOptionsName, len(ExtraOptionsName)- 15 )
		if not newExtraOptionName = OldExtraOptionname then
			ExtraOptionCounter = ExtraOptionCounter + 1
			ExtraOptionNameArray(ExtraOptionCounter) = newExtraOptionName
			ExtraOptionQTYArray(ExtraOptionCounter) =  Quantity
		end if
	ExtraOptionname = newExtraOptionName	
End If


   rs.movenext
  wend
  
  TotalAdvertisingCounter = AdvertisingCounter
  TotalVendorCounter = VendorCounter
  TotalSponsorCounter = SponsorCounter
  TotalClassesCounter = ClassesCounter
  TotalExtraOptionCounter = ExtraOptionCounter
  
  rs.close


'OldProductionClassEntriesQuantity = Quantity
 '   	OldHalterShowEntriesQuantity = Quantity
  '  	OldCompanionAnimalQuantity = Quantity
   
   
  '  	OldVetCheckQuantity = Quantity
    '	OldElectricityQuantity = Quantity
    '	OldAOBAFeeQuantity = Quantity
    '	OldAnimalStallsQuantity = Quantity
    '	OldFleeceShowQuantity = Quantity
    '	OldSpinOffQuantity = Quantity
    	'OldElectricityQTY = Quantity
    	'OldStallMatQuantity =  Quantity
    	'OldDinnerTicketQTY =  Quantity
    	'OldVegitarianQTY = VegitarianQTY   	   
    	'OldDisplayStallsQTY =  Quantity


'************************************************************
'  UPDATE REGISTRATION TEMP TABLE
'************************************************************
	
	'***************************************
	'Update Animal Stall
	'***************************************	
	
	if len(UpdateAnimalStallQTY) > 0 then
	if UpdateAnimalStallQTY > 0 then
	UpdateServiceDescription = "Animal Stalls"
	
	sql = "select RegistrationID from Registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO Registration (Status, EventID, PeopleID, Quantity, Halternotes, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  UpdateAnimalStallQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateFeePerPen   & " )" 
		Conn.Execute(Query) 

	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE Registration Set Quantity = " &  UpdateAnimalStallQTY & ", " 
	Query =  Query & " ItemPrice = " & UpdateFeePerPen & ", " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
	if UpdateAnimalStallQTY > 0 and UpdateFeePerPen > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>Animal Stalls</font></td><td align = right><font face=arial size:2;>" & formatcurrency(UpdateFeePerPen) & "</font></td><td align = right><font face=arial size:2;>" & UpdateAnimalStallQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(UpdateFeePerPen * UpdateAnimalStallQTY)   & "</font></td></tr>"
	end if
	
	
	end if 
end if	
	
	
	
	'***************************************
	'Update Display Stall
	'***************************************	
	
	if len(DisplayStallQTY)  > 0 then
	if DisplayStallQTY  > 0 then
	UpdateServiceDescription = "Display Stalls"

	sql = "select RegistrationID from Registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO Registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  DisplayStallQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateDisplayStallPrice   & " )" 
	Conn.Execute(Query) 
	
	else 
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  DisplayStallQTY & ", " 
	Query =  Query & " ItemPrice = " & UpdateDisplayStallPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
	
if DisplayStallQTY > 0 and UpdateDisplayStallPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if
	
	
	
  end if 
	  end if 

	






'***************************************
'Update Companion  Entries
'***************************************	

	if len(AnimalQTY  > 0) then
	if AnimalQTY  > 0 then
	UpdateServiceDescription = "Halter Show Entries"
	
	
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AnimalQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateHalterShowFee   & " )" 

	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  AnimalQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateHalterShowFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	

tempQTY = AnimalQTY
tempPrice = UpdateHalterShowFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if
	
  end if 
    end if  
  
  
    '***************************************
	'Update Production Show Entries
	'***************************************
	ProductionPrice = Price4
	ProductionPriceDiscount = Price4Discount
	ProductionPriceDiscountStartDate = Price4DiscountStartDate
	ProductionPriceDiscountEndDate = Price4DiscountEndDate

	if ProductionPriceDiscount > 0 and len(ProductionPriceDiscountStartDate) > 5 and len(ProductionPriceDiscountStartDate) > 5 then
  	if DateDiff("d", ProductionPriceDiscountStartDate, now()) > 1 and DateDiff("d", ProductionPriceDiscountEndDate, now()) < 1 then
 	 	FullPriceProductionPrice = ProductionPrice
 	 	ProductionPrice = ProductionPriceDiscount
 	  	showdiscount = True
		end if 
	end if

	
	if len(ProductionQTY) > 0 then
		if ProductionQTY > 0 then
	UpdateProductionPrice = ProductionPrice
	UpdateServiceDescription = "Production Class Entries"
	
	
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ProductionQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateProductionPrice   & " )" 
	Conn.Execute(Query) 

	
	else  			
		RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  ProductionQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateProductionPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
	
	tempQTY = ProductionQTY
tempPrice =  UpdateProductionPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
    end if 
  
  
  
  '***************************************
	'Update Companion Animal Entries
	'***************************************	
	
	if len(UnshownQTY) > 0 then
		if UnshownQTY > 0 then
	UpdateCompanionAnimalPrice = 0
	UpdateServiceDescription = "Companion Animal"
	
	
	
	sql = "select RegistrationID from registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  UnshownQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateCompanionAnimalPrice   & " )" 

	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  UnshownQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateCompanionAnimalPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
tempQTY = UnshownQTY
tempPrice =  UpdateCompanionAnimalPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
   end if  
 

 
 	'***************************************
	'Update Vet Check Entries
	'***************************************	

	if len(VetCheckQTY) > 0 then	
		if VetCheckQTY > 0 then	
	UpdateServiceDescription = "Vet Check"
	if len(UpdateVetCheckPrice) < 1 then
	   UpdateVetCheckPrice = 0
	end if
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  VetCheckQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 
	'response.write("<br>vet check insert/update = " & Query & "<br>")	
	Conn.Execute(Query) 
	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  VetCheckQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateVetCheckPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if
	

	rs.close
	
tempQTY = VetCheckQTY
tempPrice =  UpdateVetCheckPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
  end if 
 
 
  '***************************************
  'Update AOBA Entries
  '***************************************	
	
		
	if len(AOBAFeeQuantity) > 0 then
			
	if AOBAFeeQuantity> 0 then

	UpdateServiceDescription = "AOBA Fee"
	
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AOBAQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateAOBAFee   & " )" 
'response.write("<br>AOBA query = " & Query )
	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  AOBAQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateAOBAFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
	
tempQTY = AOBAQTY
tempPrice =  UpdateAOBAFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
  end if 

 
  '***************************************
  'Update Electricity Entries
  '***************************************	
	
	if len(ElectricityQTY) > 0 then
	if ElectricityQTY > 0 then
	UpdateServiceDescription = "Electricity"
	
	
	sql = "select RegistrationID from registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ElectricityQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 
	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  ElectricityQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateElectricityFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
	tempQTY =  ElectricityQTY
tempPrice =  UpdateElectricityFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
		EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if

  end if 
end if



 '***************************************
  'Update Mats Entries
  '***************************************	
	
	if len(StallMatsQTY) > 0 then
if StallMatsQTY > 0 then
	UpdateServiceDescription = "Stall Mats"
	
	
	sql = "select RegistrationID from registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  StallMatsQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateMatsFee   & " )" 
	Conn.Execute(Query) 

	else  	
		RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  StallMatsQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateMatsFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
	
tempQTY = StallMatsQTY
tempPrice =  UpdateMatsFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
  end if

  
  '***************************************
  'Update Fleece Show Entries
  '***************************************	
	
	if len(FleecesQTY) > 0 then
	if FleecesQTY > 0 then

	UpdateServiceDescription = "Fleece Show Entry"
	
	
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  FleecesQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 

	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  FleecesQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateFleeceShowFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
	tempQTY =  FleecesQTY
tempPrice =  UpdateFleeceShowFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 
end if
 
   
  
  '***************************************
  'Update Spin Off Show Entries
  '***************************************	
	

	if  len(SpinOffQTY) > 0 then
		if  SpinOffQTY > 0 then
	UpdateServiceDescription = "Spin-Off Entry"
	
	
	
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  SpinOffQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  SpinOffFee   & " )" 
	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  SpinOffQTY & " ," 
	Query =  Query & " ItemPrice = " & SpinOffFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	
tempQTY =  SpinOffQTY
tempPrice =  SpinOffFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if

  end if 
end if

 
 '********************************************************************************
 '	Update ADVERTISING OPTIONS
 '********************************************************************************

AdvertisingCounter = 0
  sql = "select * from AdvertisingLevels  where AvaliableByItself = True and EventID = " & EventID 
	'response.write("sql=" & sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	While Not rs.eof  
	AdvertisingCounter =AdvertisingCounter + 1
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertsingQTYArraycount = "AdvertsingQTYArray(" & AdvertisingCounter & ")"
	
	if not len(AdvertsingQTYArray(AdvertisingCounter) = 0 ) then
	
	UpdateServiceDescription = "Advertising - " & AdvertisingLevelName
	
	
	
	sql2 = "select RegistrationID from registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AdvertsingQTYArray(AdvertisingCounter)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  AdvertisingLevelPrice   & " )" 
	Conn.Execute(Query) 

	
	else  	
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  AdvertsingQTYArray(AdvertisingCounter) & " ," 
	Query =  Query & " ItemPrice = " & AdvertisingLevelPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 
	end if	
	rs2.close
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	  
	  
tempQTY =   AdvertsingQTYArray(AdvertisingCounter)
tempPrice =  AdvertisingLevelPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if
	Wend		
end if 


 '********************************************************************************
 '	Update Vendors OPTIONS
 '********************************************************************************
if TotalVendorCounter > 0 then
VendorCounter = 0
  sql = "select * from VendorLevels  where EventID = " & EventID & " Order by VendorStallPrice" 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	While Not rs.eof  
    VendorCounter = VendorCounter + 1
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallPrice = rs("VendorStallPrice")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	
	Costpertable = rs("Costpertable")
	MaxExtraTables = rs("MaxExtraTables")
	if len(MaxExtraTables) < 1 then
	  Numfreetables = 0
	end if
	
	
	Numfreetables = rs("Numfreetables")
	if len(Numfreetables) < 1 then
	  Numfreetables = 0
	end if
	
	

	VendorQTYArraycount = "VendorQTYArray(" & VendorCounter & ")"

	VendorTableQTYArraycount = "VendorTableQTYArray(" & VendorCounter & ")"
	DontNeedTableArraycount = "DontNeedTableArray(" & VendorCounter & ")"
	
'response.write("<BR>VENDORQTYArray " & VendorlevelID & " =" & VendorQTYArray(VendorCounter) & "<br>")
	if len(VendorQTYArray(VendorCounter)) > 0 then
		if VendorQTYArray(VendorCounter) > -1 then
	UpdateServiceDescription = "Vendor - " & VendorStallName
	
	
	if len(VendorTableQTYArray(VendorCounter)) < 1 then
		VendorTableQTYArray(VendorCounter) = 0
    end if 
    


str1 = UpdateServiceDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	UpdateServiceDescription= Replace(str1, str2 , "''")
	
End If  

If DontNeedTableArray(VendorCounter) = "Yes" then
else
 DontNeedTableArray(VendorCounter) = "No"
End if 

	sql2 = "select RegistrationID from registration where EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("<br>vendor sql=" & sql & "<br>")
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then

		Query =  "INSERT INTO registration (Status, EventID, PeopleID,  DontNeedTable, Quantity, ServiceDescription, ExtraTables, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  DontNeedTableArray(VendorCounter)  & ","
		Query =  Query & " " &  VendorQTYArray(VendorCounter)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  VendorTableQTYArray(VendorCounter)  & ","
		Query =  Query & " " &  VendorStallPrice   & " )" 
		'response.write("vendor Query" &  Query & "<br>")
	Conn.Execute(Query) 

	else  			
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  VendorQTYArray(VendorCounter) & " ,"
	Query =  Query & " DontNeedTable = " & DontNeedTableArray(VendorCounter) & ", " 
	Query =  Query & " ItemPrice = " & VendorStallPrice & ", " 
	Query =  Query & " ExtraTables = " & VendorTableQTYArray(VendorCounter) & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
		'response.write("vendor Query" &  Query & "<br>")
	Conn.Execute(Query) 

	end if	
	rs2.close
	
	

	
	
  end if
end if


tempQTY =  VendorQTYArray(VendorCounter)
tempPrice =  VendorStallPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if
  


  if  VendorTableQTYArray(VendorCounter)  > 0  then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>Extra Tables</font></td><td align = right><font face=arial size:2;>" & formatcurrency(Costpertable) & "</font></td><td align = right><font face=arial size:2;>" & VendorTableQTYArray(VendorCounter) & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(Costpertable * VendorTableQTYArray(VendorCounter))   & "</font></td></tr>"
end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 
end if


 '***************************************
  'Update Dinner Ticket Entries
  '***************************************	


	if len(DinnerQTY) > 0 or len(DinnerVegQTY) > 0 then
	
	if DinnerQTY > 0 or DinnerVegQTY > 0 then
	
	UpdateServiceDescription = "Dinner Ticket"
	
		
	sql = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then
		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, VegitarianQTY, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  DinnerQTY  & ","
		Query =  Query & " '" & UpdateServiceDescription  & "',"
		Query =  Query & " " & DinnerVegQTY  & ","
		Query =  Query & " " &  UpdateDinnerFee   & " )" 
	Conn.Execute(Query) 

	else 
	RegistrationID = rs("RegistrationID")
	Query =  " UPDATE registration Set Quantity = " &  DinnerQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateDinnerFee & ", " 
	Query =  Query & " VegitarianQTY = " & DinnerVegQTY & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 
	end if	
		end if
	rs.close
	
tempQTY =  DinnerQTY
tempPrice =  UpdateDinnerFee 
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if


  end if 


 '********************************************************************************
 '	Update Extra Options
 '********************************************************************************
ExtraOptionsCounter = 0
sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and EventID = " & EventID & " order by ExtraOptionsPrice" 
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowExtraOptions = True
	end if 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 

	While Not rs.eof  
	ExtraOptionsCounter = ExtraOptionsCounter + 1
	ExtraOptionsID = rs("ExtraOptionsID")
		ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		ExtraOptionsQTYAvailable= rs("ExtraOptionsQTYAvailable")
		ExtraOptionsPrice= rs("ExtraOptionsPrice")
		AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
		AvaliableByItself= rs("AvaliableByItself")
	
		str1 = ExtraOptionsName
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, " ")
		End If 
		
		str1 = ExtraOptionsName
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, "''")
		End If 	
	
		str1 = UpdateServiceDescription
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			UpdateServiceDescription= Replace(str1,  str2, "''")
		End If 
	
	ExtraOptionsQTYArraycount = "ExtraOptionsQTYArray(" & ExtraOptionsCounter & ")"
		
	if len(ExtraOptionsQTYArray(ExtraOptionsCounter)) > 0  then
		if ExtraOptionsQTYArray(ExtraOptionsCounter) > 0  then
	UpdateServiceDescription = "Extra Option - " & ExtraOptionsName
	
		
	if len(ExtraOptionsPrice) > 0 then
	else
		ExtraOptionsPrice = 0
	end if 
	
	sql2 = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		'response.write("sql=" & sql)
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ExtraOptionsQTYArray(ExtraOptionsCounter)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  ExtraOptionsPrice   & " )" 
	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  ExtraOptionsQTYArray(ExtraOptionsCounter) & " ," 
	Query =  Query & " ItemPrice = " & ExtraOptionsPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 
	end if	
	rs2.close
  end if
  end if	

tempQTY =  ExtraOptionsQTYArray(ExtraOptionsCounter)
tempPrice =  ExtraOptionsPrice 
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if
  
  	
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 



 '********************************************************************************
 '	Update Sponsorship
 '********************************************************************************
SponsorshipCounter = 0
 	sql = "select * from SponsorshipLevels  where EventID = " & EventID & " order by SponsorshipLevelPrice"

     Set rs = Server.CreateObject("ADODB.Recordset")
    
    rs.Open sql, conn, 3, 3 
      	'response.write("<br>sponsorship num=" & rs.recordcount & "</br>")   
	if not rs.eof then 

	While Not rs.eof 
	SponsorshipCounter = SponsorshipCounter + 1 
		SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName= rs("SponsorshipLevelName")
		SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
		SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")
	
		str1 = SponsorshipLevelName
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelName = Replace(str1,  str2, " ")
		End If 
		
		str1 = SponsorshipLevelName
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelName= Replace(str1,  str2, "'")
		End If 	
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipCounter & ")"
	
	if  len(SponsorQTYArray(SponsorshipCounter))  > 0  then
		if  SponsorQTYArray(SponsorshipCounter)  > -1  then
	UpdateServiceDescription = "Sponsorship - " & SponsorshipLevelName
	
	
	
	sql2 = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
		response.write("sql=" & sql)
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	
		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  SponsorQTYArray(SponsorshipCounter)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  SponsorshipLevelPrice   & " )" 
	Conn.Execute(Query) 

	else  		
		RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  SponsorQTYArray(SponsorshipCounter) & " ," 
	Query =  Query & " ItemPrice = " & SponsorshipLevelPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs2.close
	
tempQTY =  SponsorQTYArray(SponsorshipCounter)
tempPrice =  SponsorshipLevelPrice
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
	
	response.Write(EmailTransactionList)
end if
	
  end if
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 


 '********************************************************************************
 '	Update Classes
 '********************************************************************************
ClassesCounter  = 0
sql = "select * from Classinfo where EventID = " & EventID & " order by ClassInfoStudentFee" 
	'response.write("sql=" & sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowClasses = True 
	end if 

  if ShowClasses = True then
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 

	While Not rs.eof 
	ClassesCounter = ClassesCounter + 1 
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassInfoMaximumStudents= rs("ClassInfoMaximumStudents")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
	
if len(ClassInfoStudentFee)> 0 then
else
ClassInfoStudentFee = 0
end if
	
	ClassStartTime = rs("ClassStartTime")
	ClassEndTime = rs("ClassEndTime")
	ClassesQTYArraycount = "ClassesQTYArray(" & ClassesCounter & ")"

	if len(ClassesQTYArray(ClassesCounter))  > 0  then
		if ClassesQTYArray(ClassesCounter)  > -1 then
	UpdateServiceDescription = "Classes - " & ClassInfoTitle
	
	
	sql2 = "select RegistrationID from registration where  EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	'response.write("sql=" & sql)
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	

		Query =  "INSERT INTO registration (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Paid' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ClassesQTYArray(ClassesCounter)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " & ClassInfoStudentFee  & " )" 
	Conn.Execute(Query) 

	else  		
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE registration Set Quantity = " &  ClassesQTYArray(ClassesCounter) & " ," 
	Query =  Query & " ItemPrice = " & ClassInfoStudentFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs2.close
	
tempQTY =  ClassesQTYArray(ClassesCounter)
tempPrice =  ClassInfoStudentFee
tempItemName = UpdateServiceDescription
	
if tempQTY > 0 and tempPrice > 0 then
	EmailTransactionList = EmailTransactionList & "<tr><td><font face=arial size:2;>" & tempItemName & "</font></td><td align = right><font face=arial size:2;>" & formatcurrency(tempPrice) & "</font></td><td align = right><font face=arial size:2;>" & tempQTY & "</font></td><td align = right><font face=arial size:2;>" &  formatcurrency(tempPrice * tempQTY)   & "</font></td></tr>"
end if



  end if
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 



 end if ' END UPDATE REGISTRATION TEMP TABLE






Query =  " UPDATE registrationtemp Set Status = 'Paid'" 
	Query =  Query & " where Status = 'Draft' and PeopleID = " & PeopleID & " and EventID = " & EventID & " ;" 

	response.write("Query=" & Query)
	Conn.Execute(Query) 



Query =  "INSERT INTO OrdersSetupEvents (item_number, "
if len(PeopleID) > 0 then
Query =  Query & " PeopleID, "
end if
if len(EventID) > 0 then
Query =  Query & "  EventID, "
end if

Query =  Query & " Payment_status, Payment_amount, Payment_currency, Txn_id, Payer_email, address_city, address_country, address_name, address_state, address_status, address_street, address_postcode, first_name, last_name, payer_id, payer_status, contact_phone )" 
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
		Query =  Query & " '" &   Txn_id  & "', " 	 
 		Query =  Query & " '" &   Payer_email & "', " 	 
		Query =  Query & " '" &   address_city & "', " 	 
		Query =  Query & " '" &   address_country & "', " 	 
		Query =  Query & " '" &  address_name & "', " 	 
		Query =  Query & " '" &   address_state & "', " 	 
		Query =  Query & " '" &   address_status & "', " 	 
		Query =  Query & " '" &   address_street & "', " 	 
		Query =  Query & " '" &   address_postcode & "', " 	 
		Query =  Query & " '" &   first_name & "', " 	 
		Query =  Query & " '" &   last_name & "', " 	 		
		Query =  Query & " '" &   payer_id & "', " 	
		Query =  Query & " '" &  payer_status & "', " 	
		Query =  Query & " '" &  contact_phone & "')" 
		 

		 
		'response.write("Query=" & Query)
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
strSubject = "Your "  & EventName & " Order"

'PeopleEmail = "John@TheAndresenGroup.com"
'Payer_email = "John@TheAndresenGroup.com"
strBody = "<font face='arial'>Dear " & first_name & " " & last_name & "<br>"
strBody  = strBody &  "Thank your for your order. Below is your transaction information:<br>"
strBody  = strBody & EmailTransactionList
strBody  = strBody &  " Payment Amount " &  Payment_amount   & "(" & Payment_currency & ")<br>"
strBody = strBody & "Thank you for your " & EventName & " registration. </font>"



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


strSubject = EventName & " Sign Up" 
strBody = "<font face='arial'>You Received A Payment<br>"
strBody  = strBody &  "Below is the transaction information:<br>"

strBody  = strBody &  "Buyer:<br>"
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

'response.write(strBody)
	
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