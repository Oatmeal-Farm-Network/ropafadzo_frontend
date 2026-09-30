<% SetLocale("en-us") %>
<html>
<head> 
<%  PageName = "FiberMania - Register" %>
<%  PageLink = "FiberManiaEventRegisterPayment.asp" %>
<!--#Include virtual="GlobalVariablesEvent.asp"-->
<title>FiberManiaRegistration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="SOJAA.css">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
<% 

PageTitle = "Register for FiberMania" %>
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" >
<table border="1" bordercolor = "black"  bgcolor ="#FDF4DD" cellspacing="0" cellpadding="0" align = "center" width = "800"><tr><td>
<iframe src="http://www.sojaa.com/SojaaiFrameHeader.asp" frameborder =0 width = "803" height = "249" scrolling = "no" bgcolor ="#FDF4DD"></iframe> 

<table border = "0" width = "100%" height = "100%" ><tr><td valign = "top">


<table width = "700" align = "center" border = "0">
<tr><td class = "body" align = "center"><a name="top"></a><br />
<h1>Confirm Your Order</h1>
Double check your order and then select the "Make Your Payment with PayPal" <br />button at the bottom of this page:
</td>
</tr>
</table>
<% RegistrationID= request.QueryString("RegistrationID") 

'EventName=request.QueryString("EventName")
OrderTotal=request.QueryString("OrderTotal")
PeopleID=request.QueryString("PeopleID")

if request.querystring("RemoveHalterAnimal") = "True" then
  RemoveHalterAnimalID = request.querystring("AnimalID")
  
  
  if len(RemoveHalterAnimalID)> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveHalterAnimalID & " and RegistrationType= 'Halter' "

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	

		Query =  "Delete * From RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveHalterAnimalID & " and RegistrationType= 'Halter' " 
	
	Conn.Execute(Query) 
	rs.close
  end if 
  end if 
end if 

if request.querystring("RemoveProductionAnimal") = "True" then
  RemoveProductionAnimalID = request.querystring("AnimalID")
 
  
  if len(RemoveProductionAnimalID)> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveProductionAnimalID & " and RegistrationType= 'Production' "

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	

		Query =  "Delete * From RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveProductionAnimalID & " and RegistrationType= 'Production' " 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

end if 


if request.querystring("RemoveCompanionAnimal") = "True" then
  RemoveCompanionAnimalID = request.querystring("AnimalID")
 
  
  if len(RemoveCompanionAnimalID)> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveCompanionAnimalID & " and RegistrationType= 'Companion' "

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	

		Query =  "Delete * From RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveCompanionAnimalID & " and RegistrationType= 'Companion' " 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

end if 


if request.querystring("RemoveFleeceAnimal") = "True" then
  RemoveFleeceAnimalID = request.querystring("AnimalID")
  
  
  if len(RemoveFleeceAnimalID)> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveFleeceAnimalID & " and RegistrationType= 'Fleece' "
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	

		Query =  "Delete * From RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveFleeceAnimalID & " and RegistrationType= 'Fleece' " 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

end if 



if request.querystring("RemoveSpinOffAnimal") = "True" then
  RemoveSpinOffAnimalID = request.querystring("AnimalID")
 
  
  if len(RemoveSpinOffAnimalID)> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveSpinOffAnimalID & " and RegistrationType= 'SpinOff' "
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	
		Query =  "Delete * From RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & RemoveSpinOffAnimalID & " and RegistrationType= 'SpinOff' " 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

end if 


dim ProductionClassNameArray(1000)
dim HalterClassNameArray(1000)
dim HalterClassIDArray(1000)
dim ProductionClassIDArray(1000)
dim AnimalNameArray(1000)
dim AnimalIDArray(1000)
dim ProductionAnimalNameArray(1000)
dim ProductionAnimalIDArray(1000)
dim CompanionAnimalNameArray(1000)
dim CompanionAnimalIDArray(1000)
dim FleeceAnimalNameArray(1000)
dim FleeceAnimalIDArray(1000)
dim SpinOffAnimalNameArray(1000)
dim SpinOffAnimalIDArray(1000)
dim ClassesQTYArray(1000)
dim SponsorQTYArray(1000)
dim AdvertsingQTYArray(1000)
dim VendorQTYArray(1000)
dim VendorTableQTYArray(1000)
dim ExtraOptionsQTYArray(1000)
Dim DontNeedTableArray(1000)
Dim ClassInfoMaterialFeePay(1000)
OrderTotal = 0

EventSubTypeID = request.querystring("EventSubTypeID")

sql3 = "select * from Event where EventID = " & EventID
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AOBA = rs3("AOBA")
  AOBAFee = rs3("AOBAFee")
end if
rs3.close

if AOBA = True and len(AOBAFee) > 0 then
  ShowAOBAFee = "True"
end if



sql3 = "select * from Services where EventID = " & EventID
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if

	
	

 sql3 = "select * from EventPagelayout where PageAvailable = True and EventID = " & EventID & " order by LinkOrder"	
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 
	if rs("PageName") = "Halter Show" and rs("ShowPage") = True then
       ShowHalterShow = True 
     End If
 
     if rs("PageName") = "Fleece Show"  and rs("ShowPage") = True then
       ShowFleeceShow = True 
     End If

     if rs("PageName") = "Vendors"  and rs("ShowPage") = True then
       ShowVendors = True 
     End If


     	if rs("PageName") = "Stud Auction"  and rs("ShowPage") = True then
       		ShowStudauction = True 
     	End If

	if rs("PageName") = "Spin-Off"  and rs("ShowPage") = True then
       		ShowSpinOff = True 
     	End If



     if rs("PageName") = "Sponsors"  and rs("ShowPage") = True then
       ShowSponsors = True
     End If

     
     if rs("PageName") = "Advertising"  and rs("ShowPage") = True then
       ShowAdvertising = True
     End If


     if rs("PageName") = "Classes"  and rs("ShowPage") = True then
       ShowClasses = True 
     End If

     if rs("PageName") = "Dinner"  and rs("ShowPage") = True then
       ShowDinner = True 
     End If
     
     

     if rs("PageName") = "Silent Auction" and rs("ShowPage") = True  then
       ShowSilentAuction = True
     End If
rs.movenext
wend
  
dim aID(40000)
dim aName(40000)


sql2 = "select * from Animals where PeopleID = " & PeopleID & " order by FullName "
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		aID(acounter) = rs2("ID")
		aName(acounter) = rs2("FullName")
		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close



 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")
	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	MaxQTY3 =  rs("ServiceMaxQuantity3")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	VetCheckFee = rs("VetCheckFee")
	ElectricityFee = rs("ElectricityFee")
	ElectricityAvailable  = rs("ElectricityAvailable")

	Electricityoptional  = rs("Electricityoptional")

	MaxPensPerFarm = rs("MaxPensPerFarm")
	
	if MaxPensPerFarm > 0 then
	else
		MaxPensPerFarm = 40
	end if 

	MaxDisplaysPerFarm= rs("MaxDisplaysPerFarm")
	
	if MaxDisplaysPerFarm > 0 then
	else
		MaxDisplaysPerFarm = 40
	end if 
	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")

	StallMatPrice = rs("StallMatPrice")
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  

str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 
if len(Price1DiscountStartDateMonth) > 0 and len(Price1DiscountStartDateDay) > 0 and len(Price1DiscountStartDateYear) > 0 then
	Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
end if
if len(Price1DiscountEndDateMonth) > 0 and len(Price1DiscountEndDateDay) > 0 and len(Price1DiscountEndDateYear) > 0 then
	Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear
end if


if len(Price2DiscountStartDateMonth) > 0 and len(Price2DiscountStartDateDay) > 0 and len(Price2DiscountStartDateYear) > 0 then
	Price2DiscountStartDate = Price2DiscountStartDateMonth & "/" & Price2DiscountStartDateDay & "/" & Price2DiscountStartDateYear
end if
if len(Price2DiscountEndDateMonth) > 0 and len(Price2DiscountEndDateDay) > 0 and len(Price2DiscountEndDateYear) > 0 then
	Price2DiscountEndDate = Price2DiscountEndDateMonth & "/" & Price2DiscountEndDateDay & "/" & Price2DiscountEndDateYear
end if

if len(Price3DiscountStartDateMonth) > 0 and len(Price3DiscountStartDateDay) > 0 and len(Price3DiscountStartDateYear) > 0 then
	Price3DiscountStartDate = Price3DiscountStartDateMonth & "/" & Price3DiscountStartDateDay & "/" & Price3DiscountStartDateYear
end if
if len(Price3DiscountEndDateMonth) > 0 and len(Price3DiscountEndDateDay) > 0 and len(Price3DiscountEndDateYear) > 0 then
	Price3DiscountEndDate = Price3DiscountEndDateMonth & "/" & Price3DiscountEndDateDay & "/" & Price3DiscountEndDateYear
end if

if len(Price4DiscountStartDateMonth) > 0 and len(Price4DiscountStartDateDay) > 0 and len(Price4DiscountStartDateYear) > 0 then
	Price4DiscountStartDate = Price4DiscountStartDateMonth & "/" & Price4DiscountStartDateDay & "/" & Price4DiscountStartDateYear
end if
if len(Price4DiscountEndDateMonth) > 0 and len(Price4DiscountEndDateDay) > 0 and len(Price4DiscountEndDateYear) > 0 then
	Price4DiscountEndDate = Price4DiscountEndDateMonth & "/" & Price4DiscountEndDateDay & "/" & Price4DiscountEndDateYear
end if

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

if len(ServiceEndDate) < 6  then %>
<% ' <center><h2>The Registration End Date on this Show Has Not Been Determined</h2></center>%>
<% end if %>


<% if len(ServiceEndDate) > 6 and DateDiff("d", ServiceEndDate, now()) > 1 then
  RegistrationOpen = False %>
<center><h2>Registration is Closed</h2>
Regestration for this show ended on <%=ServiceEndDate %></center>
<% end if %>

<% if len(ServiceStartDate) > 6 and DateDiff("d", ServiceStartDate, now()) < 0 then
  RegistrationOpen = False %>
<center><h2>Registration Has Not Opened Yet</h2>
Registration will open on <%=ServiceStartDate %></center>
<% end if %>

<% if RegistrationOpen = True then %>




<%
sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then
	    RegistrationID = rs("RegistrationID")
	end if 
	rs.close
	
	
	sql = "select * from RegistrationNotes where  RegistrationID = " &  RegistrationID 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	


		Query =  "INSERT INTO RegistrationNotes ("
		if len(Halternotes) > 0 then
		    Query =  Query & " Halternotes, "
		end if
		if len(VendorNotes) > 0 then
		    Query =  Query & " VendorNotes, "
		end if
		
		Query =  Query & " RegistrationID  ) " 
		Query =  Query & " Values ( "
		
		if len(Halternotes) > 0 then
		   Query =  Query & " '" &  Halternotes  & "',"
		end if
		if len(VendorNotes) > 0 then
		    Query =  Query & " '" &  VendorNotes  & "',"
		end if

		Query =  Query & " " &  RegistrationID   & " )" 
		Conn.Execute(Query) 

	else  	
	RegistrationID = rs("RegistrationID")
	
	if len(Halternotes) > 0  or len(VendorNotes) > 0 then
	    Query =  " UPDATE RegistrationNotes Set "
	    if len(Halternotes) > 0 and len(VendorNotes) > 0 then
	    Query =  Query & " Halternotes = '" &  Halternotes & "', " 
	    else
	    if len(Halternotes) > 0 then
	    Query =  Query & " Halternotes = '" &  Halternotes & "' " 
	    end if
	    end if
	    if len(VendorNotes) > 0 then
	    Query =  Query & " VendorNotes = '" &  VendorNotes & "' " 
	    end if
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	
	Conn.Execute(Query) 
    end if
    

	rs.close
	end if 
	
	sql = "select * from RegistrationNotes where  RegistrationID = " &  RegistrationID 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	
	Halternotes = rs("HalterNotes")
	Vendornotes = rs("Vendornotes")
	end if
	
%>	
	
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
  <td class = "body" width= "450"><img src = "images/px.gif" width = "5" height = "1" alt = "Event registration"><b>Service</b></td>
  <td class = "body" align = "center" width = "80"><b>Price</b></td>
  <td class = "body" align = "center" width = "60"><b>Quantity</b></td>
  <td class = "body" align = "center" width = "100"><b><img src = "images/px.gif" width = "4" height = "1" />Total</b></td>
</tr>
</table>
</td>
</tr>
<tr>
  <td background = "images/background650.jpg">
<a Name= "FormTop"></a>
  	<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "640" align = "center">
  

<%

'************************************************************
'  GATHER PAST INFORMATION FROM THE REGISTRATION TEMP TABLE
'************************************************************
if NOT(Update = "True") then 
	dim OldAdvertisingNameArray(1000)
	dim OldAdvertisingQTYArray(1000)
	AdvertisingCounter = 0
	
	dim OldVendorNameArray(1000)
	dim OldVendorQTYArray(1000)
	dim OldVendorTableQTYArray(1000)
	dim OldDontNeedTableArray(1000)
	VendorCounter = 0

	dim OldSponsorNameArray(1000)
	dim OldSponsorQTYArray(1000)
	SponsorCounter = 0
	
	dim OldClassesNameArray(1000)
	dim OldClassesQTYArray(1000)
	ClassesCounter = 0

	dim OldExtraOptionNameArray(1000)
	dim OldExtraOptionQTYArray(1000)
	ExtraOptionCounter = 0


	sql = "select * from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " Order by ItemPrice"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3
	while not rs.eof    
		ExtraOptionsName	 = rs("ServiceDescription")
		Quantity = rs("Quantity")
		VegitarianQTY = rs("VegitarianQTY")
		ExtraTablesQTY = rs("ExtraTables")


	if ExtraOptionsName = "Production Class Entries"  and Quantity > 0 then
    	OldProductionClasEntriesQuantity = Quantity
    end if


	if ExtraOptionsName = "Halter Show Entries"  and Quantity > 0 then
    	OldHalterShowEntriesQuantity = Quantity
    end if

	if ExtraOptionsName = "Companion Animal"  and Quantity > 0 then
    	OldCompanionAnimalQuantity = Quantity
    end if


	if ExtraOptionsName = "Vet Check"  and Quantity > 0 then
    	OldVetCheckQuantity = Quantity
    end if

	if ExtraOptionsName = "Electricity"  and Quantity > 0 then
    	OldElectricityQuantity = Quantity
    end if


	if ExtraOptionsName = "AOBA Fee"  and Quantity > 0 then
    	OldAOBAFeeQuantity = Quantity
    end if

	if ExtraOptionsName = "Animal Stalls"  and Quantity > 0 then
    	OldAnimalStallsQuantity = Quantity
    end if


	if trim(ExtraOptionsName) = "Fleece Show Entry"  and Quantity > 0 then
    	OldFleeceShowQuantity = Quantity
    end if


	if ExtraOptionsName = "Spin-Off Entry"  and Quantity > 0 then
    	OldSpinOffQuantity = Quantity
    end if

    if ExtraOptionsName = "Electricity" and Quantity > 0 then
    	OldElectricityQTY = Quantity
    end if


    if ExtraOptionsName = "Stall Mats" and Quantity > 0 then
    	OldStallMatQuantity =  Quantity
    end if 



 	if ExtraOptionsName = "Dinner Ticket" and Quantity > 0 then
    	OldDinnerTicketQTY =  Quantity
    end if 
    
    if VegitarianQTY > 0 then
    	OldVegitarianQTY = VegitarianQTY   	   
    end if
     
     if ExtraOptionsName = "Display Stalls" and Quantity > 0 then
    	OldDisplayStallsQTY =  Quantity
     end if 
 	
