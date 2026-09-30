<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Halter Home" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Halter Show</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Halter" %>
<!--#Include file="OverviewHeader.asp"-->

<!'--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 


<%

EventID = request.querystring("EventID")
	' Start Update Halter Classes
    HalterClass = request.Form("HalterClass")
  		sqlp = "select * from AnimalHalterClassesLookup where SpeciesID = 2"
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then 
	 			Query =  "Delete * From AnimalHalterClasses where EventID = " &  EventID
                response.write("Query=" & Query )
				'Conn.Execute(Query) 

			 while Not rsp.eof 
			str1 = HalterClass
			str2 = AnimalHalterLookupID
			If InStr(str1,str2) > 0 Then
				Query =  "INSERT INTO AnimalHalterClasses (EventID, AnimalHalterLookupID)"
				Query =  Query & " Values (" &  EventID & " ,"
				Query =  Query &   " " & AnimalHalterLookupID & " )" 
				Conn.Execute(Query) 
			End If  
			
			 rsp.movenext
			wend 
		 end if 
	' End Update Halter Classes	
		
	' Start Update Production Classes			
		ProductionClass = request.Form("ProductionClass")
			

		sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 2"
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then 
	 			Query =  "Delete * From AnimalProductionClasses where EventID = " &  EventID
			'	Conn.Execute(Query) 

			 while Not rsp.eof 
			 AnimalProductionLookupID = rsp("AnimalProductionLookupID")
			str1 = ProductionClass
			str2 = AnimalProductionLookupID
			If InStr(str1,str2) > 0 Then
				Query =  "INSERT INTO AnimalProductionClasses (EventID, AnimalProductionLookupID)"
				Query =  Query & " Values (" &  EventID & " ,"
				Query =  Query &   " " & AnimalProductionLookupID & " )" 
				Conn.Execute(Query) 
			End If  
			
			 rsp.movenext
			wend 
			
		 end if 

	' End Update Production Classes	
UpdateHalter = False
 If Request.Querystring("UpdateHalter" ) = "True" Then