str1 = ExtraOptionsName
str2 = "Advertising"
If InStr(str1,str2) > 0 Then

	newOldAdName = right(ExtraOptionsName, len(ExtraOptionsName)- 14 )
		if not newOldAdName = OldOldAdname then
			AdvertisingCounter = AdvertisingCounter + 1
			OldAdvertisingNameArray(AdvertisingCounter) = newOldAdName
			OldAdvertisingQTYArray(AdvertisingCounter) =  Quantity
		end if
	OldOldAdname = newOldAdName	
End If 


str1 = ExtraOptionsName
str2 = "Vendor"
If InStr(str1,str2) > 0 Then

	newOldVendorName = right(ExtraOptionsName, len(ExtraOptionsName)- 9 )
		if not newOldVendorName = OldOldVendorname then
			VendorCounter = VendorCounter + 1
			OldVendorNameArray(VendorCounter) = newOldVendorName
			OldVendorQTYArray(VendorCounter) =  Quantity
			OldVendorTableQTYArray(VendorCounter) =  rs("ExtraTables")
			OldDontNeedTableArray(VendorCounter) =  rs("DontNeedTable")
			
		end if
	OldOldVendorname = newOldVendorName	
End If 

 str1 = ExtraOptionsName
str2 = "Sponsorship"
If InStr(str1,str2) > 0 Then

	newOldSponsorName = right(ExtraOptionsName, len(ExtraOptionsName)- 14 )
		if not newOldSponsorName = OldOldSponsorname then
			SponsorCounter = SponsorCounter + 1
			OldSponsorNameArray(SponsorCounter) = newOldSponsorName
			OldSponsorQTYArray(SponsorCounter) =  Quantity
		end if
	OldOldSponsorname = newOldSponsorName	
End If 

str1 = ExtraOptionsName
str2 = "Classes"
If InStr(str1,str2) > 0 Then

	newOldClassesName = right(ExtraOptionsName, len(ExtraOptionsName)- 10 )
		if not newOldClassesName = OldOldClassesname then
			ClassesCounter = ClassesCounter + 1
			OldClassesNameArray(ClassesCounter) = newOldClassesName
			OldClassesQTYArray(ClassesCounter) =  Quantity
		end if
	OldOldClassesname = newOldClassesName	
End If 



str1 = ExtraOptionsName
str2 = "Extra Option"
If InStr(str1,str2) > 0 Then

	newOldExtraOptionName = right(ExtraOptionsName, len(ExtraOptionsName)- 15 )
		if not newOldExtraOptionName = OldOldExtraOptionname then
			ExtraOptionCounter = ExtraOptionCounter + 1
			OldExtraOptionNameArray(ExtraOptionCounter) = newOldExtraOptionName
			OldExtraOptionQTYArray(ExtraOptionCounter) =  Quantity
		end if
	OldOldExtraOptionname = newOldExtraOptionName	
End If


   rs.movenext
  wend
  
  TotalAdvertisingCounter = AdvertisingCounter
  TotalVendorCounter = VendorCounter
  TotalSponsorCounter = SponsorCounter
  TotalClassesCounter = ClassesCounter
  TotalExtraOptionCounter = ExtraOptionCounter
  
  rs.close
END IF

'************************************************************
'  UPDATE REGISTRATION TEMP TABLE
'************************************************************
Update = Request.Querystring("Update")
if Update = "True" then 
	
	'***************************************
	'Update Animal Stall
	'***************************************	

	
	if len(UpdateAnimalStallQTY) > 0 then

	UpdateServiceDescription = "Animal Stalls"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, Halternotes, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  UpdateAnimalStallQTY  & ","
		Query =  Query & " '" &  Halternotes  & "',"
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateFeePerPen   & " )" 
		Conn.Execute(Query) 

	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  UpdateAnimalStallQTY & ", " 
	Query =  Query & " ItemPrice = " & UpdateFeePerPen & ", " 
	Query =  Query & " Halternotes = '" & Halternotes & "' "
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
	end if 
	
	
	
	
	'***************************************
	'Update Halter Show Entries
	'***************************************	
	AnimalQTY= request.form("AnimalQTY")
counterx = 0
		
if AnimalQTY > 0 then
while cint(counterx) < cint(AnimalQTY)
    counterx = counterx +1
	AnimalIDArraycount = "AnimalIDArray(" & counterx & ")"	
	AnimalIDArray(counterx)=Request.Form(AnimalIDArraycount) 
	
	
  if len(AnimalIDArray(counterx))> 0  then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & AnimalIDArray(counterx) & " and Registrationtype = 'Halter'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then
	Query =  "INSERT INTO RegisteredAnimals (PeopleID, EventID, RegistrationType, AnimalRegistrationID ) " 
	Query =  Query & " Values ( " &  PeopleID & " ,"
	Query =  Query & " " &  EventID & " ,"
	Query =  Query & " 'Halter' ,"
	Query =  Query & " " & AnimalIDArray(counterx)   & " )" 
	
	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

    HalterClassIDArraycount = "HalterClassIDArray(" & counterx & ")"	
	HalterClassIDArray(counterx)=Request.Form(HalterClassIDArraycount)
		
  if len(HalterClassIDArray(counterx))> 0 and len(AnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & AnimalIDArray(counterx) & " and Registrationtype = 'Halter'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then	

	
    Query =  " UPDATE RegisteredAnimals Set HalterClassID = " &  HalterClassIDArray(counterx) & " " 
  	Query =  Query & " where AnimalRegistrationID = " & AnimalIDArray(counterx) & ";" 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 


Wend

else
   AnimalQTY = 0
end if 	




'***************************************
'Update Production Show Entries
'***************************************	
	ProductionQTY= request.form("ProductionQTY")
counterx = 0

if ProductionQTY > 0 then
while cint(counterx) < cint(ProductionQTY)
    counterx = counterx +1
	ProductionAnimalIDArraycount = "ProductionAnimalIDArray(" & counterx & ")"	
		
	ProductionAnimalIDArray(counterx)=Request.Form(ProductionAnimalIDArraycount) 
  if len(ProductionAnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & ProductionAnimalIDArray(counterx) & " and Registrationtype = 'Production'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegisteredAnimals (PeopleID, EventID, RegistrationType, AnimalRegistrationID ) " 
		Query =  Query & " Values ( " &  PeopleID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " 'Production' ,"
		Query =  Query & " " & ProductionAnimalIDArray(counterx)   & " )" 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 
  
  
 ProductionClassIDArraycount = "ProductionClassIDArray(" & counterx & ")"	
	ProductionClassIDArray(counterx)=Request.Form(ProductionClassIDArraycount)
		
  if len(ProductionClassIDArray(counterx))> 0 and len(ProductionAnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & ProductionAnimalIDArray(counterx) & " and Registrationtype = 'Production'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If not rs.eof Then
	
    Query =  " UPDATE RegisteredAnimals Set ProductionClassID = " &  ProductionClassIDArray(counterx) & " " 
	Query =  Query & " where AnimalRegistrationID = " & ProductionAnimalIDArray(counterx) & ";" 

	
	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

Wend

else
   ProductionQTY = 0
end if 	


'***************************************
'Update Companion  Entries
'***************************************	
	UnshownQTY= request.form("UnshownQTY")
counterx = 0
		
if UnshownQTY > 0 then
while cint(counterx) < cint(UnshownQTY)
    counterx = counterx +1
	CompanionAnimalIDArraycount = "CompanionAnimalIDArray(" & counterx & ")"	
		
	CompanionAnimalIDArray(counterx)=Request.Form(CompanionAnimalIDArraycount) 
	
  if len(CompanionAnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & CompanionAnimalIDArray(counterx) & " and Registrationtype = 'Companion'"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO RegisteredAnimals (PeopleID, EventID, RegistrationType, AnimalRegistrationID ) " 
		Query =  Query & " Values ( " &  PeopleID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " 'Companion' ,"
		Query =  Query & " " & CompanionAnimalIDArray(counterx)   & " )" 

	Conn.Execute(Query) 
	rs.close
  end if 
  end if 


Wend
else
   UnshownQTY = 0
end if
	
	
'***************************************
'Update Fleece  Entries
'***************************************	
	FleecesQTY= request.form("FleecesQTY")
counterx = 0
		
if FleecesQTY > 0 then
while cint(counterx) < cint(FleecesQTY)
    counterx = counterx +1
	FleeceAnimalIDArraycount = "FleeceAnimalIDArray(" & counterx & ")"	
		
	FleeceAnimalIDArray(counterx)=Request.Form(FleeceAnimalIDArraycount) 
	
  if len(FleeceAnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & FleeceAnimalIDArray(counterx) & " and Registrationtype = 'Fleece'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegisteredAnimals (PeopleID, EventID, RegistrationType, AnimalRegistrationID ) " 
		Query =  Query & " Values ( " &  PeopleID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " 'Fleece' ,"
		Query =  Query & " " & FleeceAnimalIDArray(counterx)   & " )" 
	
	Conn.Execute(Query) 
	rs.close
  end if 
  end if 


Wend

else
   FleecesQTY = 0
end if	


	
'***************************************
'Update SpinOff  Entries
'***************************************	
	SpinOffQTY= request.form("SpinOffQTY")
counterx = 0
		
if SpinOffQTY > 0 then
while cint(counterx) < cint(SpinOffQTY)
    counterx = counterx +1
	SpinOffAnimalIDArraycount = "SpinOffAnimalIDArray(" & counterx & ")"	
		
	SpinOffAnimalIDArray(counterx)=Request.Form(SpinOffAnimalIDArraycount) 

  if len(SpinOffAnimalIDArray(counterx))> 0 then
    sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and AnimalRegistrationID = " & SpinOffAnimalIDArray(counterx) & " and Registrationtype = 'SpinOff'"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegisteredAnimals (PeopleID, EventID, RegistrationType, AnimalRegistrationID ) " 
		Query =  Query & " Values ( " &  PeopleID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " 'SpinOff' ,"
		Query =  Query & " " & SpinOffAnimalIDArray(counterx)   & " )" 
	
	Conn.Execute(Query) 
	rs.close
  end if 
  end if 

Wend
else
   SpinOffQTY = 0
end if	




	
	UpdateHalterShowFee = request.form("HalterShowFee")
	
	if len(AnimalQTY  > 0) then
	if AnimalQTY  > 0 then
	UpdateServiceDescription = "Halter Show Entries"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AnimalQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateHalterShowFee   & " )" 

	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  AnimalQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateHalterShowFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
    end if  
  
  
    '***************************************
	'Update Production Show Entries
	'***************************************
	ProductionPrice = Price4
	ProductionPriceDiscount = Price4Discount
	ProductionPriceDiscountStartDate = Price4DiscountStartDate
	ProductionPriceDiscountEndDate = Price4DiscountEndDate

	ProductionQTY = request.form("ProductionQTY")
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
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ProductionQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateProductionPrice   & " )" 
	Conn.Execute(Query) 

	
	else  			
		RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  ProductionQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateProductionPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
    end if 
  
  
  
  '***************************************
	'Update Companion Animal Entries
	'***************************************	
	UnshownQTY= request.form("UnshownQTY")
	
	if len(UnshownQTY) > 0 then
		if UnshownQTY > 0 then
	UpdateCompanionAnimalPrice = 0
	UpdateServiceDescription = "Companion Animal"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  UnshownQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateCompanionAnimalPrice   & " )" 

	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  UnshownQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateCompanionAnimalPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
   end if  
 

 
 	'***************************************
	'Update Vet Check Entries
	'***************************************	
	
	if AnimalQTY > 0  OR UnshownQTY > 0 then
		VetCheckQTY= 1
	else
	 	VetCheckQTY= 0
	end if 

	UpdateVetCheckPrice = request.form("VetCheckFee")
	if len(UpdateVetCheckPrice) > 0 then
	else
	UpdateVetCheckPrice = 0
	
	end if 
	if len(VetCheckQTY) > 0 then	
	UpdateServiceDescription = "Vet Check"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  VetCheckQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 

	Conn.Execute(Query) 
	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  VetCheckQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateVetCheckPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  
  
 
 
  '***************************************
  'Update AOBA Entries
  '***************************************	
	
	 if ShowAOBAFee = "True" then
	 
		if AOBAQTY > 0 or DisplayStallQTY > 0 then
			AOBAQTY = 1
		else
			AOBAQTY = 0
		end if
	UpdateAOBAFee = AOBAFee
		
	if len(AOBAQTY) > 0 then
	

	UpdateServiceDescription = "AOBA Fee"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AOBAQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateAOBAFee   & " )" 

	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  AOBAQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateAOBAFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  end if


 
  '***************************************
  'Update Electricity Entries
  '***************************************	
	
	if  ElectricityAvailable= "True" then
		if AnimalStallQTY > 0 or DisplayStallQTY > 0 then
			ElectricityQTY = 1
		else
			ElectricityQTY = 0
		end if
	UpdateElectricityFee = ElectricityFee
		
	if len(ElectricityQTY) > 0 then

	UpdateServiceDescription = "Electricity"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ElectricityQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 
	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  ElectricityQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateElectricityFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  end if


 '***************************************
  'Update Mats Entries
  '***************************************	
	
	if  StallMatsAvailable= "True" and StallMatPrice > 0  then
		StallMatsQTY = request.form("StallMatsQTY")
			
		UpdateMatsFee = StallMatPrice	
	if len(StallMatsQTY) > 0 then

	UpdateServiceDescription = "Stall Mats"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  StallMatsQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateMatsFee   & " )" 
	Conn.Execute(Query) 

	else  	
		RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  StallMatsQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateMatsFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  end if

  
  '***************************************
  'Update Fleece Show Entries
  '***************************************	
	
	if  ShowFleeceShow = True then 		
	
	FleecesQTY = request.form("FleecesQTY")
	
	UpdateFleeceShowFee = request.form("FleeceShowFee")		
	if len(FleecesQTY) > 0 then


	UpdateServiceDescription = "Fleece Show Entry"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  FleecesQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  UpdateVetCheckPrice   & " )" 

	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  FleecesQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateFleeceShowFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  end if
 
   
  
  '***************************************
  'Update Spin Off Show Entries
  '***************************************	
	
	if  ShowSpinOff = True then 		
	SpinOffQTY = request.form("SpinOffQTY")
		SpinOffFee = request.form("SpinOffFee")
	if not len(SpinOffQTY = 0 ) then
	UpdateServiceDescription = "Spin-Off Entry"
	PeopleID = Session("PeopleID")
	
	
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  SpinOffQTY  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  SpinOffFee   & " )" 
	Conn.Execute(Query) 
	
	else  	
	RegistrationID = rs("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  SpinOffQTY & " ," 
	Query =  Query & " ItemPrice = " & SpinOffFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs.close
  end if 
  end if


 
 '********************************************************************************
 '	Update ADVERTISING OPTIONS
 '********************************************************************************


 if ShowAdvertising = True then 
  sql = "select * from AdvertisingLevels  where AvaliableByItself = True and EventID = " & EventID 

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	
	While Not rs.eof  
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertsingQTYArraycount = "AdvertsingQTYArray(" & AdvertisingLevelID & ")"
	AdvertsingQTYArray(AdvertisingLevelID) = Request.Form(AdvertsingQTYArraycount)
	
	if not len(AdvertsingQTYArray(AdvertisingLevelID) = 0 ) then
	
	UpdateServiceDescription = "Advertising - " & AdvertisingLevelName
	PeopleID = Session("PeopleID")
	
	
	sql2 = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  AdvertsingQTYArray(AdvertisingLevelID)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  AdvertisingLevelPrice   & " )" 
	Conn.Execute(Query) 

	
	else  	
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  AdvertsingQTYArray(AdvertisingLevelID) & " ," 
	Query =  Query & " ItemPrice = " & AdvertisingLevelPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 
	end if	
	rs2.close
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 
end if





 '***************************************
  'Update Dinner Ticket Entries
  '***************************************	
	
	 if ShowDinner = "True" then
		UpdateDinnerFee = request.form("DinnerFee")
		DinnerQTY = request.form("DinnerQTY")
		DinnerVegQTY = request.form("DinnerVegQTY")
		
		if len(DinnerVegQTY) > 0 then
		else
		 DinnerVegQTY = 0
		end if

	if len(DinnerQTY) > 0 or len(DinnerVegQTY) > 0 then
	
	if DinnerQTY > 0 or DinnerVegQTY > 0 then
	
	UpdateServiceDescription = "Dinner Ticket"
	PeopleID = Session("PeopleID")
		
	sql = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	If rs.eof Then
		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, VegitarianQTY, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  DinnerQTY  & ","
		Query =  Query & " '" & UpdateServiceDescription  & "',"
		Query =  Query & " " & DinnerVegQTY  & ","
		Query =  Query & " " &  UpdateDinnerFee   & " )" 
	Conn.Execute(Query) 

	else 
	RegistrationID = rs("RegistrationID")
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  DinnerQTY & " ," 
	Query =  Query & " ItemPrice = " & UpdateDinnerFee & ", " 
	Query =  Query & " VegitarianQTY = " & DinnerVegQTY & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 

	Conn.Execute(Query) 
	end if	
		end if
	rs.close
  end if 
  end if

 '********************************************************************************
 '	Update Extra Options
 '********************************************************************************

sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and EventID = " & EventID & "" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowExtraOptions = True
	end if 

  if ShowExtraOptions = True then
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 

	While Not rs.eof  
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
	
	ExtraOptionsQTYArraycount = "ExtraOptionsQTYArray(" & ExtraOptionsID & ")"
	ExtraOptionsQTYArray(ExtraOptionsID) = Request.Form(ExtraOptionsQTYArraycount)
		
	if len(ExtraOptionsQTYArray(ExtraOptionsID)) > 0  then
		if ExtraOptionsQTYArray(ExtraOptionsID) > 0  then
	UpdateServiceDescription = "Extra Option - " & ExtraOptionsName
	PeopleID = Session("PeopleID")
		
	if len(ExtraOptionsPrice) > 0 then
	else
		ExtraOptionsPrice = 0
	end if 
	
	sql2 = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ExtraOptionsQTYArray(ExtraOptionsID)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  ExtraOptionsPrice   & " )" 
	Conn.Execute(Query) 

	
	else  		
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  ExtraOptionsQTYArray(ExtraOptionsID) & " ," 
	Query =  Query & " ItemPrice = " & ExtraOptionsPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 
	end if	
	rs2.close
  end if
  end if		
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 
end if


 '********************************************************************************
 '	Update Sponsorship
 '********************************************************************************

 	sql = "select * from SponsorshipLevels  where EventID = " & EventID
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowExtraOptions = True
	end if 

  if showsponsors = true then
  
     Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 

	While Not rs.eof  
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
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)

	if  len(SponsorQTYArray(SponsorshipLevelID))  > 0  then
		if  SponsorQTYArray(SponsorshipLevelID)  > -1  then
	UpdateServiceDescription = "Sponsorship - " & SponsorshipLevelName
	PeopleID = Session("PeopleID")
	
	
	sql2 = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	
		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  SponsorQTYArray(SponsorshipLevelID)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " &  SponsorshipLevelPrice   & " )" 
	Conn.Execute(Query) 

	else  		
		RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  SponsorQTYArray(SponsorshipLevelID) & " ," 
	Query =  Query & " ItemPrice = " & SponsorshipLevelPrice & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs2.close
  end if
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 
end if


 '********************************************************************************
 '	Update Classes
 '********************************************************************************

if ShowClasses= True then
sql = "select * from Classinfo where EventID = " & EventID & "" 
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
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassInfoMaximumStudents= rs("ClassInfoMaximumStudents")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
		ClassInfoMaterialFee=  rs("ClassInfoMaterialFee")


if len(ClassInfoStudentFee)> 0 then
else
ClassInfoStudentFee = 0
end if
	
	ClassStartTime = rs("ClassStartTime")
	ClassEndTime = rs("ClassEndTime")
	ClassesQTYArraycount = "ClassesQTYArray(" & ClassInfoID & ")"
	ClassesQTYArray(ClassInfoID) = Request.Form(ClassesQTYArraycount)

	if len(ClassesQTYArray(ClassInfoID))  > 0  then
		if ClassesQTYArray(ClassInfoID)  > -1 then
	UpdateServiceDescription = "Classes - " & ClassInfoTitle
	PeopleID = Session("PeopleID")
	
	sql2 = "select RegistrationID from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If rs2.eof Then	

		Query =  "INSERT INTO RegistrationTemp (Status, EventID, PeopleID, Quantity, ServiceDescription, ItemPrice ) " 
		Query =  Query & " Values ('Draft' ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  PeopleID  & ","
		Query =  Query & " " &  ClassesQTYArray(ClassInfoID)  & ","
		Query =  Query & " '" &  UpdateServiceDescription  & "',"
		Query =  Query & " " & ClassInfoStudentFee  & " )" 
	Conn.Execute(Query) 

	else  		
	RegistrationID = rs2("RegistrationID")
	
	Query =  " UPDATE RegistrationTemp Set Quantity = " &  ClassesQTYArray(ClassInfoID) & " ," 
	Query =  Query & " ItemPrice = " & ClassInfoStudentFee & " " 
	Query =  Query & " where RegistrationID = " & RegistrationID & ";" 
	Conn.Execute(Query) 

	end if	
	rs2.close
  end if
  end if
 	  rowcount = rowcount + 1
	  rs.movenext
	Wend		
end if 

end if

end if
%>


<% end if ' END UPDATE REGISTRATION TEMP TABLE %>


<%'************************************************************
'  GET EXISTING REGISTRATION INFORMATION - PREVIOUS INPUT
'************************************************************

OrderExists = False
numorders = 0
sql = "select RegistrationID from RegistrationTemp where EventId = " & EventID & " and PeopleID =" & PeopleID 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then
		OrderExists = True
		numorders = rs.recordcount
	end if


 '********************************************************************************
 '	CREATE ARRAY OF SPPONSORSHIPS
 '********************************************************************************

dim SponsorNameArray(100)
dim SponsorIDArray(100)
dim ExtraOptionSponsorQTYArray(100)


sql4 = "select * from SponsorshipLevelbenefits, Sponsorshiplevels  where SponsorshipLevelbenefits.SponsorshipLevelID = Sponsorshiplevels.SponsorshipLevelID and Sponsorshiplevels.EventID = " & EventID & " order by SponsorshipLevelName"

Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3 
if not rs4.eof then 
   i = 1
  ExtraOptionSponsorQTYArray(i) = 0
 SponsorIDArray(i) = rs4("ExtraOptionID")
 SponsorNameArray(i) = rs4("SponsorshipLevelName")
 OldOptionName = rs4("SponsorshipLevelName")
    				
 while not rs4.eof 
    NewOptionName = rs4("SponsorshipLevelName")
	if not(OldOptionName = NewOptionName) then
		i = i + 1
		ExtraOptionSponsorQTYArray(i) = 0
		SponsorIDArray(i) = rs4("ExtraOptionID")
		SponsorNameArray(i) = rs4("SponsorshipLevelName")
	end if
     				
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionSponsorQTYArray(i) = ExtraOptionSponsorQTYArray(i) +  ( rs4("SponsorshipLevelQTY") *     SponsorQTYArray(SponsorshipLevelID) )
    OldOptionName = rs4("SponsorshipLevelName")
    			
    rs4.movenext
 wend
 
 TotalSponsorshipCounter = i
 
 i = 1
  
end if




 '********************************************************************************
 '	CREATE ARRAY OF EXTRA OPTIONS
 '********************************************************************************
dim ExtraOptionID(100)
dim ExtraOptionQTY(100)

sql4 = "select * from SponsorshipLevelbenefits, ExtraOptions where OptionType ='ExtraOption' and SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & " order by ExtraOptionsPrice"
		
Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3 
if not rs4.eof then 
    TotalSponsorshipLevelQTY = 0
    i = 1
    ExtraOptionQTY(i) = 0
    ExtraOptionID(i) = rs4("ExtraOptionID")
    OldOptionName = rs4("ExtraOptionsName")
    while not rs4.eof 
        NewOptionName = rs4("ExtraOptionsName")
		 if not(OldOptionName = NewOptionName) then
			i = i + 1
			ExtraOptionQTY(i) = 0
			ExtraOptionID(i) = rs4("ExtraOptionID")
		 end if
    			
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionQTY(i) = ExtraOptionQTY(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
	OldOptionName = rs4("ExtraOptionsName")
     rs4.movenext
 wend
 
 TotalExtraOptions = i
 
 i = 1
 end if


 

 '********************************************************************************
 '	CREATE ARRAY OF ADVERTISING OPTIONS
 '********************************************************************************
dim AdvertisingNameArray(100)
dim AdvertisingIDArray(100)
dim ExtraOptionAdvertsingQTYArray(100)



sql4 = "select * from SponsorshipLevelbenefits, ExtraOptions where OptionType ='Advertising' and SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & " order by ExtraOptionsname"
			
		    		Set rs4 = Server.CreateObject("ADODB.Recordset")
    				rs4.Open sql4, conn, 3, 3 
    				if not rs4.eof then 
    				i = 1
    				ExtraOptionAdvertsingQTYArray(i) = 0
    				AdvertisingIDArray(i) = rs4("ExtraOptionID")
    				AdvertisingNameArray(i) = rs4("ExtraOptionsName")
    				OldOptionName = rs4("ExtraOptionsName")
    				
    				while not rs4.eof 

    				 NewOptionName = rs4("ExtraOptionsName")
				     if not(OldOptionName = NewOptionName) then
				      	i = i + 1
				      	ExtraOptionAdvertsingQTYArray(i) = 0
				      	AdvertisingIDArray(i) = rs4("ExtraOptionID")
				      	AdvertisingNameArray(i) = rs4("ExtraOptionsName")
				     end if
    		
    				
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionAdvertsingQTYArray(i) = ExtraOptionAdvertsingQTYArray(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
		
    OldOptionName = rs4("ExtraOptionsName")
    			
    rs4.movenext
 wend
 
 TotalAdvertisingOptions = i
 
 i = 1
 
end if




 '********************************************************************************
 '	SPONSORSHIP OPTIONS
 '********************************************************************************

  if showsponsors = true then
  	sql = "select * from SponsorshipLevels  where EventID = " & EventID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	
	order = "Even"
	While Not rs.eof  
	SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName= rs("SponsorshipLevelName")
		SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
		SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")

   if len(SponsorshipLevelQTYAvailable) > 0 then
   else
     SponsorshipLevelQTYAvailable = 50
   end if
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)

	i = 0
	while i < (TotalSponsorCounter + 1 )
	   	i = i + 1
		if OldSponsorNameArray(i) = SponsorshipLevelName  then
			OldSponsorQTY = OldSponsorQTYArray(i)
		end if
	wend


if SponsorQTYArray(SponsorshipLevelID) < 1 and OldSponsorQTY > 0  and NOT(Update = "True") then
	SponsorQTYArray(SponsorshipLevelID) = OldSponsorQTY
end if
 if len(SponsorQTYArray(SponsorshipLevelID)) > 0 then
    %>
     <tr>

	<td class = "body" width = "260">
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><%= SponsorshipLevelName %><bR>
	</td>
	<td class = "body" align = "right" width = "110">	
		<%= formatcurrency(SponsorshipLevelPrice) %></td>
    <td class = "body" align = "right" width = "110">	
 		<%=SponsorQTYArray(SponsorshipLevelID)%></td>
	<td class = "body" align = "right" width = "110">	
		<%=formatcurrency(SponsorQTYArray(SponsorshipLevelID) * SponsorshipLevelPrice ) %><% OrderTotal = OrderTotal + (SponsorQTYArray(SponsorshipLevelID) * SponsorshipLevelPrice) %></td>
 </tr>
	 

<% 
end if
sql3 = "select * from SponsorshipLevelbenefits, ExtraOptions where SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and  SponsorshipLevelID = " & SponsorshipLevelID & " and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & ""
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while Not rs3.eof
    if rs3("ExtraOptionsName") = "Free Halter Stall" then
    	TotalFreeHalterStallQTY = TotalFreeHalterStallQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if 
  
    if rs3("ExtraOptionsName") = "Free Display Stall" then
    	TotalFreeDisplayStallQTY = TotalFreeDisplayStallQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if 

   if trim(rs3("ExtraOptionsName")) = "Expidited Vet Check in" then
    	TotalExpiditedVetCheckinQTY = TotalExpiditedVetCheckinQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if 

    if rs3("ExtraOptionsName") = "Free Vet Check in" then
    	TotalFreeVetCheckinQTY = TotalFreeVetCheckinQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if 


    if rs3("ExtraOptionsName") = "Free Stall Mat" then
    	TotalFreeStallMatQTY = TotalFreeStallMatQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if 

    if rs3("ExtraOptionsName") = "Free Electricity" then
    	TotalFreeElectricityQTY = TotalFreeElectricityQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if

	if rs3("ExtraOptionsName") = "Free Dinner Ticket(s)" then
    	TotalFreeDinnerTicketsQTY = TotalFreeDinnerTicketsQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    end if
	
	rs3.movenext
wend
rs3.close	
	  
  rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
  %>


<% if  ShowHalterShow = True  then %>

 <tr >
		<td class = "body" colspan = "4" height = "30"><a name ="Halter"></a>
	       <img src = "/images/px.gif" width = "5" alt = "Halter Show Registration"><b>Halter Show</b>
	       <small><i>Note: the number of animals that you can bring is limited by the number of stalls that you sellect.</i></small>
	     </td>
	   </tr>


<%
'************************************************************
'  ANIMAL STALLS
'************************************************************
 if  FeePerPen > 0 then
AnimalStallQTY = request.form("AnimalStallQTY")
 Halternotes = request.form("Halternotes")
if AnimalStallQTY < 1 and OldAnimalStallsQuantity > 0 and NOT(Update = "True") then
	AnimalStallQTY = OldAnimalStallsQuantity
end if

 showdiscount = False
if len(Price2Discount) > 0 and len(Price2DiscountStartDate) > 4 and len(Price2DiscountStartDate) > 4 then
  if DateDiff("d", Price2DiscountStartDate, now()) > 1 and DateDiff("d", Price2DiscountEndDate, now()) < 1 then
 	 FullPriceFeePerPen = FeePerPen
 	 FeePerPen = Price2Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalStallQTY) > 0  and len(FeePerPen) > 0  then
	AnimalStallTotal = AnimalStallQTY * FeePerPen
else
	AnimalStallTotal = 0
end if 

    %>
     <tr>
  <td class = "body" >
  <input type = "hidden" value = "<%=FeePerPen %>" name = "FeePerPen">
  
  <% if len(FeePerPen) > 1 then %>
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Animal Stalls 
  <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %><small>-<% end if %>
  	<% if len(MaxQTY2) > 0 then %><%=MaxQty2%> adults <% end if %>
  	<% if len(MaxQTY) > 0 and len(MaxQTY2) > 0 then %> OR <% end if %>
  	 <% if len(MaxQTY) > 0 then %><%=MaxQty%> juveniles per stall <% end if %>  
   <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %></small><% end if %>
  <% if showdiscount = True then %>
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount Rate from <%=Price2DiscountStartDate %> To <% =Price2DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" >
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPriceFeePerPen,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerPen,2)%>
 		<% else %>
	  <%=formatcurrency(FeePerPen,2)%>
	
<% end if %>

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <% if len(MaxPensPerFarm) > 0 then
     else
      MaxPensPerFarm = 50
     end if %>
  <select size="1" name="AnimalStallQTY" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(AnimalStallQTY) > 0 then %>
  	<option value="<%=AnimalStallQTY%>"><%=AnimalStallQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < (MaxPensPerFarm + 1) %>
  		<option value="<%=x%>"><%=x%></option>

	<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" > <%=formatcurrency(AnimalStallTotal,2)%>
	<% OrderTotal = OrderTotal + AnimalStallTotal %>
	<img src = "/images/px.gif" width = "5" alt = "Sponsorship Registration">
  </td>
</tr> 
<tr><td class = "body" colspan = "4" valign = "top">
&nbsp;Animal Stall Location Requests:
</td></tr>
<tr><td class = "body" colspan = "4" valign = "top" align = "center">
<textarea name="Halternotes" cols="80" rows="2" wrap="VIRTUAL" class = "body"><%= Halternotes%></textarea>
</td></tr>




<% if TotalFreeHalterStallQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" align = "right" colspan = "2" valign = "top">
   <img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration"><small>Animal stalls that come with your sponsorship<% if TotalFreeHalterStallQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right" valign = "top">
	<%=TotalFreeHalterStallQTY%><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right" valign = "top">
N/A	<img src = "/images/px.gif" width = "5" alt = "Sponsorship Registration"><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "9" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if 
 end if 
end if 

'************************************************************
'  DISPLAY STALLS
'************************************************************
 if  Price3 > 0 then
DisplayStallQTY = request.form("DisplayStallQTY")

	if DisplayStallQTY < 1 and OldDisplayStallsQTY > 0 and NOT(Update = "True") then
		DisplayStallQTY = OldDisplayStallsQTY
	end if


CurrentNumDisplayStallQTY = DisplayStallQTY
 showdiscount = False
if Price3Discount > 0 and len(Price3DiscountStartDate) > 5 and len(Price3DiscountStartDate) > 5 then
  if DateDiff("d", Price3DiscountStartDate, now()) > 1 and DateDiff("d", Price3DiscountEndDate, now()) < 1 then
 	 FullPricePrice3 = Price3
 	 Price3 = Price3Discount
 	  showdiscount = True
	end if 
end if


if len(AnimalStallQTY) > 0  and len(Price3) > 0  then
	DisplayStallTotal = DisplayStallQTY * Price3
else
	DisplayStallTotal = 0
end if 


    %>
     <tr>
  <td class = "body" >
    <input type = "hidden" value = "<%= Price3 %>" name = "DisplayStallPrice">

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Display Stalls 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price3DiscountStartDate %> to <% =Price3DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" >
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPricePrice3,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(Price3,2)%>
 			<% else %>
	  <%=formatcurrency(Price3,2)%>
	
<% end if %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <select size="1" name="DisplayStallQTY" onchange="submit();" width="50" style="width: 50px"  >
  	<% if len(DisplayStallQTY) > 0 then %>
  	<option value="<%=DisplayStallQTY%>"><%=DisplayStallQTY%></option>
  
  	<% end if 
  	 x = 0
  	 while x < (MaxDisplaysPerFarm + 1) %>
  		<option value="<%=x%>"><%=x%></option>

	<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" > <%=formatcurrency(DisplayStallTotal,2)%>
  	<% OrderTotal = OrderTotal + DisplayStallTotal %>
	<img src = "/images/px.gif" width = "5" alt = "Display Stall Registration">

  </td>
</tr> 


<% if TotalFreeDisplayStallQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" valign = "top" align="right" colspan = "2">
   <small>Display stalls that come with your sponsorship<% if TotalFreeDisplayStallQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right">
	<%=TotalFreeDisplayStallQTY%><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
N/A<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if 
 end if 



'************************************************************
'  HALTER SHOW ENTRIES
'************************************************************
 if  FeePerAnimal > 0 then
AnimalQTY = request.form("AnimalQTY")

if AnimalQTY < 1 and OldHalterShowEntriesQuantity > 0 and NOT(Update = "True") then
	AnimalQTY = OldHalterShowEntriesQuantity
end if

if len(MaxQty2) > 0 then
else
MaxQty2 = 3
end if 
 showdiscount = False
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 FullPricePrice1 = FeePerAnimal
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalQTY) > 0  and len(FeePerAnimal) > 0   then
	AnimalTotal = AnimalQTY * FeePerAnimal
	else
	AnimalTotal = 0
end if 

    %>
     <tr>

  <td class = "body" >
    <input type = "hidden" value = "<%= FeePerAnimal %>" name = "HalterShowFee">
 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Halter Show Entries
 <% if AnimalStallQTY = 0 and TotalFreeHalterStallQTY = 0 then %>

<% end if 
 	 if MaxQTY3 > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY3 %> Entries Per Exhibitor Per Class.</small>
	<% end if 

   if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" >
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPricePrice1,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <select size="1" name="AnimalQTY" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(AnimalQTY) > 0 then %>
  	<option value="<%=AnimalQTY%>"><%=AnimalQTY%></option>
  
  	<% end if 
  	 x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1) + TotalFreeHalterStallQTY %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" > <%=formatcurrency(AnimalTotal,2)%>
  	<% OrderTotal = OrderTotal + AnimalTotal %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 

<%
'************************************************************
'  HALTER SHOW ENTRIES
'************************************************************

if AnimalQTY > 0 then %>

<tr>
  <td colspan = "4">


  <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
   			<td class = "body" align = "center" width = "310"><b>Animal's Name</b></td>
  			<td class = "body" align = "center" width = "200"><b>Halter Class</b></td>
  			<td class = "body" align = "center" width = "140"><b>Options</b></td>
		</tr>
	</table>
</td>
</tr>


<tr>
  <td background = "images/background650.jpg">

  <table>
  <% 
  
counterx = 0 
sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and RegistrationType = 'Halter'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	while not rs.eof 
	
	 counterx = counterx +1
	AnimalIDArray(counterx) = rs("AnimalRegistrationID")	
	HalterClassIDArray(counterx) = rs("HalterClassID")	
	if HalterClassIDArray(counterx)> 0 then
	    sqlH = "select * from AnimalHalterClassesLookup where AnimalHalterLookupID = " & HalterClassIDArray(counterx) 
	    Set rsH = Server.CreateObject("ADODB.Recordset")
	    rsH.Open sqlH, conn, 3, 3   
	    if not rsH.eof then
	        HalterClassNameArray(counterx) = rsH("HalterClassName")	
	    end if
	    rsH.close
	 end if
	rs.movenext
	wend
  
      BoxOrder = "Even"
  counterx = 0 
    while counterx < cint(AnimalQTY) 
    counterx = counterx + 1 
    
    if len(AnimalIDArray(counterx)) > 0 then
    sql3 = "select * from Animal where AnimalID = " & AnimalIDArray(counterx) & ""
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
    if Not rs3.eof then
      AnimalNameArray(counterx) = rs3("AnimalsName")
      DOB = rs3("DOBMonth") & "/" & rs3("DOBDay")& "/" & rs3("DOBYear")
      AgeClass = rs3("AgeClass")
      Category = rs3("Category")
      if Category = "Experienced Female" or Category = "Inexperienced Female" then
         Gender = "F"
      else
         Gender = "M"
      end if
    end if
    end if
    
  if BoxOrder = "Even" then
     BoxOrder = "Odd"
    %>
     <tr>
  <% else 
  BoxOrder = "Even"%>
  <tr bgcolor = "#EFEFEF">
  <% end if %>
      <td class = "body" width = "310">
  <select size="1" name="AnimalIDArray(<%=counterx %>)" width = "300" style="width: 300px" onchange="submit();">

        <% if len(AnimalIDArray(counterx))> 0 then %>
			<option name = "AID0" value= "<%=AnimalIDArray(counterx) %>" selected ><%=AnimalNameArray(counterx)%> </option>
		<% else %>
		    <option name = "AID0" value= "" selected >Select an animal</option>
		<% end if %>

	 <%	count = 1
						while count < acounter
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
	  </td>
 <td width = "200">
<%
 if len(AnimalIDArray(counterx))> 0 then 


 sqlp = "select * from AnimalHalterClassesLookup where SpeciesID = 1"
				Set rsp = Server.CreateObject("ADODB.Recordset")
				rsp.Open sqlp, conn, 3, 3
				if Not rsp.eof then
				AnimalHalterLookupID = rsp("AnimalHalterLookupID")
				HalterClassName = rsp("HalterClassName") %>
			 <select size="1" name="HalterClassIDArray(<%=counterx %>)" width = "190" style="width: 190px" onchange="submit();">
                    <% if len(HalterClassIDArray(counterx) )> 0 then %>
                        <option  value="<%=HalterClassIDArray(counterx) %>" selected><%=HalterClassNameArray(counterx) %></option>
                    <% else %>
                     <option  value="" selected>Select a Class</option>
                    <% end if %>
                    <% count = 1
						while Not rsp.eof 
					%>
						<option name = "AID1" value="<%=rsp("AnimalHalterLookupID")%>">
							<%=rsp("HalterClassName")%>
						</option>
					<% 	rsp.movenext
					wend %>
					</select>		  
	  
	        <% end if %> 
	        	  
	        <% end if %> 
	  </td>
      <td class = "body" align = "center" width = "140">
      <% if len(AnimalIDArray(counterx))> 0 then %>
 
         <a href = "EventAddAnimal.asp?AddAnimal=False&EditAnimal=True&AnimalAdded=True&AnimalID=<%=AnimalIDArray(counterx)%>" class = "body">Edit</a> | <a href = "EventRegister.asp?RemoveHalterAnimal=True&AnimalID=<%=AnimalIDArray(counterx)%>#Halter" class = "body">Remove</a>
      <% end if %>
	  </td>
	 </tr>
	<% 
	wend %>
  <tr>
      <td class = "body" >

	  </td>
      <td class = "body" colspan = "3" align = "center">

<a href = "EventAddAnimal.asp?EventID=<%=EventID%>"  class = "body">Add an Animal</a><img src = "images/px.gif" width = "20" height = "1" /><a href = "EventDeleteAnimal.asp?EventID=<%=EventID%>"  class = "body">Delete an Animal</a>
	  </td>
	 </tr>
  </table>
  </td>
</tr>

<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br />

  </td>
</tr>
<% end if %>

<% ' Halter Animals Box End %>






<%
'************************************************************
'  PRODUCTION CLASS HALTER SHOW ENTRIES
'************************************************************

ProductionPrice = Price4
ProductionPriceDiscount = Price4Discount
ProductionPriceDiscountStartDate = Price4DiscountStartDate
ProductionPriceDiscountEndDate = Price4DiscountEndDate


if  ProductionPrice > 0 then
ProductionQTY = request.form("ProductionQTY")
if len(ProductionQTY) > 0 then
else
ProductionQTY = 0
end if 

if ProductionQTY < 1  and  OldProductionClasEntriesQuantity > 0 and  NOT(Update = "True") then
	ProductionQTY = OldProductionClasEntriesQuantity
END IF


 showdiscount = False
 	
if ProductionPriceDiscount > 0 and len(ProductionPriceDiscountStartDate) > 5 and len(ProductionPriceDiscountStartDate) > 5 then
  if DateDiff("d", ProductionPriceDiscountStartDate, now()) > 1 and DateDiff("d", ProductionPriceDiscountEndDate, now()) < 1 then
 	 FullPriceProductionPrice = ProductionPrice
 	 ProductionPrice = ProductionPriceDiscount
 	  showdiscount = True
	end if 
end if

if len(ProductionQTY) > 0  and len(FeePerAnimal) > 0  then
	ProductionPriceTotal = ProductionQTY * ProductionPrice
	else
	ProductionPriceTotal = 0
end if 

 %>
     <tr>

  <td class = "body" >
<a name = "Production"></a>
 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Halter Show Production Class Entries
 <% sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 1"
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then 
			 i = 0
				 while Not rsp.eof  
				AnimalProductionLookupID = rsp("AnimalProductionLookupID")
				ProductionClassName = rsp("ProductionClassName") 
				 sqlp2 = "select * from AnimalProductionClasses where AnimalProductionLookupID = " & AnimalProductionLookupID & " and EventID =" & EventID
				Set rsp2 = Server.CreateObject("ADODB.Recordset")
				rsp2.Open sqlp2, conn, 3, 3
					if not rsp2.eof then 
					 i = i + 1 
					 if i > 1 then %>, <% else %><small>-<% end if %><%=ProductionClassName%>
				<% end if 
				rsp2.close 
				 rsp.movenext
			wend 
			rsp.close %>
			</small><% end if %>

 
 <% if AnimalStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you add animals please select stalls to put them in.</font></small>

<% end if %> 
	<% if MaxQTY3 > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY3 %> Entries Per Exhibitor Per Class.</small>
	<% end if %>


  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=ProductionPriceDiscountStartDate %> to <% =ProductionPriceDiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" >
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPriceProductionPrice,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(ProductionPrice,2)%>
 			<% else %>
	  <%=formatcurrency(ProductionPrice,2)%>
	
<% end if %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <select size="1" name="ProductionQTY" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(ProductionQTY) > 0 then %>
  	<option value="<%=ProductionQTY%>"><%=ProductionQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" > <%=formatcurrency(ProductionPriceTotal,2)%>
  	<% OrderTotal = OrderTotal + ProductionPriceTotal %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 

<%
'************************************************************
'  PRODUCTION CLASS ENTRIES
'************************************************************

if ProductionQTY > 0 then %>

<tr>
  <td colspan = "4">


  <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
   			<td class = "body" align = "center" width = "310"><b>Animal's Name</b></td>
   			<td class = "body" align = "center" width = "200"><b>Production Class</b></td>
  			<td class = "body" align = "center" width = "140"><b>Options</b></td>
		</tr>
	</table>
</td>
</tr>
<tr>
  <td background = "images/background650.jpg">

  <table border= "0">
  <% 
  
counterx = 0 
sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and RegistrationType = 'Production'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	while not rs.eof 
	
	 counterx = counterx +1
	ProductionAnimalIDArray(counterx) = rs("AnimalRegistrationID")	
    ProductionClassIDArray(counterx) = rs("ProductionClassID")	
    
	if len(ProductionClassIDArray(counterx))> 0 then
	sqlH = "select * from AnimalProductionClassesLookup where AnimalProductionLookupID = " & ProductionClassIDArray(counterx) 
	Set rsH = Server.CreateObject("ADODB.Recordset")
	rsH.Open sqlH, conn, 3, 3   
	if not rsH.eof then
	    ProductionClassNameArray(counterx) = rsH("ProductionClassName")	
	end if
	rsH.close
	end if
	rs.movenext
	wend
      BoxOrder = "Even"
  counterx = 0 
    while counterx < cint(ProductionQTY) 
    counterx = counterx + 1 
    
    if len(ProductionAnimalIDArray(counterx)) > 0 then
    sql3 = "select * from Animal where AnimalID = " & ProductionAnimalIDArray(counterx) & ""
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
    if Not rs3.eof then
      ProductionAnimalNameArray(counterx) = rs3("AnimalsName")
      DOB = rs3("DOBMonth") & "/" & rs3("DOBDay")& "/" & rs3("DOBYear")
      AgeClass = rs3("AgeClass")
      Category = rs3("Category")
      if Category = "Experienced Female" or Category = "Inexperienced Female" then
         Gender = "F"
      else
         Gender = "M"
      end if
    end if
    end if
    
  if BoxOrder = "Even" then
     BoxOrder = "Odd"
    %>
     <tr>
  <% else 
  BoxOrder = "Even"%>
  <tr bgcolor = "#EFEFEF">
  <% end if %>
      <td class = "body" width = "310">
  <select size="1" name="ProductionAnimalIDArray(<%=counterx %>)" width = "300" style="width: 300px" onchange="submit();">
        <% if len(ProductionAnimalNameArray(counterx))> 1 then %>
			<option  value= "<%=ProductionAnimalIDArray(counterx) %>" selected ><%=ProductionAnimalNameArray(counterx)%> </option>
		<% else %>
		    <option name = "AID0" value= "" selected >select an animal</option>
		<% end if %>
		<% count = 1
			while count < acounter
		%>
				<option name = "AID1" value="<%=aID(count)%>">
					<%=aID(count)%><%=aName(count)%>
				</option>
		<% 	count = count + 1
			wend %>
		</select>
	  </td>
	  <td width = "200">
	  <% if len(ProductionAnimalNameArray(counterx))> 1 then 
    sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 1"
				Set rsp = Server.CreateObject("ADODB.Recordset")
				rsp.Open sqlp, conn, 3, 3
				if Not rsp.eof then
				AnimalProductionLookupID = rsp("AnimalProductionLookupID")
				ProductionClassName = rsp("ProductionClassName") %>
			 <select size="1" name="ProductionClassIDArray(<%=counterx %>)" width = "200" style="width: 200px" onchange="submit();">
        <% if len(ProductionClassIDArray(counterx) )> 0 then %>
                        <option  value="<%=ProductionClassIDArray(counterx) %>" Selected><%=ProductionClassNameArray(counterx) %></option>
                    <% else %>
                     <option  value="" selected>Select a Class</option>
                    <% end if %>
					<% count = 1
						while Not rsp.eof 
					%>
						<option name = "AID1" value="<%=rsp("AnimalProductionLookupID")%>">
							<%=rsp("ProductionClassName")%>
						</option>
					<% 	rsp.movenext
					wend %>
					</select>		  
	  
	        <% end if %> 
	        <% end if %>
      </td>
      <td class = "body" align = "center" width = "140">
      <% if len(ProductionAnimalIDArray(counterx))> 0 then %>
         <a href = "EventAddAnimal.asp?AddAnimal=False&EditAnimal=True&AnimalAdded=True&AnimalID=<%=ProductionAnimalIDArray(counterx)%>" class = "body">Edit</a> | <a href = "EventRegister.asp?RemoveProductionAnimal=True&AnimalID=<%=ProductionAnimalIDArray(counterx)%>#Production" class = "body">Remove</a>
      <% end if %>
	  </td>
	 </tr>
	<% 
	wend %>
  <tr>
      <td class = "body" >

	  </td>
 <td class = "body" colspan = "3" align = "center">

<a href = "EventAddAnimal.asp?EventID=<%=EventID%>"  class = "body">Add an Animal</a><img src = "images/px.gif" width = "20" height = "1" /><a href = "EventDeleteAnimal.asp?EventID=<%=EventID%>"  class = "body">Delete an Animal</a>
	  </td>
	 </tr>
  </table>
  </td>
</tr>

<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br />

  </td>
</tr>
<% end if
 ' Production Animals Box End 
 end if 
 
'************************************************************
'  COMPANION ANIMALS
'************************************************************
%>
<% if  ShowHalterShow = True  then %>
<% UnshownQTY = request.form("UnshownQTY")
 
if  UnshownQTY < 1  and OldCompanionAnimalQuantity > 0 and  NOT(Update = "True") then
	UnshownQTY = OldCompanionAnimalQuantity
end if

%>
     <tr>

  <td class = "body" ><a name = "Companion"></a>

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Companion Animals <small>(animals that will not be shown)</small>
 <% if AnimalStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you add animals please select stalls to put them in.</font></small>

<% end if %> 

 
 </td>
  <td class = "body" align = "right" >
  N/A


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
   <select size="1" name="UnshownQTY" onchange="submit();" width="50" style="width: 50px" >
  
  <% if AnimalStallQTY = 0 then %> 
  	<option value="0">0</option>

  <% else %>

  	<% if len(UnshownQTY) > 0 then %>
  	<option value="<%= UnshownQTY%>"><%= UnshownQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < ((AnimalStallQTY * MaxQty2) + 1 - AnimalQTY) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend 
	
	end if %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" >  
  N/A
<img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
</tr> 


<%
'************************************************************
'  Companion CLASS ENTRIES
'************************************************************

if UnshownQTY > 0 then %>

<tr>
  <td colspan = "4">


  <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
   			<td class = "body" align = "center" width = "310"><b>Animal's Name</b></td>
  			<td class = "body" align = "center" width = "200"><b>Gender</b></td>
  			<td class = "body" align = "center" width = "140"><b>Options</b></td>
		</tr>
	</table>
</td>
</tr>
<tr>
  <td background = "images/background650.jpg">

  <table border= "0">
  <% 
  
counterx = 0 
sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and RegistrationType = 'Companion'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	while not rs.eof 
	
	 counterx = counterx +1
	CompanionAnimalIDArray(counterx) = rs("AnimalRegistrationID")	
	rs.movenext
	wend
  
      BoxOrder = "Even"
  counterx = 0 
    while counterx < cint(UnshownQTY) 
    counterx = counterx + 1 
    
    if len(CompanionAnimalIDArray(counterx)) > 0 then
    sql3 = "select * from Animal where AnimalID = " & CompanionAnimalIDArray(counterx) & ""
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
    if Not rs3.eof then
      CompanionAnimalNameArray(counterx) = rs3("AnimalsName")
      DOB = rs3("DOBMonth") & "/" & rs3("DOBDay")& "/" & rs3("DOBYear")
      AgeClass = rs3("AgeClass")
      Category = rs3("Category")
      if Category = "Experienced Female" or Category = "Inexperienced Female" then
         Gender = "F"
      else
         Gender = "M"
      end if
    end if
    end if
    
  if BoxOrder = "Even" then
     BoxOrder = "Odd"
    %>
     <tr>
  <% else 
  BoxOrder = "Even"%>
  <tr bgcolor = "#EFEFEF">
  <% end if %>
      <td class = "body" width = "310">
  <select size="1" name="CompanionAnimalIDArray(<%=counterx %>)"  width = "300" style="width: 300px" onchange="submit();">
        <% if len(CompanionAnimalNameArray(counterx))> 1 then %>
			<option name = "AID0" value= "<%=CompanionAnimalIDArray(counterx) %>" selected ><%=CompanionAnimalNameArray(counterx)%> </option>
		<% else %>
		    <option name = "AID0" value= "" selected >select an animal</option>
		<% end if %>
					<% count = 1
						while count < acounter
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
	  </td>
 	  <td class = "body" width = "100" align = "center">
         <% if len(CompanionAnimalIDArray(counterx))> 0 then %> <%=Gender %> <% end if %></td>
         	  <td class = "body" width = "100" align = "center">
         <% if len(CompanionAnimalIDArray(counterx))> 0 then %> <%=AgeClass %>  <% end if %></td>
      <td class = "body" align = "center" width = "140">
      <% if len(CompanionAnimalIDArray(counterx))> 0 then %>
         <a href = "EventAddAnimal.asp?AddAnimal=False&EditAnimal=True&AnimalAdded=True&AnimalID=<%=CompanionAnimalIDArray(counterx)%>" class = "body">Edit</a> | <a href = "EventRegister.asp?RemoveCompanionAnimal=True&AnimalID=<%=CompanionAnimalIDArray(counterx)%>#Companion" class = "body">Remove</a>
      <% end if %>
	  </td>
	 </tr>
	<% 
	wend %>
  <tr>
      <td class = "body" >

	  </td>
	   <td class = "body" colspan = "3" align = "center">

<a href = "EventAddAnimal.asp?EventID=<%=EventID%>"  class = "body">Add an Animal</a><img src = "images/px.gif" width = "20" height = "1" /><a href = "EventDeleteAnimal.asp?EventID=<%=EventID%>"  class = "body">Delete an Animal</a>
	  </td>
	 </tr>
  </table>
  </td>
</tr>

<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br />

  </td>
</tr>
<% end if  ' Companion Animals Box End 
 end if 


'************************************************************
'  VET CHECK FEE
'************************************************************
if  VetCheckFee > 0 then

if TotalFreeVetCheckinQTY < 1 then


VetCheckQTY = request.form("VetCheckQTY")
if VetCheckQTY < 1 and OldVetCheckQuantity > 0 and  NOT(Update = "True") then
 VetCheckQTY = OldVetCheckQuantity
end if


 showdiscount = False
 
if Price4Discount > 0 and len(Price4DiscountStartDate) > 5 and len(Price4DiscountStartDate) > 5 then
  if DateDiff("d", Price4DiscountStartDate, now()) > 1 and DateDiff("d", Price4DiscountEndDate, now()) < 1 then
 	 FullPricePrice4 = Price4
 	 Price4 = Price4Discount
 	  showdiscount = True
	end if 
end if

if len(VetCheckQTY) > 0  and len(FeePerAnimal) > 0  then
	Price4Total = VetCheckQTY * FeePerAnimal
	else
	Price4Total = 0
end if 

 %>

     <tr>

  <td class = "body" >
    <input type = "hidden" value = "<%= VetCheckFee %>" name = "VetCheckFee">
     
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Vet Check Fee
 
 <% if AnimalQTY = 0  and UnshownQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you register animals.</font></small>

<% end if %> 

 </td>
  <td class = "body" align = "right" >
  <%=formatcurrency(VetCheckFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <% if AnimalQTY > 0  OR UnshownQTY > 0 then %>
    <input type = "hidden" value = "1" name = "VetCheckQTY">
    	<% OrderTotal = OrderTotal + VetCheckFee %>
	1
  <% else %>
    <input type = "hidden" value = "0" name = "VetCheckQTY">
  	N/A
  <% end if %>
  


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" >  
  <% if AnimalQTY > 0  OR UnshownQTY > 0 then %>
	 <%=formatcurrency(VetCheckFee,2)%>
<% end if %>

	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">

</td>
</tr> 




<% else %>
<tr bgcolor = "#F6F6F6" height = "25">
<td class = "body" colspan = "2" valign = "top" align = "right">    
   <small>The vet check comes with your sponsorship<% if TotalFreeDisplayStallQTY > 1 then %>s<%end if %>.</small>
</td>
<td class = "body" align = "right">
	1<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
$0.00<img src = "images/px.gif" width = "5" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if 
end if 
end if 

'************************************************************
'  ELECTRICITY FEE
'************************************************************
 if  TotalFreeElectricityQTY < 1 then 
 
if  ElectricityAvailable= "True" then


ElectricityQTY = request.form("ElectricityQTY")

if ElectricityQTY < 1 and OldElectricityQuantity > 0 and NOT(Update = "True") then
	ElectricityQTY = OldElectricityQuantity
end if


 showdiscount = False
 
 %>

     <tr>
  <td class = "body" ><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Electricity Fee
  
 <% if Electricityoptional  ="True" then %>
 
  
 <% if AnimalStallQTY = 0 or DisplayStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you add animal <br><img src = "images/px.gif" width = "5" height = "1" alt = "Event Registration"> or display stalls.</font></small>

<% end if %> 

 </td>
  <td class = "body" align = "right" >
      <input type = "hidden" value = "<%= ElectricityFee %>" name = "ElectricityFee">
  <%=formatcurrency(ElectricityFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0  then %>
	 <select size="1" name="ElectricityQTY" onchange="submit();" width="50" style="width: 50px" >
  
  <% if ElectricityQTY = 0 then %> 
  	<option value="0" selected>0</option>
	<option value="1">1</option>

  <% else %>
  
	<option value="1" selected>1</option>
  	<option value="0">0</option>
  <% end if %>
	</select><img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> 
	
  <% else %>
  	N/A<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration">
  <% end if %>
  
</td>
  <td class = "body" align = "right" >  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0 then %>
	 <%=formatcurrency((ElectricityFee * ElectricityQTY),2)%>
<% end if %>
	<% OrderTotal = OrderTotal + (ElectricityFee * ElectricityQTY) %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">

 </td>
</tr> 

<% else ' Electricity Optional= False 

 if AnimalStallQTY = 0 and DisplayStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you add a animal<br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">or display stall.</font></small><% end if %>
</td>
  <td class = "body" align = "right" >
  <%=formatcurrency(ElectricityFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <% if ElectricityQTY > 0 then %>
	1
  <% else %>
  	N/A
  <% end if %>
  


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" >  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0 then %>
	 <%=formatcurrency(ElectricityFee,2)%>
<% end if %>
<% OrderTotal = OrderTotal + ElectricityFee %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 

<% end if ' Electricity is Available %>



 <tr><td colspan = "4"> </td></tr>
 <% end if %>
 
<% else %>
<tr bgcolor = "#F6F6F6" height = "20" >
<td class = "body" colspan = "2" align = "right">    <input type = "hidden" value = "0" name = "VetCheckFee">
   <small>Electricity comes with your sponsorship<% if TotalFreeDisplayStallQTY > 1 then %>s<%end if %>.</small>
</td>
<td class = "body" align = "right">
	1<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
$0.00<img src = "images/px.gif" width = "5" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if %>




<%
'************************************************************
'  STALL MATS FEE
'************************************************************
%>

<% if  StallMatsAvailable= "True" and StallMatPrice > 0   then
StallMatsQTY = request.form("StallMatsQTY")

	if StallMatsQTY > 1 and OldStallMatQuantity	 > 0 and NOT(Update = "True") then
	else
		StallMatsQTY =  OldStallMatQuantity	
	end if


 showdiscount = False
 
 %>

     <tr>

 <td class = "body" ><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Stall Mats
  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0 or TotalFreeHalterStallQTY > 0 or TotalFreeDisplayStallQTY > 0  then 
  	else %>
  <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you can add stall matts you need to select stalls to <br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">put them in.</small>
  
  <% end if %>
 </td>
  <td class = "body" align = "right" >
      <input type = "hidden" value = "<%= StallMatPrice %>" name = "StallMatPrice">
  <%=formatcurrency(StallMatPrice,2)%>
 

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
 <% Maxnumstallmats = cint(AnimalStallQTY) + cint(CurrentNumDisplayStallQTY) + 1%>

   
 <select size="1" name="StallMatsQTY" onchange="submit();" width="50" style="width: 50px" >
  
  <% if (AnimalStallQTY + DisplayStallQTY) = 0 then %> 
  	<option value="0">0</option>

  <% else %>

  	<% if (StallMatsQTY) > 0 then %>
  	<option value="<%=StallMatsQTY%>"><%= StallMatsQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < Maxnumstallmats %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend 
	
	end if %>
	</select><img src = "/images/px.gif" width = "5" alt = "Livestock Event registration">

 </td>
  <td class = "body" align = "right" >  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0 then %>
	 <%=formatcurrency((StallMatPrice * StallMatsQTY),2)%>
<% end if %>
<% OrderTotal = OrderTotal + (StallMatPrice * StallMatsQTY) %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 



<% if TotalFreeStallMatQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" colspan = "2" align = "right">
   <small># Stall Mats that come with your sponsorship<% if TotalFreeStallMatQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right">
	<%=TotalFreeStallMatQTY %><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
N/A<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>
<% end if %>



<% end if ' Stall Matts are Available %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>

<% end if 'END IF SHOWHALTERSHOW = TRUE %>



<% if  ShowFleeceShow = True then %>

	  <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Fleece Show"><b>Fleece Show</b>
	     </td>
	   </tr>

<%
'************************************************************
'  FLEECE SHOW ENTRIES
'************************************************************
 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Fleece Show' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")
	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")
	
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
End If 

Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 


if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

 if FeePerAnimal > 0 then
FleecesQTY = request.form("FleecesQTY")

if FleecesQTY < 1 and OldFleeceShowQuantity > 0 and  NOT(Update = "True") then
	FleecesQTY = OldFleeceShowQuantity
end if

 showdiscount = False
 FullFeePerAnimal = FeePerAnimal
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

if len(FleecesQTY) > 0  and len(FeePerAnimal) > 0   then
	Price1Total = FleecesQTY * FeePerAnimal
	else
	Price1Total = 0
end if 

if len(ServiceStartDate) > 0 and DateDiff("d",  ServiceStartDate, now() ) > 1 and DateDiff("d", ServiceEndDate, now()  ) < 1 then

    %>
     <tr>

  <td class = "body" >

 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Fleece Show Entries 
 
 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>
	<% if MaxQTY > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY %> Fleece Entries Per Exhibitor Per Class.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" ><%= FullFeePerAnimal %>" name = "FleeceShowFee">
      <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullFeePerAnimal,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Flece Show Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %>
   
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <select size="1" name="FleecesQTY" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(FleecesQTY) > 0 then %>
  	<option value="<%=FleecesQTY%>"><%=FleecesQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < 30 %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" > <%=formatcurrency(Price1Total,2)%>
  <% OrderTotal = OrderTotal + Price1Total %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 


<% end if %>
<% end if %>




<%
'************************************************************
'  Fleece Show ENTRIES
'************************************************************

if FleecesQTY > 0 then %>

<tr>
  <td colspan = "4">


  <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
   			<td class = "body" align = "center" width = "310"><b>Animal's Name</b></td>
  			<td class = "body" align = "center" width = "100"><b>Gender</b></td>
  			 <td class = "body" align = "center" width = "100"><b>Age Class</b></td>
  			<td class = "body" align = "center" width = "140"><b>Options</b></td>
		</tr>
	</table>
</td>
</tr>
<tr>
  <td background = "images/background650.jpg">

  <table border= "0">
  <% 
  
counterx = 0 
sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and RegistrationType = 'Fleece'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	while not rs.eof 
	 counterx = counterx +1
	FleeceAnimalIDArray(counterx) = rs("AnimalRegistrationID")	
	rs.movenext
	wend
  
      BoxOrder = "Even"
  counterx = 0 
    while counterx < cint(FleecesQTY) 
    counterx = counterx + 1 
    
    if len(FleeceAnimalIDArray(counterx)) > 0 then
    sql3 = "select * from Animal where AnimalID = " & FleeceAnimalIDArray(counterx) & ""
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
    if Not rs3.eof then
      FleeceAnimalNameArray(counterx) = rs3("AnimalsName")
      DOB = rs3("DOBMonth") & "/" & rs3("DOBDay")& "/" & rs3("DOBYear")
      AgeClass = rs3("AgeClass")
      Category = rs3("Category")
      if Category = "Experienced Female" or Category = "Inexperienced Female" then
         Gender = "F"
      else
         Gender = "M"
      end if
    end if
    end if
    
  if BoxOrder = "Even" then
     BoxOrder = "Odd"
    %>
     <tr>
  <% else 
  BoxOrder = "Even"%>
  <tr bgcolor = "#EFEFEF">
  <% end if %>
      <td class = "body" width = "310">
  <select size="1" name="FleeceAnimalIDArray(<%=counterx %>)" width = "300" style="width: 300px"  onchange="submit();">
        <% if len(FleeceAnimalNameArray(counterx))> 1 then %>
			<option name = "AID0" value= "<%=FleeceAnimalIDArray(counterx) %>" selected ><%=FleeceAnimalNameArray(counterx)%> </option>
		<% else %>
		    <option name = "AID0" value= "" selected >select an animal</option>
		<% end if %>
					<% count = 1
						while count < acounter
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aID(count)%><%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
	  </td>
	  <td class = "body" width = "100" align = "center">
         <% if len(FleeceAnimalIDArray(counterx))> 0 then %> <%=Gender %> <% end if %>
	  </td>
	  	  <td class = "body" width = "100" align = "center">
         <% if len(FleeceAnimalIDArray(counterx))> 0 then %> <%=AgeClass %>  <% end if %>
	  </td>
      <td class = "body" align = "center" width = "140">
      <% if len(FleeceAnimalIDArray(counterx))> 0 then %>
         <a href = "EventAddAnimal.asp?AddAnimal=False&EditAnimal=True&AnimalAdded=True&AnimalID=<%=FleeceAnimalIDArray(counterx)%>" class = "body">Edit</a> | <a href = "EventRegister.asp?RemoveFleeceAnimal=True&AnimalID=<%=FleeceAnimalIDArray(counterx)%>#Fleece" class = "body">Remove</a>
      <% end if %>
	  </td>
	 </tr>
	<% 
	wend %>
  <tr>
      <td class = "body" >

	  </td>
	   <td class = "body" colspan = "3" align = "center">

<a href = "EventAddAnimal.asp?EventID=<%=EventID%>"  class = "body">Add an Animal</a><img src = "images/px.gif" width = "20" height = "1" /><a href = "EventDeleteAnimal.asp?EventID=<%=EventID%>"  class = "body">Delete an Animal</a>
	  </td>
	 </tr>
  </table>
  </td>
</tr>

<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br />

  </td>
</tr>
<% end if %>

<% ' Fleece Animals Box End %>


<% end if ' SHOW FLEECE SHOW %>



<% '***************************************
   ' AOBA Fee Entries
   '***************************************	
 if ShowAOBAFee = "True" then

	AOBAQTY = request.form("AOBAQTY")

if AOBAQTY < 1 and OldAOBAFeeQuantity > 0 and NOT(Update = "True") then
	AOBAQTY = OldAOBAFeeQuantity
end if
 showdiscount = False
%>

<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>

 <% end if  %>  

     <tr>
  
  <td class = "body" >  
   <input type = "hidden" value = "<%= AOBAFee %>" name = "AOBAFee">
  <img src = "images/px.gif" width = "4" height = "30" alt = "Livestock Event Registration">AOBA Fee for Non-AOBA Show Division Members
 
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee only applies if you enter an animal or fleece<Br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration"> into the show <b>and</b> you are a Non-AOBA Member.</font></small>


 </td>
  <td class = "body" align = "right" >
  <%=formatcurrency(AOBAFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right" >
  <% if AnimalQTY > 0  OR ProductionQTY > 0 OR FleecesQTY > 0 then %>
   <select size="1" name="AOBAQTY" onchange="submit();" width="50" style="width: 50px" >
    <% if AOBAQTY = 0 then %> 
  	<option value="0" selected>0</option>
	<option value="1">1</option>

  <% else %>
  
	<option value="1" selected>1</option>
  	<option value="0">0</option>
  <% end if %>
  </select><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">
  <% else %>
    <input type = "hidden" value = "0" name = "AOBAQTY">
  	N/A
  <% end if %>
  


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right" >  
  <% if AOBAQTY > 0  then %>
	 <%=formatcurrency(AOBAFee,2)%>
	 <% OrderTotal = OrderTotal + AOBAFee %>
  <% else %>
     N/A
<% end if %>

	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">

 </td>
</tr> 

 

<% end if 

'************************************************************
'  SPIN OFF SHOW ENTRIES
'************************************************************
if  ShowSpinOff = True  then %>
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
 <% end if  %>  
	  <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Sponsorship Options"><b>Spin-Off</b>
	     </td>
	   </tr>


<% sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'SpinOff' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")

	
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY =  rs("ServiceMaxQuantity2")
	if len(MaxQTY) > 0 then
	else
	  MaxQTY = 20
	end if


	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
End If 

Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

 if FeePerAnimal > 0 then
SpinOffQTY = request.form("SpinOffQTY")

 showdiscount = False
 
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 FullFeePerAnimal = FeePerAnimal
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

	if SpinOffQTY  = 0 and len(OldSpinOffQuantity) > 0 and NOT(Update = "True")then
		SpinOffQTY = OldSpinOffQuantity
	end if

if len(SpinOffQTY) > 0  and len(FeePerAnimal) > 0 then
	Price1Total = SpinOffQTY * FeePerAnimal
	else
	Price1Total = 0
end if 

if len(ServiceStartDate) > 0 and DateDiff("d", ServiceStartDate, now()) > 1 and DateDiff("d", ServiceEndDate, now()) < 1 then

    %>
     <tr>

  <td class = "body">

 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Spin-Off Show Entries 
 
 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>
<% if MaxQTY > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY %> Entries Per Exhibitor Per Class.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right">    <input type = "hidden" value = "<%= FullFeePerAnimal %>" name = "SpinOffFee">
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullFeePerAnimal,2)%></strike></small><img src = "images/px.gif" width = "10" alt = "Flece Show Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %><img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  <select size="1" name="SpinOffQTY" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(SpinOffQTY) > 0 then %>
  	<option value="<%=SpinOffQTY%>"><%=SpinOffQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < (MaxQty + 1) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>


 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%=formatcurrency(Price1Total,2)%>
  <% OrderTotal = OrderTotal + Price1Total %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">

 </td>
</tr> 


<% end if %>
<% end if %>

<%
'************************************************************
'  Fleece Show ENTRIES
'************************************************************

if SpinOffQTY > 0 then %>

<tr>
  <td colspan = "4">


  <table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">
  <tr><td height = "4"><img src = "images/px.gif" height = "1" width = "1"></td>	
	<tr>
  		<td class = "body" align = "center" background = "images/header650.jpg" height = "20">
		<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "650" align = "center">	
		<tr>
   			<td class = "body" align = "center" width = "310"><b>Animal's Name</b></td>
  			<td class = "body" align = "center" width = "100"><b>Gender </b></td>
  			<td class = "body" align = "center" width = "100"><b>Age Class</b></td>
  			<td class = "body" align = "center" width = "140"><b>Options</b></td>
		</tr>
	</table>
</td>
</tr>
<tr>
  <td background = "images/background650.jpg">

  <table border= "0">
  <% 
  
counterx = 0 
sql = "select * from RegisteredAnimals where EventId = " & EventID & " and PeopleID =" & PeopleID & " and RegistrationType = 'SpinOff'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	while not rs.eof 
	
	 counterx = counterx +1
	SpinOffAnimalIDArray(counterx) = rs("AnimalRegistrationID")	
	rs.movenext
	wend
  
      BoxOrder = "Even"
  counterx = 0 
    while counterx < cint(SpinOffQTY) 
    counterx = counterx + 1 
    
    if len(SpinOffAnimalIDArray(counterx)) > 0 then
    sql3 = "select * from Animal where AnimalID = " & SpinOffAnimalIDArray(counterx) & ""
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
    if Not rs3.eof then
      SpinOffAnimalNameArray(counterx) = rs3("AnimalsName")
      DOB = rs3("DOBMonth") & "/" & rs3("DOBDay")& "/" & rs3("DOBYear")
      AgeClass = rs3("AgeClass")
      Category = rs3("Category")
      if Category = "Experienced Female" or Category = "Inexperienced Female" then
         Gender = "F"
      else
         Gender = "M"
      end if
    end if
    end if
    
  if BoxOrder = "Even" then
     BoxOrder = "Odd"
    %>
     <tr>
  <% else 
  BoxOrder = "Even"%>
  <tr bgcolor = "#EFEFEF">
  <% end if %>
      <td class = "body" width = "310">
  <select size="1" name="SpinOffAnimalIDArray(<%=counterx %>)"  width = "300" style="width: 300px" onchange="submit();">
        <% if len(SpinOffAnimalNameArray(counterx))> 1 then %>
			<option name = "AID0" value= "<%=SpinOffAnimalIDArray(counterx) %>" selected ><%=SpinOffAnimalNameArray(counterx)%> </option>
		<% else %>
		    <option name = "AID0" value= "" selected >select an animal</option>
		<% end if %>
					<% count = 1
						while count < acounter
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aID(count)%><%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
	  </td>
	  <td class = "body" width = "100" align = "center">
         <% if len(SpinOffAnimalIDArray(counterx))> 0 then %> <%=Gender %> <% end if %>
	  </td>
	  	  <td class = "body" width = "100" align = "center">
         <% if len(SpinOffAnimalIDArray(counterx))> 0 then %> <%=AgeClass %>  <% end if %>
	  </td>
      <td class = "body" align = "center" width = "140">
      <% if len(SpinOffAnimalIDArray(counterx))> 0 then %>
         <a href = "EventAddAnimal.asp?AddAnimal=False&EditAnimal=True&AnimalAdded=True&AnimalID=<%=SpinOffAnimalIDArray(counterx)%>" class = "body">Edit</a> | <a href = "EventRegister.asp?RemoveSpinOffAnimal=True&AnimalID=<%=SpinOffAnimalIDArray(counterx)%>#SpinOff" class = "body">Remove</a>
      <% end if %>
	  </td>
	 </tr>
	<% 
	wend %>
  <tr>
      <td class = "body" >

	  </td>
 <td class = "body" colspan = "3" align = "center">

<a href = "EventAddAnimal.asp?EventID=<%=EventID%>"  class = "body">Add an Animal</a><img src = "images/px.gif" width = "20" height = "1" /><a href = "EventDeleteAnimal.asp?EventID=<%=EventID%>"  class = "body">Delete an Animal</a>
	  </td>
	 </tr>
  </table>
  </td>
</tr>

<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br />

  </td>
</tr>
<% end if %>

<% ' Spin Off Animals Box End %>

<% end if ' SHOW Spin Off SHOW %>

 <% 
 '********************************************************************************
 '	ADVERTISING OPTIONS
 '********************************************************************************
  if ShowAdvertising = True then %>

 <% sql = "select * from AdvertisingLevels  where AvaliableByItself =True and EventID = " & EventID 
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>

 <% end if  %>  

	<tr>
   <td class = "body" colspan = "4" height ="30">
     <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><b>Advertising</b>
   </td>
</tr>

	
	<% 
	dim AdvertsingQTYArray2(1000)
	While Not rs.eof 
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertsingQTYArraycount = "AdvertsingQTYArray(" & AdvertisingLevelID & ")"
	AdvertsingQTYArray2(AdvertisingLevelID) = Request.Form(AdvertsingQTYArraycount)
	if len(AdvertisingLevelQTYAvailable) > 0 then
	else
	  AdvertisingLevelQTYAvailable = 20
	end if


i = 0
	while i < (TotalAdvertisingCounter + 1 )
	   	i = i + 1
		if OldAdvertisingNameArray(i) = AdvertisingLevelName then
			OldAdvertisingQTY = OldAdvertisingQTYArray(i)
		end if
	wend
	
	
  if AdvertsingQTYArray2(AdvertisingLevelID) < 1 and OldAdvertisingQTY > 0 and NOT(Update = "True") then
 	AdvertsingQTYArray2(AdvertisingLevelID) =  OldAdvertisingQTY
  end if 
	%>

     <tr>
  <td class = "body">
	<img src = "/images/px.gif" width = "10" alt = "Livestock Event Registration"><%=AdvertisingLevelName %>


 </td>
  <td class = "body" align = "right">
   <%=formatcurrency(AdvertisingLevelPrice) %>
   
		<img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> </td>
  <td class = "body" align = "right">
  
   <select size="1" name="AdvertsingQTYArray(<%=AdvertisingLevelID%>)" onchange="submit();" width="50" style="width: 50px" >
  	<% if len(AdvertsingQTYArray2(AdvertisingLevelID)) > 0 then %>
  	<option value="<%=AdvertsingQTYArray2(AdvertisingLevelID)%>"><%=AdvertsingQTYArray2(AdvertisingLevelID)%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < (AdvertisingLevelQTYAvailable + 1) %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend %>
	</select>

 <img src = "/images/px.gif" width = "5" alt = "Livestock event registration"> </td>
  <td class = "body" align = "right"> <%= formatcurrency(AdvertsingQTYArray2(AdvertisingLevelID) * AdvertisingLevelPrice) %>
  <% OrderTotal = OrderTotal + (AdvertsingQTYArray2(AdvertisingLevelID) * AdvertisingLevelPrice) %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
 </td>
</tr> 



<% 	


i = 1
 for i = 1 to TotalAdvertisingOptions
    if  		AdvertisingNameArray(i) = AdvertisingLevelName then
 %>

     <tr>

			<td class = "body"   align = "Right" colspan = "2" height = "20"><small># <%=AdvertisingLevelName %> that comes with sponsorship<% if ExtraOptionAdvertsingQTYArray(i) > 1 then %>s<%end if %>:</small></td>
  			<td class = "body"   align = "right"><%= ExtraOptionAdvertsingQTYArray(i) %><img src = "images/px.gif"width = "10" height = "1" alt = "Event Registration"></td>
  			<td class = "body"   align = "right">N/A <img src = "images/px.gif"width = "10" height = "1" alt = "<%=AdvertisingLevelName %> Registration"></td>
  		</tr>
		<tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "<%=EventName%> Event Registration"></td></tr>

 <%  
   end if 
 next
    	
		rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if %>

<% end if %>



 <% 
 '********************************************************************************
 '	VENDOR OPTIONS
 '********************************************************************************

  if showvendors = true then
 sql = "select * from VendorLevels  where len(VendorStallPrice) > 0 and  EventID = " & EventID & " Order by VendorStallPrice"
     Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>

 <% end if  %>  

	<%
	counter = 0
	While Not rs.eof  
	counter = counter + 1
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallPrice = rs("VendorStallPrice")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	
	if len(VendorStallMaxQtyPer) > 0 then
	else
	  VendorStallMaxQtyPer = 50
	end if
	
	Costpertable = rs("Costpertable")
	MaxExtraTables = rs("MaxExtraTables")
	if len(MaxExtraTables) < 1 then
	  Numfreetables = 0
	end if
	Numfreetables = rs("Numfreetables")

	if len(MaxExtraTables) > 0 then
	else
	  MaxExtraTables = 10
	end if


	if len(Numfreetables) > 0 then
	else
	  Numfreetables = 0
	end if

 
 
 
	DontNeedTableArraycount = "DontNeedTableArray(" & VendorLevelID & ")"
	DontNeedTableArray(VendorLevelID) = Request.Form(DontNeedTableArraycount)
		
	
	VendorQTYArraycount = "VendorQTYArray(" & VendorLevelID & ")"
	VendorQTYArray(VendorLevelID) = Request.Form(VendorQTYArraycount)
	
	VendorTableQTYArraycount = "VendorTableQTYArray(" & VendorLevelID & ")"
	VendorTableQTYArray(VendorLevelID) = Request.Form(VendorTableQTYArraycount)

	i = 0
	while i < (TotalVendorCounter + 1 )
	   	i = i + 1
		if OldVendorNameArray(i) = VendorStallName then
			OldVendorQTY = OldVendorQTYArray(i)
			OldVendorTableQTY = OldVendorTableQTYArray(i)
		end if
	wend

	IF VendorQTYArray(VendorLevelID) < 1 and OldVendorQTYArray(counter) > -1 and NOT(Update = "True") then
		VendorQTYArray(VendorLevelID) = OldVendorQTYArray(counter)
	end if




if OldDontNeedTableArray(counter)= False then
    OldDontNeedTableArray(counter)= "No"
else
    OldDontNeedTableArray(counter)= "Yes"
end if


if len(DontNeedTableArray(VendorLevelID)) < 1 and OldDontNeedTableArray(counter)= "Yes" and NOT(Update = "True") then
DontNeedTableArray(VendorLevelID) = "Yes"
end if


	IF VendorTableQTYArray(VendorLevelID) < 1 and OldVendorTableQTY > -1 and NOT(Update = "True") then
		VendorTableQTYArray(VendorLevelID) = OldVendorTableQTY
	end if

 if VendorQTYArray(VendorLevelID) > 0 then %>
   <tr>

	<td class = "body">
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><%= VendorStallName %><bR>
		
		<%  if Numfreetables > 0 then %>
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><small>This option comes with <%=Numfreetables %> table<% if Numfreetables > 1 or Numfreetables = 0 then %>s<% end if %>.</small>
		<% end if %>
	</td>
	<td class = "body" align = "right">	
		<%= formatcurrency(VendorStallPrice) %><img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
    </td>
    <td class = "body" align = "right">	
<%=VendorQTYArray(VendorLevelID)%>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> 
</td>
<td class = "body" align = "right">	
		<%=formatcurrency(VendorQTYArray(VendorLevelID) * VendorStallPrice ) %>
	<% OrderTotal = OrderTotal + (VendorQTYArray(VendorLevelID) * VendorStallPrice )  %>

		<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
    </td>
 </tr>


<% 	
i = 1
 for i = 1 to TotalVendorOptions
    if VendorNameArray(i) = VendorStallName then
 %>
 
	<tr>
		<td class = "body"   align = "Right" colspan = "2" height = "20" ><small># <%=VendorStallName %> that comes with sponsorship<% if ExtraOptionVendorQTYArray(i) > 1 then %>s<%end if %>:</small></td>
  		<td class = "body"   align = "right"><%= ExtraOptionVendorQTYArray(i) %><img src = "images/px.gif"width = "10" height = "1" alt = "Event Registration"></td>
  		<td class = "body"   align = "right">N/A <img src = "images/px.gif"width = "10" height = "1" alt = "<%=VendorLevelName %> Registration"></td>
  	</tr>
	<tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "<%=EventName%> Event Registration"></td></tr>

 <%  
   end if 
   
 next 
  
    
if  Numfreetables > 0 then 
 if DontNeedTableArray(VendorLevelID) = "Yes" then %>
     <tr>

	<td class = "body" align = "right">
		 I Don't Need a Table
	</td>
	<td class = "body" align = "right">

    </td>
    <td class = "body" align = "right">	
    </td>
	<td class = "body" align = "right">	
</td>
</tr>
<% end if
end if
 
	
	
 if len(VendorTableQTYArray(VendorLevelID)) > 0 then
 if MaxExtraTables > 0 then %>
     <tr>
	<td class = "body" align = "right">
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration">Extra Tables<bR>
	</td>
	<td class = "body" align = "right">
	  <% if len(Costpertable) > 0 then %>
	  	<%= formatcurrency(Costpertable) %>
	    <% else %>
	      Free
	    <%   	Costpertable = 0 
	     end if %>
  
	
	  <img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
    </td>
    <td class = "body" align = "right">	

  		<%=VendorTableQTYArray(VendorLevelID)%>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> 

    </td>

	<td class = "body" align = "right">	
		<%=formatcurrency(VendorTableQTYArray(VendorLevelID) * Costpertable ) %>
	<% OrderTotal = OrderTotal + (VendorTableQTYArray(VendorLevelID) * Costpertable )  %>
	<img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
</td>
</tr>
<% end if %>
<% end if %>
<% 
	 end if 
rowcount = rowcount + 1
		rs.movenext
	Wend	
  end if 
if len(VendorNotes) > 0 then
  
 %> 
  <tr><td class = "body" colspan = "4" valign = "top">
&nbsp;Vendor Stall Location Requests:
</td></tr>
<tr><td class = "body" colspan = "4" valign = "top" align = "center">
<%= VendorNotes%>
</td></tr>
 
 <% end if
 end if
  
 '********************************************************************************
 '	CLASSES OPTIONS
 '********************************************************************************
if ShowClasses = True then
sql = "select * from Classinfo where EventID = " & EventID & "" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowClasses = True %>
	
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>
 <% end if  %>  

	<%

		
	end if 

  if ShowClasses = True then
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if not rs.eof then 
	
	While Not rs.eof  
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassInfoMaximumStudents= rs("ClassInfoMaximumStudents")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
			ClassInfoMaterialFee=  rs("ClassInfoMaterialFee")
ClassInfoMaterialFeeOptional=  rs("ClassInfoMaterialFeeOptional")
	if len(ClassDateMonth) > 0 and len(ClassDateDay) > 0 and len(ClassDateYear) > 0 then
	ClassDate = cstr(ClassDateMonth) & "/" & cstr(ClassDateDay) & "/" & cstr(ClassDateYear)
end if
	
	if len(ClassInfoMaximumStudents) > 0 then
	else
	  ClassInfoMaximumStudents = 100
	end if
	
	ClassInfoRoomDesignation = rs("ClassInfoRoomDesignation")
	
		str1 = ClassInfoTitle
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, " ")
		End If 
		
		str1 = ClassInfoTitle
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, "'")
		End If 	
	
	ClassStartTime = rs("ClassStartTime")
	ClassEndTime = rs("ClassEndTime")
	ClassesQTYArraycount = "ClassesQTYArray(" & ClassInfoID & ")"
	ClassesQTYArray(ClassInfoID) = Request.Form(ClassesQTYArraycount)


	UpdateServiceDescription = "Material / Equipement Fee - " & ClassInfoTitle
	PeopleID = Session("PeopleID")
	
	sql2 = "select Quantity from RegistrationTemp where Status='Draft' and EventId = " & EventID & " and PeopleID =" & PeopleID & " and ServiceDescription = '" & UpdateServiceDescription & "' Order by RegistrationID Desc"

	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3   
	If not rs2.eof Then	
        'RegistrationID = rs2("RegistrationID")
        ClassInfoMaterialFeePay(classinfoid) = rs2("Quantity")
    end if
    

	if len(ClassInfoStudentFee) > 0 then
	else
	  ClassInfoStudentFee = 0 
	end if

i = 0
	while i < (TotalClassesCounter + 1 )
	   	i = i + 1
		if OldClassesNameArray(i) = ClassInfoTitle then
			OldClassesQTY = OldClassesQTYArray(i)
		end if
	wend
	
	
  if ClassesQTYArray(ClassInfoID) < 1 and OldClassesQTY > 0 and NOT(Update = "True") then
 	ClassesQTYArray(ClassInfoID) =  OldClassesQTY
 	
  end if
 if len(ClassesQTYArray(ClassInfoID)) > 0 then 

    %>
 <tr>
	<td class = "body">
		<img src = "/images/px.gif" width = "10" alt = "Classes Registration"><%= ClassInfoTitle %><br>
		<% if len(ClassDate) > 8 then %>
		  <img src = "/images/px.gif" width = "15" alt = "Classes Registration"><small><%=ClassDate%></small>
		<% end if %>
		<% if len(ClassStartTime) > 0 then %>
			<small><%=ClassStartTime%></small>
		<% end if %>
		<% if len(ClassEndTime) > 0 then %>
			<small> - <%=ClassEndTime%></small>
		<% end if %>
		<% if len(ClassInfoRoomDesignation) > 0 then %>
			<small>Room <%=ClassInfoRoomDesignation%></small>
		<% end if %>

	</td>
	<td class = "body" align = "right">	
		<% if len(ClassInfoStudentFee) > 0 and ClassInfoStudentFee > 0 then %>
			<%= formatcurrency(ClassInfoStudentFee) %>
		<% else %>
			Free
		<% end if %><img src = "/images/px.gif" width = "5" alt = "Classes Registration">
    </td>
    <td class = "body" align = "right">	
 		<%=ClassesQTYArray(ClassInfoID)%>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> 

    </td>

	<td class = "body" align = "right">	
		<% if len(ClassInfoStudentFee) > 0 and ClassInfoStudentFee > 0 then %>
			<%=formatcurrency(ClassesQTYArray(ClassInfoID) * ClassInfoStudentFee ) %>
			<% OrderTotal = OrderTotal + (ClassesQTYArray(ClassInfoID) * ClassInfoStudentFee )  %>


		<% else %>
			Free
		<% end if %> 	
				<img src = "/images/px.gif" width = "5" alt = "Class Registration">    </td>
</tr>
<% if len(ClassInfoMaterialFee) > 1 then
 if ClassInfoMaterialFee > 1 then %>
<tr><td class = "body">Class Materials/Equipment Fee</td>
<td class = "body"><%=formatcurrency(ClassInfoMaterialFee) %></td>
<td ><% if ClassInfoMaterialFeeOptional = True then %>

<%= ClassInfoMaterialFeePay(ClassInfoID) %>


		<% else %>
		Required.
		<% end if %>   </td>
		<td class = "body">
		<% if ClassInfoMaterialFeeOptional = True then 
		if ClassInfoMaterialFeePay(ClassInfoID)  > 0 then%>
				<%=formatcurrency(ClassInfoMaterialFee * ClassInfoMaterialFeePay(ClassInfoID)) %>
				<% else %>
    $0.00
		<% end if %>
		<% else %>
		<%=formatcurrency(ClassInfoMaterialFee * ClassesQTYArray(ClassInfoID) ) %>
		<% end if %>
		</td>
</tr>
<% end if %>
<% end if %>
<%
end if
 rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
   end if 
  
 '********************************************************************************
 '	EXTRA OPTIONS
 '********************************************************************************
 
sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and AvaliableByItself = True and EventID = " & EventID & "" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowExtraOptions = True %>
	
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>
 <% end if  %>  
	<tr ><td class = "body" colspan = "4" height ="30"><img src = "/images/px.gif" width = "5"  alt = "Vendor Registration"><b>Other Options</b></td></tr>
	<%

	end if 

  if ShowExtraOptions = True then

    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	
	While Not rs.eof  
	ExtraOptionsID = rs("ExtraOptionsID")
		ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		ExtraOptionsQTYAvailable= rs("ExtraOptionsQTYAvailable")
		ExtraOptionsPrice= rs("ExtraOptionsPrice")
		AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
		AvaliableByItself= rs("AvaliableByItself")
	
	
	if len(ExtraOptionsQTYAvailable) > 0 then
	else
	  ExtraOptionsQTYAvailable = 50
	end if
		str1 = ExtraOptionsName
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, " ")
		End If 
		
		str1 = ExtraOptionsName
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, "'")
		End If 	
	
	
	ExtraOptionsQTYArraycount = "ExtraOptionsQTYArray(" & ExtraOptionsID & ")"
	ExtraOptionsQTYArray(ExtraOptionsID) = Request.Form(ExtraOptionsQTYArraycount)