UpdateHalter =True
	ServiceTypeLookupID= Request.Form("ServiceTypeLookupID") 
  	ServicesID= Request.Form("ServicesID") 
	FeePerAnimal = Request.Form("FeePerAnimal")
	FeePerPen  = Request.Form("FeePerPen")
	MaxQTYCheckbox = Request.Form("MaxQTYCheckbox")
	MaxQTY = Request.Form("MaxQTY")
	MaxQTY2 = Request.Form("MaxQTY2")

	MaxQTY3 = Request.Form("MaxQTY3")
	ServiceEndDateMonth = Request.Form("ServiceEndDateMonth")
	ServiceEndDateDay = Request.Form("ServiceEndDateDay")
	ServiceEndDateYear = Request.Form("ServiceEndDateYear")
	
	ServiceStartDateMonth = Request.Form("ServiceStartDateMonth")
	ServiceStartDateDay = Request.Form("ServiceStartDateDay")
	ServiceStartDateYear = Request.Form("ServiceStartDateYear")

	Description = Request.Form("Description")
	EventID = Request.Form("EventID")
	EventSubTypeID = Request.Form("EventSubTypeID")
	VetCheckFee  = Request.Form("VetCheckFee")
 	ElectricityFee  = Request.Form("ElectricityFee")
 	ElectricityAvailable  = Request.Form("ElectricityAvailable")
 	ElectricityOptional  = Request.Form("ElectricityOptional")
 	
  	MaxPensPerFarm  = Request.Form("MaxPensPerFarm")
  	MaxDisplaysPerFarm = Request.Form("MaxDisplaysPerFarm")
 	StallMatsAvailable  = Request.Form("StallMatsAvailable")
 	StallMatPrice  = Request.Form("StallMatPrice")

	Price1DiscountName= Request.Form("Price1DiscountName")
	Price1DiscountOther= Request.Form("Price1DiscountOther")
	Price1Discount= Request.Form("Price1Discount")
	Price1DiscountStartDateMonth  = Request.Form("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = Request.Form("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = Request.Form("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = Request.Form("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = Request.Form("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = Request.Form("Price1DiscountEndDateYear")

	Price2DiscountName= Request.Form("Price2DiscountName")
	Price2DiscountOther= Request.Form("Price2DiscountOther")
	Price2Discount= Request.Form("Price2Discount")
	Price2DiscountStartDateMonth  = Request.Form("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = Request.Form("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = Request.Form("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = Request.Form("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = Request.Form("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = Request.Form("Price2DiscountEndDateYear")

	Price3  = Request.Form("Price3")
	Price3DiscountName= Request.Form("Price3DiscountName")
	Price3DiscountOther= Request.Form("Price3DiscountOther")
	Price3Discount= Request.Form("Price3Discount")
	Price3DiscountStartDateMonth  = Request.Form("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = Request.Form("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = Request.Form("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = Request.Form("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = Request.Form("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = Request.Form("Price3DiscountEndDateYear")

	Price4  = Request.Form("Price4")
	Price4DiscountName= Request.Form("Price4DiscountName")
	Price4DiscountOther= Request.Form("Price4DiscountOther")
	Price4Discount= Request.Form("Price4Discount")
	Price4DiscountStartDateMonth  = Request.Form("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = Request.Form("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = Request.Form("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = Request.Form("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = Request.Form("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = Request.Form("Price4DiscountEndDateYear")

str1 = Price1DiscountName
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price1DiscountName= Replace(str1,  str2, "''")
End If 

str1 = Price2DiscountName
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price2DiscountName= Replace(str1,  str2, "''")
End If 


str1 = Price3DiscountName
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price3DiscountName= Replace(str1,  str2, "''")
End If 

str1 = Price4DiscountName
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price4DiscountName= Replace(str1,  str2, "''")
End If 


str1 = Price1DiscountOther
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price1DiscountOther= Replace(str1,  str2, "''")
End If 

str1 = Price2DiscountOther
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price2DiscountOther= Replace(str1,  str2, "''")
End If 


str1 = Price3DiscountOther
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price3DiscountOther= Replace(str1,  str2, "''")
End If 

str1 = Price4DiscountOther
str2 = "'"
If InStr(str1,str2) > 0 Then
	Price4DiscountOther= Replace(str1,  str2, "''")
End If 


str1 = Description
str2 = "'"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "''")
End If 

Query =  " UPDATE Services Set Description = '" &  Description & "',"

if len(MaxQTY) > 0 then
	Query =  Query & " ServiceMaxQuantity  = " &  MaxQTY  & "," 
end if
 
if len(MaxQTY2) > 0 then
Query =  Query & " ServiceMaxQuantity2  = " &  MaxQTY2  & "," 
end if

if len(MaxQTY3) > 0 then
Query =  Query & " ServiceMaxQuantity3  = " &  MaxQTY3  & "," 
end if


if len(FeePerAnimal) > 0 then
  Query =  Query & " Price  = " &  FeePerAnimal & "," 
else
  Query =  Query & " Price  = 0," 
end if


 if len(StallMatsAvailable) > 0 then
  Query =  Query & " StallMatsAvailable  = " &  StallMatsAvailable & "," 
  else
  Query =  Query & " StallMatsAvailable  = 0," 
end if


 if len(StallMatPrice) > 0 then
  Query =  Query & " StallMatPrice  = " &  StallMatPrice & "," 
  else
  Query =  Query & " StallMatPrice  = 0," 
end if


if len(VetCheckFee) > 0 then
  Query =  Query & " VetCheckFee  = " &  VetCheckFee & "," 
else
  Query =  Query & " VetCheckFee  = 0," 
end if

 if len(ElectricityFee) > 0 then
  Query =  Query & " ElectricityFee  = " &  ElectricityFee & "," 
else
  Query =  Query & " ElectricityFee  = 0," 
end if


 if len(MaxPensPerFarm) > 0 then
  Query =  Query & " MaxPensPerFarm  = " &  MaxPensPerFarm & "," 
else
  Query =  Query & " MaxPensPerFarm  =  0," 
end if


 if len(MaxDisplaysPerFarm) > 0 then
  Query =  Query & " MaxDisplaysPerFarm  = " &  MaxDisplaysPerFarm & "," 
else
  Query =  Query & " MaxDisplaysPerFarm  =  0," 
end if



 if len(ServiceEndDateMonth) > 0 then
  Query =  Query & " ServiceEndDateMonth  = " &  ServiceEndDateMonth & "," 
end if

 if len(ServiceEndDateDay) > 0 then
  Query =  Query & " ServiceEndDateDay  = " &  ServiceEndDateDay & "," 
end if

 if len(ServiceEndDateYear) > 0 and (len(ServiceEndDateMonth) > 0 or len(ServiceEndDateDay) > 0 ) then
  Query =  Query & " ServiceEndDateYear  = " &  ServiceEndDateYear & "," 
end if



 if len(ServiceStartDateMonth) > 0 then
  Query =  Query & " ServiceStartDateMonth  = " &  ServiceStartDateMonth & "," 
end if

 if len(ServiceStartDateDay) > 0 then
  Query =  Query & " ServiceStartDateDay  = " &  ServiceStartDateDay & "," 
end if

 if len(ServiceStartDateYear) > 0 and (len(ServiceStartDateMonth) > 0 or len(ServiceStartDateDay) > 0 ) then
  Query =  Query & " ServiceStartDateYear  = " &  ServiceStartDateYear & "," 
end if



 if len(Price1Discount) > 0 then
  Query =  Query & " Price1Discount  = " &  Price1Discount & "," 
else
  Query =  Query & " Price1Discount  = 0," 
end if

 Query =  Query & " Price1DiscountName  = '" &  Price1DiscountName & "'," 
  Query =  Query & " Price1DiscountOther  = '" &  Price1DiscountOther & "'," 

if len(Price1DiscountstartDateMonth) > 0 then
  Query =  Query & " Price1DiscountstartDateMonth  = " &  Price1DiscountstartDateMonth & "," 
end if

 if len(Price1DiscountstartDateDay) > 0 then
  Query =  Query & " Price1DiscountstartDateDay  = " &  Price1DiscountstartDateDay & "," 
end if

 if len(Price1DiscountstartDateYear) > 0 and (len(Price1DiscountstartDateMonth) > 0 or len(Price1DiscountstartDateDay)) then
  Query =  Query & " Price1DiscountstartDateYear  = " &  Price1DiscountstartDateYear & "," 
end if

 if len(Price1DiscountEndDateMonth) > 0 then
  Query =  Query & " Price1DiscountEndDateMonth  = " &  Price1DiscountEndDateMonth & "," 
end if

 if len(Price1DiscountEndDateDay) > 0 then
  Query =  Query & " Price1DiscountEndDateDay  = " &  Price1DiscountEndDateDay & "," 
end if

 if len(Price1DiscountEndDateYear) > 0 and ( len(Price1DiscountEndDateMonth) > 0 or len(Price1DiscountEndDateDay) > 0 ) then
  Query =  Query & " Price1DiscountEndDateYear  = " &  Price1DiscountEndDateYear & "," 
end if

Query =  Query & " Price2DiscountName  = '" &  Price2DiscountName & "'," 
Query =  Query & " Price2DiscountOther  = '" &  Price2DiscountOther & "'," 

if len(Price2Discount) > 0 then
  Query =  Query & " Price2Discount  = " &  Price2Discount & "," 
else
  Query =  Query & " Price2Discount  = 0," 
end if



if len(Price2DiscountstartDateMonth) > 0 then
  Query =  Query & " Price2DiscountstartDateMonth  = " &  Price2DiscountstartDateMonth & "," 
end if

 if len(Price2DiscountstartDateDay) > 0 then
  Query =  Query & " Price2DiscountstartDateDay  = " &  Price2DiscountstartDateDay & "," 
end if

 if len(Price2DiscountstartDateYear) > 0 and (len(Price2DiscountstartDateMonth) > 0  or len(Price2DiscountstartDateDay) > 0 ) then
  Query =  Query & " Price2DiscountstartDateYear  = " &  Price2DiscountstartDateYear & "," 
end if

 if len(Price2DiscountEndDateMonth) > 0 then
  Query =  Query & " Price2DiscountEndDateMonth  = " &  Price2DiscountEndDateMonth & "," 
end if

 if len(Price2DiscountEndDateDay) > 0 then
  Query =  Query & " Price2DiscountEndDateDay  = " &  Price2DiscountEndDateDay & "," 
end if

 if len(Price2DiscountEndDateYear) > 0 and (len(Price2DiscountEndDateMonth) > 0 or len(Price2DiscountEndDateDay) > 0  ) then
  Query =  Query & " Price2DiscountEndDateYear  = " &  Price2DiscountEndDateYear & "," 
end if


Query =  Query & " Price3DiscountName  = '" &  Price3DiscountName & "'," 
Query =  Query & " Price3DiscountOther  = '" &  Price3DiscountOther & "'," 

if len(Price3) > 0 then
  Query =  Query & " Price3  = " &  Price3 & "," 
else
  Query =  Query & " Price3  = 0," 
end if



 if len(Price3Discount) > 0 then
  Query =  Query & " Price3Discount  = " &  Price3Discount & "," 
else
  Query =  Query & " Price3Discount  = 0," 
end if



if len(Price3DiscountstartDateMonth) > 0 then
  Query =  Query & " Price3DiscountstartDateMonth  = " &  Price3DiscountstartDateMonth & "," 
end if

 if len(Price3DiscountstartDateDay) > 0 then
  Query =  Query & " Price3DiscountstartDateDay  = " &  Price3DiscountstartDateDay & "," 
end if

 if len(Price3DiscountstartDateYear) > 0 and (len(Price3DiscountstartDateMonth) > 0 or len(Price3DiscountstartDateDay)) then
  Query =  Query & " Price3DiscountstartDateYear  = " &  Price3DiscountstartDateYear & "," 
end if

 if len(Price3DiscountEndDateMonth) > 0 then
  Query =  Query & " Price3DiscountEndDateMonth  = " &  Price3DiscountEndDateMonth & "," 
end if

 if len(Price3DiscountEndDateDay) > 0 then
  Query =  Query & " Price3DiscountEndDateDay  = " &  Price3DiscountEndDateDay & "," 
end if

 if len(Price3DiscountEndDateYear) > 0 and ( len(Price3DiscountEndDateMonth) > 0 or len(Price3DiscountEndDateDay) > 0 ) then
  Query =  Query & " Price3DiscountEndDateYear  = " &  Price3DiscountEndDateYear & "," 
end if

 if len(Price4) > 0 then
  Query =  Query & " Price4  = " &  Price4 & "," 
else
  Query =  Query & " Price4  = 0," 
end if
'
Query =  Query & " Price4DiscountName  = '" &  Price4DiscountName & "'," 
Query =  Query & " Price4DiscountOther  = '" &  Price4DiscountOther & "'," 

 if len(Price4Discount) > 0 then
  Query =  Query & " Price4Discount  = " &  Price4Discount & "," 
else
  Query =  Query & " Price4Discount  = 0," 
end if



if len(Price4DiscountstartDateMonth) > 0 then
  Query =  Query & " Price4DiscountstartDateMonth  = " &  Price4DiscountstartDateMonth & "," 
end if

 if len(Price4DiscountstartDateDay) > 0 then
  Query =  Query & " Price4DiscountstartDateDay  = " &  Price4DiscountstartDateDay & "," 
end if

 if len(Price4DiscountstartDateYear) > 0 and (len(Price4DiscountstartDateMonth) > 0 or len(Price4DiscountstartDateDay)) then
  Query =  Query & " Price4DiscountstartDateYear  = " &  Price4DiscountstartDateYear & "," 
end if

 if len(Price4DiscountEndDateMonth) > 0 then
  Query =  Query & " Price4DiscountEndDateMonth  = " &  Price4DiscountEndDateMonth & "," 
end if

 if len(Price4DiscountEndDateDay) > 0 then
  Query =  Query & " Price4DiscountEndDateDay  = " &  Price4DiscountEndDateDay & "," 
end if

 if len(Price4DiscountEndDateYear) > 0 and ( len(Price4DiscountEndDateMonth) > 0 or len(Price4DiscountEndDateDay) > 0 ) then
  Query =  Query & " Price4DiscountEndDateYear  = " &  Price4DiscountEndDateYear & "," 
end if





 if len(FeePerPen) > 0 then
  Query =  Query & " Price2  = " &  FeePerPen & "," 
else
  Query =  Query & " Price2  = 0," 
end if


if len(StopDate1) > 0 then
 Query =  Query & " ServiceEndDate  = '" &  StopDate1 & "'," 
end if 

   Query =  Query & " ElectricityAvailable  = " & ElectricityAvailable & " , " 	
  Query =  Query & " ElectricityOptional  = " &  ElectricityOptional & " , " 	
 	
 Query =  Query & " ExtraField  = ''" 
Query =  Query & " where servicesID = " & servicesID & " and  EventID = " &  EventID & "" 

Conn.Execute(Query) 

end if

%>
<!'--#Include file="HalterHeader.asp"--> 

<% 

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	ServiceTypeLookupID = rs("ServiceTypeLookupID")
	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
		ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")


	
	Price1Discount= rs("Price1Discount")
	Price1DiscountName= rs("Price1DiscountName")
	Price1DiscountOther= rs("Price1DiscountOther")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountName= rs("Price2DiscountName")
	Price2DiscountOther= rs("Price2DiscountOther")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")
	
	
	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountName= rs("Price3DiscountName")
	Price31DiscountOther= rs("Price3DiscountOther")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")
	Price4Discount= rs("Price4Discount")
	Price4DiscountName= rs("Price4DiscountName")
	Price4DiscountOther= rs("Price4DiscountOther")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")


 	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")
	ElectricityFee = rs("ElectricityFee")
	ElectricityAvailable  = rs("ElectricityAvailable")
	Electricityoptional  = rs("Electricityoptional")
	
	VetCheckFee = rs("VetCheckFee")
	MaxPensPerFarm = rs("MaxPensPerFarm")
	StallMatsAvailable = rs("StallMatsAvailable")
	StallMatPrice = rs("StallMatPrice")
		
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


str1 = Price1DiscountName
str2 = "''"
If InStr(str1,str2) > 0 Then
	Price1DiscountName= Replace(str1,  str2, "'")
End If 

str1 = Price2DiscountName
str2 = "''"
If InStr(str1,str2) > 0 Then
	Price2DiscountName= Replace(str1,  str2, "'")
End If 


str1 = Price3DiscountName
str2 = "''"
If InStr(str1,str2) > 0 Then
	Price3DiscountName= Replace(str1,  str2, "'")
End If 

str1 = Price4DiscountName
str2 = "''"
If InStr(str1,str2) > 0 Then
	Price4DiscountName= Replace(str1,  str2, "'")
End If 

	
End If 



if FeePerAnimal = "0" then
   FeePerAnimal = ""
end if

if Price1Discount = "0" then
   Price1Discount = ""
end if

if Price2Discount = "0" then
   Price2Discount = ""
end if


if FeePerPen = "0" then
   FeePerPen = ""
end if


if Price1Discount = "0" then
  Price1Discount = ""
end if



if Price2Discount = "0" then
  Price2Discount = ""
end if



if Price3Discount = "0" then
  Price3Discount = ""
end if


if Price4Discount = "0" then
  Price4Discount = ""
end if


if Price1 = "0" then
  Price1 = ""
end if


if Price2 = "0" then
  Price2 = ""
end if


if Price3 = "0" then
  Price3 = ""
end if


if Price4 = "0" then
  Price4 = ""
end if



Proceed = True
Startdate = True
Enddate = True 
FindFeePerAnimal = True
FindFeePerPen = True

if len(ServiceStartDateDay) > 0 and len(ServiceStartDateMonth) > 0 and len(ServiceStartDateYear) > 0 then
else
  Proceed = false
  Startdate = false
end if 

if len(ServiceEndDateDay) > 0 and len(ServiceEndDateMonth) > 0 and len(ServiceEndDateYear) > 0 then
else
  Proceed = false
  Enddate = false
end if 


if len(FeePerAnimal) > 0  then
else
  Proceed = false
  FindFeePerAnimal = false
end if

if len(FeePerPen) > 0  then
else
  Proceed = false
  FindFeePerPen = false
end if


%>

<% PageTitleText = "Halter Show Overview"%>
<!--#Include file="970Top.asp"-->



<table border = "0"  cellpadding=0 cellspacing=0 width = "965" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><br></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"></td></tr>
	<tr><td class = "body2" height = "10"></td></tr>
	 <tr><td class = "body2" height = "10" align = "left"><b>* indicates 
		 Required fields</b>
	 <% if Proceed = false and UpdateHalter =True then %>
	  <font Color = "red"><b>Your information is incomplete. Please enter:<br>
	   	<% if Startdate = false then %>
	   		- A valid registration start date.<br>
	   	<% end if %>	
	   	<% if Enddate = false then %>
	   		- A valid registration end date.<br>
	   	<% end if %>	
		<% if FindFeePerAnimal = false then %>
	   		- A fee per animal.<br>
	   	<% end if %>
		<% if FindFeePerPen = false then %>
	   		- A fee per animal pen.<br>
	   	<% end if %>

	   		</b></font>
	   	
	 <% end if %>
	 </td></tr>

</table>

<form  name=halterform method="post" action="HalterHome.asp?EventID=<%=EventID%>&UpdateHalter=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "965" align = "right" >
 <tbody>
	<tr>
	  <td valign = "top" width = "448">
	    <% PageTitleText = "Show Judges"  %>
<!--#Include file="444Top.asp"--> 
	  <table  border = "0" cellpadding=0 cellspacing=0  valign = "top" width = "420" >
 <tr>
   <td class = "body" >
   
    <% sqlb = "select * from Judgesshows, Judges where Judgesshows.JudgeID = Judges.JudgeID and  JudgesShows.EventID = " & EventID & " and ShowType = 'Halter'"
           
   					Set rsb = Server.CreateObject("ADODB.Recordset")
   					rsb.Open sqlb, conn, 3, 3  
   					if not rsb.eof then %>
   					  Below are is the judge(s) for this show:<br>
					<% while not rsb.eof
						JudgeName = rsb("JudgeFirstName") & " " & rsb("JudgeLastName") 
						JudgeID  = rsb("JudgeID")  %>
						&nbsp;&nbsp;&nbsp;&nbsp;<a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class = "body"><%= JudgeName %></a><br>
   					<% rsb.movenext
   					wend
   					else %>
   					Currently there are no halter show judges entered. 
   					
   					<% end if 
   					rsb.close %>
<br>
 
    To add judges to your halter show please select <a href = "JudgeAdd.asp?EventID=<%=EventID%>" class = "body">
	Add Judges</a>.

  <input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >
   </td>
   </tr>
  </table>
  <!--#Include file="444Bottom.asp"-->
<% PageTitleText = "Halter Show Entries Fees and Dates"  %>
<!--#Include file="444Top.asp"--> 
<table  border = "0" cellpadding=0 cellspacing=0  valign = "top" >
	  	<tr><td colspan = "4"><table  border = "0" >
	    <tr>
	      <td class = "body2" align = "right" width = "200"><% if FindFeePerAnimal = false and UpdateHalter =True  then %><font color = "red"><%End if%>
		  Fee Per Animal*: <% if FindFeePerAnimal = false and UpdateHalter =True  then %></font><%End if%></td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "FeePerAnimal" size = 7 maxsize = 9 value = "<%=FeePerAnimal%>"></div>
			
	
	<script type="text/javascript">

	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>
  		<% 'Begining of Avaliable Halter Classes%>
		<tr>
			<td class = "body" align = "right" valign = "top"><div align = "right">
				Available Halter Classes:</div></td>
			<td class="body2" colspan = "3">
				<% sqlp = "select * from AnimalHalterClassesLookup where SpeciesID = 1"
				Set rsp = Server.CreateObject("ADODB.Recordset")
				rsp.Open sqlp, conn, 3, 3
				if not rsp.eof then %>
			<table> 
				<% while Not rsp.eof  
				AnimalHalterLookupID = rsp("AnimalHalterLookupID")
				HalterClassName = rsp("HalterClassName") %>
				
				<tr>
					<td class = "body">
				
				<% sqlp2 = "select * from AnimalHalterClasses where AnimalHalterLookupID = " & AnimalHalterLookupID & " and EventID =" & EventID
				Set rsp2 = Server.CreateObject("ADODB.Recordset")
				rsp2.Open sqlp2, conn, 3, 3
				if rsp2.eof then %>
					<input type="checkbox" name="HalterClass" value="<%=AnimalHalterLookupID %>" ><%=HalterClassName%><br >
				<% else %>
					<input type="checkbox" name="HalterClass" value="<%=AnimalHalterLookupID %>" checked><%=HalterClassName%><br >	
				<% end if 
				rsp2.close %>
			  
				</td>
			</tr>
		
			<% rsp.movenext
			wend
			rsp.close %>
			</table>
			<% end if %>
            </td>
          </tr>
	 <tr>
	      <td class = "body2" colspan = "4" align = "center" ><b>Fee Per Animal 
		  Discount</b><br>
	     <font color = "#303030"><small>List below discount information for the 
		  fee per animal.</small></font></td>
	    </tr>
   
	    <tr>
	      <td class = "body2" align = "right" valign = "top">Discount Name:</td>
	      <td class = "body2" colspan = "3" align = "left"><input  type="text" name = "Price1DiscountName" size = 17 maxsize = 19 value = "<%=Price1DiscountName%>"><br>
	        <font color = "#303030"><small>(i.e. Early Bird Special)</small></font>
	      </td>
	    </tr>

	     <tr>
	      <td class = "body2" align = "right" >Discount Price: </td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "Price1Discount" size = 7 maxsize = 9 value = "<%=Price1Discount%>"></div>
			<script type="text/javascript">
			    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>

	    <tr>
	      <td class = "body2" align = "right"  valign = "top">Other Promotional 
		  Offer:</td>
	      <td class = "body2" colspan = "3" align = "left"><input  type="text" name = "Price1DiscountOther" size = 17 maxsize = 19 value = "<%=Price1DiscountOther%>"><br>
	        <font color = "#303030"><small>(i.e. free program ad)</small></font>
	      </td>
	    </tr>



	    
	<tr >
	    <td class = "body" align = "right"><div align = "right">Discount Start:</div></td>
		<td class="body2" colspan = "3" >
		
			<table border = "0" >
			<tr><td>
			  <select size="1" name="Price1DiscountStartDateMonth">

		<% if len(Price1DiscountStartDateMonth) > 0 then %>
					<option value="<%=Price1DiscountStartDateMonth%>" selected><%=MonthString(Price1DiscountStartDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price1DiscountStartDateDay">
		<% if len(Price1DiscountStartDateDay) > 0 then %>
					<option value="<%=Price1DiscountStartDateDay%>" selected><%=Price1DiscountStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price1DiscountStartDateYear">
				<% if len(Price1DiscountStartDateYear) > 0 then %>
					<option value="<%=Price1DiscountStartDateYear%>" selected><%=Price1DiscountStartDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>

				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		</table>
		
		</td>
		</tr>
<tr >
	    <td class = "body" align = "right"><div align = "right">Discount End:</div></td>
		<td class="body2" colspan = "3" >
		
			<table border = "0" >
			<tr><td>
			  <select size="1" name="Price1DiscountEndDateMonth">

		<% if len(Price1DiscountEndDateMonth) > 0 then %>
					<option value="<%=Price1DiscountEndDateMonth%>" selected><%=MonthString(Price1DiscountEndDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price1DiscountEndDateDay">
		<% if len(Price1DiscountEndDateDay) > 0 then %>
					<option value="<%=StartDateDay%>" selected><%=Price1DiscountEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price1DiscountEndDateYear">
				<% if len(Price1DiscountEndDateYear) > 0 then %>
					<option value="<%=Price1DiscountEndDateYear%>" selected><%=Price1DiscountEndDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
	</table>
	</td>
	</tr>
	</table>
		</td>
	</tr>
	</table>
	<!--#Include file="444Bottom.asp"--> 
	  
	  <% PageTitleText = "Production Class Facts"  %>
<!--#Include file="444Top.asp"--> 
	<table >
	<tr>
	      <td class = "body2" align = "right" >Production Class Fee Per Animal: </td>
	      <td class = "body2" colspan = "3" align = "left">$<input class="positive" type="text" name = "Price4" size = 7 maxsize = 9 value = "<%=Price4%>">
				<input type="hidden" name="ServicesID" value = <%=ServicesID %> >
	
	<script type="text/javascript">

	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>

	
	      </td>
	    </tr>
	    		<% 'Begining of Avaliable Production Classes%>
		<tr>
			<td class = "body" align = "right" valign = "top"><div align = "right">
				Available Production Classes:</div></td>
			<td class="body2" colspan = "3">
				<% sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 1"
				Set rsp = Server.CreateObject("ADODB.Recordset")
				rsp.Open sqlp, conn, 3, 3
				if not rsp.eof then %>
			<table> 
				<% while Not rsp.eof  
				AnimalProductionLookupID = rsp("AnimalProductionLookupID")
				ProductionClassName = rsp("ProductionClassName") %>
				
				<tr>
					<td class = "body">
				
				<% sqlp2 = "select * from AnimalProductionClasses where AnimalProductionLookupID = " & AnimalProductionLookupID & " and EventID =" & EventID
				Set rsp2 = Server.CreateObject("ADODB.Recordset")
				rsp2.Open sqlp2, conn, 3, 3
				if rsp2.eof then %>
					<input type="checkbox" name="ProductionClass" value="<%=AnimalProductionLookupID %>" ><%=ProductionClassName%><br >
				<% else %>
					<input type="checkbox" name="ProductionClass" value="<%=AnimalProductionLookupID %>" checked><%=ProductionClassName%><br >	
				<% end if 
				rsp2.close %>
			  
				</td>
			</tr>
		
			<% rsp.movenext
			wend
			rsp.close %>
			</table>
			<% end if %>
            </td>
          </tr>
	    <tr>
	      <td class = "body2" colspan = "4" align = "center" ><br><b>Production 
		  class discount</b></td>
	    </tr>

	     <tr>
	      <td class = "body2" align = "right"  valign = "top">Discount Name:</td>
	      <td class = "body2" colspan = "3" align = "left"><input  type="text" name = "Price4DiscountName" size = 17 maxsize = 19 value = "<%=Price4DiscountName%>"><br>
	        <font color = "#303030"><small>(i.e. Production Class Discount)</small></font>
	      </td>
	    </tr>
	     <tr>
	      <td class = "body2" align = "right" >Discount Price: </td>
	      <td class = "body2" colspan = "3" align = "left">$<input class="positive" type="text" name = "Price4Discount" size = 7 maxsize = 9 value = "<%=Price4Discount%>">
			<script type="text/javascript">
			    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>

	    <tr>
	      <td class = "body2" align = "right"  valign = "top">Other Promotional 
		  Offer:</td>
	      <td class = "body2" colspan = "3" align = "left"><input  type="text" name = "Price4DiscountOther" size = 17 maxsize = 19 value = "<%=Price4DiscountOther%>"><br>
	        <font color = "#303030"><small>(i.e. Free Production Class 
		  Sponsorship)</small></font>
	      </td>
	    </tr>
	<tr >
	    <td class = "body" align = "right"><div align = "right">Discount Starts:</div></td>
		<td class="body2" colspan = "3">
		
			<table border = "0" >
			<tr><td>
			  <select size="1" name="Price4DiscountStartDateMonth">

		<% if len(Price4DiscountStartDateMonth) > 0 then %>
					<option value="<%=Price4DiscountStartDateMonth%>" selected><%=MonthString(Price4DiscountStartDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price4DiscountStartDateDay">
		<% if len(Price4DiscountStartDateDay) > 0 then %>
					<option value="<%=Price4DiscountStartDateDay%>" selected><%=Price4DiscountStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price4DiscountStartDateYear">
				<% if len(Price4DiscountStartDateYear) > 0 then %>
					<option value="<%=Price4DiscountStartDateYear%>" selected><%=Price4DiscountStartDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		</table>
		
		</td>
		</tr>
<tr >
	    <td class = "body" align = "right"><div align = "right">Discount Ends:</div></td>
		<td class="body2" colspan = "3">
		
			<table border = "0" >
			<tr><td>
			  <select size="1" name="Price4DiscountEndDateMonth">

		<% if len(Price4DiscountEndDateMonth) > 0 then %>
					<option value="<%=Price4DiscountEndDateMonth%>" selected><%=MonthString(Price4DiscountEndDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price4DiscountEndDateDay">
		<% if len(Price4DiscountEndDateDay) > 0 then %>
					<option value="<%=StartDateDay%>" selected><%=Price4DiscountEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price4DiscountEndDateYear">
				<% if len(Price4DiscountEndDateYear) > 0 then %>
					<option value="<%=Price4DiscountEndDateYear%>" selected><%=Price4DiscountEndDateYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
	<tr><td colspan = "4" height = "10"></td></tr>
		</table>
			</td>
		</tr>
			
			<tr>
			<td class = "body" align = "right" colspan = "1"><div align = "right">
				Max. # Entries Per Exhibitor Per Class:</div></td><td class="body2" colspan = "3" align = "left">
			
				&nbsp;<select size="1" name="MaxQTY3">
				<% if len(MaxQTY3) > 0 then %>
					<option value="<%=MaxQTY3%>" selected><%=MaxQTY3%></option>
					<option value="0">0</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>
		
					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
				</select>
				</td>
			</tr>
	
		</td>
		</tr>
		</table>

		<% 'End of Production Class section %>
			<!--#Include file="444Bottom.asp"--> 
			
			
			
<% PageTitleText = "Pen Fees and Dates"  %>
<!--#Include file="444Top.asp"-->
<table cellpadding = "0" cellspacing = "0"  > 
	  	    <tr>
	    <td class = "body" align = "right"><div align = "right">Max. # Pens Per 
			Exhibitor:</div></td>
		<td class="body2" colspan = "3" align = "left">&nbsp;<select size="1" name="MaxPensPerFarm">
		<% if len(MaxPensPerFarm) > 0 then %>
					<option value="<%=MaxPensPerFarm%>" selected><%=MaxPensPerFarm%></option>
					<option value="0">0</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
				</select>
		</td>
	</tr>
    <tr>
	      <td class = "body2" align = "right" ><% if FindFeePerPen = false and UpdateHalter =True then %><font color = "red"><%End if%>
		  Fee Per Animal Pen*:<% if FindFeePerPen = false and UpdateHalter =True then %></font><%End if%> </td>
	      <td class = "body2" colspan = "3" height = "25" align = "left" ><div align = "top">
			  $<input class="positive" type="text" name = "FeePerPen" size = 7 maxsize = 9 value = "<%=FeePerPen%>"></div>
	      
	      	<script type="text/javascript">

	      	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	
	</script>
	      
	      </td>
	   </tr>
<tr>
	    <td class = "body" align = "right">Maximum # <b>Juveniles</b> Per Pen:</td>
		<td class="body2" colspan = "3" align = "left">&nbsp;<select size="1" name="MaxQTY">
		<% if len(MaxQTY) > 0 then %>
					<option value="<%=MaxQTY%>" selected><%=MaxQTY%></option>
					<option value="0">0</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
				</select>
		</td>
	</tr>
	<tr><td>&nbsp;</td>
		<td align="left">OR</td>
	</tr>
	<tr>
	    <td class = "body" align = "right">Maximum # <b>Adults</b> Per Pen:</td>
		<td class="body2" colspan = "3" align = "left">&nbsp;<select size="1" name="MaxQTY2">
		<% if len(MaxQTY2) > 0 then %>
					<option value="<%=MaxQTY2%>" selected><%=MaxQTY2%></option>
					<option value="0">0</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
				</select>
		</td>
	</tr>
  <tr>
	      <td class = "body2" colspan = "4" align = "center" ><br><b>Pen 
		  Discount</b></td>
	    </tr>
	     <tr>
	      <td class = "body2" align = "right"  valign = "top">Discount Name:</td>
	      <td class = "body2" colspan = "3" align = "left"><input type="text" name = "Price2DiscountName" size = 25 maxsize = 19 value = "<%=Price2DiscountName%>"><br>
	        <font color = "#303030"><small>(i.e. Production Class Discount)</small></font>
	      </td>
	    </tr>
	         <tr>
	      <td class = "body2" align = "right" >Discount Price: </td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "Price2Discount" size = 7 maxsize = 9 value = "<%=Price2Discount%>"></div>
			<script type="text/javascript">
			    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>
	    <tr>
	      <td class = "body2" align = "right"  valign = "top">Other Promotional 
		  Offer:</td>
	      <td class = "body2" colspan = "3" align = "left"><input type="text" name = "Price2DiscountOther" size = 25 maxsize = 19 value = "<%=Price2DiscountOther%>"><br>
	        <font color = "#303030"><small>(i.e. Free Sponsorship)</small></font>
	      </td>
	    </tr>

	    
	<tr >
	    <td class = "body" align = "right">Discount Start:&nbsp;</td>
		<td class="body2" colspan = "3" align = "left">
			  <select size="1" name="Price2DiscountStartDateMonth">

		<% if len(Price2DiscountStartDateMonth) > 0 then %>
					<option value="<%=Price2DiscountStartDateMonth%>" selected><%=MonthString(Price2DiscountStartDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price2DiscountStartDateDay">
		<% if len(Price2DiscountStartDateDay) > 0 then %>
					<option value="<%=Price2DiscountStartDateDay%>" selected><%=Price2DiscountStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price2DiscountStartDateYear">
				<% if len(Price2DiscountStartDateYear) > 0 then %>
					<option value="<%=Price2DiscountStartDateYear%>" selected><%=Price2DiscountStartDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>

				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>
				
			<% currentyear = year(date) 
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
<tr >
	    <td class = "body" align = "right">Discount End:&nbsp;</td>
		<td class="body2" colspan = "3" align = "left">
			  <select size="1" name="Price2DiscountEndDateMonth">

		<% if len(Price2DiscountEndDateMonth) > 0 then %>
					<option value="<%=Price2DiscountEndDateMonth%>" selected><%=MonthString(Price2DiscountEndDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price2DiscountEndDateDay">
		<% if len(Price2DiscountEndDateDay) > 0 then %>
					<option value="<%=Price2DiscountEndDateDay%>" selected><%=Price2DiscountEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price2DiscountEndDateYear">
				<% if len(Price2DiscountEndDateYear) > 0 then %>
					<option value="<%=Price2DiscountEndDateYear%>" selected><%=Price2DiscountEndDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		</table>
<!--#Include file="444Bottom.asp"-->
	  </td>
	  <td width = "12"><img src = "images/px.gif" height = "1" width = "1" /></td>
      <td width = "507" valign = "top">
	  	   <table width = "400" cellpadding = "5" align= "center"  ><tr><td class = "body"><img src = "images/tipsSmall.jpg" border = "0" height = "51" width = "58" alt = "Helful tips"></td></tr>
	 <tr><td class = "body" bgcolor = "#ECFBF9" valign = "top" height = "80">
		<b>Discount Prices</b> - In order for discount prices to appear on the 
		 registration pages you need to enter a discount start and end dates as 
		 well as a discount price.
	  </td>
	</tr>
  </table>
	  	   
 <% PageTitleText = "Display Stall Fees and Dates"  %>
<!--#Include file="505Top.asp"-->
 <table border = "0" cellpadding = "0" cellspacing = "0"  width = "510">  
<tr>
	    <td class = "body" align = "right" width = "250"><div align = "right">
			Max. # Display Stalls Per Exhibitor:</div></td>
		<td class="body2" colspan = "3" align = "left">&nbsp;<select size="1" name="MaxDisplaysPerFarm">
		<% if len(MaxDisplaysPerFarm) > 0 then %>
					<option value="<%=MaxDisplaysPerFarm%>" selected><%=MaxDisplaysPerFarm%></option>
					<option value="0">0</option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
				</select>
			</td>
	</tr>
	   <tr>
	      <td class = "body2" align = "right" >Fee Per Display Stall: </td>
	      <td class = "body2" colspan = "3" height = "25" align = "left" ><div align = "top">
			  $<input class="positive" type="text" name = "Price3" size = 7 maxsize = 9 value = "<%=Price3%>"></div>
	      
	<script type="text/javascript">
	    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>

	      
	      </td>
	   </tr>
 	   <tr>
	      <td class = "body2" align = "center" colspan = "2"><br><b>Display 
		  Stall Discount</b></td>
	   </tr>
<tr>
	      <td class = "body2" align = "right"  valign = "top">Discount Name:</td>
	      <td class = "body2" colspan = "3" align = "left"><input type="text" name = "Price3DiscountName" size = 25 maxsize = 19 value = "<%=Price3DiscountName%>"><br>
	        <font color = "#303030"><small>(i.e. Display Stall Discount)</small></font>
	      </td>
	    </tr>
		     <tr>
	      <td class = "body2" align = "right">Discount Price: </td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "Price3Discount" size = 7 maxsize = 9 value = "<%=Price3Discount%>"></div>
			<script type="text/javascript">
			    $(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>
	    <tr>
	      <td class = "body2" align = "right"  valign = "top">Other Promotional 
		  Offer:</td>
	      <td class = "body2" colspan = "3" align = "left"><input type="text" name = "Price3DiscountOther" size = 25 maxsize = 19 value = "<%=Price3DiscountOther%>"><br>
	        <font color = "#303030"><small>(i.e. Free flyer in exhibitor packet)</small></font>
	      </td>
	    </tr>
	<tr >
	    <td class = "body" align = "right"><div align = "right">Discount 
			Starts:&nbsp;</div></td>
		<td class="body2" colspan = "3" align = "left">
			  <select size="1" name="Price3DiscountStartDateMonth">

		<% if len(Price3DiscountStartDateMonth) > 0 then %>
					<option value="<%=Price3DiscountStartDateMonth%>" selected><%=MonthString(Price3DiscountStartDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price3DiscountStartDateDay">
		<% if len(Price3DiscountStartDateDay) > 0 then %>
					<option value="<%=Price3DiscountStartDateDay%>" selected><%=Price3DiscountStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price3DiscountStartDateYear">
				<% if len(Price3DiscountStartDateYear) > 0 then %>
					<option value="<%=Price3DiscountStartDateYear%>" selected><%=Price3DiscountStartDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
</tr>
<tr >
	    <td class = "body" align = "right"><div align = "right">Discount Ends:&nbsp;</div></td>
		<td class="body2" colspan = "3" align = "left">
			  <select size="1" name="Price3DiscountEndDateMonth">

		<% if len(Price3DiscountEndDateMonth) > 0 then %>
					<option value="<%=Price3DiscountEndDateMonth%>" selected><%=MonthString(Price3DiscountEndDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="Price3DiscountEndDateDay">
		<% if len(Price3DiscountEndDateDay) > 0 then %>
					<option value="<%=Price3DiscountEndDateDay%>" selected><%=Price3DiscountEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="Price3DiscountEndDateYear">
				<% if len(Price3DiscountEndDateYear) > 0 then %>
					<option value="<%=Price3DiscountEndDateYear%>" selected><%=Price3DiscountEndDateYear%></option>
					<option value="<%=year(now)%>"><%=year(now)%></option>

				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
	</tr>
</table>
<!--#Include file="505Bottom.asp"-->

<% PageTitleText = "Other Dates and Fees"  %>
<!--#Include file="505Top.asp"-->
<table  border = "0" cellpadding=5 cellspacing = "0"  width = "504">
<tr>
	      <td class = "body2" align = "right" width = "250"> <% if Startdate = false and UpdateHalter =True  then %><font color = "red"><%End if%>
		  Registration Start Date:* <% if Startdate = false and UpdateHalter =True  then %></font><%End if%>
</td>
			
			<td width = "250" align = "left">
			  <select size="1" name="ServiceStartDateMonth">

		<% if len(ServiceStartDateMonth) > 0 then %>
					<option value="<%=ServiceStartDateMonth%>" selected><%=MonthString(ServiceStartDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="ServiceStartDateDay">
		<% if len(ServiceStartDateDay) > 0 then %>
					<option value="<%=ServiceStartDateDay%>" selected><%=ServiceStartDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="ServiceStartDateYear">
				<% if len(ServiceStartDateYear) > 0 then %>
					<option value="<%=ServiceStartDateYear%>" selected><%=ServiceStartDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>

				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>
		<tr>
	      <td class = "body2" align = "right" > <% if Enddate = false and UpdateHalter =True  then %><font color = "red"><%End if%>
		  Registration end date:* <% if Enddate = false and UpdateHalter =True  then %></font><%End if%>
</td>
			
			<td width = "250" align = "left">
			  <select size="1" name="ServiceEndDateMonth">

		<% if len(ServiceEndDateMonth) > 0 then %>
					<option value="<%=ServiceEndDateMonth%>" selected><%=MonthString(ServiceEndDateMonth)%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>/
				<select size="1" name="ServiceEndDateDay">
		<% if len(ServiceEndDateDay) > 0 then %>
					<option value="<%=ServiceEndDateDay%>" selected><%=ServiceEndDateDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>/
		<select size="1" name="ServiceEndDateYear">
				<% if len(ServiceEndDateYear) > 0 then %>
					<option value="<%=ServiceEndDateYear%>" selected><%=ServiceEndDateYear%></option>
					<option value="<%=year(now)%>" ><%=year(now)%></option>

				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear+1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
			</td>
		</tr>




		<% if StallMatPrice = "0" then
	   		StallMatPrice = ""
	   		end if 
	   
	   		if VetCheckFee = "0" then
	   			VetCheckFee = ""
	   		end if 
	   
	   	   	if ElectricityFee = "0" then
	   			ElectricityFee = ""
	   		end if 
	   		
	   %>
	   
	   
		 <tr>
	      <td class = "body2" align = "right" >Vet Check Fee: </td>
	     
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "VetCheckFee" size = 7 maxsize = 9 value = "<%=VetCheckFee%>"></div>
			<script type="text/javascript">
			$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>
		 
	
	<tr>
	 <td class = "body2" align = "right" >Is Electricity Available?</td>
	 <td class = "body2" colspan = "3" align = "left">  		
	 <% if ElectricityAvailable = True then %>
		<small>Yes</small><input TYPE="RADIO" name="ElectricityAvailable" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="ElectricityAvailable" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="ElectricityAvailable" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="ElectricityAvailable" Value = "No" checked>
		<% end if %>
		</td>
	</tr>

 	<tr>
	      <td class = "body2" align = "right" >Electricity Fee: </td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "ElectricityFee" size = 7 maxsize = 9 value = "<%=ElectricityFee%>"></div>
			<script type="text/javascript">
			$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	      </td>
	    </tr>
		<tr>
	 <td class = "body2" align = "right" >Is Electricity Optional?</td>
	 <td class = "body2" colspan = "3" align = "left">  		
	 <% if ElectricityOptional = True then %>
		<small>Yes</small><input TYPE="RADIO" name="ElectricityOptional" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="ElectricityOptional" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="ElectricityOptional" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="ElectricityOptional" Value = "No" checked>
		<% end if %>
		</td>
	</tr>

	 <tr>
	  <td class = "body2" align = "right"><small>Offer Stall Mats For Sale?:</small></td>
  		<td class = "body2"  align = "left">
  		<% if StallMatsAvailable = True then %>
		<small>Yes</small><input TYPE="RADIO" name="StallMatsAvailable" Value = "Yes" checked >
		<small>No</small><input TYPE="RADIO" name="StallMatsAvailable" Value = "No" >
		<% else %>
		<small>Yes</small><input TYPE="RADIO" name="StallMatsAvailable" Value = "Yes" >
		<small>No</small><input TYPE="RADIO" name="StallMatsAvailable" Value = "No" checked>
		<% end if %>
		</td>
	</tr>
	  <tr>
	      <td class = "body2" align = "right">Stall Mat Price (Value): </td>
	      <td class = "body2" colspan = "3" align = "left"><div align = "top">$<input class="positive" type="text" name = "StallMatPrice" size = 7 maxsize = 9 value = "<%=StallMatPrice%>"></div>
			<script type="text/javascript">
			$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
			</script>
	 </td>
	</tr>
</table> 
<!--#Include file="505Bottom.asp"-->


<% PageTitleText = "Halter Show Description"  %>
<!--#Include file="505Top.asp"-->
 <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script>
 		   <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> 
<!--#Include file="505Bottom.asp"-->


	   </td>
	  </tr>
</table>

<table align = "center">
	<tr><td  class = "body2" align = "center">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit Changes" class = "Regsubmit2" ><br>
	
	</td>
	</tr>
</table>
</form>
 




<!--#Include file="970Bottom.asp"-->
<!--#Include file="Footer.asp"-->
		
		</Body>
		</html>