i = 0
	while i < (TotalExtraOptionCounter + 1 )
	   	i = i + 1
		if OldExtraOptionNameArray(i) = ExtraOptionsName then
			OldExtraOptionQTY = OldExtraOptionQTYArray(i)
		end if
	wend
	
	
  if ExtraOptionsQTYArray(ExtraOptionsID) < 1 and OldExtraOptionQTY > 0 and NOT(Update = "True") then
 	ExtraOptionsQTYArray(ExtraOptionsID) =  OldExtraOptionQTY
  end if 


    %>
     <tr>
  	<td class = "body">
		<blockquote><%= ExtraOptionsName %></blockquote>
	</td>
	<td class = "body" align = "right">	
	<% if len(ExtraOptionsPrice) > 0 then %>	
		<%= formatcurrency(ExtraOptionsPrice) %>
	<% else %>
	Free
	<% end if %>	
		<img src = "/images/px.gif" width = "5" alt = "ExtraOptions Registration">
    </td>
    <td class = "body" align = "right">	
 		<%=ExtraOptionsQTYArray(ExtraOptionsID)%></option>
  <img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> 

    </td>

	<td class = "body" align = "right">	
	<% if len(ExtraOptionsPrice) > 0 then %>	
		<%=formatcurrency(ExtraOptionsQTYArray(ExtraOptionsID) * ExtraOptionsPrice ) %>
		<% OrderTotal = OrderTotal + (ExtraOptionsQTYArray(ExtraOptionsID) * ExtraOptionsPrice )   %>
	<% else %>
		Free
	<% end if %>
		<img src = "/images/px.gif" width = "5" alt = "ExtraOptions Registration">
    </td>
</tr>

<% 	

i = 1
 for i = 1 to TotalExtraOptions
   if  ExtraOptionID(i) = ExtraOptionsID and ExtraOptionQTY(i) > 0 then
 %>
 <tr><td class = "body"   align = "Right" colspan = "2" height="20"><small># <%=rs("ExtraOptionsName")%> that comes with sponsorship<% if ExtraOptionQTY(i) > 1 then %>s<%end if %>:</small></td>
 			<td class = "body"   align = "right"><%= ExtraOptionQTY(i) %><img src = "images/px.gif"width = "10" height = "1" alt = "<%=rs("ExtraOptionsName")%> Registration"></td>
  			<td class = "body"   align = "right">N/A <img src = "images/px.gif"width = "10" height = "1" alt = "<%=rs("ExtraOptionsName")%> Registration"></td>
  		</tr>
		<tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "<%=EventName%> Event Registration"></td></tr>

 <%  
   end if 
 next
 		rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if

 
'************************************************************
'  DINNER TICKETS FEE
'************************************************************
if ShowDinner= "True"  then

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Dinner' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	Title = rs("Title")
	VegitarianOption = rs("VegitarianOption")

	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	if len(Title) > 1 then
	else
	  Title = "Dinner"
	end if

	DinnerFee = rs("Price")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")

	if len(MaxQTY2) > 0 then
	else
		MaxQTY2 = 100
	end if
	
End If 


if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
else
   ServiceStartDate = ""
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
	else
   ServiceEndDate = ""

end if


OfferDinnerTickets = True


if len(ServiceEndDateMonth) < 1 or len(ServiceEndDateDay) < 1 then
OfferDinnerTickets = True
else
	if DateDiff("d", ServiceEndDate, now()) > 1 then
		OfferDinnerTickets = False
	end if
end if

	if len(DinnerFee) > 0 then
	else
		OfferDinnerTickets = False
	end if


if OfferDinnerTickets = True then
	
	
	DinnerQTY = request.form("DinnerQTY")

if DinnerQTY < 1 and OldDinnerTicketQTY > 0 and NOT(Update = "True") then
	DinnerQTY = OldDinnerTicketQTY
end if

 showdiscount = False
 
 %>

     <tr>
  <td class = "body">
<br>
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><%=Title %>
  
  <% if len(ServiceEndDate) > 6 then %>
  <br>
  <img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"><small>Registration ends <%=ServiceEndDate %>.</small>
  <% end if %>
  
  
 </td>
  <td class = "body" align = "right">
      <input type = "hidden" value = "<%= DinnerFee %>" name = "DinnerFee">
  <%=formatcurrency(DinnerFee,2)%>
 

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
 <% Maxnumstallmats = cint(AnimalStallQTY) + cint(CurrentNumDisplayStallQTY) + 1%>

   
 <select size="1" name="DinnerQTY" onchange="submit();" width="50" style="width: 50px" >
  
 
  	<% if (DinnerQTY) > 0 then %>
  	<option value="<%=DinnerQTY%>"><%= DinnerQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < MaxQTY2 + 1 %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend 
	
 %>
	</select><img src = "/images/px.gif" width = "10" height = "1" alt = "Livestock Event registration">
 </td>
  <td class = "body" align = "right">  
 	 <%=formatcurrency((DinnerFee * DinnerQTY),2)%>
 	 <% OrderTotal = OrderTotal + (DinnerFee * DinnerQTY) %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 


<% 
end if ' if OfferDinnerTickets = True 


 if TotalFreeDinnerTicketsQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" align = "right" colspan = "2">
   <small># tickets from sponsorship<% if TotalFreeDinnerTicketsQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right">
	<%=TotalFreeDinnerTicketsQTY%><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
N/A<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if 


if VegitarianOption = "True" and DinnerQTY > 0 then
	DinnerVegQTY = request.form("DinnerVegQTY")
	if DinnerVegQTY < 1 and OldVegitarianQTY > 0 and NOT(Update = "True") then
		DinnerVegQTY = OldVegitarianQTY
	end if


    %>
     <tr>
  <td class = "body">
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Vegetarian Meals
   <br><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><small>How many of your meals should be vegetarian?</small>

 </td>
  <td class = "body" align = "right">
		N/A
 <img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">
  
 <select size="1" name="DinnerVegQTY" onchange="submit();" width="50" style="width: 50px" >
   
  	<% if (DinnerVegQTY) > 0 then %>
  	<option value="<%=DinnerVegQTY%>"><%= DinnerVegQTY%></option>
  
  	<% end if %>
  	<% x = 0
  	 while x < DinnerQTY + 1 %>
  		<option value="<%=x%>"><%=x%></option>
  		<% x = x + 1
	wend 
 %>
	</select><img src = "/images/px.gif" width = "10" alt = "Livestock Event registration">

 </td>
  <td class = "body" align = "right">  
 	 N/A
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 
<% 
end if ' if vegitary Option = True %>


<% end if ' if ShowDinner  = true %>
 
<% If FirstGroup = True then
   FirstGroup = False
else
 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>

 <% end if  %>  

	<tr ><td class = "body" colspan = "3" height = "30" align = "right" ><b>Total:</b><img src = "/images/px.gif" width = "5" alt = "<%=EventName%> Event Registration"></td>
		<td class = "body" colspan = "1" height = "30" align = "right"><b><%=formatcurrency(OrderTotal,2) %><img src = "/images/px.gif" width = "10" alt = "<%=EventName%> Event Registration"></b>
		<br /><br />
		</td>
	</tr>
</table>
</td>
</tr>	
<tr>
  <td background = "images/Footer650.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>
<br><br />
	<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "640" align = "center">	
<tr><td class = "body" >

</td>
<td align = "right" class = "body">

<% 


if len(Paypal) > 0 and   len(PaypalEmail) > 0 then %>
   <center>
<form action="https://www.paypal.com/cgi-bin/webscr" target= "Blank" method="post">
    <input type="hidden" name="cmd" value="_xclick"> 
    <input type="hidden" name="upload" value="1">   
    <input type="hidden" name="business" value="<%=PaypalEmail %>">   
    <input type="hidden" name="item_name" value="<%=EventName %> Event Registration">  
     <input type="hidden" name="amount" value="<%=OrderTotal %>">   
     <input name="custom" type="hidden" id="custom" value="<%=PeopleID %>E<%=EventID %>"> 
    <input type="hidden" name="return" value="http://www.AndresenEvents.com/EventRegister.asp?EventID=<%=EventID%>">
    <input type="hidden" name="cbt" value="Complete Your Registration">
       <input type="hidden" name="cancel_return" value="http://www.AndresenEvents.com/EventRegister.asp?EventID=<%=EventID%>">
    <input type="hidden" name="notify_url" value="Http://www.AndresenEvents.com/EventOrderCompletion.asp">   
     <input type="submit" class = "regsubmit2" value="Make Your Payment with PayPal"> 

     </form></center>
 <% end if %>
</td>
</tr>
</table>
</td>
</tr>
</table>
<% end if ' REGISTRATION IS OPEN %>



 <!--#Include file="FibermaniaFooter.asp"--> 
 <!--#Include file="sojaaFooter.asp"--> </td></tr></table>
</body>
</html>

